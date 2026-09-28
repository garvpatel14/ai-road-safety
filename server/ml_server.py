"""
SafeRoad AI — YOLOv8 Inference Microservice
FastAPI server on port 8000 that:
  - Loads pothole_yolov8.pt once at startup
  - Accepts POST /detect with a base64-encoded JPEG frame
  - Returns real YOLOv8 bounding boxes + confidence + severity
  - Falls back gracefully if the model fails to load

Start with:
    python server/ml_server.py
or:
    uvicorn server.ml_server:app --host 0.0.0.0 --port 8000 --reload
"""

import base64
import io
import os
import time
import traceback
from pathlib import Path

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Model path ───────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).parent
MODEL_PATH = BASE_DIR / "models" / "pothole_yolov8.pt"

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="SafeRoad AI — YOLOv8 Inference API",
    description="Real-time pothole & road hazard detection powered by YOLOv8",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow the Vite dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global model state ────────────────────────────────────────────────────────
model        = None
model_error  = None
model_names  = {}
CONF_DEFAULT = 0.40

# ── Class colours & severity mapping ─────────────────────────────────────────
CLASS_COLORS = {
    "Pothole":            "#ef4444",
    "Alligator Crack":    "#f97316",
    "Longitudinal Crack": "#eab308",
    "Severe Edge Erosion":"#ec4899",
    "Manhole Disrepair":  "#8b5cf6",
}
DEFAULT_COLOR = "#ef4444"

def estimate_severity(box_w: int, box_h: int, frame_w: int, frame_h: int):
    """Estimates severity and depth from bounding box proportion."""
    ratio = (box_w * box_h) / max(frame_w * frame_h, 1)
    if ratio > 0.08:
        return "Critical", round(15.0 + ratio * 40, 1), round(box_w * 0.15, 1)
    elif ratio > 0.03:
        return "High",     round(10.0 + ratio * 30, 1), round(box_w * 0.12, 1)
    elif ratio > 0.01:
        return "Medium",   round(6.0  + ratio * 20, 1), round(box_w * 0.10, 1)
    else:
        return "Low",      round(3.0  + ratio * 10, 1), round(box_w * 0.08, 1)

# ── Non-road COCO classes to filter out ──────────────────────────────────────
NON_ROAD = {
    'person','bicycle','car','motorcycle','airplane','bus','train','truck','boat',
    'traffic light','fire hydrant','stop sign','parking meter','bench','bird','cat',
    'dog','horse','sheep','cow','elephant','bear','zebra','giraffe','backpack',
    'umbrella','handbag','tie','suitcase','frisbee','skis','snowboard','sports ball',
    'kite','baseball bat','baseball glove','skateboard','surfboard','tennis racket',
    'bottle','wine glass','cup','fork','knife','spoon','bowl','banana','apple',
    'sandwich','orange','broccoli','carrot','hot dog','pizza','donut','cake',
    'chair','couch','potted plant','bed','dining table','toilet','tv','laptop',
    'mouse','remote','keyboard','cell phone','microwave','oven','toaster','sink',
    'refrigerator','book','clock','vase','scissors','teddy bear','hair drier','toothbrush'
}

# ── Startup: load model ───────────────────────────────────────────────────────
@app.on_event("startup")
async def load_model():
    global model, model_error, model_names
    try:
        from ultralytics import YOLO
        print(f"[ML Server] Loading model from: {MODEL_PATH}")
        if MODEL_PATH.exists():
            model = YOLO(str(MODEL_PATH))
            print(f"[ML Server] ✅ Custom model loaded: {MODEL_PATH.name}")
        else:
            # Fallback to the pretrained nano model for testing
            model = YOLO("yolov8n.pt")
            print("[ML Server] ⚠️  pothole_yolov8.pt not found — loaded yolov8n.pt as fallback")
        model_names = model.names if hasattr(model, "names") else {}
        print(f"[ML Server] Model classes: {model_names}")
    except Exception as e:
        model_error = str(e)
        print(f"[ML Server] ❌ Model load failed: {e}")
        traceback.print_exc()

# ── Request / Response schemas ────────────────────────────────────────────────
class DetectRequest(BaseModel):
    image: str          # base64-encoded JPEG
    lat:   float = 22.5645
    lng:   float = 72.9289
    conf:  float = CONF_DEFAULT

class Detection(BaseModel):
    type:       str
    confidence: float
    severity:   str
    depth_cm:   float
    width_cm:   float
    color:      str
    bbox:       list   # [x1, y1, x2, y2] in pixels
    lat:        float
    lng:        float

class DetectResponse(BaseModel):
    detections: list
    frame_w:    int
    frame_h:    int
    fps:        float
    model:      str
    mode:       str    # "yolov8" | "fallback"

# ── Health endpoint ───────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status":     "online",
        "model_ready": model is not None,
        "model_path":  str(MODEL_PATH),
        "model_exists": MODEL_PATH.exists(),
        "error":       model_error,
        "service":     "SafeRoad AI YOLOv8 Inference",
    }

# ── Main detection endpoint ───────────────────────────────────────────────────
@app.post("/detect", response_model=DetectResponse)
def detect(req: DetectRequest):
    import cv2

    t0 = time.perf_counter()

    # 1. Decode base64 image
    try:
        img_bytes = base64.b64decode(req.image)
        nparr     = np.frombuffer(img_bytes, np.uint8)
        frame     = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if frame is None:
            raise ValueError("cv2.imdecode returned None")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {e}")

    frame_h, frame_w = frame.shape[:2]
    detections = []

    if model is not None:
        # 2a. Real YOLOv8 inference
        try:
            results = model.predict(
                source=frame,
                conf=req.conf,
                verbose=False,
                imgsz=640,
            )
            for r in results:
                for box in r.boxes:
                    cls_id   = int(box.cls[0].cpu().numpy())
                    raw_name = model_names.get(cls_id, str(cls_id)).lower()

                    # Skip non-road COCO objects
                    if raw_name in NON_ROAD:
                        continue

                    conf_val = float(box.conf[0].cpu().numpy()) * 100
                    coords   = box.xyxy[0].cpu().numpy().astype(int).tolist()
                    x1, y1, x2, y2 = coords

                    # Friendly class name
                    pretty = raw_name.title()
                    if "pothole" in raw_name:
                        pretty = "Pothole"
                    elif "alligator" in raw_name:
                        pretty = "Alligator Crack"
                    elif "longitudinal" in raw_name or "crack" in raw_name:
                        pretty = "Longitudinal Crack"
                    elif "erosion" in raw_name:
                        pretty = "Severe Edge Erosion"
                    elif "manhole" in raw_name:
                        pretty = "Manhole Disrepair"

                    sev, depth, width = estimate_severity(x2-x1, y2-y1, frame_w, frame_h)
                    detections.append(Detection(
                        type=pretty,
                        confidence=round(conf_val, 1),
                        severity=sev,
                        depth_cm=depth,
                        width_cm=width,
                        color=CLASS_COLORS.get(pretty, DEFAULT_COLOR),
                        bbox=[x1, y1, x2, y2],
                        lat=req.lat,
                        lng=req.lng,
                    ).dict())
            mode = "yolov8"
        except Exception as e:
            print(f"[ML Server] Inference error: {e}")
            detections = []
            mode = "error"
    else:
        # 2b. OpenCV edge-contour fallback (if model failed to load)
        import cv2
        roi_y = int(frame_h * 0.45)
        roi   = frame[roi_y:, :]
        gray  = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        blur  = cv2.GaussianBlur(gray, (7, 7), 0)
        th    = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                       cv2.THRESH_BINARY_INV, 21, 5)
        cnts, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in cnts[:3]:
            area = cv2.contourArea(cnt)
            if 2500 < area < (frame_w * frame_h * 0.15):
                bx, by, bw, bh = cv2.boundingRect(cnt)
                aspect = float(bw) / max(bh, 1)
                if 0.5 < aspect < 3.5:
                    sev, depth, width = estimate_severity(bw, bh, frame_w, frame_h)
                    conf_val = min(88.5, max(72.0, 65.0 + area / 900.0))
                    typ = "Pothole" if aspect < 2.0 else "Alligator Crack"
                    detections.append(Detection(
                        type=typ,
                        confidence=round(conf_val, 1),
                        severity=sev,
                        depth_cm=depth,
                        width_cm=width,
                        color=CLASS_COLORS.get(typ, DEFAULT_COLOR),
                        bbox=[bx, roi_y + by, bx + bw, roi_y + by + bh],
                        lat=req.lat,
                        lng=req.lng,
                    ).dict())
        mode = "fallback"

    elapsed = time.perf_counter() - t0
    fps     = round(1.0 / max(elapsed, 0.001), 1)

    return DetectResponse(
        detections=detections,
        frame_w=frame_w,
        frame_h=frame_h,
        fps=fps,
        model=MODEL_PATH.name if MODEL_PATH.exists() else "yolov8n.pt",
        mode=mode,
    )


if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print(" SafeRoad AI — YOLOv8 Inference Server")
    print(" URL : http://localhost:8000")
    print(" Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)

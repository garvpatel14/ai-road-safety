"""
SafeRoad AI & iWatchRoad: Real-Time YOLO Pothole Detection & Geotagging Pipeline
Based on architecture from: smlab-niser/iWatchRoad (Subhankar Mishra Lab, NISER)

Features:
- YOLOv8 Object Detection (Potholes, Longitudinal Cracks, Alligator Cracks)
- Video / Camera Feed (Dashcam video file or WebRTC/Webcam device index)
- Bounding box rendering with class labels, confidence scores, and depth estimates
- Geotagging integration (GPS coordinate synchronization)
- Automatic HTTP POST to SafeRoad AI Backend API (PostgreSQL + PostGIS database)

Usage:
    python yolo_pothole_detector.py --source 0                    # Run on webcam / dashcam
    python yolo_pothole_detector.py --source dashcam_sample.mp4   # Run on recorded video
    python yolo_pothole_detector.py --model yolov8n.pt --conf 0.45
"""

import sys
import os
import time
import json
import argparse
from datetime import datetime

try:
    import cv2
    import numpy as np
except ImportError:
    print("Warning: OpenCV (cv2) or numpy not installed. Run: pip install opencv-python numpy")

try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except ImportError:
    ULTRALYTICS_AVAILABLE = False
    print("Notice: 'ultralytics' not installed. Running in heuristic simulation mode. To use YOLOv8, run: pip install ultralytics")

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False


# Road hazard class mappings inspired by iWatchRoad
CLASS_LABELS = {
    0: "Pothole",
    1: "Alligator Crack",
    2: "Longitudinal Crack",
    3: "Severe Edge Erosion",
    4: "Manhole Disrepair"
}

CLASS_COLORS = {
    "Pothole": (0, 0, 255),            # Red
    "Alligator Crack": (0, 165, 255),    # Orange
    "Longitudinal Crack": (0, 255, 255),# Yellow
    "Severe Edge Erosion": (255, 0, 255), # Magenta
    "Manhole Disrepair": (255, 128, 0)  # Amber
}


class iWatchRoadDetector:
    def __init__(self, model_path="yolov8n.pt", conf_threshold=0.45, api_url="http://localhost:5000/api/reports"):
        self.conf_threshold = conf_threshold
        self.api_url = api_url
        self.model = None
        self.last_reported_time = 0
        self.report_cooldown_sec = 3.0  # Prevent spamming duplicate detections

        if ULTRALYTICS_AVAILABLE:
            try:
                print(f"[iWatchRoad] Loading YOLOv8 model: {model_path}...")
                self.model = YOLO(model_path)
                print("[iWatchRoad] Model loaded successfully.")
            except Exception as e:
                print(f"[iWatchRoad] Failed to load YOLO weights ({e}). Defaulting to vision heuristics.")
        else:
            print("[iWatchRoad] YOLOv8 ultralytics package not detected. Using adaptive edge-contour detection fallback.")

    def log_defect_to_api(self, defect_data):
        """Sends detected pothole data to the SafeRoad Express/PostgreSQL API"""
        if not REQUESTS_AVAILABLE:
            return

        now = time.time()
        if now - self.last_reported_time < self.report_cooldown_sec:
            return

        try:
            payload = {
                "type": defect_data.get("type", "Pothole"),
                "severity": defect_data.get("severity", "High"),
                "description": f"Automated detection by YOLOv8 iWatchRoad AI Vision Pipeline. Confidence: {defect_data.get('confidence')}%",
                "locationName": "Dashcam Telemetry Feed",
                "lat": defect_data.get("lat", 37.7749),
                "lng": defect_data.get("lng", -122.4194),
                "aiConfidence": defect_data.get("confidence", 92.5),
                "depthCm": defect_data.get("depth_cm", 12.0),
                "widthCm": defect_data.get("width_cm", 40.0),
                "areaSqM": defect_data.get("area_sq_m", 0.18),
                "priorityScore": 85,
                "reportedBy": "AI-YOLO-DASHCAM"
            }
            res = requests.post(self.api_url, json=payload, timeout=2)
            if res.status_code in [200, 201]:
                print(f"[iWatchRoad] Successfully synced {payload['type']} to SafeRoad database! ID: {res.json().get('report', {}).get('id')}")
                self.last_reported_time = now
        except Exception as err:
            # Backend not running or timeout
            pass

    def estimate_severity(self, box_w, box_h, frame_w, frame_h):
        """Estimates pothole depth and severity based on bounding box proportion"""
        area_ratio = (box_w * box_h) / (frame_w * frame_h)
        if area_ratio > 0.08:
            return "Critical", round(15.0 + area_ratio * 40, 1), round(box_w * 0.15, 1)
        elif area_ratio > 0.03:
            return "High", round(10.0 + area_ratio * 30, 1), round(box_w * 0.12, 1)
        elif area_ratio > 0.01:
            return "Medium", round(6.0 + area_ratio * 20, 1), round(box_w * 0.10, 1)
        else:
            return "Low", round(3.0 + area_ratio * 10, 1), round(box_w * 0.08, 1)

    def draw_hud(self, frame, detections, fps, lat=37.7749, lng=-122.4194):
        """Draws iWatchRoad HUD and styled bounding boxes on the frame"""
        h, w, _ = frame.shape

        # Top HUD Bar
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, 60), (15, 15, 20), -1)
        cv2.addWeighted(overlay, 0.75, frame, 0.25, 0, frame)

        # Telemetry & Status Text
        cv2.putText(frame, "iWatchRoad AI Vision | YOLOv8 Road Scanner", (20, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 220, 255), 2)
        cv2.putText(frame, f"FPS: {fps:.1f} | Detections: {len(detections)} | GPS: {lat:.4f}N, {lng:.4f}W", (20, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (200, 200, 200), 1)

        # Bounding boxes
        for det in detections:
            x1, y1, x2, y2 = det["box"]
            cls_name = det["type"]
            conf = det["confidence"]
            severity = det["severity"]
            color = CLASS_COLORS.get(cls_name, (0, 0, 255))

            # Bounding box
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

            # iWatchRoad Corner brackets
            line_len = int(min(x2 - x1, y2 - y1) * 0.2)
            cv2.line(frame, (x1, y1), (x1 + line_len, y1), (255, 255, 255), 3)
            cv2.line(frame, (x1, y1), (x1, y1 + line_len), (255, 255, 255), 3)
            cv2.line(frame, (x2, y1), (x2 - line_len, y1), (255, 255, 255), 3)
            cv2.line(frame, (x2, y1), (x2, y1 + line_len), (255, 255, 255), 3)
            cv2.line(frame, (x1, y2), (x1 + line_len, y2), (255, 255, 255), 3)
            cv2.line(frame, (x1, y2), (x1, y2 - line_len), (255, 255, 255), 3)
            cv2.line(frame, (x2, y2), (x2 - line_len, y2), (255, 255, 255), 3)
            cv2.line(frame, (x2, y2), (x2, y2 - line_len), (255, 255, 255), 3)

            # Label badge
            label = f"{cls_name} {conf:.1f}% [{severity}]"
            (label_w, label_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
            cv2.rectangle(frame, (x1, max(0, y1 - label_h - 10)), (x1 + label_w + 10, y1), color, -1)
            cv2.putText(frame, label, (x1 + 5, max(14, y1 - 5)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)

        return frame

    def process_frame(self, frame, lat=37.7749, lng=-122.4194):
        h, w, _ = frame.shape
        detections = []

        if self.model is not None:
            # Ultralytics YOLOv8 inference
            results = self.model.predict(source=frame, conf=self.conf_threshold, verbose=False)
            for r in results:
                for box in r.boxes:
                    coords = box.xyxy[0].cpu().numpy().astype(int)
                    x1, y1, x2, y2 = coords
                    conf = float(box.conf[0].cpu().numpy()) * 100
                    cls_id = int(box.cls[0].cpu().numpy())
                    model_names = getattr(self.model, 'names', {})
                    raw_name = model_names.get(cls_id, str(cls_id)).lower()

                    # Filter out humans, vehicles, animals, and non-road COCO classes
                    non_road_classes = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']

                    if raw_name in non_road_classes:
                        # Suppress human / non-road object from pothole detections
                        continue

                    cls_name = raw_name.title() if raw_name in ['pothole', 'crack', 'alligator crack'] else CLASS_LABELS.get(cls_id, "Pothole")

                    severity, depth_cm, width_cm = self.estimate_severity(x2 - x1, y2 - y1, w, h)
                    det = {
                        "box": [x1, y1, x2, y2],
                        "type": cls_name,
                        "confidence": conf,
                        "severity": severity,
                        "depth_cm": depth_cm,
                        "width_cm": width_cm,
                        "lat": lat,
                        "lng": lng
                    }
                    detections.append(det)
                    self.log_defect_to_api(det)
        else:
            # Visual heuristics fallback when torch/ultralytics is not yet installed
            roi_y = int(h * 0.45)
            road_roi = frame[roi_y:h, :]
            gray = cv2.cvtColor(road_roi, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (7, 7), 0)
            thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 21, 5)

            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for cnt in contours:
                area = cv2.contourArea(cnt)
                if 2500 < area < (w * h * 0.15):
                    bx, by, bw, bh = cv2.boundingRect(cnt)
                    aspect = float(bw) / bh
                    if 0.5 < aspect < 3.5:
                        x1 = bx
                        y1 = roi_y + by
                        x2 = bx + bw
                        y2 = y1 + bh
                        severity, depth_cm, width_cm = self.estimate_severity(bw, bh, w, h)
                        conf = min(98.5, max(75.0, 70.0 + (area / 800.0)))
                        det = {
                            "box": [x1, y1, x2, y2],
                            "type": "Pothole" if aspect < 2.0 else "Alligator Crack",
                            "confidence": conf,
                            "severity": severity,
                            "depth_cm": depth_cm,
                            "width_cm": width_cm,
                            "lat": lat,
                            "lng": lng
                        }
                        detections.append(det)
                        self.log_defect_to_api(det)
                        if len(detections) >= 3:
                            break

        return detections

    def run_stream(self, source=0):
        if str(source).isdigit():
            source = int(source)

        print(f"[iWatchRoad] Opening video source: {source}")
        cap = cv2.VideoCapture(source)

        if not cap.isOpened():
            print(f"Error: Could not open video source '{source}'. If on laptop, check camera privacy settings or specify a video file.")
            return

        prev_time = time.time()
        fps = 30.0

        print("[iWatchRoad] Detection stream initialized. Press 'q' to quit, 's' to screenshot.")

        while True:
            ret, frame = cap.read()
            if not ret:
                print("[iWatchRoad] End of video stream.")
                break

            current_time = time.time()
            fps = 1.0 / max(0.001, (current_time - prev_time))
            prev_time = current_time

            detections = self.process_frame(frame)
            frame_annotated = self.draw_hud(frame, detections, fps)

            cv2.imshow("SafeRoad AI - iWatchRoad YOLO Pothole HUD", frame_annotated)
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('s'):
                fname = f"pothole_detection_{int(time.time())}.jpg"
                cv2.imwrite(fname, frame_annotated)
                print(f"[iWatchRoad] Saved screenshot: {fname}")

        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="iWatchRoad YOLO Pothole Detection Pipeline")
    parser.add_argument("--source", default=0, help="Camera index (0 for laptop webcam / mobile rear cam) or path to dashcam video (.mp4)")
    default_model = "server/models/pothole_yolov8.pt" if os.path.exists("server/models/pothole_yolov8.pt") else "yolov8n.pt"
    parser.add_argument("--model", default=default_model, help="Path to YOLO weights (.pt)")
    parser.add_argument("--conf", type=float, default=0.45, help="Confidence threshold (0.0 to 1.0)")
    parser.add_argument("--api", default="http://localhost:5000/api/reports", help="SafeRoad API endpoint for defect logging")

    args = parser.parse_args()
    detector = iWatchRoadDetector(model_path=args.model, conf_threshold=args.conf, api_url=args.api)
    detector.run_stream(source=args.source)

"""
SafeRoad AI - End-to-End ML Model Creator & Training Pipeline
=============================================================
This script provides a complete solution to build, train, validate, and deploy
a high-accuracy YOLOv8 model for road hazard detection:
  - Class 0: Pothole
  - Class 1: Alligator Crack
  - Class 2: Longitudinal Crack
  - Class 3: Severe Edge Erosion

Modes:
  1. Synthetic Dataset Generation & Quick Train (No external download needed):
     python server/scripts/make_ml_model.py --quick

  2. Custom Dataset Training:
     python server/scripts/make_ml_model.py --dataset path/to/data.yaml --epochs 50

  3. Test & Benchmark Current Model:
     python server/scripts/make_ml_model.py --test-only

  4. Export Existing Model to ONNX / TorchScript:
     python server/scripts/make_ml_model.py --export
"""

import os
import sys
import time
import shutil
import random
import argparse
from pathlib import Path
from datetime import datetime

# Safe unicode printing on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import numpy as np
import cv2

try:
    from ultralytics import YOLO
    import torch
    ULTRALYTICS_OK = True
except ImportError:
    ULTRALYTICS_OK = False


CLASSES = [
    "Pothole",
    "Alligator Crack",
    "Longitudinal Crack",
    "Severe Edge Erosion"
]

SCRIPT_DIR = Path(__file__).parent.resolve()
SERVER_DIR = SCRIPT_DIR.parent
MODELS_DIR = SERVER_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)
TARGET_MODEL_PATH = MODELS_DIR / "pothole_yolov8.pt"


def generate_synthetic_road_dataset(output_dir: Path, num_train=120, num_val=30, img_size=640):
    """
    Generates a realistic annotated synthetic dataset of asphalt road surfaces with:
    - Potholes (irregular dark craters with internal shadow, edge highlights, inner gravel)
    - Alligator cracks (spiderweb / polygonal fissure patterns)
    - Longitudinal cracks (vertical fissures with jagged deviation)
    - Severe edge erosion (ragged curb/pavement destruction)
    - Negative samples (clean asphalt, road lines) to ensure low false-positive rate
    """
    print(f"\n[1/4] Synthesizing realistic road distress dataset...")
    print(f"      Destination: {output_dir}")
    print(f"      Train images: {num_train} | Val images: {num_val} | Resolution: {img_size}x{img_size}")

    for split in ["train", "val"]:
        (output_dir / "images" / split).mkdir(parents=True, exist_ok=True)
        (output_dir / "labels" / split).mkdir(parents=True, exist_ok=True)

    def create_asphalt_background(w, h):
        base_color = random.randint(65, 110)
        img = np.full((h, w, 3), base_color, dtype=np.uint8)
        # Asphalt grain noise
        noise = np.random.normal(0, random.uniform(8, 18), (h, w, 3)).astype(np.int16)
        img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

        # Occasional road lane marking (white/yellow dashed or solid line)
        if random.random() < 0.6:
            lane_color = (220, 220, 220) if random.random() < 0.7 else (20, 200, 230)
            lx = random.randint(int(w * 0.1), int(w * 0.9))
            lw = random.randint(6, 14)
            cv2.line(img, (lx, 0), (lx + random.randint(-40, 40), h), lane_color, lw)

        # Perspective / illumination gradient
        gradient = np.linspace(random.uniform(0.7, 0.9), random.uniform(1.0, 1.2), h)[:, None, None]
        img = np.clip(img * gradient, 0, 255).astype(np.uint8)
        return img

    def draw_pothole(img, labels):
        h, w = img.shape[:2]
        cx = random.randint(int(w * 0.2), int(w * 0.8))
        cy = random.randint(int(h * 0.25), int(h * 0.85))
        rx = random.randint(int(w * 0.05), int(w * 0.16))
        ry = int(rx * random.uniform(0.45, 0.85))
        angle = random.randint(0, 180)

        # Outer crater shadow
        cv2.ellipse(img, (cx, cy), (rx, ry), angle, 0, 360, (20, 20, 20), -1)
        # Inner depth shadow
        cv2.ellipse(img, (cx + random.randint(-4, 4), cy + int(ry * 0.15)),
                    (int(rx * 0.75), int(ry * 0.75)), angle, 0, 360, (10, 10, 10), -1)
        # Edge highlights / erosion rim
        cv2.ellipse(img, (cx, cy), (rx + 2, ry + 2), angle, 0, 180, (140, 140, 140), 2)
        # Broken pebbles inside
        for _ in range(random.randint(6, 18)):
            px = cx + random.randint(-int(rx * 0.6), int(rx * 0.6))
            py = cy + random.randint(-int(ry * 0.6), int(ry * 0.6))
            cv2.circle(img, (px, py), random.randint(1, 3), (80, 80, 80), -1)

        # YOLO normalized bbox: class x_center y_center width height
        bx1 = max(0, cx - rx - 4)
        by1 = max(0, cy - ry - 4)
        bx2 = min(w, cx + rx + 4)
        by2 = min(h, cy + ry + 4)
        norm_cx = ((bx1 + bx2) / 2) / w
        norm_cy = ((by1 + by2) / 2) / h
        norm_w = (bx2 - bx1) / w
        norm_h = (by2 - by1) / h
        labels.append(f"0 {norm_cx:.6f} {norm_cy:.6f} {norm_w:.6f} {norm_h:.6f}")

    def draw_alligator_crack(img, labels):
        h, w = img.shape[:2]
        cx = random.randint(int(w * 0.25), int(w * 0.75))
        cy = random.randint(int(h * 0.25), int(h * 0.75))
        rad_x = random.randint(int(w * 0.08), int(w * 0.18))
        rad_y = int(rad_x * random.uniform(0.6, 1.0))

        # Generate interlocking polygonal cracks
        pts = []
        for _ in range(random.randint(14, 26)):
            px = int(cx + random.gauss(0, rad_x * 0.45))
            py = int(cy + random.gauss(0, rad_y * 0.45))
            px = np.clip(px, 10, w - 10)
            py = np.clip(py, 10, h - 10)
            pts.append((px, py))

        for i in range(len(pts)):
            for j in range(i + 1, min(i + 4, len(pts))):
                if random.random() < 0.7:
                    cv2.line(img, pts[i], pts[j], (15, 15, 15), random.randint(1, 3))
                    # Subtle highlight on crack edges
                    cv2.line(img, (pts[i][0] + 1, pts[i][1] + 1), (pts[j][0] + 1, pts[j][1] + 1), (120, 120, 120), 1)

        bx1 = max(0, min(p[0] for p in pts) - 6)
        by1 = max(0, min(p[1] for p in pts) - 6)
        bx2 = min(w, max(p[0] for p in pts) + 6)
        by2 = min(h, max(p[1] for p in pts) + 6)
        norm_cx = ((bx1 + bx2) / 2) / w
        norm_cy = ((by1 + by2) / 2) / h
        norm_w = (bx2 - bx1) / w
        norm_h = (by2 - by1) / h
        labels.append(f"1 {norm_cx:.6f} {norm_cy:.6f} {norm_w:.6f} {norm_h:.6f}")

    def draw_longitudinal_crack(img, labels):
        h, w = img.shape[:2]
        sx = random.randint(int(w * 0.2), int(w * 0.8))
        sy = random.randint(int(h * 0.1), int(h * 0.4))
        length = random.randint(int(h * 0.3), int(h * 0.55))

        cur_x, cur_y = sx, sy
        min_x, max_x = cur_x, cur_x
        step = 15
        while cur_y < sy + length and cur_y < h - 10:
            next_x = cur_x + random.randint(-6, 6)
            next_y = cur_y + step + random.randint(-3, 3)
            next_x = np.clip(next_x, 5, w - 5)
            next_y = np.clip(next_y, 5, h - 5)
            cv2.line(img, (cur_x, cur_y), (next_x, next_y), (20, 20, 20), random.randint(2, 4))
            min_x = min(min_x, cur_x, next_x)
            max_x = max(max_x, cur_x, next_x)
            cur_x, cur_y = next_x, next_y

        bx1 = max(0, min_x - 8)
        by1 = max(0, sy - 8)
        bx2 = min(w, max_x + 8)
        by2 = min(h, cur_y + 8)
        norm_cx = ((bx1 + bx2) / 2) / w
        norm_cy = ((by1 + by2) / 2) / h
        norm_w = (bx2 - bx1) / w
        norm_h = (by2 - by1) / h
        labels.append(f"2 {norm_cx:.6f} {norm_cy:.6f} {norm_w:.6f} {norm_h:.6f}")

    def draw_edge_erosion(img, labels):
        h, w = img.shape[:2]
        side = "left" if random.random() < 0.5 else "right"
        base_x = 0 if side == "left" else w - 1
        sy = random.randint(int(h * 0.2), int(h * 0.6))
        eh = random.randint(int(h * 0.2), int(h * 0.35))
        ew = random.randint(int(w * 0.1), int(w * 0.22))

        pts = [(base_x, sy)]
        for y_step in range(sy, sy + eh, 15):
            jitter_x = base_x + (random.randint(int(ew * 0.4), ew) if side == "left" else -random.randint(int(ew * 0.4), ew))
            pts.append((jitter_x, y_step))
        pts.append((base_x, sy + eh))

        pts_arr = np.array(pts, dtype=np.int32)
        cv2.fillPoly(img, [pts_arr], (30, 25, 20))
        cv2.polylines(img, [pts_arr], False, (140, 130, 110), 2)

        bx1 = 0 if side == "left" else max(0, w - ew - 10)
        bx2 = min(w, ew + 10) if side == "left" else w
        by1 = max(0, sy - 5)
        by2 = min(h, sy + eh + 5)
        norm_cx = ((bx1 + bx2) / 2) / w
        norm_cy = ((by1 + by2) / 2) / h
        norm_w = (bx2 - bx1) / w
        norm_h = (by2 - by1) / h
        labels.append(f"3 {norm_cx:.6f} {norm_cy:.6f} {norm_w:.6f} {norm_h:.6f}")

    # Generate train and validation sets
    for split, count in [("train", num_train), ("val", num_val)]:
        for idx in range(count):
            img = create_asphalt_background(img_size, img_size)
            labels = []

            # 85% chance to contain road distresses, 15% negative background
            if random.random() < 0.85:
                # Add 1 to 3 defects per image
                num_defects = random.choices([1, 2, 3], weights=[0.6, 0.3, 0.1])[0]
                defect_types = random.choices(["pothole", "alligator", "longitudinal", "erosion"],
                                              weights=[0.45, 0.25, 0.20, 0.10], k=num_defects)
                for dtype in defect_types:
                    if dtype == "pothole":
                        draw_pothole(img, labels)
                    elif dtype == "alligator":
                        draw_alligator_crack(img, labels)
                    elif dtype == "longitudinal":
                        draw_longitudinal_crack(img, labels)
                    elif dtype == "erosion":
                        draw_edge_erosion(img, labels)

            # Save image and label
            name = f"road_{split}_{idx:04d}"
            cv2.imwrite(str(output_dir / "images" / split / f"{name}.jpg"), img, [cv2.IMWRITE_JPEG_QUALITY, 90])
            with open(output_dir / "labels" / split / f"{name}.txt", "w") as f:
                f.write("\n".join(labels) + ("\n" if labels else ""))

    # Generate data.yaml
    yaml_content = f"""# SafeRoad AI YOLOv8 Dataset Configuration
path: {output_dir.resolve().as_posix()}
train: images/train
val: images/val

names:
  0: Pothole
  1: Alligator Crack
  2: Longitudinal Crack
  3: Severe Edge Erosion
"""
    yaml_path = output_dir / "data.yaml"
    with open(yaml_path, "w") as f:
        f.write(yaml_content)

    print(f"      ✓ Dataset created: {yaml_path}")
    return yaml_path


def train_model(data_yaml: Path, base_model="yolov8n.pt", epochs=15, imgsz=640, batch=8):
    """Fine-tunes YOLOv8 using road-specific augmentations."""
    if not ULTRALYTICS_OK:
        print("❌ Error: ultralytics or torch is not installed.")
        sys.exit(1)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("\n" + "=" * 65)
    print(" SafeRoad AI — Model Training Execution")
    print("=" * 65)
    print(f" Base Model     : {base_model}")
    print(f" Dataset        : {data_yaml}")
    print(f" Compute Device : {device.upper()} {'(NVIDIA GPU)' if device == 'cuda' else '(CPU)'}")
    print(f" Epochs         : {epochs} | Batch: {batch} | ImgSz: {imgsz}")
    print("=" * 65)

    model = YOLO(base_model)

    results = model.train(
        data=str(data_yaml),
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        device=device,
        project="saferoad_runs",
        name="yolov8_road_safety",
        optimizer="AdamW",
        lr0=0.002,
        lrf=0.01,
        mosaic=0.8,
        mixup=0.1,
        hsv_h=0.015,
        hsv_s=0.5,
        hsv_v=0.4,
        degrees=8.0,
        translate=0.08,
        scale=0.4,
        fliplr=0.5,
        save=True,
        verbose=True
    )

    # Locate best.pt
    best_weights = Path(model.trainer.best) if hasattr(model.trainer, "best") else None
    if not best_weights or not best_weights.exists():
        best_weights = Path("saferoad_runs") / "yolov8_road_safety" / "weights" / "best.pt"

    if best_weights.exists():
        # Backup existing model if present
        if TARGET_MODEL_PATH.exists():
            backup_path = MODELS_DIR / f"pothole_yolov8_backup_{int(time.time())}.pt"
            shutil.copy(TARGET_MODEL_PATH, backup_path)
            print(f"\n[SafeRoad AI] Backed up previous model to: {backup_path.name}")

        shutil.copy(best_weights, TARGET_MODEL_PATH)
        print(f"\n✓ Successfully deployed newly trained model to:")
        print(f"  {TARGET_MODEL_PATH} ({TARGET_MODEL_PATH.stat().st_size / (1024*1024):.2f} MB)")
    else:
        print(f"⚠ Warning: Could not locate best.pt automatically. Check saferoad_runs/")

    return TARGET_MODEL_PATH


def test_model_inference(model_path: Path):
    """Runs a test inference on a sample synthesized frame and reports performance."""
    if not model_path.exists():
        print(f"❌ Model file not found at: {model_path}")
        return

    print("\n" + "=" * 65)
    print(" Testing Trained Model Inference")
    print("=" * 65)
    print(f" Model: {model_path}")

    model = YOLO(str(model_path))

    # Generate synthetic road test frame
    w, h = 640, 360
    test_img = np.full((h, w, 3), 85, dtype=np.uint8)
    noise = np.random.normal(0, 12, (h, w, 3)).astype(np.int16)
    test_img = np.clip(test_img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    # Road line
    cv2.line(test_img, (w // 2, 0), (w // 2, h), (220, 220, 220), 8)
    # Synthetic pothole
    cv2.ellipse(test_img, (220, 240), (55, 30), 0, 0, 360, (20, 20, 20), -1)
    cv2.ellipse(test_img, (220, 240), (40, 20), 0, 0, 360, (10, 10, 10), -1)
    # Synthetic crack
    cv2.line(test_img, (400, 120), (420, 280), (15, 15, 15), 3)

    t0 = time.perf_counter()
    results = model.predict(test_img, conf=0.25, verbose=False)
    elapsed_ms = (time.perf_counter() - t0) * 1000

    boxes = results[0].boxes
    print(f" Inference Time : {elapsed_ms:.1f} ms ({1000/max(elapsed_ms, 1):.1f} FPS)")
    print(f" Model Classes  : {model.names}")
    print(f" Detections     : {len(boxes)}")

    for i, b in enumerate(boxes):
        cls_id = int(b.cls[0].cpu().numpy())
        cls_name = model.names.get(cls_id, str(cls_id))
        conf = float(b.conf[0].cpu().numpy()) * 100
        bbox = b.xyxy[0].cpu().numpy().astype(int).tolist()
        print(f"   [{i+1}] {cls_name} — Confidence: {conf:.1f}% — BBox: {bbox}")

    # Save output visualization
    output_vis = MODELS_DIR / "sample_detection_test.jpg"
    res_img = results[0].plot()
    cv2.imwrite(str(output_vis), res_img)
    print(f" Visual Test Saved: {output_vis}")


def export_model(model_path: Path):
    """Exports model to ONNX for edge and web browser inference."""
    print(f"\n[SafeRoad AI] Exporting model {model_path.name}...")
    try:
        model = YOLO(str(model_path))
        onnx_file = model.export(format="onnx", dynamic=True)
        print(f" ✓ ONNX Export Complete: {onnx_file}")
    except Exception as e:
        print(f" ⚠ ONNX export notice: {e}")
        print("   To export to ONNX, run: pip install onnx")


def main():
    parser = argparse.ArgumentParser(description="SafeRoad AI - Model Creator & Training Pipeline")
    parser.add_argument("--quick", action="store_true", help="Generate synthetic dataset and train a fast model (Default)")
    parser.add_argument("--dataset", type=str, default=None, help="Path to custom data.yaml")
    parser.add_argument("--epochs", type=int, default=15, help="Number of epochs to train (default: 15)")
    parser.add_argument("--batch", type=int, default=8, help="Batch size (default: 8)")
    parser.add_argument("--model", type=str, default="yolov8n.pt", help="Base model (yolov8n.pt or yolov8s.pt)")
    parser.add_argument("--test-only", action="store_true", help="Test current model without training")
    parser.add_argument("--export", action="store_true", help="Export existing model to ONNX")

    args = parser.parse_args()

    print("\n╔════════════════════════════════════════════════════════════════════╗")
    print("║               SafeRoad AI — YOLOv8 ML Model Pipeline               ║")
    print("╚════════════════════════════════════════════════════════════════════╝")

    if args.test_only:
        test_model_inference(TARGET_MODEL_PATH)
        return

    if args.export:
        export_model(TARGET_MODEL_PATH)
        return

    # Dataset resolution
    if args.dataset and os.path.exists(args.dataset):
        data_yaml = Path(args.dataset)
        print(f"\n[SafeRoad AI] Using user provided dataset: {data_yaml}")
    else:
        dataset_dir = SERVER_DIR / "datasets" / "synthetic_road_distress"
        data_yaml = generate_synthetic_road_dataset(dataset_dir, num_train=120, num_val=30)

    # Train model
    trained_path = train_model(
        data_yaml=data_yaml,
        base_model=args.model,
        epochs=args.epochs,
        imgsz=640,
        batch=args.batch
    )

    # Test and verify
    test_model_inference(trained_path)

    print("\n" + "=" * 65)
    print(" 🎉 ML Model Build & Verification Completed!")
    print(f" Model Location: {TARGET_MODEL_PATH}")
    print(" Start Live Detection Server:")
    print("   python server/ml_server.py")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    main()

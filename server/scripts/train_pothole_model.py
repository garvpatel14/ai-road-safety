"""
SafeRoad AI & iWatchRoad: Custom YOLOv8 Model Training Pipeline for High-Accuracy Pothole Detection
Inspired by research and methodology from smlab-niser/iWatchRoad

This script trains a specialized YOLOv8 neural network on annotated road distress datasets
(Potholes, Alligator Cracks, Longitudinal Cracks, Transverse Cracks).

Prerequisites:
    pip install ultralytics torch torchvision opencv-python roboflow

Usage:
    python train_pothole_model.py --epochs 100 --imgsz 640 --batch 16 --model yolov8s.pt
"""

import os
import sys
import argparse
from pathlib import Path

try:
    from ultralytics import YOLO
    import torch
except ImportError:
    print("Error: 'ultralytics' or 'torch' not installed.")
    print("Please run: pip install ultralytics torch torchvision")
    sys.exit(1)


# Sample dataset configuration (YOLO format)
DEFAULT_YAML_CONTENT = """# SafeRoad AI Pothole Detection Dataset Configuration
path: ./datasets/potholes  # dataset root dir
train: images/train       # train images (relative to 'path')
val: images/val           # val images (relative to 'path')
test: images/test         # test images (optional)

# Classes
names:
  0: Pothole
  1: Alligator Crack
  2: Longitudinal Crack
  3: Severe Edge Erosion
"""


def create_default_dataset_yaml(output_path="pothole_data.yaml"):
    """Generates the data.yaml file required by YOLOv8"""
    if not os.path.exists(output_path):
        with open(output_path, "w") as f:
            f.write(DEFAULT_YAML_CONTENT)
        print(f"[SafeRoad AI] Generated dataset template at: {output_path}")
    return output_path


def train_pothole_model(
    model_name="yolov8s.pt",
    data_yaml="pothole_data.yaml",
    epochs=100,
    imgsz=640,
    batch=16,
    project_name="saferoad_runs",
    exp_name="yolov8_pothole_high_acc"
):
    """
    Trains YOLOv8 with optimal road-safety hyperparameters:
    - Mosaic & Mixup data augmentation for handling small road cracks
    - HSV jitter for handling sunlight, shadows, dusk, and wet asphalt
    - Early stopping (patience=20) to prevent overfitting
    """
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("=" * 65)
    print(f" SafeRoad AI Model Trainer (iWatchRoad YOLOv8)")
    print(f" Target Device: {device.upper()} {'(GPU Active)' if device == 'cuda' else '(CPU - GPU recommended for speed)'}")
    print(f" Base Model: {model_name}")
    print(f" Dataset YAML: {data_yaml}")
    print(f" Epochs: {epochs} | Image Resolution: {imgsz}x{imgsz} | Batch Size: {batch}")
    print("=" * 65)

    # 1. Load Pretrained Weights
    model = YOLO(model_name)

    # 2. Train with road distress augmentations
    results = model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        device=device,
        project=project_name,
        name=exp_name,
        patience=20,            # Early stopping if no mAP improvement in 20 epochs
        save=True,              # Save best.pt checkpoints
        optimizer="AdamW",      # High accuracy optimizer
        lr0=0.001,              # Initial learning rate
        lrf=0.01,               # Final learning rate
        # Road condition augmentations:
        mosaic=1.0,             # 4-image mosaic combines road textures
        mixup=0.15,             # Mixes road patches to reduce false positives
        hsv_h=0.015,            # Hue shift (handles different asphalt types)
        hsv_s=0.6,              # Saturation shift (handles wet/dry asphalt)
        hsv_v=0.4,              # Value shift (handles shadows from trees/bridges)
        degrees=10.0,           # Dashcam rotation tolerance
        translate=0.1,          # Dashcam road bump vibration
        scale=0.5,              # Pothole size scale variation
        fliplr=0.5,             # Horizontal flip
        verbose=True
    )

    print("\n" + "=" * 65)
    print(f" Training Completed Successfully!")
    print(f" Best Weights Saved: {project_name}/{exp_name}/weights/best.pt")
    print("=" * 65)

    # 3. Validate on Test Split
    print("\n[SafeRoad AI] Running final validation on test dataset...")
    metrics = model.val()
    print(f" mAP@50:    {metrics.box.map50:.4f}")
    print(f" mAP@50-95: {metrics.box.map:.4f}")

    # 4. Export for Web & Mobile Deployment
    print("\n[SafeRoad AI] Exporting best model to ONNX for production deployment...")
    try:
        onnx_path = model.export(format="onnx", dynamic=True)
        print(f" ONNX Model Exported: {onnx_path}")
    except Exception as e:
        print(f" ONNX export notice: {e}")

    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Custom YOLOv8 Pothole Detection Model")
    parser.add_argument("--model", default="yolov8s.pt", help="Base model (yolov8n.pt for mobile speed, yolov8s.pt for balanced accuracy, yolov8m.pt for maximum mAP)")
    parser.add_argument("--data", default="pothole_data.yaml", help="Path to dataset data.yaml")
    parser.add_argument("--epochs", type=int, default=100, help="Number of training epochs")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution")
    parser.add_argument("--batch", type=int, default=16, help="Batch size (reduce to 8 or 4 if GPU runs out of VRAM)")

    args = parser.parse_args()

    # Ensure dataset config exists
    yaml_file = create_default_dataset_yaml(args.data)

    if not os.path.exists("./datasets/potholes"):
        print("\n" + "!" * 65)
        print(" DATASET DIRECTORY NOTICE:")
        print(" To start training, you need an annotated road damage dataset.")
        print(" 1. Download the RDD2022 or Roboflow Pothole Dataset in YOLOv8 format.")
        print(" 2. Place it into './datasets/potholes' or update 'pothole_data.yaml'.")
        print(" 3. Re-run: python train_pothole_model.py")
        print("!" * 65 + "\n")

    train_pothole_model(
        model_name=args.model,
        data_yaml=yaml_file,
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch
    )

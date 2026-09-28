"""
SafeRoad AI - RDD2020 / VOC to YOLOv8 Training Pipeline
======================================================
Trains YOLOv8 on the Road Damage Dataset (RDD) provided at E:\train (or custom path).

Handles:
  1. Parsing Pascal VOC XML annotations in annotations/xmls
  2. Mapping damage categories:
       - D40       -> 0: Pothole
       - D20       -> 1: Alligator Crack
       - D00, D01  -> 2: Longitudinal Crack
       - D10, D11  -> 3: Transverse Crack
       - D43, D44  -> 4: Road Marking Decay
  3. Generating 85/15 Train/Validation split
  4. Creating YOLOv8 dataset configuration
  5. Fine-tuning YOLOv8 model with road-safety augmentations
  6. Automatically deploying best model weights to server/models/pothole_yolov8.pt

Usage:
  python server/scripts/train_from_rdd.py --data-dir "E:\\train" --epochs 10 --batch 8
"""

import os
import sys
import time
import shutil
import random
import argparse
import xml.etree.ElementTree as ET
from pathlib import Path

# Fix Windows console encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

try:
    from ultralytics import YOLO
    import torch
    ULTRALYTICS_OK = True
except ImportError:
    ULTRALYTICS_OK = False


SCRIPT_DIR = Path(__file__).parent.resolve()
SERVER_DIR = SCRIPT_DIR.parent
MODELS_DIR = SERVER_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)
TARGET_MODEL_PATH = MODELS_DIR / "pothole_yolov8.pt"

# RDD standard code to class mapping
RDD_CLASS_MAP = {
    "D40": (0, "Pothole"),
    "D20": (1, "Alligator Crack"),
    "D00": (2, "Longitudinal Crack"),
    "D01": (2, "Longitudinal Crack"),
    "D10": (3, "Transverse Crack"),
    "D11": (3, "Transverse Crack"),
    "D43": (4, "Road Marking Decay"),
    "D44": (4, "Road Marking Decay"),
}

CLASS_NAMES = {
    0: "Pothole",
    1: "Alligator Crack",
    2: "Longitudinal Crack",
    3: "Transverse Crack",
    4: "Road Marking Decay"
}


def convert_xml_to_yolo(xml_file: Path, img_w: int, img_h: int):
    """Parses a VOC XML file and converts bounding boxes to YOLO normalized coordinates."""
    yolo_lines = []
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
        
        # Read image size from XML or fallback
        size_node = root.find("size")
        if size_node is not None:
            w_node = size_node.find("width")
            h_node = size_node.find("height")
            if w_node is not None and int(w_node.text) > 0:
                img_w = int(w_node.text)
            if h_node is not None and int(h_node.text) > 0:
                img_h = int(h_node.text)

        for obj in root.findall("object"):
            name_node = obj.find("name")
            if name_node is None:
                continue
            name = name_node.text.strip()
            if name not in RDD_CLASS_MAP:
                continue

            class_id, _ = RDD_CLASS_MAP[name]
            bndbox = obj.find("bndbox")
            if bndbox is None:
                continue

            xmin = float(bndbox.find("xmin").text)
            ymin = float(bndbox.find("ymin").text)
            xmax = float(bndbox.find("xmax").text)
            ymax = float(bndbox.find("ymax").text)

            # Clamp coordinates
            xmin = max(0.0, min(xmin, float(img_w)))
            xmax = max(0.0, min(xmax, float(img_w)))
            ymin = max(0.0, min(ymin, float(img_h)))
            ymax = max(0.0, min(ymax, float(img_h)))

            box_w = xmax - xmin
            box_h = ymax - ymin
            if box_w <= 1 or box_h <= 1:
                continue

            x_center = xmin + box_w / 2.0
            y_center = ymin + box_h / 2.0

            # Normalized
            norm_x = x_center / img_w
            norm_y = y_center / img_h
            norm_w = box_w / img_w
            norm_h = box_h / img_h

            yolo_lines.append(f"{class_id} {norm_x:.6f} {norm_y:.6f} {norm_w:.6f} {norm_h:.6f}")

    except Exception as e:
        print(f"Warning parsing {xml_file.name}: {e}")

    return yolo_lines


def prepare_yolo_dataset(data_dir: Path, target_dir: Path = None, val_ratio=0.15, max_samples=None):
    """
    Scans data_dir (with 'images' and 'annotations/xmls'),
    generates YOLO txt labels in data_dir/'labels', and creates train.txt/val.txt splits.
    Zero-copy: no images are duplicated!
    """
    images_dir = data_dir / "images"
    xmls_dir = data_dir / "annotations" / "xmls"
    labels_dir = data_dir / "labels"
    labels_dir.mkdir(parents=True, exist_ok=True)

    if not images_dir.exists() or not xmls_dir.exists():
        raise FileNotFoundError(f"Expected 'images' and 'annotations/xmls' inside {data_dir}")

    print(f"\n[1/3] Preparing YOLOv8 dataset from: {data_dir}")
    print(f"      Labels output directory: {labels_dir}")

    # Gather matching pairs
    image_files = sorted(list(images_dir.glob("*.jpg")) + list(images_dir.glob("*.png")))
    valid_pairs = []

    for img_p in image_files:
        xml_p = xmls_dir / f"{img_p.stem}.xml"
        if xml_p.exists():
            valid_pairs.append((img_p, xml_p))

    print(f"      Found {len(valid_pairs)} matching image/annotation pairs.")

    if max_samples and max_samples < len(valid_pairs):
        random.seed(42)
        valid_pairs = random.sample(valid_pairs, max_samples)
        print(f"      Subsampled to {len(valid_pairs)} images for quick training.")

    # Convert all XMLs to YOLO labels (zero-copy)
    print("      Converting VOC XMLs to YOLO txt annotations...")
    for img_p, xml_p in valid_pairs:
        lines = convert_xml_to_yolo(xml_p, 720, 720)
        dest_txt = labels_dir / f"{img_p.stem}.txt"
        with open(dest_txt, "w") as f:
            f.write("\n".join(lines) + ("\n" if lines else ""))

    # Shuffle & split into train.txt and val.txt
    random.seed(42)
    random.shuffle(valid_pairs)
    val_count = max(1, int(len(valid_pairs) * val_ratio))
    val_set = valid_pairs[:val_count]
    train_set = valid_pairs[val_count:]

    print(f"      Train set: {len(train_set)} images | Val set: {len(val_set)} images")

    train_txt = data_dir / "train.txt"
    with open(train_txt, "w") as f:
        for img_p, _ in train_set:
            f.write(f"{img_p.resolve().as_posix()}\n")

    val_txt = data_dir / "val.txt"
    with open(val_txt, "w") as f:
        for img_p, _ in val_set:
            f.write(f"{img_p.resolve().as_posix()}\n")

    # Generate data.yaml
    yaml_path = data_dir / "rdd_data.yaml"
    yaml_content = f"""# SafeRoad AI RDD2020 Dataset Configuration
path: {data_dir.resolve().as_posix()}
train: train.txt
val: val.txt

names:
  0: Pothole
  1: Alligator Crack
  2: Longitudinal Crack
  3: Transverse Crack
  4: Road Marking Decay
"""
    with open(yaml_path, "w") as f:
        f.write(yaml_content)

    print(f"      ✓ Dataset configured at: {yaml_path}")
    return yaml_path



def train_rdd_model(data_yaml: Path, base_model="yolov8n.pt", epochs=15, batch=8, imgsz=640):
    """Executes YOLOv8 fine-tuning on RDD dataset."""
    if not ULTRALYTICS_OK:
        print("❌ Error: ultralytics is not installed.")
        sys.exit(1)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("\n" + "=" * 65)
    print(" SafeRoad AI — RDD Model Training Execution")
    print("=" * 65)
    print(f" Base Model     : {base_model}")
    print(f" Dataset        : {data_yaml}")
    print(f" Compute Device : {device.upper()} {'(NVIDIA GPU)' if device == 'cuda' else '(CPU)'}")
    print(f" Epochs         : {epochs} | Batch: {batch} | ImgSz: {imgsz}")
    print("=" * 65 + "\n")

    model = YOLO(base_model)

    results = model.train(
        data=str(data_yaml),
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        device=device,
        project="saferoad_runs",
        name="rdd_pothole_yolov8",
        optimizer="AdamW",
        lr0=0.001,
        lrf=0.01,
        mosaic=0.8,
        mixup=0.1,
        save=True,
        verbose=True
    )

    # Locate best.pt
    best_weights = Path(model.trainer.best) if hasattr(model.trainer, "best") else None
    if not best_weights or not best_weights.exists():
        best_weights = Path("saferoad_runs") / "rdd_pothole_yolov8" / "weights" / "best.pt"

    if best_weights.exists():
        # Backup existing model
        if TARGET_MODEL_PATH.exists():
            backup_path = MODELS_DIR / f"pothole_yolov8_backup_{int(time.time())}.pt"
            shutil.copy(TARGET_MODEL_PATH, backup_path)
            print(f"\n[SafeRoad AI] Backed up old model to: {backup_path.name}")

        shutil.copy(best_weights, TARGET_MODEL_PATH)
        print(f"\n✓ Successfully deployed newly trained model to:")
        print(f"  {TARGET_MODEL_PATH} ({TARGET_MODEL_PATH.stat().st_size / (1024*1024):.2f} MB)")
    else:
        print("⚠ Could not locate best weights automatically. Check saferoad_runs/rdd_pothole_yolov8/weights/")

    return TARGET_MODEL_PATH


def main():
    parser = argparse.ArgumentParser(description="Train YOLOv8 on RDD Dataset")
    parser.add_argument("--data-dir", type=str, default=r"E:\train", help="Path to RDD dataset containing images and annotations/xmls")
    parser.add_argument("--target-dir", type=str, default=r"E:\rdd_yolo", help="Where to write converted YOLO dataset")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs (default: 10)")
    parser.add_argument("--batch", type=int, default=8, help="Batch size (default: 8)")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution (default: 640)")
    parser.add_argument("--max-samples", type=int, default=None, help="Limit number of images for faster training (e.g. 200)")
    parser.add_argument("--base-model", type=str, default="yolov8n.pt", help="Pretrained base model (yolov8n.pt or server/models/pothole_yolov8.pt)")

    args = parser.parse_args()

    print("\n╔════════════════════════════════════════════════════════════════════╗")
    print("║            SafeRoad AI — Real Road Damage Training (RDD)           ║")
    print("╚════════════════════════════════════════════════════════════════════╝")

    data_dir = Path(args.data_dir)
    target_dir = Path(args.target_dir)

    # Step 1: Convert & Prepare Dataset
    yaml_path = prepare_yolo_dataset(
        data_dir=data_dir,
        target_dir=target_dir,
        max_samples=args.max_samples
    )

    # Step 2: Train Model
    trained_model = train_rdd_model(
        data_yaml=yaml_path,
        base_model=args.base_model,
        epochs=args.epochs,
        batch=args.batch,
        imgsz=args.imgsz
    )

    print("\n" + "=" * 65)
    print(" 🎉 Training Pipeline Complete!")
    print(f" Trained Model Saved: {trained_model}")
    print(" To start live detection server:")
    print("   npm run ml:serve")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    main()

"""
Quick test for the SafeRoad AI /detect endpoint.
Reads a test image (or creates a synthetic road frame) and POSTs it to the ML server.

Usage:
    python server/scripts/test_api_detect.py
    python server/scripts/test_api_detect.py --image path/to/pothole.jpg
"""

import argparse
import base64
import json
import sys
import os

try:
    import requests
except ImportError:
    print("Install requests: pip install requests")
    sys.exit(1)

try:
    import numpy as np
    import cv2
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

ML_URL = "http://localhost:8000"


def make_synthetic_road_frame(w=640, h=360):
    """Creates a simple grey asphalt-like image for testing."""
    frame = np.full((h, w, 3), 80, dtype=np.uint8)  # dark asphalt grey
    # Add some noise
    noise = np.random.randint(0, 30, (h, w, 3), dtype=np.uint8)
    frame = cv2.add(frame, noise)
    # Draw a fake dark pothole ellipse
    cv2.ellipse(frame, (w // 2, int(h * 0.65)), (55, 30), 0, 0, 360, (30, 30, 30), -1)
    return frame


def image_to_base64(path=None):
    if path and os.path.exists(path):
        with open(path, "rb") as f:
            return base64.b64encode(f.read()).decode()
    elif HAS_CV2:
        frame = make_synthetic_road_frame()
        _, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
        return base64.b64encode(buf.tobytes()).decode()
    else:
        print("No image path provided and opencv-python not installed.")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Test SafeRoad ML /detect endpoint")
    parser.add_argument("--image", default=None, help="Path to a test image file")
    parser.add_argument("--conf", type=float, default=0.35, help="Confidence threshold")
    args = parser.parse_args()

    print("=" * 55)
    print(" SafeRoad AI — ML API Test Client")
    print("=" * 55)

    # 1. Health check
    print("\n[1] Checking /health ...")
    try:
        r = requests.get(f"{ML_URL}/health", timeout=5)
        health = r.json()
        print(f"    Status      : {health['status']}")
        print(f"    Model ready : {health['model_ready']}")
        print(f"    Model path  : {health['model_path']}")
        if health.get("error"):
            print(f"    Error       : {health['error']}")
    except Exception as e:
        print(f"    ❌ Could not reach ML server: {e}")
        print("    → Make sure `python server/ml_server.py` is running.")
        sys.exit(1)

    # 2. Detect
    print("\n[2] Sending test frame to /detect ...")
    b64 = image_to_base64(args.image)
    payload = {"image": b64, "lat": 37.7749, "lng": -122.4194, "conf": args.conf}
    try:
        r = requests.post(f"{ML_URL}/detect", json=payload, timeout=30)
        result = r.json()
    except Exception as e:
        print(f"    ❌ Request failed: {e}")
        sys.exit(1)

    print(f"    Mode        : {result['mode']}")
    print(f"    Frame size  : {result['frame_w']}×{result['frame_h']}")
    print(f"    Infer FPS   : {result['fps']}")
    print(f"    Detections  : {len(result['detections'])}")

    for i, d in enumerate(result["detections"], 1):
        print(f"\n    Detection {i}:")
        print(f"      Type       : {d['type']}")
        print(f"      Confidence : {d['confidence']}%")
        print(f"      Severity   : {d['severity']}")
        print(f"      Depth      : {d['depth_cm']} cm")
        print(f"      BBox       : {d['bbox']}")

    print("\n✅ Test complete.\n")


if __name__ == "__main__":
    main()

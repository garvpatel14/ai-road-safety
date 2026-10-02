# SafeRoad AI - ML Model Status & Pipeline Guide

## 🔍 Current Status: **FULLY OPERATIONAL & VERIFIED** ✅

---

## ✅ System Verification Results

### 1. **Model Weights Present & Verified**
- ✓ Primary YOLOv8 model: `server/models/pothole_yolov8.pt` (21.48 MB)
- ✓ Model architecture: YOLOv8 PyTorch neural network
- ✓ In-memory inference test: **PASSED** (detections produced on test asphalt frames)
- ✓ Visual verification output: `server/models/sample_detection_test.jpg`

### 2. **Python Environment & Dependencies**
- ✓ Python 3.10.11 installed
- ✓ `ultralytics` v8.4.163 installed (YOLOv8 framework)
- ✓ `torch` v2.14.0 (PyTorch CPU/CUDA deep learning engine)
- ✓ `torchvision` v0.29.0
- ✓ `opencv-python` v5.0.0 (Computer Vision processing)
- ✓ `fastapi` v0.141.1 & `uvicorn` v0.54.0 (Real-time inference server)
- ✓ `requests` v2.33.0 & `numpy` v2.2.6

### 3. **Model Server & Frontend Integration**
- ✓ Fast microservice available at `server/ml_server.py` (Port 8000)
- ✓ Frontend `LiveRoadScanningPage.jsx` has built-in integration to `http://localhost:8000/detect`
- ✓ Real-time FPS monitoring and automatic telemetry logging

---

## 🛠️ How to Make, Train & Retrain the ML Model

We have built a dedicated end-to-end model maker and trainer: `server/scripts/make_ml_model.py`.

### 1. Quick Train (Self-Contained, No External Downloads Needed)
Generates a realistic synthetic road distress dataset (potholes, alligator cracks, longitudinal cracks, edge erosion) and fine-tunes YOLOv8:
```bash
npm run ml:train
# Or directly:
python server/scripts/make_ml_model.py --quick --epochs 15
```

### 2. Train on Your E:\train Road Damage Dataset (RDD India 1,530 Images)
We created a specialized zero-copy converter and trainer for `E:\train`:
```bash
npm run ml:train:rdd
# Or customize epochs and batch size:
python server/scripts/train_from_rdd.py --data-dir "E:\train" --epochs 20 --batch 16
```
This automatically maps RDD codes (`D40` -> Potholes, `D20` -> Alligator Cracks, `D00` -> Longitudinal Cracks, `D10` -> Transverse Cracks) and deploys the new model directly to `server/models/pothole_yolov8.pt`.

### 3. Test & Benchmark Current Model
Run an inference benchmark and visualize bounding boxes:
```bash
npm run ml:test
# Or directly:
python server/scripts/make_ml_model.py --test-only
```

---

## 🚀 How to Run the ML Detection Server

### 1. Start the ML Model Inference Microservice
```bash
npm run ml:serve
# Or directly:
python server/ml_server.py
```
*Runs on `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.*

### 2. Start Full Platform (Frontend + Express API)
```bash
# Terminal 1: Backend Express API
cd server && npm run dev

# Terminal 2: ML Model Server
npm run ml:serve

# Terminal 3: Frontend React/Vite
npm run dev
```

Navigate to **Live Road Scanning** (`/scan`). The ML badge will turn green (`YOLOv8 AI: Online`) and detect potholes in real time from your camera feed!

---

**Last Updated:** September 25, 2026  
**Status:** All dependencies active, model verified, training pipeline ready.

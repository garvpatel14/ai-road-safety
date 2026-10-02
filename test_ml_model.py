"""
SafeRoad AI - ML Model Setup Verification Script
This script checks if the YOLOv8 pothole detection model is properly configured.
"""

import sys
import os
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def print_section(title):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def check_python_version():
    print_section("1. Python Version Check")
    version = sys.version_info
    print(f"   Python Version: {version.major}.{version.minor}.{version.micro}")
    if version.major >= 3 and version.minor >= 8:
        print("   ✓ Python version is compatible (3.8+)")
        return True
    else:
        print("   ✗ Python 3.8 or higher is required")
        return False

def check_dependencies():
    print_section("2. Required Dependencies Check")
    dependencies = {
        'ultralytics': 'YOLOv8 Framework',
        'cv2': 'OpenCV (Computer Vision)',
        'torch': 'PyTorch (Deep Learning)',
        'numpy': 'NumPy (Numerical Computing)',
        'requests': 'HTTP Requests'
    }
    
    missing = []
    installed = []
    
    for module, description in dependencies.items():
        try:
            if module == 'cv2':
                import cv2
                version = cv2.__version__
            elif module == 'ultralytics':
                import ultralytics
                version = ultralytics.__version__
            elif module == 'torch':
                import torch
                version = torch.__version__
            elif module == 'numpy':
                import numpy
                version = numpy.__version__
            elif module == 'requests':
                import requests
                version = requests.__version__
            
            print(f"   ✓ {description:30} (v{version})")
            installed.append(module)
        except ImportError:
            print(f"   ✗ {description:30} NOT INSTALLED")
            missing.append(module)
    
    return missing

def check_model_file():
    print_section("3. YOLOv8 Model File Check")
    model_paths = [
        'server/models/pothole_yolov8.pt',
        'models/pothole_yolov8.pt',
        'yolov8n.pt'
    ]
    
    found = False
    for path in model_paths:
        if os.path.exists(path):
            size_mb = os.path.getsize(path) / (1024 * 1024)
            print(f"   ✓ Model Found: {path}")
            print(f"     Size: {size_mb:.2f} MB")
            found = True
            break
    
    if not found:
        print("   ✗ No model file found")
        print("     Expected locations:")
        for path in model_paths:
            print(f"       - {path}")
    
    return found

def check_cuda_gpu():
    print_section("4. GPU/CUDA Availability Check")
    try:
        import torch
        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name(0)
            print(f"   ✓ CUDA GPU Available: {gpu_name}")
            print(f"     CUDA Version: {torch.version.cuda}")
            print("     Status: ML model will run on GPU (FAST)")
            return True
        else:
            print("   ⚠ No CUDA GPU detected")
            print("     Status: ML model will run on CPU (SLOWER)")
            return False
    except:
        print("   ⚠ Cannot check GPU (torch not installed)")
        return False

def test_model_loading():
    print_section("5. Model Loading Test")
    try:
        from ultralytics import YOLO
        print("   Attempting to load model...")
        
        model_path = None
        if os.path.exists('server/models/pothole_yolov8.pt'):
            model_path = 'server/models/pothole_yolov8.pt'
        elif os.path.exists('yolov8n.pt'):
            model_path = 'yolov8n.pt'
        
        if model_path:
            model = YOLO(model_path)
            print(f"   ✓ Model loaded successfully: {model_path}")
            print(f"     Model Type: {type(model).__name__}")
            return True
        else:
            print("   ✗ No model file available for testing")
            return False
    except Exception as e:
        print(f"   ✗ Error loading model: {str(e)}")
        return False

def check_backend_integration():
    print_section("6. Backend API Integration Check")
    try:
        import requests
        api_url = "http://localhost:5000/api/reports"
        print(f"   Testing connection to: {api_url}")
        
        response = requests.get(api_url, timeout=2)
        if response.status_code == 200:
            print("   ✓ Backend API is accessible")
            data = response.json()
            if 'reports' in data:
                print(f"     Found {len(data['reports'])} existing reports in database")
            return True
        else:
            print(f"   ⚠ Backend responded with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("   ✗ Backend API not running")
        print("     Please start the backend with: cd server && npm run dev")
        return False
    except Exception as e:
        print(f"   ⚠ Connection test failed: {str(e)}")
        return False

def main():
    print("\n" + "╔" + "═" * 68 + "╗")
    print("║" + " " * 15 + "SafeRoad AI - ML Model Verification" + " " * 18 + "║")
    print("╚" + "═" * 68 + "╝")
    
    results = {
        'python': check_python_version(),
        'model_file': check_model_file(),
        'gpu': check_cuda_gpu(),
    }
    
    missing_deps = check_dependencies()
    results['dependencies'] = len(missing_deps) == 0
    
    if not missing_deps:
        results['model_loading'] = test_model_loading()
    else:
        results['model_loading'] = False
        print_section("5. Model Loading Test")
        print("   ⊘ Skipped (dependencies missing)")
    
    results['backend'] = check_backend_integration()
    
    # Summary
    print_section("VERIFICATION SUMMARY")
    
    total = len(results)
    passed = sum(results.values())
    
    for check, status in results.items():
        icon = "✓" if status else "✗"
        print(f"   {icon} {check.replace('_', ' ').title()}")
    
    print(f"\n   Overall: {passed}/{total} checks passed")
    
    if missing_deps:
        print("\n" + "!" * 70)
        print("   INSTALLATION REQUIRED")
        print("!" * 70)
        print("\n   To install missing dependencies, run:")
        print(f"\n   pip install {' '.join(missing_deps)}")
        print("\n   Or install all requirements:")
        print("\n   pip install -r server/requirements.txt")
        print()
    
    if passed == total:
        print("\n   🎉 ALL SYSTEMS GO! ML model is ready to use.")
        print("\n   To test the detector, run:")
        print("   python server/scripts/yolo_pothole_detector.py --source 0")
    elif not results['backend']:
        print("\n   ⚠ ML model is configured but backend is not running.")
        print("   Start the backend first: cd server && npm run dev")
    
    print("\n" + "=" * 70 + "\n")

if __name__ == "__main__":
    main()

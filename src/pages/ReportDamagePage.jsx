import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Upload,
  Camera,
  MapPin,
  AlertTriangle,
  Sparkles,
  X,
  Send,
  Compass,
  Video,
  FileImage,
  Navigation,
  Map as MapIcon,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Crosshair,
  Trash2,
} from 'lucide-react';

// ─── Leaflet red marker icon ────────────────────────────────────────────────
const redMarkerIcon = L.divIcon({
  html: `<div style="
    background: #ef4444;
    width: 32px; height: 32px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    display: flex; align-items: center; justify-content: center;
  "><div style="
    width: 10px; height: 10px;
    background: white;
    border-radius: 50%;
    transform: rotate(45deg);
  "></div></div>`,
  className: 'custom-leaflet-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// ─── react-leaflet helper: re-center map when street changes ────────────────
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 17, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
};

// ─── react-leaflet helper: capture map clicks ───────────────────────────────
const MapClickHandler = ({ onClick }) => {
  useMapEvents({ click: (e) => onClick(e.latlng) });
  return null;
};

// ─── Anand, Gujarat location data ──────────────────────────────────────────
const ANAND_AREAS = {
  'Anand City': {
    lat: 22.5569,
    lng: 72.9560,
    streets: [
      { name: 'Station Road', lat: 22.5581, lng: 72.9542 },
      { name: 'College Road', lat: 22.5612, lng: 72.9578 },
      { name: 'Vitthal Udyognagar Road', lat: 22.5495, lng: 72.9620 },
      { name: 'Anand–Sojitra Road', lat: 22.5530, lng: 72.9700 },
      { name: 'Gujarat Vidyapith Road', lat: 22.5600, lng: 72.9530 },
      { name: 'Sardar Patel Road', lat: 22.5570, lng: 72.9510 },
      { name: 'Vallabh Vidyanagar Main Road', lat: 22.5540, lng: 72.9480 },
    ],
  },
  'Vallabh Vidyanagar': {
    lat: 22.5440,
    lng: 72.9246,
    streets: [
      { name: 'Vidyanagar Main Road', lat: 22.5445, lng: 72.9250 },
      { name: 'University Road', lat: 22.5460, lng: 72.9230 },
      { name: 'VV Nagar–Anand Road', lat: 22.5430, lng: 72.9270 },
      { name: 'Charutar Vidya Mandal Road', lat: 22.5420, lng: 72.9210 },
      { name: 'Karamsad Road', lat: 22.5410, lng: 72.9290 },
    ],
  },
  'Karamsad': {
    lat: 22.5401,
    lng: 72.9393,
    streets: [
      { name: 'Karamsad Main Road', lat: 22.5405, lng: 72.9390 },
      { name: 'Borsad Road (Karamsad)', lat: 22.5415, lng: 72.9410 },
      { name: 'Gokul Road', lat: 22.5395, lng: 72.9375 },
      { name: 'Sardar Chowk Road', lat: 22.5385, lng: 72.9400 },
    ],
  },
  'Borsad': {
    lat: 22.4053,
    lng: 72.8990,
    streets: [
      { name: 'Borsad Main Road', lat: 22.4058, lng: 72.8985 },
      { name: 'Anand–Borsad Highway', lat: 22.4070, lng: 72.9010 },
      { name: 'Gandhi Chowk Road', lat: 22.4040, lng: 72.8970 },
      { name: 'Railway Station Road (Borsad)', lat: 22.4045, lng: 72.9000 },
    ],
  },
  'Sojitra': {
    lat: 22.5252,
    lng: 72.9947,
    streets: [
      { name: 'Sojitra Main Bazaar Road', lat: 22.5255, lng: 72.9950 },
      { name: 'Anand–Sojitra Road (Sojitra end)', lat: 22.5265, lng: 72.9970 },
      { name: 'Tarapur Road', lat: 22.5240, lng: 72.9930 },
    ],
  },
  'Petlad': {
    lat: 22.4723,
    lng: 72.8084,
    streets: [
      { name: 'Petlad Main Road', lat: 22.4728, lng: 72.8080 },
      { name: 'Station Road (Petlad)', lat: 22.4715, lng: 72.8090 },
      { name: 'Anand–Petlad Road', lat: 22.4740, lng: 72.8100 },
      { name: 'Pij Road', lat: 22.4700, lng: 72.8070 },
    ],
  },
  'Umreth': {
    lat: 22.6887,
    lng: 72.7615,
    streets: [
      { name: 'Umreth Main Road', lat: 22.6890, lng: 72.7618 },
      { name: 'Vadodara–Anand Road (Umreth)', lat: 22.6900, lng: 72.7630 },
      { name: 'Nadiad Road (Umreth)', lat: 22.6875, lng: 72.7600 },
    ],
  },
  'Tarapur': {
    lat: 22.5667,
    lng: 73.0167,
    streets: [
      { name: 'Tarapur GIDC Road', lat: 22.5670, lng: 73.0170 },
      { name: 'Sojitra–Tarapur Road', lat: 22.5655, lng: 73.0155 },
      { name: 'Anand–Tarapur Main Road', lat: 22.5680, lng: 73.0185 },
    ],
  },
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;   // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;  // 100 MB

const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const ReportDamagePage = () => {
  const { addToast, addNotification } = useNotifications();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // File state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [damageType, setDamageType] = useState('Pothole');
  const [severity, setSeverity] = useState('High');

  // Location state
  const [locationMode, setLocationMode] = useState('gps');
  const [gpsStatus, setGpsStatus] = useState('idle');
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  // Manual location state
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [streetApproxLat, setStreetApproxLat] = useState(null);
  const [streetApproxLng, setStreetApproxLng] = useState(null);

  // Map-clicked exact location
  const [mapClickedLat, setMapClickedLat] = useState(null);
  const [mapClickedLng, setMapClickedLng] = useState(null);
  const [reverseGeoAddress, setReverseGeoAddress] = useState('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});

  // ── File handling ──────────────────────────────────────────────────────────
  const processFile = (file) => {
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      addToast('Unsupported file type. Please upload an image or video.', 'warning');
      return;
    }
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      addToast('File too large. Max ' + (isVideo ? '100 MB for videos' : '10 MB for images') + '.', 'warning');
      return;
    }
    const url = URL.createObjectURL(file);
    setUploadedFile({ file, preview: url, type: isImage ? 'image' : 'video' });
    setAiConfidence(null);
    if (isImage) simulateAiDetection();
    setErrors((prev) => ({ ...prev, file: null }));
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const clearFile = () => {
    if (uploadedFile && uploadedFile.preview) URL.revokeObjectURL(uploadedFile.preview);
    setUploadedFile(null);
    setAiConfidence(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const simulateAiDetection = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiConfidence('96.8% Match: Deep Pothole detected with high structural risk');
      addToast('AI Vision automatically classified road damage severity!', 'info');
    }, 1200);
  };

  // ── GPS auto-detect ────────────────────────────────────────────────────────
  const handleAutoGPS = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser.', 'warning');
      return;
    }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detectedLat = pos.coords.latitude.toFixed(6);
        const detectedLng = pos.coords.longitude.toFixed(6);
        setLat(detectedLat);
        setLng(detectedLng);
        setLocationName('Anand, Gujarat, India');
        setGpsStatus('success');
        setErrors((prev) => ({ ...prev, location: null }));
        addToast('GPS location acquired successfully!', 'success');
      },
      (err) => {
        setGpsStatus('error');
        let msg = 'Unable to retrieve location.';
        if (err.code === 1) msg = 'Location permission denied. Please allow access or use manual selection.';
        else if (err.code === 2) msg = 'Location information is unavailable.';
        else if (err.code === 3) msg = 'Location request timed out.';
        addToast(msg, 'warning');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // ── Manual area/street selection ───────────────────────────────────────────
  const handleAreaChange = (area) => {
    setSelectedArea(area);
    setSelectedStreet('');
    setStreetApproxLat(null);
    setStreetApproxLng(null);
    clearMapSelection();
    setLat('');
    setLng('');
    setLocationName('');
    setErrors((prev) => ({ ...prev, location: null }));
  };

  const handleStreetChange = (streetName) => {
    setSelectedStreet(streetName);
    // Clear any previous map-click marker
    clearMapSelection();
    setLat('');
    setLng('');
    setLocationName('');

    if (streetName && selectedArea) {
      const areaData = ANAND_AREAS[selectedArea];
      const streetData = areaData.streets.find((s) => s.name === streetName);
      if (streetData) {
        // These are APPROXIMATE — only used to center the map
        setStreetApproxLat(streetData.lat);
        setStreetApproxLng(streetData.lng);
      }
      setErrors((prev) => ({ ...prev, location: null }));
    }
  };

  // ── Map click handler ──────────────────────────────────────────────────────
  const reverseGeocode = useCallback(async (latitude, longitude) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(
        'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + latitude + '&lon=' + longitude + '&zoom=18&addressdetails=1',
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data && data.display_name) {
        setReverseGeoAddress(data.display_name);
      }
    } catch {
      // Fallback: keep the dropdown-based location string
    } finally {
      setIsReverseGeocoding(false);
    }
  }, []);

  const handleMapClick = useCallback((latlng) => {
    const clickedLat = latlng.lat;
    const clickedLng = latlng.lng;
    setMapClickedLat(clickedLat);
    setMapClickedLng(clickedLng);
    setLat(clickedLat.toFixed(6));
    setLng(clickedLng.toFixed(6));
    setLocationName(
      (selectedStreet || '') + ', ' + (selectedArea || '') + ', Anand, Gujarat, India'
    );
    setReverseGeoAddress('');
    reverseGeocode(clickedLat, clickedLng);
    setErrors((prev) => ({ ...prev, location: null }));
  }, [selectedStreet, selectedArea, reverseGeocode]);

  const clearMapSelection = () => {
    setMapClickedLat(null);
    setMapClickedLng(null);
    setReverseGeoAddress('');
    setIsReverseGeocoding(false);
  };

  const handleModeSwitch = (mode) => {
    setLocationMode(mode);
    setLocationName('');
    setLat('');
    setLng('');
    setGpsStatus('idle');
    setSelectedArea('');
    setSelectedStreet('');
    setStreetApproxLat(null);
    setStreetApproxLng(null);
    clearMapSelection();
    setErrors((prev) => ({ ...prev, location: null }));
  };

  // ── Validation & submission ────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!uploadedFile) newErrors.file = 'Please upload an image or video of the road damage.';
    if (!damageType) newErrors.damageType = 'Please select a damage type.';
    if (!severity) newErrors.severity = 'Please select a hazard severity.';
    if (!description.trim()) newErrors.description = 'Please provide a description.';
    if (locationMode === 'gps') {
      if (gpsStatus !== 'success') newErrors.location = 'Please auto-detect your GPS location.';
    } else {
      if (!selectedArea) newErrors.location = 'Please select an area.';
      else if (!selectedStreet) newErrors.location = 'Please select a street/road.';
      else if (mapClickedLat === null || mapClickedLng === null) newErrors.location = 'Please select the exact road damage location on the map.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please fill in all required fields.', 'warning');
      return;
    }
    const reportPayload = {
      damageType,
      severity,
      locationMethod: locationMode,
      area: locationMode === 'manual' ? selectedArea : 'Anand, Gujarat, India',
      street: locationMode === 'manual' ? selectedStreet : '',
      location: locationName,
      latitude: lat,
      longitude: lng,
      description,
      fileType: uploadedFile.type,
      fileName: uploadedFile.file.name,
      fileSize: formatBytes(uploadedFile.file.size),
      dateTime: new Date().toISOString(),
    };
    console.log('Damage Report Payload:', reportPayload);
    addToast('Road damage report submitted successfully! AI verification queued.', 'success');
    addNotification({
      title: 'New Damage Report Submitted',
      message: damageType + ' report registered at ' + locationName + '. AI confidence ' + (aiConfidence ? '96.8%' : '90%') + '.',
      type: 'warning',
    });
    navigate('/my-reports');
  };

  // ── Derived helpers ────────────────────────────────────────────────────────
  const availableStreets = selectedArea ? (ANAND_AREAS[selectedArea] ? ANAND_AREAS[selectedArea].streets : []) : [];

  const inputCls = (hasErr) =>
    'w-full px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 ' +
    (hasErr ? 'focus:ring-red-500 border-red-500/50' : 'focus:ring-brand-500');

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety-500/10 text-safety-600 dark:text-safety-400 text-xs font-bold border border-safety-500/20">
          <AlertTriangle className="w-4 h-4" /> Road Hazard Form
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Report Road Damage</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Submit photo or video evidence. Our AI Vision instantly verifies damage types and dispatches repair teams.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">

        {/* ── 1. FILE UPLOAD ─────────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Upload Damage Photo / Video <span className="text-red-500">*</span>
          </label>

          {uploadedFile ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-brand-500/40 bg-slate-900 group">
              {uploadedFile.type === 'image' ? (
                <img src={uploadedFile.preview} alt="Damage Preview" className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full bg-slate-950">
                  <video src={uploadedFile.preview} controls className="w-full max-h-64 object-contain" />
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 text-slate-300 text-xs">
                    <Video className="w-4 h-4 text-brand-400" />
                    <span className="font-semibold truncate">{uploadedFile.file.name}</span>
                    <span className="ml-auto text-slate-400">{formatBytes(uploadedFile.file.size)}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={clearFile}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-white hover:bg-red-600 transition z-10"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>

              {uploadedFile.type === 'image' && (
                isAiAnalyzing ? (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
                    <Sparkles className="w-8 h-8 text-safety-400 animate-spin" />
                    <p className="text-xs font-bold">AI Computer Vision Analyzing Image...</p>
                  </div>
                ) : (aiConfidence && (
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs flex items-center gap-1.5 border border-white/20">
                    <Sparkles className="w-4 h-4 text-safety-400 shrink-0" />
                    <span className="text-emerald-400 font-bold">{aiConfidence}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <label
              className={
                'flex flex-col items-center justify-center w-full h-52 rounded-2xl border-2 border-dashed cursor-pointer transition p-6 text-center space-y-2 ' +
                (isDragOver
                  ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 '
                  : 'border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 bg-slate-50/50 dark:bg-slate-900/50 ') +
                (errors.file ? 'border-red-500/60' : '')
              }
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <div className="flex items-center gap-3">
                  <FileImage className="w-7 h-7" />
                  <Video className="w-7 h-7" />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to upload or drag &amp; drop road image / video
              </p>
              <p className="text-[11px] text-slate-400">
                Images: PNG, JPG, JPEG, WEBP (max 10 MB) &nbsp;&middot;&nbsp; Videos: MP4, MOV, WEBM (max 100 MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/quicktime,video/webm,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {errors.file && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.file}
            </p>
          )}
        </div>

        {/* ── 2. DAMAGE TYPE & SEVERITY ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Damage Type <span className="text-red-500">*</span>
            </label>
            <select
              value={damageType}
              onChange={(e) => { setDamageType(e.target.value); setErrors((p) => ({ ...p, damageType: null })); }}
              className={inputCls(errors.damageType)}
            >
              <option value="Pothole">Pothole</option>
              <option value="Crack">Surface Crack</option>
              <option value="Erosion">Road Erosion / Slope</option>
              <option value="Debris">Debris / Obstruction</option>
              <option value="Missing Signage">Missing Road Signage</option>
            </select>
            {errors.damageType && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.damageType}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Hazard Severity <span className="text-red-500">*</span>
            </label>
            <select
              value={severity}
              onChange={(e) => { setSeverity(e.target.value); setErrors((p) => ({ ...p, severity: null })); }}
              className={inputCls(errors.severity)}
            >
              <option value="Low">Low – Minor cosmetic defect</option>
              <option value="Medium">Medium – Noticeable bumpy ride</option>
              <option value="High">High – Tire damage hazard</option>
              <option value="Critical">Critical – Immediate risk of crash</option>
            </select>
            {errors.severity && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.severity}</p>}
          </div>
        </div>

        {/* ── 3. LOCATION & GPS ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Location &amp; GPS Coordinates <span className="text-red-500">*</span>
          </label>

          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleModeSwitch('gps')}
              className={
                'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition ' +
                (locationMode === 'gps'
                  ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-400 hover:bg-brand-500/5')
              }
            >
              <Navigation className="w-4 h-4" />
              Auto-Detect Current GPS
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('manual')}
              className={
                'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition ' +
                (locationMode === 'manual'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-400 hover:bg-emerald-500/5')
              }
            >
              <MapIcon className="w-4 h-4" />
              Select Location Manually
            </button>
          </div>

          {/* GPS mode panel */}
          {locationMode === 'gps' && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detect your current device location using the browser geolocation API.
                </p>
                <button
                  type="button"
                  onClick={handleAutoGPS}
                  disabled={gpsStatus === 'loading'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition disabled:opacity-60"
                >
                  {gpsStatus === 'loading'
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Detecting...</>
                    : <><Compass className="w-3.5 h-3.5" /> Detect GPS</>}
                </button>
              </div>

              {gpsStatus === 'success' && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Location detected automatically
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-semibold">Location:</span> {locationName}
                    </div>
                    <div className="ml-5"><span className="font-semibold">Latitude:</span> {lat}</div>
                    <div className="ml-5"><span className="font-semibold">Longitude:</span> {lng}</div>
                  </div>
                </div>
              )}

              {gpsStatus === 'error' && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 flex items-start gap-2 text-xs text-red-500">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Permission denied or GPS unavailable. Please switch to <strong>Select Location Manually</strong>.</span>
                </div>
              )}

              {gpsStatus === 'idle' && (
                <p className="text-[11px] text-slate-400">Click &quot;Detect GPS&quot; and allow location access when prompted.</p>
              )}
            </div>
          )}

          {/* Manual mode panel */}
          {locationMode === 'manual' && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select the area and street where the road damage is located — even if you are not physically there.
              </p>

              {/* Area dropdown */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Select Area <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedArea}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full appearance-none px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-8"
                  >
                    <option value="">— Select an area in Anand, Gujarat —</option>
                    {Object.keys(ANAND_AREAS).map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Street dropdown */}
              <div>
                <label className={'block text-[11px] font-bold uppercase tracking-wider mb-1 ' + (selectedArea ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600')}>
                  Select Main Street / Road <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedStreet}
                    onChange={(e) => handleStreetChange(e.target.value)}
                    disabled={!selectedArea}
                    className="w-full appearance-none px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-8 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {selectedArea ? '— Select a road in ' + selectedArea + ' —' : '— Select an area first —'}
                    </option>
                    {availableStreets.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Interactive map + location info (only when street selected) */}
              {selectedStreet && streetApproxLat && streetApproxLng && (
                <>
                  {/* Instruction */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Crosshair className="w-4 h-4 text-brand-500" />
                    Select the exact location of the road damage on the map.
                  </div>

                  {/* Leaflet Map */}
                  <div className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner relative">
                    <MapContainer
                      center={[streetApproxLat, streetApproxLng]}
                      zoom={17}
                      scrollWheelZoom={true}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <RecenterMap lat={streetApproxLat} lng={streetApproxLng} />
                      <MapClickHandler onClick={handleMapClick} />
                      {mapClickedLat !== null && mapClickedLng !== null && (
                        <Marker position={[mapClickedLat, mapClickedLng]} icon={redMarkerIcon} />
                      )}
                    </MapContainer>
                  </div>

                  {/* Location info card — before vs after map click */}
                  {mapClickedLat !== null && mapClickedLng !== null ? (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Exact location selected
                        </div>
                        <button
                          type="button"
                          onClick={() => { clearMapSelection(); setLat(''); setLng(''); setLocationName(''); }}
                          className="flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-3 h-3" /> Clear
                        </button>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <div className="flex flex-wrap items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="font-semibold">Location:</span>
                          <span>{reverseGeoAddress || locationName}{isReverseGeocoding ? ' (detecting...)' : ''}</span>
                        </div>
                        <div className="ml-5"><span className="font-semibold">Latitude:</span> {lat}</div>
                        <div className="ml-5"><span className="font-semibold">Longitude:</span> {lng}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold">
                        <MapPin className="w-4 h-4" /> Street selected: {selectedStreet}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                        <div>Approximate location: {streetApproxLat.toFixed(6)}, {streetApproxLng.toFixed(6)}</div>
                        <div className="font-semibold text-amber-600 dark:text-amber-400">Please click on the map to select the exact damage location.</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {errors.location && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.location}
            </p>
          )}
        </div>

        {/* ── 4. DESCRIPTION ────────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: null })); }}
            className={inputCls(errors.description)}
            placeholder="Provide context regarding the damage depth, traffic impact, or nearby landmarks..."
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
            </p>
          )}
        </div>

        {/* ── SUBMIT ────────────────────────────────────────────────────── */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-safety-600 to-brand-600 text-white font-bold text-sm shadow-xl shadow-safety-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Submit Damage Report
        </button>

      </form>
    </div>
  );
};

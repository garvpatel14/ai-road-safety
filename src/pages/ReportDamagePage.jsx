import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import {
  Upload,
  Camera,
  MapPin,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  X,
  Send,
  Compass
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const ReportDamagePage = () => {
  const { addToast, addNotification } = useNotifications();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [damageType, setDamageType] = useState('Pothole');
  const [severity, setSeverity] = useState('High');
  const [locationName, setLocationName] = useState('Market St & 5th Ave, San Francisco');
  const [lat, setLat] = useState('37.7749');
  const [lng, setLng] = useState('-122.4194');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        simulateAiDetection();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAiDetection = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiConfidence('96.8% Match: Deep Pothole detected with high structural risk');
      addToast('AI Vision automatically classified road damage severity!', 'info');
    }, 1200);
  };

  const handleAutoGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(4));
          setLng(pos.coords.longitude.toFixed(4));
          addToast('GPS Location acquired from browser geolocation', 'success');
        },
        () => {
          addToast('Geolocation permission denied. Using selected map coordinate.', 'warning');
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imagePreview) {
      addToast('Please upload an image of the road damage.', 'warning');
      return;
    }

    addToast('Road damage report submitted successfully! AI verification queued.', 'success');
    addNotification({
      title: 'New Damage Report Submitted',
      message: `${damageType} report registered at ${locationName}. AI confidence ${aiConfidence ? '96.8%' : '90%'}.`,
      type: 'warning',
    });

    navigate('/my-reports');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety-500/10 text-safety-600 dark:text-safety-400 text-xs font-bold border border-safety-500/20">
          <AlertTriangle className="w-4 h-4" /> Road Hazard Form
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Report Road Damage</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Submit photo evidence. Our AI Vision instantly verifies damage types and dispatches repair teams.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
        
        {/* 1. IMAGE UPLOAD & PREVIEW */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Upload Damage Photo <span className="text-red-500">*</span>
          </label>

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-brand-500/40 bg-slate-900 group">
              <img src={imagePreview} alt="Damage Preview" className="w-full h-64 object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setAiConfidence(null);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-white hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* AI Detection Overlay */}
              {isAiAnalyzing ? (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
                  <Sparkles className="w-8 h-8 text-safety-400 animate-spin" />
                  <p className="text-xs font-bold">AI Computer Vision Analyzing Image...</p>
                </div>
              ) : (
                aiConfidence && (
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs flex items-center justify-between border border-white/20">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Sparkles className="w-4 h-4 text-safety-400" /> {aiConfidence}
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-52 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer transition p-6 text-center space-y-2">
              <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to upload or drag & drop road image
              </p>
              <p className="text-[11px] text-slate-400">PNG, JPG or WEBP (Max 10MB)</p>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        {/* 2. DAMAGE TYPE & SEVERITY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Damage Type
            </label>
            <select
              value={damageType}
              onChange={(e) => setDamageType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Pothole">Pothole</option>
              <option value="Crack">Surface Crack</option>
              <option value="Erosion">Road Erosion / Slope</option>
              <option value="Debris">Debris / Obstruction</option>
              <option value="Missing Signage">Missing Road Signage</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Hazard Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Low">Low - Minor cosmetic defect</option>
              <option value="Medium">Medium - Noticeable bumpy ride</option>
              <option value="High">High - Tire damage hazard</option>
              <option value="Critical">Critical - Immediate risk of crash</option>
            </select>
          </div>
        </div>

        {/* 3. GPS COORDINATES & LOCATION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Location & GPS Coordinates
            </label>
            <button
              type="button"
              onClick={handleAutoGPS}
              className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline"
            >
              <Compass className="w-3.5 h-3.5" /> Auto-Detect Current GPS
            </button>
          </div>

          <div>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Street address or intersection"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-400 mb-0.5">Latitude</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-0.5">Longitude</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>
        </div>

        {/* 4. DESCRIPTION */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Detailed Description
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Provide context regarding the damage depth, traffic impact, or nearby landmarks..."
          />
        </div>

        {/* SUBMIT BUTTON */}
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

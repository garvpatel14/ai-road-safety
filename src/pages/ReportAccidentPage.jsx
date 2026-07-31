import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import {
  Car,
  Camera,
  Compass,
  AlertOctagon,
  PhoneCall,
  Send,
  X,
  ShieldAlert
} from 'lucide-react';

export const ReportAccidentPage = () => {
  const { addToast, addNotification } = useNotifications();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Severe');
  const [vehicles, setVehicles] = useState(2);
  const [locationName, setLocationName] = useState('Highway 101 North Exit 22B');
  const [lat, setLat] = useState('37.7650');
  const [lng, setLng] = useState('-122.4200');
  const [notifyEmergency, setNotifyEmergency] = useState(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAutoGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(4));
          setLng(pos.coords.longitude.toFixed(4));
          addToast('GPS position updated via location service', 'success');
        },
        () => addToast('Could not fetch GPS automatically.', 'warning')
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addToast('Accident alert logged! Emergency & road safety units notified.', 'error');
    addNotification({
      title: 'Accident Reported',
      message: `Collision reported on ${locationName} involving ${vehicles} vehicle(s). Emergency dispatch alert sent.`,
      type: 'accident',
    });

    navigate('/map');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/20">
          <AlertOctagon className="w-4 h-4" /> Emergency Collision Form
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Report Traffic Accident</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Report vehicle collisions to instantly warn nearby commuters and broadcast emergency dispatch signals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
        
        {/* EMERGENCY 911 NOTICE */}
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-red-700 dark:text-red-400">Immediate Injury Emergency?</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">If anyone requires urgent medical attention, dial 911 / 112 immediately.</p>
            </div>
          </div>
          <a
            href="tel:911"
            className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
          >
            Call 911
          </a>
        </div>

        {/* 1. PHOTO EVIDENCE */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Accident Scene Photo (Optional)
          </label>

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-red-500/40 bg-slate-900">
              <img src={imagePreview} alt="Accident Scene" className="w-full h-64 object-cover" />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-white hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer transition p-6 text-center space-y-2">
              <div className="p-3.5 rounded-2xl bg-red-500/10 text-red-600">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upload image of accident scene
              </p>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        {/* 2. SEVERITY & NUMBER OF VEHICLES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Accident Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Minor">Minor - Fender bender / No injuries</option>
              <option value="Moderate">Moderate - Lane blocked / Vehicle damage</option>
              <option value="Severe">Severe - Multiple vehicles / Emergency on site</option>
              <option value="Critical">Critical - Major highway blockage</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Number of Vehicles Involved
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={vehicles}
              onChange={(e) => setVehicles(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* 3. GPS & LOCATION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Accident GPS Location
            </label>
            <button
              type="button"
              onClick={handleAutoGPS}
              className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-bold hover:underline"
            >
              <Compass className="w-3.5 h-3.5" /> Acquire Current GPS
            </button>
          </div>

          <div>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Highway exit or street address"
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
            Collision Details / Description
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Describe lane blockage, vehicle types, road condition..."
          />
        </div>

        {/* 5. EMERGENCY TOGGLE */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="emergencyNotify"
            checked={notifyEmergency}
            onChange={(e) => setNotifyEmergency(e.target.checked)}
            className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
          />
          <label htmlFor="emergencyNotify" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            Broadcast emergency alert to safe route navigation network
          </label>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-safety-600 text-white font-bold text-sm shadow-xl shadow-red-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Broadcast Accident Alert
        </button>

      </form>
    </div>
  );
};

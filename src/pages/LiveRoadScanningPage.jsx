import React, { useState, useEffect } from 'react';
import { Card, StatCard } from '../components/common/Card';
import { GpsTelemetryControl } from '../components/common/GpsTelemetryControl';
import { StatusBadge } from '../components/common/StatusBadge';
import { useNotifications } from '../context/NotificationContext';
import {
  Camera,
  Video,
  Play,
  Square,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Radio,
  Sliders,
  Maximize2,
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  Layers
} from 'lucide-react';

export const LiveRoadScanningPage = () => {
  const { addToast } = useNotifications();

  const [isScanning, setIsScanning] = useState(false);
  const [sensitivity, setSensitivity] = useState('High');
  const [detectedHazards, setDetectedHazards] = useState([]);
  const [scannerStats, setScannerStats] = useState({
    distanceScannedKm: 12.4,
    defectsLogged: 4,
    avgRoadQualityScore: 82,
    scansToday: 18
  });
  const [simulatedCoords, setSimulatedCoords] = useState({ lat: 37.7749, lng: -122.4194 });

  // Simulated AI scanner object detection feed
  useEffect(() => {
    let timer;
    if (isScanning) {
      timer = setInterval(() => {
        // Randomly trigger pothole/crack detection during live scan
        if (Math.random() > 0.6) {
          const types = ['Pothole', 'Surface Crack', 'Rutting', 'Severe Edge Erosion'];
          const severities = ['Medium', 'High', 'Critical'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          const randomSev = severities[Math.floor(Math.random() * severities.length)];
          const confidence = (88 + Math.random() * 11).toFixed(1);

          const newHazard = {
            id: `SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
            type: randomType,
            severity: randomSev,
            confidence: `${confidence}%`,
            lat: (simulatedCoords.lat + (Math.random() - 0.5) * 0.002).toFixed(4),
            lng: (simulatedCoords.lng + (Math.random() - 0.5) * 0.002).toFixed(4),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };

          setDetectedHazards((prev) => [newHazard, ...prev.slice(0, 7)]);
          setScannerStats(prev => ({ ...prev, defectsLogged: prev.defectsLogged + 1 }));

          if (randomSev === 'Critical' || randomSev === 'High') {
            addToast(`AI SCAN ALERT: ${randomType} detected ahead (${confidence}% confidence)!`, 'warning');
          }
        }
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isScanning, simulatedCoords, addToast]);

  const toggleScanner = () => {
    if (!isScanning) {
      setIsScanning(true);
      addToast('Live Road Scanning active! AI Vision analyzing road surface...', 'info');
    } else {
      setIsScanning(false);
      addToast('Live Road Scanner paused.', 'info');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety-500/10 text-safety-600 dark:text-safety-400 text-xs font-bold border border-safety-500/20 mb-1">
            <Camera className="w-4 h-4" /> Real-Time Dashcam Scanner Module
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Live Road Scanning HUD</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time automated road defect detection while driving using AI computer vision.
          </p>
        </div>

        <button
          onClick={toggleScanner}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-extrabold text-sm shadow-xl transition transform active:scale-95 ${
            isScanning
              ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30 animate-pulse'
              : 'bg-gradient-to-r from-safety-600 to-brand-600 hover:opacity-95 shadow-safety-500/30'
          }`}
        >
          {isScanning ? <Square className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
          <span>{isScanning ? 'STOP LIVE SCANNING' : 'START LIVE ROAD SCAN'}</span>
        </button>
      </div>

      {/* 4 TOP SCANNER STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Distance Scanned"
          value={`${scannerStats.distanceScannedKm} km`}
          icon={Radio}
          color="brand"
        />
        <StatCard
          title="Defects Auto-Logged"
          value={scannerStats.defectsLogged}
          icon={AlertTriangle}
          color="safety"
        />
        <StatCard
          title="Road Quality Index (RQI)"
          value={`${scannerStats.avgRoadQualityScore} / 100`}
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Scans Today"
          value={scannerStats.scansToday}
          icon={Video}
          color="purple"
        />
      </div>

      {/* GPS TELEMETRY HEADER INTEGRATION */}
      <GpsTelemetryControl onCoordsUpdate={(c) => setSimulatedCoords(c)} compact={true} />

      {/* LIVE SCANNER CAMERA VIEWPORT + OVERLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Camera Viewport (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950 aspect-video group">
            
            {/* Background Simulated Road Stream */}
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
              alt="Live Road Scan Feed"
              className={`w-full h-full object-cover transition-opacity duration-500 ${isScanning ? 'opacity-85' : 'opacity-40 filter grayscale'}`}
            />

            {/* AI Scanning Lines & Grid Animation */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Horizontal Scanning Beam */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-safety-400 to-transparent shadow-[0_0_15px_#f97316] animate-scan-line" />
                {/* HUD Crosshairs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-safety-500 animate-ping" />
                </div>
              </div>
            )}

            {/* Top Viewport HUD Overlay Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
                <span>{isScanning ? 'LIVE SCANNING ACTIVE' : 'CAMERA STANDBY'}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-slate-300 text-xs font-mono border border-white/10">
                  FPS: 60 | AI Model: PotholeVision-v4
                </span>
              </div>
            </div>

            {/* Simulated AI Detection Bounding Boxes Overlay */}
            {isScanning && detectedHazards.length > 0 && (
              <div className="absolute top-1/3 left-1/4 w-44 h-32 border-2 border-safety-500 bg-safety-500/10 rounded-xl p-2 animate-pulse shadow-lg shadow-safety-500/20">
                <div className="bg-safety-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded w-max shadow">
                  {detectedHazards[0].type} ({detectedHazards[0].confidence})
                </div>
                <div className="text-[10px] text-safety-300 font-mono mt-1">
                  Depth: ~14.5cm | Risk: High
                </div>
              </div>
            )}

            {/* Bottom Viewport HUD Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-white text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Sensitivity</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {['Low', 'Medium', 'High'].map(level => (
                      <button
                        key={level}
                        onClick={() => setSensitivity(level)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sensitivity === level ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">Telemetry Lock</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {simulatedCoords.lat.toFixed(4)}° N, {simulatedCoords.lng.toFixed(4)}° W
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Live Detected Defect Feed Stream (1 Column) */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-safety-500" />
                Live Detected Defect Stream
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {detectedHazards.length} Logged
              </span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {detectedHazards.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Video className="w-8 h-8 mx-auto text-slate-500 animate-pulse" />
                  <p className="text-xs font-semibold">No defects logged yet.</p>
                  <p className="text-[11px] text-slate-500">Click "Start Live Road Scan" to begin live vision capture.</p>
                </div>
              ) : (
                detectedHazards.map((h) => (
                  <div key={h.id} className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-safety-500" />
                        {h.type}
                      </span>
                      <StatusBadge status={h.severity} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>AI Conf: <strong className="text-brand-600 dark:text-brand-400">{h.confidence}</strong></span>
                      <span className="font-mono">{h.time}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-safety-400" /> {h.lat}, {h.lng}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {detectedHazards.length > 0 && (
            <button
              onClick={() => addToast('Batch exported live scanner report log!', 'success')}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Export Live Scan Log
            </button>
          )}
        </Card>

      </div>

    </div>
  );
};

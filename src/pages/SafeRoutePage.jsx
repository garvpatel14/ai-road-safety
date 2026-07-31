import React, { useState } from 'react';
import { LeafletMap } from '../components/maps/LeafletMap';
import { INITIAL_REPORTS } from '../utils/mockData';
import {
  Navigation,
  MapPin,
  ShieldCheck,
  Clock,
  Milestone,
  AlertTriangle,
  Car,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { useNotifications } from '../context/NotificationContext';

export const SafeRoutePage = () => {
  const { addToast } = useNotifications();

  const [origin, setOrigin] = useState('Market St, Financial District');
  const [destination, setDestination] = useState('Mission Bay Boulevard');
  const [selectedPreference, setSelectedPreference] = useState('safest');
  const [calculated, setCalculated] = useState(true);

  // Simulated Polyline route coordinates for Leaflet
  const samplePolyline = [
    [37.788, -122.400],
    [37.780, -122.410],
    [37.770, -122.415],
    [37.760, -122.420]
  ];

  const handleCalculateRoute = (e) => {
    e.preventDefault();
    setCalculated(true);
    addToast('Safe AI Route calculated avoiding 2 high-risk pothole zones!', 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold border border-brand-500/20">
          <Sparkles className="w-4 h-4 text-safety-500" /> AI Navigation Engine
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Safe Route Planner</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Avoid hazardous potholes, active accidents, and severe surface cracks with real-time AI risk scoring.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ROUTE CALCULATOR FORM & STATS */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Navigation className="w-5 h-5 text-brand-500" /> Journey Parameters
            </h3>

            <form onSubmit={handleCalculateRoute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Location (Origin)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    placeholder="Enter start address..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-safety-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    placeholder="Enter destination address..."
                  />
                </div>
              </div>

              {/* Preference Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Routing Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPreference('safest')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedPreference === 'safest'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'glass-panel text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Safest AI Route
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPreference('fastest')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedPreference === 'fastest'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'glass-panel text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Zap className="w-4 h-4" /> Fastest Route
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-safety-500 text-white font-bold text-xs shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                Calculate Safe Path <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </Card>

          {/* CALCULATED ROUTE STATS */}
          {calculated && (
            <Card className="space-y-4 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Recommended Safe Route
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                  96% Safe Score
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Milestone className="w-3.5 h-3.5 text-brand-500" /> Total Distance
                  </span>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">8.4 km</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-safety-500" /> Est. Travel Time
                  </span>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">14 mins</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-safety-500" /> Potholes Avoided:
                  </span>
                  <span className="font-bold text-emerald-600">3 Potholes</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-red-500" /> Accident Sites Avoided:
                  </span>
                  <span className="font-bold text-emerald-600">1 Accident</span>
                </div>
              </div>
            </Card>
          )}

        </div>

        {/* ROUTE MAP CONTAINER */}
        <div className="lg:col-span-2 h-[550px] rounded-3xl overflow-hidden shadow-2xl relative">
          <LeafletMap reports={INITIAL_REPORTS} polyline={samplePolyline} />
          
          <div className="absolute bottom-4 left-4 z-20 glass-panel p-3 rounded-2xl border border-white/20 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">AI Safety Corridor Overlay Active</p>
              <p className="text-[10px] text-slate-500">Blue dashed line highlights safest turn-by-turn trajectory</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

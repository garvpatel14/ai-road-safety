import React from 'react';
import { GpsTelemetryControl } from '../components/common/GpsTelemetryControl';
import { LeafletMap } from '../components/maps/LeafletMap';
import { INITIAL_REPORTS } from '../utils/mockData';
import { MapPin, Navigation, Radio, ShieldCheck, Compass } from 'lucide-react';

export const GpsLocationPage = () => {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-1">
          <Radio className="w-4 h-4 animate-pulse" /> GNSS Spatial Telemetry Module
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">GPS Geolocation & Drive Tracker</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Real-time high precision GPS tracking, geofence hazard proximity alerts, and speed telemetry.
        </p>
      </div>

      {/* GPS TELEMETRY CONTROL PANEL */}
      <GpsTelemetryControl />

      {/* LIVE MAP TRACKER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-500" />
            Live Spatial Map Position
          </h3>
          <span className="text-xs text-slate-500 font-medium">Auto-centering on device location</span>
        </div>

        <LeafletMap reports={INITIAL_REPORTS} />
      </div>

    </div>
  );
};

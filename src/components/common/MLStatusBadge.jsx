import React from 'react';
import { Zap, AlertCircle } from 'lucide-react';

/**
 * MLStatusBadge
 * Shows in the Live Road Scanning HUD.
 * - mlAvailable=true  → "YOLOv8 Active" (green)
 * - mlAvailable=false → "Simulation Mode" (yellow)
 * - mlAvailable=null  → "Connecting..." (grey, pulse)
 */
export const MLStatusBadge = ({ mlAvailable, fps = null }) => {
  if (mlAvailable === null) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-700/80 text-slate-300 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        ML Connecting…
      </span>
    );
  }

  if (mlAvailable) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
        <Zap className="w-3 h-3" />
        YOLOv8 Active{fps !== null ? ` · ${fps} FPS` : ''}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
      <AlertCircle className="w-3 h-3" />
      Simulation Mode
    </span>
  );
};

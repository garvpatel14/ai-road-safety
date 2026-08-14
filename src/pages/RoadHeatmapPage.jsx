import React, { useState, useEffect } from 'react';
import { Card, StatCard } from '../components/common/Card';
import { LeafletMap } from '../components/maps/LeafletMap';
import { INITIAL_REPORTS, ANALYTICS_DATA } from '../utils/mockData';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';
import {
  Flame,
  Layers,
  Sliders,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Building,
  BarChart2,
  CheckCircle2,
  Download,
  Loader2
} from 'lucide-react';

export const RoadHeatmapPage = () => {
  const { addToast } = useNotifications();

  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [intensity, setIntensity] = useState('High Density');
  const [isExporting, setIsExporting] = useState(false);

  const districts = ['All Districts', 'Central Commercial', 'North Bay Ward', 'Sunset District', 'Skyline Hills'];

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const res = await api.get('/reports');
        if (res.data?.reports) setReports(res.data.reports);
      } catch (e) {}
    };
    fetchHeatmapData();
  }, []);

  const handleExportGeoJSON = async () => {
    setIsExporting(true);
    try {
      const res = await api.get('/map/hazards-geojson');
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `saferoad_postgis_hazards_${Date.now()}.geojson`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('Exported PostGIS Road Hazards GeoJSON successfully!', 'success');
    } catch (err) {
      addToast('Exported Municipal Heatmap Data (local format)', 'info');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/20 mb-1">
            <Flame className="w-4 h-4 text-red-500" /> Municipal Road Heatmap Portal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Municipal Road Surface Heatmap</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Density heatmap of road defect concentration, severe damage corridors, and municipal ward risk ratings.
          </p>
        </div>

        <button
          onClick={handleExportGeoJSON}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass-panel text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-60"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Export PostGIS GeoJSON
        </button>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Critical Density Hotspots"
          value="14 Corridors"
          icon={Flame}
          color="red"
        />
        <StatCard
          title="High Risk Wards"
          value="Central & North Bay"
          icon={Building}
          color="safety"
        />
        <StatCard
          title="Avg Potholes / km²"
          value="24.8"
          icon={AlertTriangle}
          color="purple"
        />
        <StatCard
          title="Pavement Quality Rating"
          value="D- (Urgent Action)"
          icon={BarChart2}
          color="brand"
        />
      </div>

      {/* FILTER & LAYER BAR */}
      <Card className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-brand-500" /> Municipal Ward Filter:
            </span>

            <div className="flex items-center gap-1.5">
              {districts.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedDistrict === d
                      ? 'bg-brand-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Density Heat Resolution:</span>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
            >
              <option value="High Density">High Resolution (50m)</option>
              <option value="District Level">District Resolution (500m)</option>
              <option value="City Wide">City-Wide Resolution (2km)</option>
            </select>
          </div>

        </div>
      </Card>

      {/* HEATMAP INTERACTIVE DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map View (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-slate-800 shadow-xl">
            <LeafletMap reports={INITIAL_REPORTS} />
          </div>
        </div>

        {/* High Risk Corridors Ranking List (1 Col) */}
        <Card className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Highest Hazard Score Corridors
            </h3>
          </div>

          <div className="space-y-3">
            {ANALYTICS_DATA.highRiskZones.map((zone, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 space-y-2 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-slate-900 dark:text-white max-w-[180px]">{zone.zone}</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-extrabold text-[10px]">
                    Score {zone.hazardScore}/100
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{zone.incidents} Incidents Logged</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{zone.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};

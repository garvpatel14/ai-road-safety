import React, { useState } from 'react';
import { LeafletMap } from '../components/maps/LeafletMap';
import { INITIAL_REPORTS, MOCK_RQI_SEGMENTS } from '../utils/mockData';
import { RoadHazardDetailsModal } from '../components/common/RoadHazardDetailsModal';
import {
  Filter,
  MapPin,
  AlertTriangle,
  Layers,
  RefreshCw,
  Search,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../components/common/Card';

export const InteractiveMapPage = () => {
  const [reports] = useState(INITIAL_REPORTS);
  const [typeFilter, setTypeFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRqiLayer, setShowRqiLayer] = useState(true);
  const [selectedHazard, setSelectedHazard] = useState(null);

  // Filter Reports Logic
  const filteredReports = reports.filter((r) => {
    const matchesType = typeFilter === 'All' || r.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesSeverity = severityFilter === 'All' || r.severity.toLowerCase() === severityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      r.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSeverity && matchesStatus && matchesSearch;
  });

  const resetFilters = () => {
    setTypeFilter('All');
    setSeverityFilter('All');
    setStatusFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold border border-brand-500/20 mb-1">
            <Layers className="w-4 h-4" /> Road Quality Index (RQI) Spatial Map
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Road Quality & Hazard Interactive Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time geospatial road condition mapping with RQI surface smoothness heatmap layers.
          </p>
        </div>

        {/* Marker Legend & RQI Toggle */}
        <div className="flex flex-wrap items-center gap-3 glass-panel p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setShowRqiLayer(!showRqiLayer)}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition ${
              showRqiLayer ? 'bg-brand-600 text-white shadow' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {showRqiLayer ? 'RQI Layer ACTIVE' : 'Enable RQI Layer'}
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Legend:</span>
          <span className="flex items-center gap-1 font-semibold text-safety-600 dark:text-safety-400">
            <span className="w-2.5 h-2.5 rounded-full bg-safety-500" /> Potholes
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Cracks
          </span>
          <span className="flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Accidents
          </span>
          <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Repairs
          </span>
        </div>
      </div>

      {/* FILTER CONTROL BAR */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          
          {/* Search Location */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search street, area, or report ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Types</option>
              <option value="Pothole">Potholes</option>
              <option value="Crack">Surface Cracks</option>
              <option value="Accident">Accidents</option>
              <option value="Repair">Repairs</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter & Reset */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Resolved">Resolved</option>
            </select>

            <button
              onClick={resetFilters}
              title="Reset Filters"
              className="p-2 rounded-xl glass-panel hover:bg-slate-200 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800">
          <span>Displaying <strong>{filteredReports.length}</strong> active map pin(s)</span>
          <span className="font-medium text-brand-600 dark:text-brand-400">Click markers to view depth specs & full hazard details</span>
        </div>
      </Card>

      {/* ROAD QUALITY INDEX (RQI) SEGMENTS BANNER */}
      {showRqiLayer && (
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold">Live Surface Smoothness RQI Corridors:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {MOCK_RQI_SEGMENTS.map(rqi => (
              <div key={rqi.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700">
                <span className="font-semibold text-slate-300">{rqi.name}:</span>
                <span className={`font-extrabold ${rqi.status === 'Good' ? 'text-emerald-400' : rqi.status === 'Fair' ? 'text-amber-400' : 'text-red-400'}`}>
                  RQI {rqi.rqiScore}/100 ({rqi.status})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAP CONTAINER */}
      <div className="h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
        <LeafletMap reports={filteredReports} />
      </div>

      {/* HAZARD DETAILS MODAL */}
      <RoadHazardDetailsModal
        isOpen={Boolean(selectedHazard)}
        onClose={() => setSelectedHazard(null)}
        hazard={selectedHazard}
      />

    </div>
  );
};

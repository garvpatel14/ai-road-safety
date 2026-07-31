import React, { useState } from 'react';
import { LeafletMap } from '../components/maps/LeafletMap';
import { INITIAL_REPORTS } from '../utils/mockData';
import {
  Filter,
  MapPin,
  AlertTriangle,
  Car,
  CheckCircle2,
  RefreshCw,
  Search
} from 'lucide-react';
import { Card } from '../components/common/Card';

export const InteractiveMapPage = () => {
  const [reports] = useState(INITIAL_REPORTS);
  const [typeFilter, setTypeFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interactive Hazard & Repair Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time geospatial OpenStreetMap mapping with color-coded severity markers.
          </p>
        </div>

        {/* Marker Legend */}
        <div className="flex flex-wrap items-center gap-3 glass-panel p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
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
          <span className="font-medium text-brand-600 dark:text-brand-400">Click markers for details & photo evidence</span>
        </div>
      </Card>

      {/* MAP CONTAINER */}
      <div className="h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
        <LeafletMap reports={filteredReports} />
      </div>

    </div>
  );
};

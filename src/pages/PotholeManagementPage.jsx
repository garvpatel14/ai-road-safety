import React, { useState, useEffect } from 'react';
import { Card, StatCard } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { RoadHazardDetailsModal } from '../components/common/RoadHazardDetailsModal';
import { INITIAL_REPORTS } from '../utils/mockData';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';
import {
  FileText,
  Search,
  Filter,
  CheckSquare,
  Wrench,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle,
  Eye,
  Trash2,
  SlidersHorizontal,
  Loader2,
  RefreshCw
} from 'lucide-react';

export const PotholeManagementPage = () => {
  const { addToast } = useNotifications();

  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports');
      if (res.data?.reports) {
        setReports(res.data.reports);
      }
    } catch (err) {
      console.warn('Fallback reports:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter logic
  const filteredReports = reports.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(searchQuery.toLowerCase()) || (r.locationName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || r.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredReports.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) return;
    setReports(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: newStatus } : r));
    addToast(`Updated status to '${newStatus}' for ${selectedIds.length} selected items.`, 'success');
    
    // Send to backend
    for (const id of selectedIds) {
      try {
        await api.put(`/reports/${id}/status`, { status: newStatus });
      } catch (e) {}
    }
    setSelectedIds([]);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold border border-brand-500/20 mb-1">
            <FileText className="w-4 h-4" /> Municipal Pothole & Defect Backlog Portal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Pothole Management Hub</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Administrative queue to prioritize, bulk triage, and assign reported road surface defects.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedIds.length} Selected</span>
            <button
              onClick={() => handleBulkStatusChange('Scheduled')}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
            >
              Bulk Approve & Schedule Repair
            </button>
          </div>
        )}
      </div>

      {/* FILTER AND SEARCH BAR */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or Location..."
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Filter className="w-3.5 h-3.5" /> Status:
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl glass-input text-xs font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Severity:
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl glass-input text-xs font-semibold"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

        </div>
      </Card>

      {/* TABLE DATA */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === filteredReports.length && filteredReports.length > 0}
                    className="rounded border-slate-300"
                  />
                </th>
                <th className="p-4">Report ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Location</th>
                <th className="p-4">Severity Matrix</th>
                <th className="p-4">Priority Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(r.id)}
                      onChange={() => handleSelectOne(r.id)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{r.id}</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{r.type}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{r.locationName}</td>
                  <td className="p-4"><StatusBadge status={r.severity} /></td>
                  <td className="p-4 font-bold text-brand-600 dark:text-brand-400">{r.priorityScore || 85} / 100</td>
                  <td className="p-4"><StatusBadge status={r.status} /></td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedReport(r)}
                      className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 hover:bg-brand-500/20 transition"
                      title="Inspect Hazard Specs"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* HAZARD INSPECTION MODAL */}
      <RoadHazardDetailsModal
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        hazard={selectedReport}
      />

    </div>
  );
};

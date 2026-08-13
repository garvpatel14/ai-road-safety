import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatCard, Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { MonthlyTrendChart, DamageDistributionChart } from '../components/charts/DashboardCharts';
import { DASHBOARD_STATS, INITIAL_REPORTS, ANALYTICS_DATA } from '../utils/mockData';
import {
  ShieldAlert,
  AlertTriangle,

  CheckCircle,
  AlertOctagon,
  Users,
  Calendar,
  PlusCircle,
  MapPin,
  Navigation,
  ExternalLink,
  Filter,
  Eye
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const DashboardPage = () => {
  const [reports] = useState(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Safety Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time geospatial hazard metrics and municipal repair telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/report-damage"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-safety-600 to-brand-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition"
          >
            <PlusCircle className="w-4 h-4" /> Report Damage
          </Link>
          <Link
            to="/safe-route"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Navigation className="w-4 h-4 text-brand-500" /> Safe Route
          </Link>
        </div>
      </div>

      {/* 6 DISPLAY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Road Damage"
          value={DASHBOARD_STATS.totalRoadDamage}
          icon={AlertTriangle}
          color="safety"
          trend="+12%"
          trendLabel="mo"
        />

        <StatCard
          title="Roads Repaired"
          value={DASHBOARD_STATS.roadsRepaired}
          icon={CheckCircle}
          color="emerald"
          trend="+28%"
          trendLabel="mo"
        />
        <StatCard
          title="Dangerous Roads"
          value={DASHBOARD_STATS.dangerousRoads}
          icon={AlertOctagon}
          color="red"
          trend="+3"
          trendLabel="new"
        />
        <StatCard
          title="Active Users"
          value={DASHBOARD_STATS.activeUsers}
          icon={Users}
          color="brand"
          trend="+1.2k"
          trendLabel="wk"
        />
        <StatCard
          title="Today's Reports"
          value={DASHBOARD_STATS.todaysReports}
          icon={Calendar}
          color="purple"
          trend="+8"
          trendLabel="today"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Monthly Incident & Damage Trend</h3>
              <p className="text-xs text-slate-500">Compare road damage reports vs accident frequency.</p>
            </div>
            <Link to="/analytics" className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1">
              Full Analytics <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <MonthlyTrendChart data={ANALYTICS_DATA.monthlyReports} />
        </Card>

        <Card className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Damage Type Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution of reported road defects.</p>
          </div>
          <DamageDistributionChart data={ANALYTICS_DATA.damageTypeDistribution} />
        </Card>
      </div>

      {/* QUICK ACTIONS & RECENT REPORTS TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Quick Actions Panel */}
        <Card className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider text-slate-500">
            Quick Actions
          </h3>
          <div className="space-y-2.5">
            <Link
              to="/report-damage"
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-brand-500/10 transition group text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <div className="p-2 rounded-lg bg-safety-500/20 text-safety-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="group-hover:text-brand-600 transition">Report Pothole / Defect</p>
                <p className="text-[10px] text-slate-400 font-normal">AI vision auto-detection</p>
              </div>
            </Link>


            <Link
              to="/map"
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-brand-500/10 transition group text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <div className="p-2 rounded-lg bg-brand-500/20 text-brand-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="group-hover:text-brand-600 transition">Explore Live Hazard Map</p>
                <p className="text-[10px] text-slate-400 font-normal">View color-coded markers</p>
              </div>
            </Link>
          </div>
        </Card>

        {/* Recent Reports Table */}
        <Card className="lg:col-span-3 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Incident & Damage Feeds</h3>
              <p className="text-xs text-slate-500">Live community submissions and AI verified reports.</p>
            </div>
            <Link to="/my-reports" className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Issue ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{r.id}</td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{r.type}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{r.locationName}</td>
                    <td className="p-3"><StatusBadge status={r.severity} /></td>
                    <td className="p-3"><StatusBadge status={r.status} /></td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedReport(r)}
                        className="p-1.5 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 transition"
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

      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={`Report Details - ${selectedReport?.id}`}
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100">
              <img src={selectedReport.image} alt={selectedReport.type} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Category</span>
                <span className="font-bold text-slate-800 dark:text-white">{selectedReport.type}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status</span>
                <StatusBadge status={selectedReport.status} />
              </div>
              <div>
                <span className="text-slate-400 block">Location</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedReport.locationName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">AI Confidence</span>
                <span className="font-bold text-emerald-600">{selectedReport.aiConfidence}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-xs mb-1">Description</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                {selectedReport.description}
              </p>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

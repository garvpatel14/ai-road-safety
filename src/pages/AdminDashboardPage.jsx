import React, { useState } from 'react';
import { StatCard, Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { INITIAL_REPORTS, MOCK_USERS, DASHBOARD_STATS } from '../utils/mockData';
import { useNotifications } from '../context/NotificationContext';
import {
  ShieldCheck,
  Users,
  FileText,
  Wrench,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Settings,
  Sliders,
  Download,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const AdminDashboardPage = () => {
  const { addToast } = useNotifications();

  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Approve Report
  const handleApproveReport = (id) => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Scheduled' } : r))
    );
    addToast(`Report ${id} Approved and scheduled for repair dispatch!`, 'success');
  };

  // Handle Reject Report
  const handleRejectReport = (id) => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    addToast(`Report ${id} rejected.`, 'warning');
  };

  // Handle Repair Status Update
  const handleUpdateStatus = (id, newStatus) => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
    addToast(`Report ${id} status updated to ${newStatus}`, 'info');
  };

  // Handle User Role Toggle
  const handleToggleUserRole = (userId) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, role: u.role.includes('Admin') ? 'Civilian Inspector' : 'Admin Supervisor' }
          : u
      )
    );
    addToast('User role updated.', 'info');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 mb-1">
            <ShieldCheck className="w-4 h-4" /> Admin Supervisor Portal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Operations Hub</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Moderate community submissions, issue work orders, and assign repair crews.
          </p>
        </div>

        <button
          onClick={() => addToast('Exporting system audit logs as CSV...', 'info')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Download className="w-4 h-4" /> Export Report CSV
        </button>
      </div>

      {/* 4 ADMIN STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Users"
          value={users.length}
          icon={Users}
          color="brand"
        />
        <StatCard
          title="Total Hazard Reports"
          value={reports.length}
          icon={FileText}
          color="safety"
        />
        <StatCard
          title="Pending Repairs"
          value={reports.filter(r => r.status === 'Pending' || r.status === 'In Progress').length}
          icon={Wrench}
          color="purple"
        />
        <StatCard
          title="Dangerous Road Corridors"
          value={47}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex border-b border-slate-200/60 dark:border-slate-800 space-x-4 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'overview', name: 'Dashboard Overview', icon: ShieldCheck },
          { id: 'reports', name: 'Manage Road Reports', icon: FileText },
          { id: 'users', name: 'User Access Control', icon: Users },
          { id: 'repairs', name: 'Repairs Dispatch', icon: Wrench },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-brand-500/5'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.name}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: ROAD REPORTS MANAGEMENT */}
      {(activeTab === 'overview' || activeTab === 'reports') && (
        <Card className="space-y-4 p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Submitted Road & Incident Reports
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reports..."
                className="pl-9 pr-3 py-1.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Report ID</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Approve / Reject</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports
                  .filter(r => r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.locationName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{r.id}</td>
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{r.type}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{r.locationName}</td>
                      <td className="p-4"><StatusBadge status={r.severity} /></td>
                      <td className="p-4"><StatusBadge status={r.status} /></td>

                      {/* Approve / Reject Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApproveReport(r.id)}
                            title="Approve Report"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectReport(r.id)}
                            title="Reject Report"
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      {/* Update Repair Status Dropdown */}
                      <td className="p-4 text-right">
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                          className="px-2.5 py-1 rounded-xl glass-input text-xs font-semibold focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB CONTENT 2: USER ACCESS CONTROL */}
      {(activeTab === 'users') && (
        <Card className="space-y-4 p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-200/60 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Registered Platform Users & Inspectors
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reports Logged</th>
                  <th className="p-4 text-right">Toggle Admin Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="p-4 font-semibold text-brand-600 dark:text-brand-400">{u.role}</td>
                    <td className="p-4"><StatusBadge status={u.status} /></td>
                    <td className="p-4 font-bold text-center">{u.reportsSubmitted}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleUserRole(u.id)}
                        className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold hover:bg-brand-600 hover:text-white transition"
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB CONTENT 3: REPAIRS DISPATCH */}
      {(activeTab === 'repairs') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Scheduled', 'In Progress', 'Resolved'].map((statusGroup) => (
            <Card key={statusGroup} className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center justify-between">
                <span>{statusGroup} Work Orders</span>
                <StatusBadge status={statusGroup} />
              </h3>

              <div className="space-y-3">
                {reports
                  .filter(r => r.status === statusGroup)
                  .map(item => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 space-y-2 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{item.id} - {item.type}</span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{item.locationName}</p>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleUpdateStatus(item.id, statusGroup === 'Scheduled' ? 'In Progress' : 'Resolved')}
                          className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline"
                        >
                          Promote to next stage →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};

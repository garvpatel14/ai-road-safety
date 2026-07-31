import React, { useState } from 'react';
import { INITIAL_REPORTS } from '../utils/mockData';
import { StatusBadge } from '../components/common/StatusBadge';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { FileText, Eye, MapPin, Calendar, ThumbsUp, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyReportsPage = () => {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Submitted Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track status progression and community upvotes for your road hazard submissions.
          </p>
        </div>

        <Link
          to="/report-damage"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-safety-600 to-brand-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition"
        >
          <PlusCircle className="w-4 h-4" /> Submit New Report
        </Link>
      </div>

      {/* REPORTS TABLE CARD */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Evidence Image</th>
                <th className="p-4">Issue ID & Type</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Logged</th>
                <th className="p-4 text-center">Community Upvotes</th>
                <th className="p-4 text-right">View Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  
                  {/* Thumbnail */}
                  <td className="p-4">
                    <div className="w-14 h-12 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 dark:border-slate-700">
                      <img src={r.image} alt={r.type} className="w-full h-full object-cover" />
                    </div>
                  </td>

                  {/* ID & Type */}
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{r.id}</p>
                    <span className="text-slate-500 font-semibold">{r.type}</span>
                  </td>

                  {/* Location */}
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-medium max-w-xs truncate">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                      <span className="truncate">{r.locationName}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <StatusBadge status={r.status} />
                  </td>

                  {/* Date */}
                  <td className="p-4 text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{r.date} ({r.time})</span>
                    </div>
                  </td>

                  {/* Upvotes */}
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold">
                      <ThumbsUp className="w-3 h-3" /> {r.upvotes}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedReport(r)}
                      className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-500 transition flex items-center gap-1.5 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DETAIL MODAL */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={`Report Investigation - ${selectedReport?.id}`}
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-700">
              <img src={selectedReport.image} alt={selectedReport.type} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <StatusBadge status={selectedReport.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Hazard Type</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedReport.type}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">AI Vision Confidence</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedReport.aiConfidence}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Reported By</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReport.reportedBy}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Logged Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReport.date}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-xs mb-1 font-semibold">Location & Context</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl">
                {selectedReport.locationName} - {selectedReport.description}
              </p>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

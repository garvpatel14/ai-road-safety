import React, { useState, useEffect } from 'react';
import { Card, StatCard } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { MOCK_VERIFICATION_QUEUE } from '../utils/mockData';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Eye,
  FileCheck,
  Cpu,
  Ruler,
  AlertTriangle,
  Send,
  UserCheck,
  Loader2
} from 'lucide-react';

export const RoadVerificationPage = () => {
  const { addToast } = useNotifications();

  const [queue, setQueue] = useState(MOCK_VERIFICATION_QUEUE);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [officerNote, setOfficerNote] = useState('');

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/verification-queue');
      if (res.data?.queue && res.data.queue.length > 0) {
        setQueue(res.data.queue);
        setSelectedItem(res.data.queue[0]);
      } else {
        setSelectedItem(queue[0]);
      }
    } catch (err) {
      console.warn('Fallback verification queue:', err.message);
      setSelectedItem(queue[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (id) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(queue.find(item => item.id !== id) || null);
    }

    try {
      await api.put(`/admin/verification-queue/${id}`, {
        action: 'approve',
        inspectionNotes: officerNote || 'Civil engineer verified.'
      });
      addToast(`Verified & Approved item ${id}! Escalated to Work Order Dispatch.`, 'success');
    } catch (err) {
      addToast(`Verified & Approved item ${id}! (local state)`, 'success');
    }
  };

  const handleReject = async (id) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(queue.find(item => item.id !== id) || null);
    }

    try {
      await api.put(`/admin/verification-queue/${id}`, {
        action: 'reject',
        inspectionNotes: officerNote || 'Rejected as false positive.'
      });
      addToast(`Item ${id} dismissed as False Positive / Low Priority.`, 'warning');
    } catch (err) {
      addToast(`Item ${id} dismissed.`, 'warning');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-1">
            <UserCheck className="w-4 h-4" /> Municipal Officer Verification Desk
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Road Defect AI Verification Desk</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Audit AI-detected road issues, confirm depth & area measurements, and authorize work orders.
          </p>
        </div>
      </div>

      {/* VERIFICATION DESK LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Col: Pending Verification Queue List */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-brand-500" /> Audit Queue
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600">
              {queue.length} Pending
            </span>
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {queue.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                <p className="text-xs font-bold">Verification queue clear!</p>
                <p className="text-[11px] text-slate-500">All AI detections have been reviewed.</p>
              </div>
            ) : (
              queue.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition border ${
                    selectedItem?.id === item.id
                      ? 'bg-brand-500/10 border-brand-600 shadow-md'
                      : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">{item.id} - {item.type}</span>
                    <StatusBadge status={item.aiFlaggedSeverity} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{item.location}</p>
                  <div className="flex justify-between items-center pt-2 text-[11px]">
                    <span className="text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> {(item.aiConfidence * 100).toFixed(0)}% Conf
                    </span>
                    <span className="text-slate-400">Inspect →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Right 2 Cols: Detailed Officer Verification Studio */}
        {selectedItem ? (
          <Card className="lg:col-span-2 space-y-6">
            
            {/* Header / Title */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Reviewing Audit Case</span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedItem.id}: {selectedItem.type}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReject(selectedItem.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 font-bold text-xs transition"
                >
                  <XCircle className="w-4 h-4" /> Reject False Positive
                </button>
                <button
                  onClick={() => handleApprove(selectedItem.id)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Dispatch Repair
                </button>
              </div>
            </div>

            {/* Side-by-side Evidence Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Media Evidence</span>
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 h-52">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.type}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">AI Neural Net Verification</span>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">AI Confidence:</span>
                    <span className="font-extrabold text-brand-600 dark:text-brand-400">{(selectedItem.aiConfidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Est. Depth:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{selectedItem.estimatedDepth}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Est. Area:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{selectedItem.estimatedArea}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
                  "{selectedItem.inspectionNotes}"
                </p>
              </div>
            </div>

            {/* Officer Audit Notes Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Civil Engineer Official Verification Signature & Notes
              </label>
              <textarea
                rows={3}
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                placeholder="Enter official inspection confirmation notes or repair instructions..."
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

          </Card>
        ) : (
          <Card className="lg:col-span-2 flex items-center justify-center min-h-[400px]">
            <p className="text-xs font-semibold text-slate-400">Select an item from the Audit Queue to inspect.</p>
          </Card>
        )}

      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, StatCard } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { MOCK_WORK_ORDERS } from '../utils/mockData';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';
import {
  Wrench,
  PlusCircle,
  Truck,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  Building,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const RepairManagementPage = () => {
  const { addToast } = useNotifications();

  const [workOrders, setWorkOrders] = useState(MOCK_WORK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    title: '',
    crewAssigned: 'Alpha Crew #4 (Cold Mix Team)',
    contractor: 'Apex Infrastructure Ltd.',
    estimatedCost: '$4,500',
    completionTarget: '2026-08-20'
  });

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/work-orders');
      if (res.data?.workOrders && res.data.workOrders.length > 0) {
        setWorkOrders(res.data.workOrders);
      }
    } catch (err) {
      console.warn('Fallback work orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.title.trim()) return;

    try {
      const res = await api.post('/admin/work-orders', {
        title: newOrder.title,
        crewAssigned: newOrder.crewAssigned,
        contractor: newOrder.contractor,
        estimatedCost: newOrder.estimatedCost,
        startDate: new Date().toISOString().split('T')[0],
        completionTarget: newOrder.completionTarget,
        beforeImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      });

      if (res.data?.workOrder) {
        setWorkOrders([res.data.workOrder, ...workOrders]);
      }
      setShowCreateModal(false);
      addToast(`Work Order created and dispatched!`, 'success');
    } catch (err) {
      const created = {
        id: `WO-${Math.floor(8800 + Math.random() * 900)}`,
        reportId: 'REP-1001',
        title: newOrder.title,
        crewAssigned: newOrder.crewAssigned,
        contractor: newOrder.contractor,
        estimatedCost: newOrder.estimatedCost,
        status: 'Scheduled',
        startDate: new Date().toISOString().split('T')[0],
        completionTarget: newOrder.completionTarget,
        progressPct: 0,
        beforeImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        afterImage: null
      };
      setWorkOrders([created, ...workOrders]);
      setShowCreateModal(false);
      addToast(`Work Order ${created.id} created and dispatched!`, 'success');
    }
  };

  const handlePromoteStage = async (id) => {
    const current = workOrders.find(w => w.id === id);
    if (!current) return;
    const nextStatus = current.status === 'Scheduled' ? 'In Progress' : 'Completed';
    const nextProgress = nextStatus === 'In Progress' ? 65 : 100;

    setWorkOrders(prev =>
      prev.map(wo => {
        if (wo.id === id) {
          return { ...wo, status: nextStatus, progressPct: nextProgress };
        }
        return wo;
      })
    );

    try {
      await api.put(`/admin/work-orders/${id}`, {
        status: nextStatus,
        progressPct: nextProgress
      });
      addToast(`Work Order ${id} advanced to ${nextStatus}.`, 'info');
    } catch (err) {
      addToast('Work Order stage updated locally.', 'info');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 mb-1">
            <Wrench className="w-4 h-4" /> Municipal Dispatch & Work Order System
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Repair Management & Dispatch</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Dispatch maintenance crews, manage contractors, calculate asphalt costs, and track repair proof.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-brand-600 hover:from-amber-500 hover:to-brand-500 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 transition"
        >
          <PlusCircle className="w-4 h-4" /> Issue New Work Order
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Work Orders"
          value={workOrders.filter(w => w.status !== 'Completed').length}
          icon={Wrench}
          color="brand"
        />
        <StatCard
          title="Crews Dispatched"
          value="6 Teams"
          icon={Truck}
          color="safety"
        />
        <StatCard
          title="Est. Budget Allocated"
          value="$24,500"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Completed Repairs"
          value={workOrders.filter(w => w.status === 'Completed').length}
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* WORK ORDER LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Scheduled', 'In Progress', 'Completed'].map((statusGroup) => (
          <Card key={statusGroup} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                {statusGroup}
              </h3>
              <StatusBadge status={statusGroup} />
            </div>

            <div className="space-y-4">
              {workOrders
                .filter(w => w.status === statusGroup)
                .map((wo) => (
                  <div key={wo.id} className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">{wo.id}</span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">{wo.estimatedCost}</span>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">{wo.title}</h4>

                    <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-brand-500" /> Crew: <span className="font-semibold text-slate-800 dark:text-slate-200">{wo.crewAssigned}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-purple-500" /> Contractor: <span className="font-semibold text-slate-800 dark:text-slate-200">{wo.contractor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-safety-500" /> Target: <span className="font-semibold">{wo.completionTarget}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Completion</span>
                        <span>{wo.progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${wo.progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    {statusGroup !== 'Completed' && (
                      <button
                        onClick={() => handlePromoteStage(wo.id)}
                        className="w-full py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-brand-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold transition"
                      >
                        Advance Stage →
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE WORK ORDER MODAL */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Issue New Work Order">
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Work Order Title</label>
            <input
              type="text"
              required
              value={newOrder.title}
              onChange={(e) => setNewOrder({ ...newOrder, title: e.target.value })}
              placeholder="e.g. Market St Pothole Cold Mix Patching"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assign Crew</label>
              <select
                value={newOrder.crewAssigned}
                onChange={(e) => setNewOrder({ ...newOrder, crewAssigned: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-semibold"
              >
                <option value="Alpha Crew #4 (Cold Mix Team)">Alpha Crew #4</option>
                <option value="Highway Rapid Ops Unit">Highway Rapid Ops</option>
                <option value="Heavy Machinery Paving Team B">Heavy Machinery Team</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contractor</label>
              <input
                type="text"
                value={newOrder.contractor}
                onChange={(e) => setNewOrder({ ...newOrder, contractor: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Estimated Cost</label>
              <input
                type="text"
                value={newOrder.estimatedCost}
                onChange={(e) => setNewOrder({ ...newOrder, estimatedCost: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
              <input
                type="date"
                value={newOrder.completionTarget}
                onChange={(e) => setNewOrder({ ...newOrder, completionTarget: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-500 transition"
            >
              Dispatch Work Order
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

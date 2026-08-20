import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { MonthlyTrendChart, DamageDistributionChart, RepairProgressBarChart } from '../components/charts/DashboardCharts';
import { ANALYTICS_DATA } from '../utils/mockData';
import { BarChart3, AlertOctagon, TrendingUp, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import api from '../services/api';

export const AnalyticsPage = () => {
  const [highRiskZones, setHighRiskZones] = useState(ANALYTICS_DATA.highRiskZones);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/analytics/stats');
        if (res.data?.highRiskZones && res.data.highRiskZones.length > 0) {
          setHighRiskZones(res.data.highRiskZones);
        }
      } catch (err) {
        console.warn('Analytics fallback:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold border border-brand-500/20">
          <BarChart3 className="w-4 h-4" /> Predictive Analytics Engine
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Road Safety Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          In-depth data insights, hazard concentration clusters, and municipal repair velocity metrics.
        </p>
      </div>

      {/* CHARTS GRID ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Reports by Month & Accident Trend */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Monthly Incident & Damage Trend</h3>
              <p className="text-xs text-slate-500">Damage reports vs accident occurrences (6 Month window)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-brand-500" />
          </div>
          <MonthlyTrendChart data={ANALYTICS_DATA.monthlyReports} />
        </Card>

        {/* 2. Damage Type Distribution */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Damage Type Distribution</h3>
              <p className="text-xs text-slate-500">Categorical breakdown of reported defects</p>
            </div>
            <ShieldAlert className="w-5 h-5 text-safety-500" />
          </div>
          <DamageDistributionChart data={ANALYTICS_DATA.damageTypeDistribution} />
        </Card>

      </div>

      {/* CHARTS GRID ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. Repair Progress Bar Chart */}
        <Card className="lg:col-span-1 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Municipal Repair Velocity</h3>
            <p className="text-xs text-slate-500">Completed work orders per month</p>
          </div>
          <RepairProgressBarChart data={ANALYTICS_DATA.repairProgress} />
        </Card>

        {/* 4. Most Dangerous Areas Leaderboard */}
        <Card className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-500" /> High-Risk Zone Leaderboard
            </h3>
            <p className="text-xs text-slate-500">Corridors ranked by hazard density score and collision frequency.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Zone / Road Segment</th>
                  <th className="p-3">Hazard Score</th>
                  <th className="p-3">Total Incidents</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {highRiskZones.map((zone, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{zone.zone}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              zone.hazardScore > 80 ? 'bg-red-500' : zone.hazardScore > 70 ? 'bg-safety-500' : 'bg-brand-500'
                            }`}
                            style={{ width: `${zone.hazardScore}%` }}
                          />
                        </div>
                        <span className="font-bold">{zone.hazardScore}/100</span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{zone.incidents}</td>
                    <td className="p-3"><StatusBadge status={zone.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>

    </div>
  );
};

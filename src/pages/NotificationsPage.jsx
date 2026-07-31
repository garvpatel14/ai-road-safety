import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Car,
  ShieldAlert,
  Trash2,
  CheckCheck
} from 'lucide-react';

export const NotificationsPage = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    unreadCount
  } = useNotifications();

  const getNotifIcon = (type) => {
    switch (type) {
      case 'repair':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'accident':
        return <Car className="w-5 h-5 text-red-500" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-brand-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Safety Notifications & Feeds
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time automated alerts for completed repairs and high-risk traffic zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs font-bold text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <CheckCheck className="w-4 h-4" /> Mark All Read
            </button>
          )}
          <button
            onClick={clearNotifications}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS FEED */}
      <Card className="p-0 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Bell className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">All caught up!</p>
            <p className="text-xs text-slate-400">No active notifications or alerts in your feed.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 sm:p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition ${
                !n.read ? 'bg-brand-500/5 dark:bg-brand-500/10 border-l-4 border-l-brand-500' : ''
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                {getNotifIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </Card>

    </div>
  );
};

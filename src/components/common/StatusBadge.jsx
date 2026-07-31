import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeStyle = (val) => {
    switch (val?.toLowerCase()) {
      case 'resolved':
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'in progress':
      case 'scheduled':
      case 'under review':
        return 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20';
      case 'pending':
      case 'pending verification':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'critical':
      case 'rejected':
      case 'high':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'medium':
        return 'bg-safety-500/10 text-safety-600 dark:text-safety-400 border-safety-500/20';
      case 'low':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
};

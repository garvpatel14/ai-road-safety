import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`glass-card rounded-2xl p-6 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color = 'brand' }) => {
  const colorStyles = {
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
    safety: 'bg-safety-500/10 text-safety-600 dark:text-safety-400 border-safety-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorStyles[color] || colorStyles.brand}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trend.startsWith('+')
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}
          >
            {trend} {trendLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
};

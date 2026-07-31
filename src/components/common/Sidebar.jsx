import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  AlertTriangle,
  Car,
  MapPin,
  Navigation,
  BarChart3,
  FileText,
  Bell,
  User,
  ShieldCheck,
  PlusCircle,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Interactive Map', path: '/map', icon: MapPin },
    { name: 'Safe Route Planner', path: '/safe-route', icon: Navigation, badge: 'AI' },
    { name: 'Report Damage', path: '/report-damage', icon: AlertTriangle },
    { name: 'Report Accident', path: '/report-accident', icon: Car },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'My Reports', path: '/my-reports', icon: FileText },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (user?.role === 'admin') {
    mainNavItems.push({
      name: 'Admin Control Hub',
      path: '/admin',
      icon: ShieldCheck,
      badge: 'Admin'
    });
  }

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 glass-panel border-r border-slate-200/60 dark:border-slate-800/80 p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto flex flex-col justify-between`}
      >
        <div className="space-y-6">
          
          {/* Quick Action Button */}
          <div className="pt-2">
            <NavLink
              to="/report-damage"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-safety-600 to-brand-600 hover:from-safety-500 hover:to-brand-500 text-white font-semibold text-sm shadow-md shadow-safety-500/20 hover:shadow-lg transition group"
            >
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition transform duration-300" />
              <span>Report Road Issue</span>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Platform Navigation
            </p>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.badge === 'Admin'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-safety-500/20 text-safety-600 dark:text-safety-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom AI Status Box */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Model Active</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Vision v4.2
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

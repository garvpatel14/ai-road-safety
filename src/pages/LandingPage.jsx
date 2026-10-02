import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Sparkles,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Camera,
  Cpu,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-500/20 via-safety-500/20 to-purple-500/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-brand-500/30 text-xs font-semibold text-brand-600 dark:text-brand-400 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-safety-500 animate-spin-slow" />
              <span>Next-Gen Autonomous Road Safety Intelligence Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
            >
              Transforming Road Hazard Reports with <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-brand-500 to-safety-500">Real-Time AI Vision</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
            >
              Detect potholes, surface cracks, and hazardous road damage automatically. Navigate safer routes using live predictive risk scoring and community-driven safety intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center items-center gap-4 pt-4"
            >
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-safety-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 hover:opacity-95 hover:scale-105 transition transform duration-200"
              >
                Plan Safe Route <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass-panel text-slate-800 dark:text-white font-bold text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <MapPin className="w-4 h-4 text-safety-500" /> Live Hazard Map
              </Link>
            </motion.div>

          </div>

          {/* Hero Image Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-14 relative rounded-3xl glass-panel p-3 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="relative rounded-2xl overflow-hidden h-[380px] sm:h-[480px]">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80"
                alt="AI Road Detection Dashboard Showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-safety-400">
                      Live AI Scanner Active
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold">Automated Road Hazard Identification</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      98.4% Detection Accuracy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. PLATFORM STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Road Reports Logged', value: '14,280+', icon: ShieldAlert, color: 'text-brand-500' },
            { label: 'Potholes Repaired', value: '9,840+', icon: CheckCircle, color: 'text-emerald-500' },
            { label: 'High-Risk Zones Flagged', value: '312', icon: AlertTriangle, color: 'text-safety-500' },
            { label: 'Active Community Users', value: '45,000+', icon: Users, color: 'text-purple-500' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glass-card rounded-2xl p-6 text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-1">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. KEY FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Built for Smarter & Safer Smart Cities
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Our multi-layer AI platform connects drivers, municipal crews, and traffic safety administrators in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'AI Damage Classification',
              desc: 'Instantly categorizes uploaded photos into Potholes, Cracks, Slope Erosions, or Debris with confidence scores.',
              icon: Camera,
            },
            {
              title: 'Dynamic Safe Routing',
              desc: 'Calculates the safest turn-by-turn route based on live accident feeds and active road repair zones.',
              icon: MapPin,
            },
            {
              title: 'Municipal Work Orders',
              desc: 'Empowers city engineers to verify, approve, and track repair status from dispatch to completion.',
              icon: Cpu,
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="glass-card rounded-3xl p-8 space-y-4 hover:shadow-2xl transition duration-300 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-safety-500 text-white flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            How SafeRoad AI Operates
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            4 simple steps from image capture to permanent road repair.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Capture & Upload', desc: 'Snap a photo of any road pothole, damage, or accident site.' },
            { step: '02', title: 'AI Analysis', desc: 'Computer Vision models pinpoint severity, size, and exact GPS coordinates.' },
            { step: '03', title: 'Hazard Mapping', desc: 'The issue is plotted live on the interactive map & safe route system.' },
            { step: '04', title: 'Repair Dispatch', desc: 'Admin approves work order and dispatches repair crews.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-6 relative space-y-3 border border-slate-200 dark:border-slate-800">
              <span className="text-4xl font-extrabold text-brand-500/20 dark:text-brand-400/20">
                {item.step}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

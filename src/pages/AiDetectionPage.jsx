import React, { useState } from 'react';
import { Card, StatCard } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { useNotifications } from '../context/NotificationContext';
import {
  Sparkles,
  Upload,
  Cpu,
  Sliders,
  Ruler,
  Layers,
  CheckCircle2,
  FileCheck,
  Zap,
  Eye,
  AlertTriangle,
  Download
} from 'lucide-react';

export const AiDetectionPage = () => {
  const { addToast } = useNotifications();

  const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [analysisResult, setAnalysisResult] = useState({
    defectsFound: 2,
    primaryDefect: 'Severe Pothole & Alligator Crack',
    overallConfidence: '97.4%',
    estimatedDepth: '14.8 cm',
    estimatedWidth: '48.2 cm',
    estimatedArea: '0.22 sq m',
    severityGrade: 'High',
    structuralRiskScore: 89,
    recommendedAction: 'Emergency Cold-Mix Asphalt Infill & Surface Sealant'
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      runAiAnalysis();
    }
  };

  const runAiAnalysis = () => {
    setIsAnalyzing(true);
    addToast('Running multi-class AI Neural Net inspection...', 'info');
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        defectsFound: Math.floor(1 + Math.random() * 3),
        primaryDefect: 'Deep Asphalt Crater & Longitudinal Expansion Crack',
        overallConfidence: `${(92 + Math.random() * 7.5).toFixed(1)}%`,
        estimatedDepth: `${(10 + Math.random() * 12).toFixed(1)} cm`,
        estimatedWidth: `${(35 + Math.random() * 25).toFixed(1)} cm`,
        estimatedArea: `${(0.12 + Math.random() * 0.2).toFixed(2)} sq m`,
        severityGrade: 'High',
        structuralRiskScore: Math.floor(75 + Math.random() * 20),
        recommendedAction: 'Immediate Sub-grade Repair & Bituminous Patching'
      });
      addToast('AI Vision Inspection completed successfully!', 'success');
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold border border-brand-500/20 mb-1">
            <Sparkles className="w-4 h-4" /> Deep Learning Computer Vision Workbench
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Pothole & Surface Defect Studio</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Multi-class deep neural network for automated road damage classification & depth metrics.
          </p>
        </div>

        <button
          onClick={runAiAnalysis}
          disabled={isAnalyzing}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-safety-500 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-brand-500/20 transition"
        >
          <Cpu className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'RUNNING AI NEURAL NET...' : 'RE-RUN AI DIAGNOSTICS'}</span>
        </button>
      </div>

      {/* TOP AI STAT METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="AI Confidence"
          value={analysisResult.overallConfidence}
          icon={Sparkles}
          color="brand"
        />
        <StatCard
          title="Estimated Depth"
          value={analysisResult.estimatedDepth}
          icon={Ruler}
          color="safety"
        />
        <StatCard
          title="Surface Area"
          value={analysisResult.estimatedArea}
          icon={Layers}
          color="purple"
        />
        <StatCard
          title="Risk Rating Score"
          value={`${analysisResult.structuralRiskScore} / 100`}
          icon={Zap}
          color="red"
        />
      </div>

      {/* WORKBENCH MAIN PANEL: IMAGE DISPLAY + AI CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive AI Image Viewer */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-500" />
              Segmentation & Bounding Box Layer
            </h3>

            <label className="cursor-pointer px-3.5 py-1.5 rounded-xl glass-panel text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-safety-500" /> Upload Image / Video Frame
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Canvas Image Container with AI Bounding Box Overlay */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 min-h-[340px] flex items-center justify-center border border-slate-200 dark:border-slate-800 group">
            <img
              src={selectedImage}
              alt="Road Inspection"
              className={`w-full max-h-[420px] object-cover transition duration-300 ${isAnalyzing ? 'opacity-30 blur-sm' : 'opacity-90'}`}
            />

            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-3 bg-slate-950/75 backdrop-blur-sm z-20">
                <Cpu className="w-12 h-12 text-brand-500 animate-spin" />
                <span className="font-extrabold text-sm tracking-wider">Analyzing Asphalt Structural Micro-Fractures...</span>
              </div>
            )}

            {/* AI Overlay Bounding Boxes */}
            {!isAnalyzing && (
              <>
                <div className="absolute top-1/3 left-1/3 w-48 h-36 border-2 border-dashed border-red-500 bg-red-500/15 rounded-xl p-2 animate-pulse shadow-xl">
                  <div className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow inline-block">
                    Pothole #1 ({analysisResult.overallConfidence})
                  </div>
                  <div className="text-[10px] text-red-200 font-mono mt-1 space-y-0.5">
                    <div>Depth: {analysisResult.estimatedDepth}</div>
                    <div>Area: {analysisResult.estimatedArea}</div>
                  </div>
                </div>

                <div className="absolute bottom-1/4 right-1/4 w-32 h-20 border-2 border-dashed border-amber-500 bg-amber-500/15 rounded-xl p-1.5 shadow-lg">
                  <div className="bg-amber-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow inline-block">
                    Micro Crack (91.2%)
                  </div>
                </div>
              </>
            )}

            {/* Bottom Floating Stats */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs border border-white/10">
              <span className="font-semibold text-slate-300">Defects Found: <strong className="text-white">{analysisResult.defectsFound}</strong></span>
              <span className="font-semibold text-slate-300">AI Model: <strong className="text-brand-400">YOLOv8-RoadDefect-Custom</strong></span>
            </div>
          </div>

          {/* AI Parameter Sliders */}
          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-brand-500" />
                Detection Confidence Filter Threshold
              </span>
              <span className="text-xs font-mono font-extrabold text-brand-600 dark:text-brand-400">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(e.target.value)}
              className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>
        </Card>

        {/* Right 1 Col: AI Diagnostic Report & Specs */}
        <Card className="space-y-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                Diagnostic Inspection Summary
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Classification</span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">{analysisResult.primaryDefect}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Severity Assessment</span>
                <div className="flex items-center justify-between">
                  <StatusBadge status={analysisResult.severityGrade} />
                  <span className="font-mono text-red-500 font-bold">Score {analysisResult.structuralRiskScore}/100</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Dimensions Matrix</span>
                <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 font-semibold pt-1">
                  <div>Depth: <strong>{analysisResult.estimatedDepth}</strong></div>
                  <div>Width: <strong>{analysisResult.estimatedWidth}</strong></div>
                  <div>Area: <strong>{analysisResult.estimatedArea}</strong></div>
                  <div>Volume: <strong>~0.03 m³</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-slate-800 dark:text-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Recommended Repair Action</span>
                <p className="font-bold text-xs text-emerald-800 dark:text-emerald-300">{analysisResult.recommendedAction}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => addToast('Exported AI Inspection Certificate PDF!', 'success')}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Export AI Diagnostic Certificate PDF
          </button>
        </Card>

      </div>

    </div>
  );
};

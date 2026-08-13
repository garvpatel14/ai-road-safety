import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, PublicLayout } from '../layouts/MainLayout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Lazy-load all 13 pages for fast initial page load & code splitting
const LandingPage = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('../pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ReportDamagePage = lazy(() => import('../pages/ReportDamagePage').then(m => ({ default: m.ReportDamagePage })));

const InteractiveMapPage = lazy(() => import('../pages/InteractiveMapPage').then(m => ({ default: m.InteractiveMapPage })));
const SafeRoutePage = lazy(() => import('../pages/SafeRoutePage').then(m => ({ default: m.SafeRoutePage })));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const MyReportsPage = lazy(() => import('../pages/MyReportsPage').then(m => ({ default: m.MyReportsPage })));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));

import { useAuth } from '../context/AuthContext';

const UserRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading Page..." />}>
      <Routes>
        {/* Public Pages Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Main Dashboard & App Pages Layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<UserRoute><DashboardPage /></UserRoute>} />
          <Route path="/report-damage" element={<ReportDamagePage />} />

          <Route path="/map" element={<InteractiveMapPage />} />
          <Route path="/safe-route" element={<SafeRoutePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/my-reports" element={<MyReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

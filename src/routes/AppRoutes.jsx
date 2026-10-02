import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, PublicLayout } from '../layouts/MainLayout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const LandingPage = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })));

const LiveRoadScanningPage = lazy(() => import('../pages/LiveRoadScanningPage').then(m => ({ default: m.LiveRoadScanningPage })));
const SafeRoutePage = lazy(() => import('../pages/SafeRoutePage').then(m => ({ default: m.SafeRoutePage })));
const ReportDamagePage = lazy(() => import('../pages/ReportDamagePage').then(m => ({ default: m.ReportDamagePage })));
const InteractiveMapPage = lazy(() => import('../pages/InteractiveMapPage').then(m => ({ default: m.InteractiveMapPage })));
const MyReportsPage = lazy(() => import('../pages/MyReportsPage').then(m => ({ default: m.MyReportsPage })));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));

const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const RoadHeatmapPage = lazy(() => import('../pages/RoadHeatmapPage').then(m => ({ default: m.RoadHeatmapPage })));
const PotholeManagementPage = lazy(() => import('../pages/PotholeManagementPage').then(m => ({ default: m.PotholeManagementPage })));
const RepairManagementPage = lazy(() => import('../pages/RepairManagementPage').then(m => ({ default: m.RepairManagementPage })));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));

import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

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
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<UserRoute><LiveRoadScanningPage /></UserRoute>} />
          <Route path="/live-scan" element={<UserRoute><LiveRoadScanningPage /></UserRoute>} />
          <Route path="/safe-route" element={<SafeRoutePage />} />
          <Route path="/map" element={<InteractiveMapPage />} />
          <Route path="/report-damage" element={<ReportDamagePage />} />
          <Route path="/my-reports" element={<MyReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/heatmap" element={<AdminRoute><RoadHeatmapPage /></AdminRoute>} />
          <Route path="/admin/potholes" element={<AdminRoute><PotholeManagementPage /></AdminRoute>} />
          <Route path="/admin/repairs" element={<AdminRoute><RepairManagementPage /></AdminRoute>} />
          <Route path="/analytics" element={<AdminRoute><AnalyticsPage /></AdminRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

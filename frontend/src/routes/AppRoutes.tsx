import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/authentication';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import { DashboardDispatcher, AdminDashboard, WelfareDashboard, CommanderDashboard, HRDashboard, PersonnelDashboard } from '../pages/dashboard';
import { PersonnelPage } from '../pages/personnel';
import { WellnessPage } from '../pages/wellness';
import { AIRiskPage } from '../pages/ai-risk';
import { InterventionsPage } from '../pages/interventions';
import { AlertsPage } from '../pages/alerts';
import { AnalyticsPage } from '../pages/analytics';
import { ReportsPage } from '../pages/reports';
import { OrganizationPage } from '../pages/organization';
import { SecurityPage } from '../pages/security';
import { MissionPlannerPage } from '../pages/mission-planner';
import { UnitTwinPage } from '../pages/unit-twin';
import { MissionImpactPage } from '../pages/mission-impact';
import { PolicyDiscoveryPage } from '../pages/policy-discovery';
import { ForceBalancingPage } from '../pages/force-balancing';
import { useAuthStore, getRoleDashboardRoute } from '../store/authStore';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated && user ? (
            <Navigate to={getRoleDashboardRoute(user.role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Authenticated Layout */}
      <Route element={<RoleProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Main Role Dispatcher */}
          <Route path="/dashboard" element={<DashboardDispatcher />} />

          {/* Differentiated Dashboards with role protection */}
          <Route
            element={
              <RoleProtectedRoute
                allowedRoles={['SUPER_ADMIN', 'SYS_ADMIN', 'SECURITY_ADMIN', 'ADMIN']}
              />
            }
          >
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>

          {/* Personnel / Soldier Dashboard */}
          <Route
            element={
              <RoleProtectedRoute
                allowedRoles={['PERSONNEL', 'COMMANDER', 'SUPER_ADMIN', 'ADMIN']}
              />
            }
          >
            <Route path="/dashboard/personnel" element={<PersonnelDashboard />} />
            <Route path="/personnel-dashboard/*" element={<PersonnelDashboard />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                allowedRoles={['WELFARE_OFFICER', 'MEDICAL_OFFICER', 'COMMANDER', 'SUPER_ADMIN', 'ADMIN']}
              />
            }
          >
            <Route path="/dashboard/welfare" element={<WelfareDashboard />} />
            <Route path="/welfare/*" element={<WelfareDashboard />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                allowedRoles={['COMMANDER', 'DEPT_HEAD', 'SUPER_ADMIN', 'ADMIN']}
              />
            }
          >
            <Route path="/dashboard/commander" element={<CommanderDashboard />} />
            <Route path="/commander/*" element={<CommanderDashboard />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                allowedRoles={['HR_OFFICER', 'TRAINING_OFFICER', 'SUPER_ADMIN', 'ADMIN']}
              />
            }
          >
            <Route path="/dashboard/hr" element={<HRDashboard />} />
            <Route path="/hr/*" element={<HRDashboard />} />
          </Route>

          {/* Core Feature Module Routes */}
          <Route path="/personnel" element={<PersonnelPage />} />
          <Route path="/wellness" element={<WellnessPage />} />
          <Route path="/ai-risk" element={<AIRiskPage />} />
          <Route path="/interventions" element={<InterventionsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/organization" element={<OrganizationPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/mission-planner" element={<MissionPlannerPage />} />
          <Route path="/unit-twin" element={<UnitTwinPage />} />
          <Route path="/mission-impact" element={<MissionImpactPage />} />
          <Route path="/policy-discovery" element={<PolicyDiscoveryPage />} />
          <Route path="/force-balancing" element={<ForceBalancingPage />} />
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route
        path="*"
        element={
          isAuthenticated && user ? (
            <Navigate to={getRoleDashboardRoute(user.role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;

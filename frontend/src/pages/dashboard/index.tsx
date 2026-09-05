import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { AdminDashboard } from './AdminDashboard';
import { WelfareDashboard } from './WelfareDashboard';
import { CommanderDashboard } from './CommanderDashboard';
import { HRDashboard } from './HRDashboard';

export const DashboardDispatcher: React.FC = () => {
  const { user } = useAuthStore();

  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'WELFARE_OFFICER':
      return <WelfareDashboard />;
    case 'COMMANDER':
      return <CommanderDashboard />;
    case 'HR_OFFICER':
      return <HRDashboard />;
    default:
      return <WelfareDashboard />;
  }
};

export default DashboardDispatcher;
export { AdminDashboard, WelfareDashboard, CommanderDashboard, HRDashboard };

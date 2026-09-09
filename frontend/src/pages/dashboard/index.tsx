import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { AdminDashboard } from './AdminDashboard';
import { WelfareDashboard } from './WelfareDashboard';
import { CommanderDashboard } from './CommanderDashboard';
import { HRDashboard } from './HRDashboard';
import { PersonnelDashboard } from './PersonnelDashboard';

export const DashboardDispatcher: React.FC = () => {
  const { user } = useAuthStore();

  switch (user?.role) {
    case 'SUPER_ADMIN':
    case 'SYS_ADMIN':
    case 'SECURITY_ADMIN':
    case 'ADMIN':
      return <AdminDashboard />;
    case 'WELFARE_OFFICER':
    case 'MEDICAL_OFFICER':
      return <WelfareDashboard />;
    case 'COMMANDER':
    case 'DEPT_HEAD':
      return <CommanderDashboard />;
    case 'HR_OFFICER':
    case 'TRAINING_OFFICER':
      return <HRDashboard />;
    case 'PERSONNEL':
      return <PersonnelDashboard />;
    default:
      return <PersonnelDashboard />;
  }
};

export default DashboardDispatcher;
export { AdminDashboard, WelfareDashboard, CommanderDashboard, HRDashboard, PersonnelDashboard };

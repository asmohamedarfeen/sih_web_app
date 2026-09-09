import { create } from 'zustand';
import { User, UserRole } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  getDashboardRoute: () => string;
}

export const getRoleDashboardRoute = (role?: UserRole | null): string => {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'SYS_ADMIN':
    case 'SECURITY_ADMIN':
    case 'ADMIN':
      return '/dashboard/admin';
    case 'WELFARE_OFFICER':
    case 'MEDICAL_OFFICER':
      return '/dashboard/welfare';
    case 'COMMANDER':
    case 'DEPT_HEAD':
      return '/dashboard/commander';
    case 'HR_OFFICER':
    case 'TRAINING_OFFICER':
      return '/dashboard/hr';
    case 'PERSONNEL':
      return '/dashboard/personnel';
    default:
      return '/login';
  }
};

export const useAuthStore = create<AuthState>((set, get) => {
  // Restore from localStorage
  const savedToken = localStorage.getItem('pswms_token');
  const savedUserJson = localStorage.getItem('pswms_user');
  let initialUser: User | null = null;
  if (savedUserJson) {
    try {
      initialUser = JSON.parse(savedUserJson);
    } catch {
      initialUser = null;
    }
  }

  return {
    user: initialUser,
    token: savedToken,
    isAuthenticated: !!savedToken && !!initialUser,

    setAuth: (user: User, token: string) => {
      localStorage.setItem('pswms_token', token);
      localStorage.setItem('pswms_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem('pswms_token');
      localStorage.removeItem('pswms_user');
      set({ user: null, token: null, isAuthenticated: false });
    },

    getDashboardRoute: () => {
      const user = get().user;
      return getRoleDashboardRoute(user?.role);
    },
  };
});

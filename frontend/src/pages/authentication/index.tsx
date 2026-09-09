import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Key,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore, getRoleDashboardRoute } from '../../store/authStore';
import { DemoAccount } from '../../types/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated, user } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);
  const [selectedDemoRole, setSelectedDemoRole] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getRoleDashboardRoute(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const fetchDemoAccounts = async () => {
      try {
        const accounts = await authService.getDemoAccounts();
        setDemoAccounts(accounts);
      } catch {
        setDemoAccounts([
          {
            uid: 'UID-WEL-007',
            force_id: 'DEF_006',
            regimental_number: 'CRPF-2014-8007',
            role: 'WELFARE_OFFICER',
            role_label: 'Welfare Officer',
            email: 'welfare@forces.gov.in',
            password: 'welfare123',
            full_name: 'Welfare Offr. Priya Sharma',
            rank: 'Lt. Colonel / Chief Welfare Officer',
            unit: 'Psychological Support & Welfare Wing',
            branch: 'CRPF',
            description: 'Assigned welfare cases, counseling calendar, and psychological intervention tracking.',
            dashboard_route: '/dashboard/welfare',
          },
          {
            uid: 'UID-CMD-005',
            force_id: 'DEF_004',
            regimental_number: 'ARMY-2007-8005',
            role: 'COMMANDER',
            role_label: 'Commander',
            email: 'commander@forces.gov.in',
            password: 'commander123',
            full_name: 'Brig. Santosh Babu',
            rank: 'Brigadier / Formation Commander',
            unit: '16 Corps Command Division',
            branch: 'Indian Army',
            description: 'Combat readiness indices, formation wellness trends, and real-time stress alerts.',
            dashboard_route: '/dashboard/commander',
          },
          {
            uid: 'UID-HRO-004B',
            force_id: 'DUM_3',
            regimental_number: 'CRPF-2008-8004B',
            role: 'HR_OFFICER',
            role_label: 'HR Officer',
            email: 'hr@forces.gov.in',
            password: 'hr123',
            full_name: 'Col. Kabir Khan (HR Officer)',
            rank: 'Colonel / HR Director',
            unit: 'Personnel & Records Division',
            branch: 'CRPF',
            description: 'Leave analysis, deployment fatigue analytics, and workforce distribution.',
            dashboard_route: '/dashboard/hr',
          },
          {
            uid: 'UID-SUP-001',
            force_id: 'DEF_001',
            regimental_number: 'ARMY-2005-9001',
            role: 'SUPER_ADMIN',
            role_label: 'Super Administrator',
            email: 'superadmin@forces.gov.in',
            password: 'superadmin123',
            full_name: 'Gen. Vikramaditya Rawat',
            rank: 'General / Chief of Defence Staff',
            unit: 'Integrated Defence Staff (IDS) HQ',
            branch: 'Indian Army',
            description: 'Full strategic oversight, RBAC permissions, audit logs, and system diagnostics.',
            dashboard_route: '/dashboard/admin',
          },
          {
            uid: 'UID-EMP-010',
            force_id: 'DUM_1',
            regimental_number: 'CRPF-2015-8010',
            role: 'PERSONNEL',
            role_label: 'Personnel / Officer',
            email: 'alex@company.com',
            password: 'employee123',
            full_name: 'Major Alex Morgan',
            rank: 'Major / Field Ops Lead',
            unit: 'Rapid Action Battalion 1',
            branch: 'CRPF',
            description: 'Self-service medical file, payslips, weapon custody, leave applications, and burnout survey.',
            dashboard_route: '/dashboard/welfare',
          },
        ]);
      }
    };
    fetchDemoAccounts();
  }, []);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authService.login({ email: loginEmail, password: loginPassword });
      setAuth(response.user, response.access_token);
      const targetRoute = getRoleDashboardRoute(response.user.role);
      navigate(targetRoute, { replace: true });
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Authentication failed. Please check your credentials.';
      setErrorMessage(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (account: DemoAccount) => {
    setSelectedDemoRole(account.role);
    setEmail(account.email);
    setPassword(account.password);
    handleLogin(undefined, account.email, account.password);
  };

  const getRoleTheme = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'SYS_ADMIN':
      case 'SECURITY_ADMIN':
      case 'ADMIN':
        return {
          border: 'hover:border-secondary-300 border-slate-200/80',
          badge: 'bg-secondary-50 text-secondary-700 border-secondary-200',
          iconBg: 'bg-secondary-50 text-secondary border border-secondary-100',
          glow: 'hover:shadow-glow-secondary-soft',
          accentColor: 'text-secondary',
        };
      case 'WELFARE_OFFICER':
      case 'MEDICAL_OFFICER':
        return {
          border: 'hover:border-primary-300 border-slate-200/80',
          badge: 'bg-primary-50 text-primary-700 border-primary-200',
          iconBg: 'bg-primary-50 text-primary border border-primary-100',
          glow: 'hover:shadow-glow-primary-soft',
          accentColor: 'text-primary',
        };
      case 'COMMANDER':
      case 'DEPT_HEAD':
        return {
          border: 'hover:border-accent-300 border-slate-200/80',
          badge: 'bg-accent-50 text-accent-700 border-accent-200',
          iconBg: 'bg-accent-50 text-accent border border-accent-100',
          glow: 'hover:shadow-glow-accent-soft',
          accentColor: 'text-accent-700',
        };
      case 'HR_OFFICER':
      case 'TRAINING_OFFICER':
        return {
          border: 'hover:border-secondary-300 border-slate-200/80',
          badge: 'bg-secondary-50 text-secondary-700 border-secondary-200',
          iconBg: 'bg-secondary-50 text-secondary border border-secondary-100',
          glow: 'hover:shadow-glow-secondary-soft',
          accentColor: 'text-secondary',
        };
      default:
        return {
          border: 'hover:border-primary-300 border-slate-200/80',
          badge: 'bg-primary-50 text-primary-700 border-primary-200',
          iconBg: 'bg-primary-50 text-primary border border-primary-100',
          glow: '',
          accentColor: 'text-primary',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col justify-between font-sans selection:bg-primary-500/20 selection:text-primary-900 relative overflow-hidden bg-dot-light">
      {/* Soft Ambient Light Blobs */}
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-primary-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-secondary-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between relative z-10 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent p-[1.5px] shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wide text-gray-900 uppercase flex items-center gap-2">
              Defense HRMS & Welfare Portal
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                STRATEGIC COMMAND
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Synchronized Strategic Welfare & Stress Intelligence Gateway</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-gray-700">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>HRMS Portal Integration Active</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 relative z-10 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
          
          {/* Left: Login Form */}
          <div className="lg:col-span-5 flex flex-col justify-center p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-extrabold mb-3">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-Trust RBAC Authentication</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Sign In to Command Portal
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Enter your official Defense HRMS credentials or select a verified role account below.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-[0.1em] mb-1.5">
                  Official Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. welfare@forces.gov.in"
                    className="w-full white-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-[0.1em] mb-1.5">
                  Access Key / Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full white-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary focus:ring-0" />
                  <span>Maintain secure session</span>
                </label>
                <span className="text-slate-400 font-mono text-[11px]">HMAC-SHA256</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-primary via-primary-600 to-secondary hover:from-primary-600 hover:to-secondary text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying HRMS Identity...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Access Command</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Clean White HRMS Role Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>HRMS Defense Role Directory</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any role below for instant 1-click HRMS authentication and automated dashboard routing.
                </p>
              </div>
              <span className="text-[11px] font-mono text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 font-bold">
                {demoAccounts.length} Verified Roles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {demoAccounts.map((account) => {
                const theme = getRoleTheme(account.role);
                const isSelected = selectedDemoRole === account.role;

                return (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => handleSelectDemo(account)}
                    disabled={isLoading}
                    className={`text-left p-5 rounded-2xl bg-white border ${theme.border} ${theme.glow} ${
                      isSelected ? 'ring-2 ring-primary shadow-md' : 'shadow-card-soft'
                    } white-card-hover flex flex-col justify-between relative overflow-hidden group cursor-pointer`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                          {account.role_label}
                        </span>
                        <div className={`p-1.5 rounded-xl ${theme.iconBg}`}>
                          <UserCheck className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-primary transition-colors">
                          {account.full_name}
                        </h4>
                        {account.uid && (
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {account.uid}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">{account.rank}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {account.unit} {account.regimental_number ? `• (${account.regimental_number})` : ''}
                      </p>

                      <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                        {account.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-slate-500">{account.email}</span>
                      <span className="text-primary font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Sign In <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Role Hierarchy Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-600 flex items-center gap-3 shadow-card-soft">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <div className="leading-relaxed">
                <span className="text-gray-900 font-bold">HRMS Hierarchy Matching: </span>
                <span className="text-slate-600">
                  <strong className="text-primary-700">Welfare Officer</strong> → Matched Cases &bull;{' '}
                  <strong className="text-accent-700">Commander</strong> → Formation Readiness &bull;{' '}
                  <strong className="text-secondary-700">HR</strong> → Leaves & Workforce &bull;{' '}
                  <strong className="text-secondary-800">Super Admin</strong> → Enterprise Telemetry
                </span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 relative z-10 shadow-sm">
        <p className="font-medium">Personnel Stress & Welfare Monitoring System • Smart India Hackathon</p>
        <p className="flex items-center gap-2 text-[11px]">
          <span>HMAC-SHA256 Protected</span> &bull; <span>Defense Intelligence Standard</span> &bull; <span>Zero-Trust Architecture</span>
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;

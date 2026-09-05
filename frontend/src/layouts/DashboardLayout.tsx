import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Users,
  HeartPulse,
  Brain,
  AlertTriangle,
  HandHeart,
  BarChart3,
  FileText,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Bell,
  Menu,
  X,
  Compass,
  Radio,
  Clock,
} from 'lucide-react';
import { useAuthStore, getRoleDashboardRoute } from '../store/authStore';
import { authService } from '../services/authService';

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/login', { replace: true });
  };

  const getRoleTheme = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'SYS_ADMIN':
      case 'SECURITY_ADMIN':
      case 'ADMIN':
        return {
          label: 'System Administrator',
          shortLabel: 'ADMIN',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
          dotClass: 'bg-blue-600',
          accentGradient: 'from-blue-600 to-indigo-600',
          activeNav: 'bg-blue-50/80 text-blue-700 border border-blue-200/80 shadow-sm font-bold',
        };
      case 'WELFARE_OFFICER':
      case 'MEDICAL_OFFICER':
        return {
          label: 'Chief Welfare Officer',
          shortLabel: 'WELFARE',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dotClass: 'bg-emerald-600',
          accentGradient: 'from-emerald-600 to-teal-600',
          activeNav: 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/80 shadow-sm font-bold',
        };
      case 'COMMANDER':
      case 'DEPT_HEAD':
        return {
          label: 'Formation Commander',
          shortLabel: 'COMMANDER',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
          dotClass: 'bg-amber-600',
          accentGradient: 'from-amber-600 to-yellow-600',
          activeNav: 'bg-amber-50/80 text-amber-700 border border-amber-200/80 shadow-sm font-bold',
        };
      case 'HR_OFFICER':
      case 'TRAINING_OFFICER':
        return {
          label: 'Senior HR Superintendent',
          shortLabel: 'HR',
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
          dotClass: 'bg-purple-600',
          accentGradient: 'from-purple-600 to-fuchsia-600',
          activeNav: 'bg-purple-50/80 text-purple-700 border border-purple-200/80 shadow-sm font-bold',
        };
      default:
        return {
          label: 'Authorized Personnel',
          shortLabel: 'USER',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          dotClass: 'bg-slate-600',
          accentGradient: 'from-slate-600 to-slate-700',
          activeNav: 'bg-slate-100 text-slate-900 font-bold',
        };
    }
  };

  const roleTheme = getRoleTheme(user?.role);

  const getNavItems = () => [
    { name: 'Command Overview', path: getRoleDashboardRoute(user?.role), icon: LayoutDashboard },
    { name: 'Personnel Directory', path: '/personnel', icon: Users },
    { name: 'Wellness Check-ins', path: '/wellness', icon: HeartPulse },
    { name: 'AI Risk Diagnostics', path: '/ai-risk', icon: Brain },
    { name: 'Welfare Interventions', path: '/interventions', icon: HandHeart },
    { name: 'Tactical Alerts', path: '/alerts', icon: AlertTriangle },
    { name: 'Analytics Center', path: '/analytics', icon: BarChart3 },
    { name: 'Dossier Reports', path: '/reports', icon: FileText },
  ];

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/[0.04] blur-[100px] pointer-events-none z-0" />

      {/* Top Header */}
      <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate(getRoleDashboardRoute(user?.role))}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1.5px] shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm tracking-wider text-slate-900 uppercase flex items-center gap-2">
                  PSWMS
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    DEFENSE PORTAL
                  </span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Personnel Stress & Welfare Intelligence Command
              </p>
            </div>
          </div>
        </div>

        {/* Center Live Status */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 shadow-sm">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="text-slate-800 font-semibold">Gateway Active</span>
          <span className="text-slate-300">&bull;</span>
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 font-medium">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>IST {currentTime || 'LIVE'}</span>
          </div>
        </div>

        {/* Right User & Role Info */}
        <div className="flex items-center gap-3">
          {/* Active Role Badge */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${roleTheme.badgeClass} shadow-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${roleTheme.dotClass} animate-pulse`} />
            <span>{roleTheme.label}</span>
          </div>

          {/* Notification Button */}
          <button className="p-2 rounded-xl text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all text-left cursor-pointer"
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${roleTheme.accentGradient} flex items-center justify-center text-xs font-bold text-white shadow-sm overflow-hidden`}>
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  user?.full_name?.charAt(0) || 'U'
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.full_name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{user?.rank || user?.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                  <p className="font-extrabold text-xs text-slate-900">{user?.full_name}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{user?.email}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleTheme.badgeClass}`}>
                      {user?.role}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">{user?.unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Switch Role Profile</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">4 Roles</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors mt-1 font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Secure Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            isMobileMenuOpen ? 'block fixed inset-0 top-16 z-30 bg-white/95 backdrop-blur-xl' : 'hidden'
          } md:block w-64 border-r border-slate-200/80 bg-white/70 p-4 space-y-6 shrink-0 z-20 flex flex-col justify-between shadow-sm`}
        >
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-3 mb-2.5">
                Primary Modules
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                        isActive
                          ? roleTheme.activeNav
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-current' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-3 mb-2.5">
                Role Dispatch
              </p>
              <div className="space-y-1 px-1">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Compass className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    <span>Change Profile</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                    Switch
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Security Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Defense Grade RBAC</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Active session verified with 256-bit cryptographic tokens.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f8fafc] relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

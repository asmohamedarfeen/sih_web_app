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
  Activity,
  Sliders,
  GitFork,
} from 'lucide-react';
import { useAuthStore, getRoleDashboardRoute } from '../store/authStore';
import { authService } from '../services/authService';
import { LanguageSelector } from '../components/common/LanguageSelector';

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
          badgeClass: 'bg-secondary-50 text-secondary-700 border-secondary-200',
          dotClass: 'bg-secondary',
          accentGradient: 'from-secondary to-secondary-800',
          activeNav: 'bg-secondary-50/90 text-secondary-700 border border-secondary-200/80 shadow-sm font-bold',
        };
      case 'WELFARE_OFFICER':
      case 'MEDICAL_OFFICER':
        return {
          label: 'Chief Welfare Officer',
          shortLabel: 'WELFARE',
          badgeClass: 'bg-primary-50 text-primary-700 border-primary-200',
          dotClass: 'bg-primary',
          accentGradient: 'from-primary to-primary-700',
          activeNav: 'bg-primary-50/90 text-primary-700 border border-primary-200/80 shadow-sm font-bold',
        };
      case 'COMMANDER':
      case 'DEPT_HEAD':
        return {
          label: 'Formation Commander',
          shortLabel: 'COMMANDER',
          badgeClass: 'bg-accent-50 text-accent-700 border-accent-200',
          dotClass: 'bg-accent',
          accentGradient: 'from-accent-600 to-accent-800',
          activeNav: 'bg-accent-50/90 text-accent-700 border border-accent-200/80 shadow-sm font-bold',
        };
      case 'HR_OFFICER':
      case 'TRAINING_OFFICER':
        return {
          label: 'Senior HR Superintendent',
          shortLabel: 'HR',
          badgeClass: 'bg-secondary-50 text-secondary-700 border-secondary-200',
          dotClass: 'bg-secondary-600',
          accentGradient: 'from-secondary-600 to-primary-600',
          activeNav: 'bg-secondary-50/90 text-secondary-700 border border-secondary-200/80 shadow-sm font-bold',
        };
      case 'PERSONNEL':
        return {
          label: 'Frontline Personnel',
          shortLabel: 'SOLDIER',
          badgeClass: 'bg-primary-50 text-primary-700 border-primary-200',
          dotClass: 'bg-primary',
          accentGradient: 'from-primary to-primary-700',
          activeNav: 'bg-primary text-white shadow-md shadow-primary/20 font-bold',
        };
      default:
        return {
          label: 'Authorized Personnel',
          shortLabel: 'USER',
          badgeClass: 'bg-slate-100 text-gray-700 border-slate-200',
          dotClass: 'bg-slate-600',
          accentGradient: 'from-slate-600 to-slate-700',
          activeNav: 'bg-slate-100 text-gray-900 font-bold',
        };
    }
  };

  const roleTheme = getRoleTheme(user?.role);

  const isCommander = user?.role === 'COMMANDER' || user?.role === 'DEPT_HEAD';

  const getNavItems = () => {
    if (user?.role === 'PERSONNEL') {
      return [
        { name: 'Personal Dashboard', path: '/dashboard/personnel', icon: LayoutDashboard },
        { name: 'Unit Hierarchy Tree', path: '/organization', icon: GitFork },
        { name: 'Daily Check-ins', path: '/wellness', icon: HeartPulse },
        { name: 'AI Health Insights', path: '/ai-risk', icon: Brain },
        { name: 'Recovery Activities', path: '/interventions', icon: HandHeart },
        { name: 'My Alerts & SOS', path: '/alerts', icon: AlertTriangle },
        { name: 'My Service Record', path: '/reports', icon: FileText },
      ];
    }

    if (isCommander) {
      return [
        { name: 'Dashboard', path: '/dashboard/commander', icon: LayoutDashboard },
        { name: 'Unit Hierarchy', path: '/organization', icon: GitFork },
        { name: 'Force Overview', path: '/personnel', icon: Users },
        { name: 'Unit Analysis', path: '/analytics', icon: BarChart3 },
        { name: 'Risk & Alerts', path: '/alerts', icon: AlertTriangle, badge: '4' },
        { name: 'AI Insights', path: '/ai-risk', icon: Brain },
        { name: 'Welfare Actions', path: '/interventions', icon: HandHeart },
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Resources', path: '/wellness', icon: HeartPulse },
        { name: 'Settings', path: '/alerts', icon: Sliders },
      ];
    }

    if (user?.role === 'WELFARE_OFFICER' || user?.role === 'MEDICAL_OFFICER') {
      return [
        { name: 'Dashboard', path: '/dashboard/welfare', icon: LayoutDashboard },
        { name: 'Unit Hierarchy', path: '/organization', icon: GitFork },
        { name: 'Personnel Overview', path: '/personnel', icon: Users },
        { name: 'Risk Analysis', path: '/analytics', icon: Activity },
        { name: 'AI Predictions', path: '/ai-risk', icon: Brain },
        { name: 'Welfare Actions', path: '/interventions', icon: HandHeart },
        { name: 'Reports & Analytics', path: '/reports', icon: FileText },
        { name: 'Resource Center', path: '/wellness', icon: HeartPulse },
        { name: 'Settings', path: '/alerts', icon: Sliders },
      ];
    }

    return [
      { name: 'System Command', path: getRoleDashboardRoute(user?.role), icon: LayoutDashboard },
      { name: 'Unit Hierarchy Tree', path: '/organization', icon: GitFork },
      { name: 'Personnel Directory', path: '/personnel', icon: Users },
      { name: 'Wellness Check-ins', path: '/wellness', icon: HeartPulse },
      { name: 'AI Risk Diagnostics', path: '/ai-risk', icon: Brain },
      { name: 'Welfare Interventions', path: '/interventions', icon: HandHeart },
      { name: 'Tactical Alerts', path: '/alerts', icon: AlertTriangle },
      { name: 'Analytics Center', path: '/analytics', icon: BarChart3 },
      { name: 'Dossier Reports', path: '/reports', icon: FileText },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className={`min-h-screen ${isCommander ? 'bg-[#F4F6F9]' : 'bg-[#f8fafc]'} text-gray-800 flex flex-col font-sans selection:bg-primary-500/20 selection:text-primary-900`}>
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary-500/[0.04] blur-[100px] pointer-events-none z-0" />

      {/* Top Header - Executive Command Bar */}
      <header className={`h-16 ${isCommander ? 'bg-[#0E231B] border-[#183B2E]' : 'bg-secondary border-secondary-800'} border-b text-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-md`}>
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate(getRoleDashboardRoute(user?.role))}
          >
            {isCommander ? (
              <div className="flex items-center gap-3">
                {/* Indian Army Gold Crest / Emblem */}
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#D4A017]/40 shadow-md flex items-center justify-center p-1 shrink-0">
                  <Shield className="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black tracking-widest text-[#D4A017] uppercase">
                      भारतीय सेना
                    </span>
                    <span className="text-[9px] font-bold text-slate-300 tracking-wider">
                      INDIAN ARMY
                    </span>
                    <span className="hidden xl:inline-block text-[8px] text-[#D4A017]/80 font-semibold border-l border-white/20 pl-2">
                      SERVICE &bull; SECURITY &bull; SELFLESSNESS
                    </span>
                  </div>
                  <h1 className="font-black text-sm tracking-tight text-white flex items-center gap-2">
                    AI Command Readiness Center
                    <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-300 font-normal">
                      &bull; People Ready | Units Strong | Nation Secure
                    </span>
                  </h1>
                </div>
              </div>
            ) : (
              <>
                <div className="w-9 h-9 rounded-xl bg-primary border border-accent/40 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4 text-accent" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-black text-sm tracking-wider text-white uppercase flex items-center gap-2">
                      PSWMS
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-secondary-900 text-accent border border-secondary-700">
                        DEFENSE COMMAND
                      </span>
                    </h1>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium tracking-wide">
                    Personnel Stress &amp; Welfare Intelligence Command
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center / Motto */}
        {isCommander ? (
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 italic tracking-wide">
            <span>Stronger Soldiers</span>
            <span className="text-slate-500">&bull;</span>
            <span>Stronger Missions</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-white font-medium">A Safer India</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-secondary-900 border border-secondary-700 text-xs text-slate-200 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-success animate-pulse" />
            <span className="text-white font-semibold">Gateway Active</span>
            <span className="text-secondary-700">&bull;</span>
            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300 font-medium">
              <Clock className="w-3 h-3 text-accent" />
              <span>IST {currentTime || 'LIVE'}</span>
            </div>
          </div>
        )}

        {/* Right User & Role Info */}
        <div className="flex items-center gap-3">
          {/* Multi-Lingual Regional Language Selector */}
          <LanguageSelector compact={isCommander} />

          {!isCommander && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border bg-secondary-900 text-accent border-secondary-700 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>{roleTheme.label}</span>
            </div>
          )}

          {/* Notification Button */}
          <button className={`p-2 rounded-xl text-slate-300 hover:text-white ${isCommander ? 'bg-black/30 hover:bg-black/40 border-[#1B382D]' : 'bg-secondary-900 hover:bg-secondary-800 border-secondary-700'} border shadow-sm transition-all relative cursor-pointer`}>
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
              4
            </span>
          </button>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl ${isCommander ? 'bg-black/30 hover:bg-black/40 border-[#1B382D]' : 'bg-secondary-900 hover:bg-secondary-800 border-secondary-700'} border shadow-sm transition-all text-left cursor-pointer`}
            >
              <div className="w-7 h-7 rounded-lg bg-[#D4A017]/20 border border-[#D4A017]/50 flex items-center justify-center text-xs font-bold text-[#D4A017] shadow-sm overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  user?.full_name?.charAt(0) || 'C'
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-white leading-tight">
                  {isCommander ? 'Commander' : user?.full_name}
                </p>
                <p className="text-[10px] text-slate-300 font-medium">
                  {isCommander ? 'Northern Command' : (user?.rank || user?.role)}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-gray-900">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                  <p className="font-extrabold text-xs text-gray-900">{user?.full_name}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{user?.email}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-secondary-50 text-secondary border-secondary-200">
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
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-slate-700 hover:text-gray-900 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Switch Role Profile</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">4 Roles</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-danger hover:text-danger-700 hover:bg-danger-50 flex items-center gap-2 transition-colors mt-1 font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Secure Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Date & Time display */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 font-mono border-l border-white/10 pl-3">
            <Clock className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>Mon, 8 Sep 2025 | 10:24 AM</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            isMobileMenuOpen ? 'block fixed inset-0 top-16 z-30' : 'hidden'
          } md:block w-64 ${
            isCommander
              ? 'bg-[#0E231B] border-r border-[#193A2D] text-slate-200'
              : 'bg-white border-r border-slate-200/90 text-gray-800'
          } p-3.5 space-y-4 shrink-0 z-20 flex flex-col justify-between shadow-xs overflow-y-auto`}
        >
          <div className="space-y-4">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${isCommander ? 'text-emerald-500/80' : 'text-slate-400'} px-3 mb-2`}>
                {isCommander ? 'Command Modules' : 'Primary Modules'}
              </p>
              <nav className="space-y-1">
                {navItems.map((item: any) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                        isActive
                          ? isCommander
                            ? 'bg-[#1F4A38] text-white shadow-md font-bold border border-emerald-500/40'
                            : 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                          : isCommander
                          ? 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                          : 'text-slate-600 hover:text-gray-900 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? (isCommander ? 'text-emerald-400' : 'text-accent') : (isCommander ? 'text-slate-400' : 'text-slate-400')}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${isCommander ? 'text-emerald-500/80' : 'text-slate-400'} px-3 mb-2`}>
                Role Dispatch
              </p>
              <div className="space-y-1 px-1">
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full text-left p-2.5 rounded-xl ${
                    isCommander
                      ? 'bg-black/30 border-[#1B382D] hover:bg-black/40 text-slate-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-gray-900'
                  } border text-xs transition-all flex items-center justify-between group cursor-pointer shadow-sm`}
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Compass className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                    <span>Change Profile</span>
                  </div>
                  <span className={`text-[10px] font-mono ${isCommander ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-primary-50 text-primary border-primary-200'} px-1.5 py-0.5 rounded font-bold border`}>
                    Switch
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Card / Soldier Silhouette for Commander */}
          {isCommander ? (
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-t from-[#091510] via-[#0e221b] to-transparent p-3 pt-6 text-center border border-[#1b3d30]/60 mt-auto">
              <svg viewBox="0 0 200 80" className="w-full h-16 text-[#091510] -mb-1 opacity-95" preserveAspectRatio="none">
                <path d="M0,80 L0,45 L35,22 L70,38 L110,12 L145,35 L180,18 L200,30 L200,80 Z" fill="#0A1C15" />
                <path d="M0,80 L0,55 L30,38 L70,50 L120,32 L160,48 L200,36 L200,80 Z" fill="#07140F" />
                <g transform="translate(32, 12) scale(0.65)" fill="#040B08">
                  <ellipse cx="25" cy="12" rx="6" ry="6.5" />
                  <path d="M18,18 C18,18 20,35 21,48 L29,48 C30,35 32,18 32,18 Z" />
                  <path d="M14,22 C14,22 17,20 18,26 L18,36 C16,36 14,32 14,22 Z" />
                  <path d="M21,48 L19,75 L22,76 L25,52 L28,75 L31,75 L29,48 Z" />
                  <line x1="8" y1="28" x2="38" y2="40" stroke="#040B08" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="6" y1="26" x2="12" y2="30" stroke="#040B08" strokeWidth="3" />
                </g>
              </svg>
              <div className="relative z-10 -mt-1">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-200">
                  NATION FIRST
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  ALWAYS
                </div>
                {/* Indian Tricolor Bar */}
                <div className="flex h-1 w-14 mx-auto mt-1 rounded-full overflow-hidden shadow-xs">
                  <div className="w-1/3 bg-[#FF9933]" />
                  <div className="w-1/3 bg-[#FFFFFF]" />
                  <div className="w-1/3 bg-[#138808]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Defense Grade RBAC</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                Active session verified with 256-bit cryptographic tokens.
              </p>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto ${isCommander ? 'p-3 sm:p-5 lg:p-6 bg-[#F4F6F9]' : 'p-4 sm:p-6 lg:p-8 bg-[#f8fafc]'} relative`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

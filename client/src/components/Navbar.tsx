import { Bell, ShieldCheck, CalendarDays, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();

  const currentPeriod = new Date().toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric'
  });

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm shrink-0 z-10">
      {/* ─── Left: Mobile Menu + Period Indicator ─────────────── */}
      <div className="flex items-center gap-3 sm:gap-2.5">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
          >
            <Menu size={20} />
          </button>
        )}
        <ShieldCheck className="hidden sm:block text-emerald-500" size={20} />
        <div className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
          <CalendarDays size={14} className="text-slate-400" />
          <span>Active Period: <span className="font-semibold text-slate-800">{currentPeriod}</span></span>
        </div>
      </div>

      {/* ─── Right: Notifications + User Avatar ─────────── */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          className="relative text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-50 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
        </button>

        <div className="h-7 w-px bg-slate-200" />

        {/* User Info */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-400 font-medium">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

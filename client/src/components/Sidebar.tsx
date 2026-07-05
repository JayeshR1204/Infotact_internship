import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, CreditCard, UserCircle,
  LogOut, ChevronRight, Building2, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const { user, logoutSession } = useAuth();
  const navigate = useNavigate();

  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR Manager';

  const adminLinks: NavItem[] = [
    { label: 'Executive Console',    to: '/admin',          icon: <LayoutDashboard size={18} /> },
    { label: 'Workforce Directory',  to: '/admin/employees', icon: <Users size={18} /> },
    { label: 'Payroll Records',      to: '/admin/payroll',   icon: <CreditCard size={18} /> },
  ];

  const employeeLinks: NavItem[] = [
    { label: 'My Workspace',   to: '/employee',         icon: <UserCircle size={18} /> },
    { label: 'Salary Slips',   to: '/employee/payslips', icon: <FileText size={18} /> },
  ];

  const links = isAdminOrHR ? adminLinks : employeeLinks;
  const sectionLabel = isAdminOrHR ? 'Management Suite' : 'Employee Portal';

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'U';

  const handleLogout = () => {
    logoutSession();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 shrink-0">
      {/* ─── Brand Header ───────────────────────────────────── */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-white">INFOTACT</p>
            <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-widest">HRMS Console</p>
          </div>
        </div>
      </div>

      {/* ─── Navigation Links ────────────────────────────────── */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">
          {sectionLabel}
        </p>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin' || link.to === '/employee'}
            className={({ isActive }) =>
              `group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-teal-600/20 text-teal-400 border border-teal-500/25'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`
            }
          >
            <span className="flex items-center gap-3">
              {link.icon}
              {link.label}
            </span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* ─── User Profile Footer ─────────────────────────────── */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name ?? 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

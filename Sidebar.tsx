import React from 'react';
import { LayoutDashboard, Users, CreditCard, UserCircle, LogOut } from 'lucide-react';

export default function Sidebar() {
  // Simulated configuration context for now. Later, this will read from AuthContext.
  const userMock = {
    name: "Alex Mercer",
    role: "HR Manager" // Toggle to 'Employee' to verify dynamic visual changes
  };

  const isAdminOrHR = userMock.role === 'Admin' || userMock.role === 'HR Manager';

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800">
      {/* Branding Segment */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-center">
        <span className="text-xl font-bold tracking-wider text-teal-400">⚡ INFOTACT HRMS</span>
      </div>

      {/* Dynamic Link Architecture */}
      <nav className="flex-1 p-4 space-y-2">
        {isAdminOrHR ? (
          <>
            <div className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2">Management Matrix</div>
            <a href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <LayoutDashboard size={20} className="text-teal-400" /> Executive Console
            </a>
            <a href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Users size={20} className="text-teal-400" /> Workforce Directory
            </a>
            <a href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <CreditCard size={20} className="text-teal-400" /> Payroll Records
            </a>
          </>
        ) : (
          <>
            <div className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2">Workspace Portal</div>
            <a href="/employee" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <UserCircle size={20} className="text-teal-400" /> Personal Account
            </a>
            <a href="/employee" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <CreditCard size={20} className="text-teal-400" /> My Salary Slips
            </a>
          </>
        )}
      </nav>
{/* User Footer Profile Node */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium truncate text-slate-200">{userMock.name}</p>
            <p className="text-xs text-slate-400 italic">{userMock.role}</p>
          </div>
          <button className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors" title="Logout Session">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );

}

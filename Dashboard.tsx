import React from 'react';
import { Users, LayoutDashboard, Settings, LogOut, Building2 } from 'lucide-react';
import EmployeeTable, { Employee } from '../components/EmployeeTable';

// Mock Dataset for testing Week 2 display capabilities
const sampleEmployees: Employee[] = [
  { id: '1', name: 'Aarav Mehta', email: 'aarav@company.com', role: 'Software Engineer', department: 'Engineering', status: 'Active' },
  { id: '2', name: 'Ananya Sharma', email: 'ananya@company.com', role: 'Product Manager', department: 'Product', status: 'Active' },
  { id: '3', name: 'Rohan Verma', email: 'rohan@company.com', role: 'UI/UX Designer', department: 'Design', status: 'On Leave' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation Panel */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between hidden md:flex">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Building2 className="w-6 h-6" />
            <span>Workspace</span>
          </div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-medium transition-all">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-all">
              <Users className="w-5 h-5" /> Employees
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-all">
              <Settings className="w-5 h-5" /> Settings
            </a>
          </nav>
        </div>
        <div className="p-6 border-t border-slate-50">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-all cursor-pointer">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Board Content Frame */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-sm text-slate-500">Manage and coordinate all active workspace staff records.</p>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-slate-100 shadow-xs rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Staff</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">1,248</div>
          </div>
          <div className="p-5 bg-white border border-slate-100 shadow-xs rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Status</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">1,210</div>
          </div>
          <div className="p-5 bg-white border border-slate-100 shadow-xs rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On Leave</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">38</div>
          </div>
        </div>

        {/* Employee Table Submodule */}
        <EmployeeTable data={sampleEmployees} />
      </main>
    </div>
  );
}



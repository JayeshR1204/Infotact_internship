import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const currentPeriod = "Period Tracking: June 2026";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-xs">
      {/* Left Action Node */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-emerald-500" size={22} />
        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {currentPeriod}
        </span>
      </div>

      {/* Right Interaction Matrix */}
      <div className="flex items-center gap-4">
        <button className="relative text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-50 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}

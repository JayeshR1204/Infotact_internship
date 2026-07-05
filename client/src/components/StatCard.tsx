import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  colorClass: string;
  trend?: string;
}

export default function StatCard({ title, value, icon, description, colorClass, trend }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-all duration-200 group">
      <div className="space-y-2 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</h3>
        <p className="text-xs text-slate-400 font-medium">{description}</p>
        {trend && (
          <p className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full inline-block border border-teal-100">
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl text-white ${colorClass} shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
        {icon}
      </div>
    </div>
  );
}

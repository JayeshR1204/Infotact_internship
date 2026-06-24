import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Dummy view layouts to prevent compilation crashes before full page files are committed
const MockLogin = () => <div className="p-8 font-semibold text-gray-700">🔐 Authentication View Portal</div>;
const MockAdminDash = () => <div className="p-8 font-semibold text-gray-700">📊 Executive Metrics Dashboard (Admin/HR Only)</div>;
const MockEmpDash = () => <div className="p-8 font-semibold text-gray-700">👤 Personal Work Profile & Pay Slips (Employee)</div>;
const MockUnauthorized = () => <div className="p-8 font-semibold text-red-600">⚠️ Access Denied: Insufficient Clearances.</div>;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Structural Components */}
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Path */}
        <Route path="/login" element={<MockLogin />} />
        <Route path="/unauthorized" element={<MockUnauthorized />} />

        {/* Protected Operational Application Framework */}
        <Route path="/admin" element={<DashboardLayout><MockAdminDash /></DashboardLayout>} />
        <Route path="/employee" element={<DashboardLayout><MockEmpDash /></DashboardLayout>} />

        {/* Catch All Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

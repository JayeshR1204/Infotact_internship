import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard'; // <-- Import real Employee workspace page
import ProtectedRoute from './components/ProtectedRoute';

const MockUnauthorized = () => <div className="p-8 font-semibold text-rose-600 p-8 bg-white rounded-xl shadow-xs border border-slate-200">⚠️ Access Denied: Insufficient Clearances.</div>;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
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
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<MockUnauthorized />} />

        {/* Protected Dashboard Applications */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['Admin', 'HR Manager']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <DashboardLayout><EmployeeDashboard /></DashboardLayout> {/* <-- Replace mock component placeholder here */}
            </ProtectedRoute>
          } 
        />

        {/* Catch All Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

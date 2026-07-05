import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// ─── Lazy-loaded pages for code splitting ────────────────────────────────────
const Login           = lazy(() => import('./pages/Login'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));

// ─── Page loading fallback ────────────────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[200px] gap-3 text-slate-400">
    <Loader2 className="animate-spin text-teal-500" size={24} />
    <span className="text-sm font-medium">Loading...</span>
  </div>
);

// ─── Unauthorized page ────────────────────────────────────────────────────────
const UnauthorizedPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="text-center space-y-4 p-8 bg-white rounded-2xl shadow-xl max-w-sm w-full">
      <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center">
        <span className="text-3xl">🔒</span>
      </div>
      <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
      <p className="text-sm text-slate-500">
        You do not have permission to view this resource.
      </p>
      <a
        href="/login"
        className="block w-full py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all"
      >
        Back to Login
      </a>
    </div>
  </div>
);

// ─── Shared Dashboard Layout (Sidebar + Navbar + Main) ───────────────────────
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen bg-slate-100 text-slate-900 overflow-hidden font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ─── Public Routes ──────────────────────────────── */}
        <Route path="/login" element={
          <Suspense fallback={<PageLoader />}><Login /></Suspense>
        } />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ─── Admin / HR Protected Routes ─────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'HR Manager']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'HR Manager']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payroll"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'HR Manager']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ─── Employee Protected Routes ────────────────────── */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <DashboardLayout><EmployeeDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/payslips"
          element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <DashboardLayout><EmployeeDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ─── Catch-All Redirect ───────────────────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Lazy-loaded components (split into isolated network chunks automatically)
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Visual Loading Fallback Screen
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Dashboard Workspace Route */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Fallback Catch-All Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}


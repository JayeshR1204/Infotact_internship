import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'Admin' | 'HR Manager' | 'Employee'>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, token, loading } = useAuth();

  // If the context is actively decoding local storage tokens, show a loading placeholder
  if (loading) {
    return (
      <div className="min-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Guard 1: Verify token persistence exists
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Guard 2: Enforce Role-Based Access Control filters
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If both security guard parameters clear, render the requested view components natively
  return <>{children}</>;
}

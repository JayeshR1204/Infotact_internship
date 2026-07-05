import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Building2, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg]     = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginSession, user, token } = useAuth();
  const navigate = useNavigate();

  // Already logged-in → redirect immediately
  if (token && user) {
    return <Navigate to={user.role === 'Employee' ? '/employee' : '/admin'} replace />;
  }

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data: {
        success: boolean;
        message?: string;
        token?: string;
        user?: {
          id: string;
          name: string;
          email: string;
          role: 'Admin' | 'HR Manager' | 'Employee';
          department: string;
          employeeId?: string;
          employeeObjectId?: string;
        };
      } = await response.json();

      if (!response.ok || !data.success || !data.token || !data.user) {
        throw new Error(data.message || 'Invalid credentials. Please try again.');
      }

      loginSession(data.token, {
        id:         data.user.id,
        name:       data.user.name,
        email:      data.user.email,
        role:       data.user.role,
        employeeId: data.user.employeeId
      });

      navigate(data.user.role === 'Employee' ? '/employee' : '/admin', { replace: true });
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-slate-900 overflow-hidden">
      {/* ─── Left Decorative Panel ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-700/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white tracking-tight">INFOTACT</p>
            <p className="text-[10px] text-teal-400 font-semibold tracking-widest uppercase">Solutions Pvt. Ltd.</p>
          </div>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
              Enterprise<br />HRMS &<br />
              <span className="text-teal-400">Payroll Suite</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Streamline workforce management, automate payroll processing, and generate audit-ready financial reports — all in one secure platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Employees Managed',   value: '500+' },
              { label: 'Payrolls Processed',  value: '12K+' },
              { label: 'Uptime Guarantee',    value: '99.9%' },
              { label: 'Data Encrypted',      value: '100%' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-black text-teal-400">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600 relative z-10">© 2026 Infotact Solutions · Powered by Intelleq Academy</p>
      </div>

      {/* ─── Right Login Panel ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 bg-white">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <p className="font-bold text-slate-900">INFOTACT HRMS</p>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to access your HRMS workspace</p>
          </div>

          {errorMsg && (
            <div className="mb-5 bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleFormSubmission}>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="you@infotact.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-12 py-3 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting
                ? <><Loader2 size={16} className="animate-spin" /> Verifying Identity...</>
                : 'Access Workspace'
              }
            </button>
          </form>

          {/* Test Credentials hint */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-1 text-xs text-slate-600 font-mono">
              <p><span className="font-bold text-teal-600">Admin:</span> admin@infotact.com · Admin@2026!</p>
              <p><span className="font-bold text-blue-600">HR Mgr:</span> priya.hr@infotact.com · Hr@2026!</p>
              <p><span className="font-bold text-slate-500">Employee:</span> arjun@infotact.com · Emp@2026!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

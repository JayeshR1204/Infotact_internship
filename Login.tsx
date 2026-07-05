import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginSession } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // Direct integration pipeline to your real authentication backend endpoints
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Test User Account",
          email,
          password,
          role: "HR Manager", // Default testing flag parameters
          department: "Operations Strategy"
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid system access token configuration.');
      }

      // Commit to global context state provider memory
      loginSession(data.token, {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        employeeId: data.user.employeeId
      });

    // Reroute based on structural clearance configurations
      if (data.user.role === 'Employee') {
        navigate('/employee');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Sign In to HRMS Console
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Enter your enterprise network identity coordinates
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center gap-3 text-rose-700 text-sm animate-pulse">
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleFormSubmission}>
          <div className="space-y-4 rounded-md shadow-xs">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                placeholder="Enterprise Corporate Email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                placeholder="Cryptographic Passphrase"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying Access Node...' : 'Access Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

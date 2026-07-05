import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserCircle, Shield, Briefcase, Calendar, CreditCard,
  Download, Loader2, FileText, TrendingUp,
  AlertCircle, Building2, Mail
} from 'lucide-react';

interface PayrollRecord {
  _id: string;
  payPeriod: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'Pending' | 'Processed' | 'Paid';
  processedAt?: string;
}

interface EmployeeProfile {
  _id: string;
  employeeId: string;
  position: string;
  salary: number;
  status: string;
  joiningDate: string;
  userId: {
    name: string;
    email: string;
    department: string;
    role: string;
  };
}

const API = 'http://localhost:5000/api';

const statusColors: Record<string, string> = {
  Paid:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  Processed: 'bg-blue-50 text-blue-700 border-blue-200',
  Pending:   'bg-amber-50 text-amber-700 border-amber-200',
};

export default function EmployeeDashboard() {
  const { token, user } = useAuth();
  const [profile, setProfile]     = useState<EmployeeProfile | null>(null);
  const [history, setHistory]     = useState<PayrollRecord[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState('');

  const fetchPersonalWorkspace = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      // Step 1: Fetch employee profile
      const empRes = await fetch(`${API}/employees/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const empData: { success: boolean; data?: EmployeeProfile; message?: string } = await empRes.json();

      if (!empData.success || !empData.data) {
        setError(empData.message || 'Could not load your profile. Please contact HR.');
        return;
      }

      setProfile(empData.data);

      // Step 2: Fetch payroll history using the employee's ObjectId
      const histRes = await fetch(`${API}/payroll/history/${empData.data._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const histData: { success: boolean; data: PayrollRecord[] } = await histRes.json();
      if (histData.success) {
        setHistory(histData.data);
      }
    } catch {
      setError('Failed to load workspace. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPersonalWorkspace();
  }, [fetchPersonalWorkspace]);

  const handleDownload = async (payrollId: string, period: string) => {
    setDownloadingId(payrollId);
    setDownloadError('');
    try {
      const res = await fetch(`${API}/payroll/download/${payrollId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const err: { message?: string } = await res.json();
        throw new Error(err.message || 'Download failed.');
      }

      // Server returns actual PDF binary
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payslip_${profile?.employeeId}_${period}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError((err as Error).message);
    } finally {
      setDownloadingId(null);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'U';

  const totalEarned = history.reduce((acc, r) => acc + r.netPay, 0);
  const lastPayroll = history[0];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Loader2 className="animate-spin text-teal-600" size={32} />
          <p className="text-sm font-medium text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="mx-auto text-rose-400" size={40} />
          <h2 className="font-bold text-rose-700">Unable to load workspace</h2>
          <p className="text-sm text-rose-600">{error}</p>
          <button
            onClick={fetchPersonalWorkspace}
            className="mt-2 px-4 py-2 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      {/* ─── Page Header ───────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Workspace</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Your personal portal for profile details, compensation, and payslips.
        </p>
      </div>

      {/* ─── Quick Stats Strip ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Current Salary',
            value: `₹${(profile?.salary || 0).toLocaleString('en-IN')}`,
            icon: <CreditCard size={18} />,
            color: 'text-teal-600 bg-teal-50'
          },
          {
            label: 'Total Earned (All Time)',
            value: `₹${totalEarned.toLocaleString('en-IN')}`,
            icon: <TrendingUp size={18} />,
            color: 'text-blue-600 bg-blue-50'
          },
          {
            label: 'Payslips Generated',
            value: history.length.toString(),
            icon: <FileText size={18} />,
            color: 'text-violet-600 bg-violet-50'
          }
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium truncate">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900 tracking-tight truncate">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Main Content Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-teal-900 p-6 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-white font-bold text-xl border-2 border-white/20 shadow-xl">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{user?.name}</h2>
              <p className="text-xs text-teal-300 font-semibold mt-0.5">{profile?.position}</p>
            </div>
            <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
              profile?.status === 'Active'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {profile?.status || 'Active'}
            </span>
          </div>

          {/* Details */}
          <div className="p-5 space-y-0 divide-y divide-slate-50">
            {[
              { icon: <Shield size={15} />,     label: 'Employee ID',   value: profile?.employeeId },
              { icon: <Building2 size={15} />,  label: 'Department',    value: profile?.userId?.department },
              { icon: <Briefcase size={15} />,  label: 'Position',      value: profile?.position },
              { icon: <Mail size={15} />,       label: 'Email',         value: user?.email },
              { icon: <Calendar size={15} />,   label: 'Joining Date',  value: profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString('en-IN') : 'N/A' },
              { icon: <UserCircle size={15} />, label: 'Access Role',   value: user?.role },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 py-3">
                <div className="text-slate-400 shrink-0">{item.icon}</div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payroll History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
              <CreditCard className="text-teal-600" size={16} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Salary Receipt Ledger</h2>
              <p className="text-xs text-slate-400">{history.length} records found</p>
            </div>
          </div>

          {downloadError && (
            <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              {downloadError}
            </div>
          )}

          {lastPayroll && (
            <div className="mx-5 mt-4 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Latest Pay Period</p>
                <p className="text-2xl font-black text-teal-700 mt-0.5">₹{lastPayroll.netPay.toLocaleString('en-IN')}</p>
                <p className="text-xs text-teal-500">{lastPayroll.payPeriod}</p>
              </div>
              <div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${statusColors[lastPayroll.status] || ''}`}>
                  {lastPayroll.status}
                </span>
              </div>
            </div>
          )}

          {history.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-3 text-slate-400">
              <FileText size={40} className="stroke-1 text-slate-300" />
              <p className="text-sm font-medium">No payslips have been generated yet.</p>
              <p className="text-xs text-slate-400">Contact HR to process your monthly payroll.</p>
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="px-5 py-3 font-semibold">Pay Period</th>
                    <th className="px-5 py-3 font-semibold">Base Salary</th>
                    <th className="px-5 py-3 font-semibold">Allowances</th>
                    <th className="px-5 py-3 font-semibold">Deductions</th>
                    <th className="px-5 py-3 font-semibold">Net Pay</th>
                    <th className="px-5 py-3 font-semibold text-center">Status</th>
                    <th className="px-5 py-3 font-semibold text-center">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map(record => (
                    <tr key={record._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900 font-mono">{record.payPeriod}</td>
                      <td className="px-5 py-4 text-slate-700">₹{record.baseSalary.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-4 text-emerald-600 font-medium">
                        +₹{record.allowances.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-rose-500 font-medium">
                        -₹{record.deductions.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-slate-900">
                        ₹{record.netPay.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${statusColors[record.status] || ''}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleDownload(record._id, record.payPeriod)}
                          disabled={downloadingId !== null}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-50 text-slate-700 hover:bg-teal-600 hover:text-white rounded-lg transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloadingId === record._id
                            ? <Loader2 className="animate-spin" size={12} />
                            : <Download size={12} />
                          }
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import {
  Users, DollarSign, Briefcase, TrendingUp,
  PlusCircle, CheckCircle2, AlertCircle, X,
  Search, Filter, MoreHorizontal, UserPlus,
  CalendarDays, Loader2, RefreshCw
} from 'lucide-react';

interface EmployeeData {
  _id: string;
  employeeId: string;
  position: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  joiningDate: string;
  userId: {
    name: string;
    email: string;
    department: string;
    role: string;
  };
}

interface ActionMessage {
  type: 'success' | 'error';
  text: string;
}

const API = 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { token } = useAuth();

  // ─── State ────────────────────────────────────────────────────
  const [employees, setEmployees]       = useState<EmployeeData[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'On Leave' | 'Terminated'>('All');
  const [actionMessage, setActionMessage] = useState<ActionMessage | null>(null);

  // Payroll form state
  const [selectedEmp, setSelectedEmp]   = useState('');
  const [allowances, setAllowances]     = useState('0');
  const [deductions, setDeductions]     = useState('0');
  const [payPeriod, setPayPeriod]       = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [payrollSubmitting, setPayrollSubmitting] = useState(false);

  // Add Employee modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '', email: '', password: '', department: '',
    employeeId: '', position: '', salary: ''
  });
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

  // ─── Fetch employees ──────────────────────────────────────────
  const fetchEmployees = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(`${API}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data: { success: boolean; data: EmployeeData[] } = await res.json();
      if (data.success) setEmployees(data.data);
    } catch {
      // silently fail on refresh
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ─── Payroll Calculation ──────────────────────────────────────
  const executePayrollCalculation = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null);
    if (!selectedEmp) {
      setActionMessage({ type: 'error', text: 'Please select an employee.' });
      return;
    }
    setPayrollSubmitting(true);
    try {
      const res = await fetch(`${API}/payroll/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          employeeId: selectedEmp,
          payPeriod,
          allowances: parseFloat(allowances),
          deductions: parseFloat(deductions)
        })
      });
      const result: { success: boolean; message: string } = await res.json();
      if (res.ok && result.success) {
        setActionMessage({ type: 'success', text: `Payroll for period ${payPeriod} processed successfully.` });
        setAllowances('0');
        setDeductions('0');
        setSelectedEmp('');
      } else {
        throw new Error(result.message || 'Payroll processing failed.');
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setPayrollSubmitting(false);
    }
  };

  // ─── Add Employee ─────────────────────────────────────────────
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSubmitting(true);
    try {
      const res = await fetch(`${API}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: addForm.name, email: addForm.email, password: addForm.password,
          department: addForm.department, employeeId: addForm.employeeId,
          position: addForm.position, salary: parseFloat(addForm.salary)
        })
      });
      const data: { success: boolean; message: string } = await res.json();
      if (res.ok && data.success) {
        setShowAddModal(false);
        setAddForm({ name: '', email: '', password: '', department: '', employeeId: '', position: '', salary: '' });
        fetchEmployees(true);
        setActionMessage({ type: 'success', text: 'New employee account created successfully.' });
      } else {
        throw new Error(data.message || 'Failed to create employee.');
      }
    } catch (err) {
      setAddError((err as Error).message);
    } finally {
      setAddSubmitting(false);
    }
  };

  // ─── Filtered list ────────────────────────────────────────────
  const filteredEmployees = employees.filter(emp => {
    const matchSearch =
      emp.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || emp.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ─── KPI Metrics ─────────────────────────────────────────────
  const activeCount   = employees.filter(e => e.status === 'Active').length;
  const totalPayroll  = employees.reduce((acc, e) => acc + e.salary, 0);
  const avgSalary     = employees.length > 0 ? Math.round(totalPayroll / employees.length) : 0;
  const deptCount     = new Set(employees.map(e => e.userId?.department).filter(Boolean)).size;

  const statusColors: Record<string, string> = {
    Active:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'On Leave': 'bg-amber-50 text-amber-700 border border-amber-200',
    Terminated: 'bg-rose-50 text-rose-700 border border-rose-200'
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="skeleton h-3 w-24 mb-3" />
              <div className="skeleton h-8 w-16 mb-2" />
              <div className="skeleton h-2 w-32" />
            </div>
          ))}
        </div>
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ─── Page Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Executive Console</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor workforce metrics and manage payroll operations.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchEmployees(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm shadow-teal-500/20"
          >
            <UserPlus size={16} />
            Add Employee
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Active Workforce"
          value={activeCount}
          icon={<Users size={20} />}
          description={`${employees.length} total registered`}
          colorClass="bg-teal-600"
          trend={`+${employees.filter(e => {
            const j = new Date(e.joiningDate);
            const now = new Date();
            return (now.getFullYear() - j.getFullYear()) * 12 + now.getMonth() - j.getMonth() < 1;
          }).length} this month`}
        />
        <StatCard
          title="Monthly Payroll"
          value={`₹${totalPayroll.toLocaleString('en-IN')}`}
          icon={<DollarSign size={20} />}
          description="Gross salary commitment"
          colorClass="bg-blue-600"
          trend="All departments"
        />
        <StatCard
          title="Average Salary"
          value={`₹${avgSalary.toLocaleString('en-IN')}`}
          icon={<TrendingUp size={20} />}
          description="Mean compensation"
          colorClass="bg-violet-600"
          trend="Across all positions"
        />
        <StatCard
          title="Departments"
          value={deptCount}
          icon={<Briefcase size={20} />}
          description="Active divisions"
          colorClass="bg-orange-500"
          trend={`${employees.length} headcount`}
        />
      </div>

      {/* ─── Main Grid: Directory + Payroll Engine ─────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* Employee Directory */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-bold text-slate-900">Workforce Directory</h2>
            <div className="flex gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search employees..."
                  className="pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-48 text-slate-700"
                />
              </div>
              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="pl-7 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Terminated</option>
                </select>
              </div>
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users size={40} className="mx-auto mb-3 stroke-1 text-slate-300" />
              <p className="text-sm font-medium">No employees found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="px-5 py-3 font-semibold">Employee</th>
                    <th className="px-5 py-3 font-semibold">Department / Role</th>
                    <th className="px-5 py-3 font-semibold">Salary</th>
                    <th className="px-5 py-3 font-semibold text-center">Status</th>
                    <th className="px-5 py-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {emp.userId?.name?.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{emp.userId?.name || 'N/A'}</div>
                            <div className="text-xs text-slate-400 font-mono">{emp.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800 text-sm">{emp.position}</div>
                        <div className="text-xs text-slate-400">{emp.userId?.department}</div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        ₹{emp.salary.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusColors[emp.status] || ''}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-400">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        </div>

        {/* Payroll Engine */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
              <DollarSign className="text-teal-600" size={17} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Payroll Engine</h2>
              <p className="text-xs text-slate-400">Process monthly disbursements</p>
            </div>
          </div>

          {actionMessage && (
            <div className={`p-3.5 rounded-xl flex items-start gap-2.5 text-sm border ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {actionMessage.type === 'success'
                ? <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                : <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              }
              <span className="text-xs">{actionMessage.text}</span>
            </div>
          )}

          <form onSubmit={executePayrollCalculation} className="space-y-4">
            {/* Employee Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Target Employee
              </label>
              <select
                value={selectedEmp}
                onChange={e => setSelectedEmp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">— Select Employee —</option>
                {employees.filter(e => e.status === 'Active').map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.userId?.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Pay Period */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays size={12} /> Pay Period
              </label>
              <input
                type="month"
                value={payPeriod}
                onChange={e => setPayPeriod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Allowances + Deductions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Allowances (₹)</label>
                <input
                  type="number" min="0" step="100" value={allowances}
                  onChange={e => setAllowances(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deductions (₹)</label>
                <input
                  type="number" min="0" step="100" value={deductions}
                  onChange={e => setDeductions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Net Pay Preview */}
            {selectedEmp && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                <p className="text-xs text-teal-600 font-semibold">Calculated Net Pay</p>
                <p className="text-xl font-black text-teal-700 mt-0.5">
                  ₹{(
                    (employees.find(e => e._id === selectedEmp)?.salary || 0)
                    + parseFloat(allowances || '0')
                    - parseFloat(deductions || '0')
                  ).toLocaleString('en-IN')}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={payrollSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-sm rounded-xl text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {payrollSubmitting
                ? <><Loader2 size={16} className="animate-spin" /> Processing...</>
                : <><PlusCircle size={16} /> Process Payroll</>
              }
            </button>
          </form>
        </div>
      </div>

      {/* ─── Add Employee Modal ────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900">Add New Employee</h3>
                <p className="text-xs text-slate-400 mt-0.5">Creates a user account and employee profile</p>
              </div>
              <button
                onClick={() => { setShowAddModal(false); setAddError(''); }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {addError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex gap-2 items-start">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  {addError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name *</label>
                  <input
                    required value={addForm.name}
                    onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Rahul Kumar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email *</label>
                  <input
                    required type="email" value={addForm.email}
                    onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="rahul@infotact.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password *</label>
                  <input
                    required type="password" value={addForm.password}
                    onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min 8 characters"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Employee ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee ID *</label>
                  <input
                    required value={addForm.employeeId}
                    onChange={e => setAddForm(p => ({ ...p, employeeId: e.target.value }))}
                    placeholder="EMP-2026-006"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</label>
                  <input
                    value={addForm.department}
                    onChange={e => setAddForm(p => ({ ...p, department: e.target.value }))}
                    placeholder="Engineering"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Position */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Position *</label>
                  <input
                    required value={addForm.position}
                    onChange={e => setAddForm(p => ({ ...p, position: e.target.value }))}
                    placeholder="Software Engineer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Salary */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base Salary (₹) *</label>
                  <input
                    required type="number" min="0" step="1000" value={addForm.salary}
                    onChange={e => setAddForm(p => ({ ...p, salary: e.target.value }))}
                    placeholder="75000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setAddError(''); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all disabled:opacity-60"
                >
                  {addSubmitting
                    ? <><Loader2 size={14} className="animate-spin" /> Creating...</>
                    : <><UserPlus size={14} /> Create Account</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { downloadEmployeePayslip } from '../utils/downloadHelper';

// Component slice markup logic within row loops
export function PayslipRowAction({ id }: { id: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const triggerDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadEmployeePayslip({
        employeeId: id,
        payPeriod: '2026-Q2',
        authToken: 'session_mock_token_jwt_hash'
      });
    } catch (err: any) {
      alert(err.message || 'Download dropped.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={triggerDownload}
      disabled={isDownloading}
      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
    >
      {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
    </button>
  );
}


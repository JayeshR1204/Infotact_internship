import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; errorLog: string; }

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, errorLog: '' };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorLog: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Forward to remote stack log aggregators (e.g. Sentry, LogRocket, DataDog clusters)
    console.error("Critical Client Execution Interrupt Event:", error, errorInfo);
  }

  private handleAppReset = () => {
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white max-w-md p-8 rounded-2xl border border-slate-100 shadow-xl space-y-5 animate-fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 text-red-600 rounded-xl">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">An operational anomaly occurred</h2>
              <p className="text-xs text-slate-400 font-mono bg-slate-50 p-3 rounded-lg overflow-x-auto text-left max-h-24">
                {this.state.errorLog || 'Runtime memory boundary violation.'}
              </p>
            </div>
            <button 
              onClick={this.handleAppReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reset Application Session
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

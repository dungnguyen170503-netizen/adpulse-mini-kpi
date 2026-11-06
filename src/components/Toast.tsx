import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'warning' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200',
    warning: 'bg-amber-950/90 border-amber-500/40 text-amber-200',
    error: 'bg-rose-950/90 border-rose-500/40 text-rose-200',
    info: 'bg-indigo-950/90 border-indigo-500/40 text-indigo-200'
  }[type];

  const Icon = {
    success: CheckCircle2,
    warning: AlertCircle,
    error: AlertCircle,
    info: Info
  }[type];

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in max-w-md">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 ${bgStyles}`}>
        <div className="flex items-center gap-2.5">
          <Icon className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-medium leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-current transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toasts, dismissToast } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center w-full max-w-xs px-4 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="animate-toast-in pointer-events-auto w-full flex items-center gap-3 bg-[#0f2d1a] border border-emerald-500/50 text-white px-4 py-3 rounded-2xl shadow-xl shadow-black/40"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="flex-1 text-xs font-semibold text-emerald-100 truncate">
            {toast.message}
          </p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-emerald-500 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

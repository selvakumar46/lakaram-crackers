import React from 'react';
import { ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function SavingsBar() {
  const { totalItemCount, festiveSavings, subtotal, viewMode, setIsCartOpen } = useCart();

  // Only show in catalog mode when cart has items
  if (viewMode !== 'catalog' || totalItemCount === 0) return null;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-[4.5rem] left-4 z-40 flex items-center gap-2 bg-emerald-950/95 border border-emerald-500/50 text-white rounded-2xl px-3.5 py-2 shadow-xl shadow-black/40 hover:border-emerald-400 transition-all active:scale-95"
      title="View your cart"
    >
      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
      <div className="text-left leading-tight">
        <p className="text-[11px] font-bold text-white">
          {totalItemCount} item{totalItemCount > 1 ? 's' : ''} · ₹{subtotal.toFixed(0)}
        </p>
        <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
          <Zap className="w-2.5 h-2.5" />
          You save ₹{festiveSavings.toFixed(0)} (80% off)
        </p>
      </div>
    </button>
  );
}

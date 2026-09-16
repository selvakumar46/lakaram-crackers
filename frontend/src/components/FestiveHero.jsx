import React from 'react';
import { Sparkles, ShieldCheck, Truck, Gift, FileSpreadsheet, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';

export default function FestiveHero() {
  const { setViewMode } = useCart();

  const triggerCelebration = () => {
    // Left fireworks cannon
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#f59e0b']
    });
    // Right fireworks cannon
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#f59e0b']
    });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#151928] via-[#0f121e] to-[#0c0e17] py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Decorative ambient background lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Diwali 2026 Festival Booking Open</span>
            <span className="bg-red-600 text-white text-[10px] px-2 py-0.2 rounded-full font-bold">75% OFF</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight font-serif">
            Celebrate with Genuine <br />
            <span className="gold-gradient-text">Sivakasi Fireworks</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Order premium certified green crackers directly from Sivakasi manufacturing hubs. Transparent wholesale rates, flat festival discounts, and safe doorstep delivery.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={() => setViewMode('quick-order')}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-red-600/30 text-sm transition-all transform hover:-translate-y-0.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Open Bulk Price List Order Form</span>
            </button>

            <button
              onClick={triggerCelebration}
              className="flex items-center gap-2 bg-[#1b2033] hover:bg-[#252b45] text-amber-300 border border-amber-500/30 font-semibold px-5 py-3 rounded-xl text-sm transition-all shadow-md"
            >
              <PartyPopper className="w-4 h-4 text-amber-400" />
              <span>Sparkle Fireworks!</span>
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
            <div className="festive-glass p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Flat 75% Discount</h4>
              </div>
              <p className="text-[11px] text-slate-400">Direct factory prices without middlemen markups.</p>
            </div>

            <div className="festive-glass p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">CSIR Green Certified</h4>
              </div>
              <p className="text-[11px] text-slate-400">30% reduced particulate matter and safe sound levels.</p>
            </div>

            <div className="festive-glass p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Truck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Safe Express Transport</h4>
              </div>
              <p className="text-[11px] text-slate-400">Doorstep delivery across major states and transport hubs.</p>
            </div>

            <div className="festive-glass p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <Gift className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Free Gift Combos</h4>
              </div>
              <p className="text-[11px] text-slate-400">Bonus sparklers & free packing on orders above ₹3,000.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

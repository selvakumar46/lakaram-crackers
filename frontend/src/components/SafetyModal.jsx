import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  X, 
  Volume2, 
  HeartHandshake 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function SafetyModal() {
  const { isSafetyModalOpen, setIsSafetyModalOpen } = useCart();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#121625] border border-emerald-500/30 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-[#151928] to-slate-900 p-5 flex items-center justify-between border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">
                Green Crackers & Festive Safety Guide
              </h2>
              <p className="text-xs text-emerald-300">
                CSIR-NEERI Certified Formulations & Safe Celebration Protocol
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 text-xs text-slate-300">
          {/* Green cracker info */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex gap-3.5 items-start">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm mb-1">
                What are Green Crackers?
              </h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                All crackers sold at SparkleFest are certified by CSIR-NEERI (National Environmental Engineering Research Institute). They are formulated without banned chemicals like Barium Nitrate, produce 30-35% less particulate matter (PM 2.5 & PM 10), and release water vapor upon burning to suppress dust.
              </p>
            </div>
          </div>

          {/* Do's and Don'ts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Do's */}
            <div className="bg-[#161a2a] p-4 rounded-2xl border border-emerald-500/20 space-y-2.5">
              <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recommended Do's</span>
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Light crackers only in open outdoor areas away from dry grass or structures.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Always keep two buckets of water and sand nearby for extinguishing used sparklers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Wear snug cotton clothes and footwear while bursting fireworks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Supervise young children closely and encourage kid-safe novelties.</span>
                </li>
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-[#161a2a] p-4 rounded-2xl border border-red-500/20 space-y-2.5">
              <h4 className="font-bold text-red-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <XCircle className="w-4 h-4" />
                <span>Strict Don'ts</span>
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Never ignite fireworks inside bottles, metal cans, or enclosed containers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Never attempt to re-ignite crackers that failed to burst the first time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Never ignite aerial repeaters or rockets near electric poles or trees.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Avoid bursting high-decibel crackers near hospitals, infants, or pet animals.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sound & Pet Care notice */}
          <div className="bg-[#181d30] p-3.5 rounded-xl border border-slate-700 flex items-center gap-3">
            <HeartHandshake className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-[11px] text-slate-300">
              <strong>Pet Friendly Tip:</strong> Keep pets indoors in a quiet room with windows closed and television or soothing music on during night celebrations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0e111d] border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
          >
            I Understand & Commit to Safety
          </button>
        </div>
      </div>
    </div>
  );
}

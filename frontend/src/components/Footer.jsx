import React from 'react';
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Footer() {
  const { setIsSafetyModalOpen, setIsAdminOpen, setViewMode } = useCart();

  return (
    <footer className="bg-[#090b12] border-t border-slate-800/80 text-slate-400 text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg crimson-gradient-bg flex items-center justify-center border border-amber-400/30">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-lg font-bold text-white font-serif">
                Lakaram Crackers Sivakasi
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Direct manufacturing outlet delivering 100% genuine Sivakasi fireworks at factory wholesale rates via www.lakaramcreckers.com. Certified Green Crackers with nationwide transport network.
            </p>
            <div className="flex items-center gap-2 pt-1 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>PESO & CSIR-NEERI Approved</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button 
                  onClick={() => { setViewMode('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Visual Product Catalog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setViewMode('quick-order'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Sivakasi Bulk Price List Order Form
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Green Crackers & Safety Rules
                </button>
              </li>
              <li>
                <span className="text-slate-500">Corporate & Wedding Fireworks Orders</span>
              </li>
              <li className="pt-1 border-t border-slate-800/80">
                <button 
                  onClick={() => setIsAdminOpen(true)}
                  className="text-amber-400/80 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>🔐 Store Manager Admin Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Transport & Dispatch States */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Transport Hubs</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Dispatched through certified non-flammable container transport across:
            </p>
            <div className="flex flex-wrap gap-1 text-[10px]">
              {['Tamil Nadu', 'Bangalore / Karnataka', 'Hyderabad / Telangana', 'Andhra Pradesh', 'Kerala', 'Mumbai / Maharashtra', 'Delhi NCR'].map(st => (
                <span key={st} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                  {st}
                </span>
              ))}
            </div>
          </div>

          {/* Contact and Sivakasi Address */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Factory Outlet</h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>45/2B, Sattur Road, Fireworks Industrial Zone, Sivakasi - 626123, Tamil Nadu, India.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="tel:+919442188990" className="hover:text-white">+91 94421 88990 / +91 98421 00123</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Dispatch Office: 9:00 AM – 9:00 PM (Mon-Sun)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="border-t border-slate-800/80 pt-6 text-[10px] text-slate-500 space-y-2">
          <p className="leading-relaxed">
            <strong>Legal & Safety Notice:</strong> Fireworks are sold strictly in accordance with the Explosives Act of India and PESO guidelines. We only manufacture and deliver CSIR-NEERI certified Green Crackers that comply with the Hon'ble Supreme Court of India standards on decibel limits and chemical restrictions. Orders are dispatched via licensed logistics partners.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-2 text-slate-500">
            <span>© 2026 Lakaram Crackers (www.lakaramcreckers.com). All Rights Reserved.</span>
            <span className="mt-1 sm:mt-0">Powered by ReactJS & Java Spring Boot API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

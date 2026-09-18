import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  FileSpreadsheet, 
  LayoutGrid, 
  Search, 
  PhoneCall, 
  Server,
  Zap,
  X,
  Settings
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { checkBackendHealth } from '../services/api';

export default function Navbar() {
  const { 
    totalItemCount, 
    subtotal, 
    setIsCartOpen, 
    setIsSafetyModalOpen,
    setIsAdminOpen,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery
  } = useCart();

  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    checkBackendHealth().then(status => setBackendConnected(status));
    const interval = setInterval(() => {
      checkBackendHealth().then(status => setBackendConnected(status));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Festive top notification banner */}
      <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-amber-100 text-xs py-1.5 px-4 font-medium flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <p className="truncate">
            ✨ <strong>Diwali Mega Discount:</strong> Flat 80% Off Directly from Sivakasi Factory • 100% Eco-Friendly Green Crackers
          </p>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full">
            <Server className={`w-3 h-3 ${backendConnected ? 'text-emerald-400' : 'text-amber-300'}`} />
            <span className={backendConnected ? 'text-emerald-300' : 'text-amber-200'}>
              {backendConnected ? 'Java 17/25 API Active' : 'Standalone / Local DB'}
            </span>
          </div>
          <a href="tel:+919442188990" className="flex items-center gap-1 hover:text-white transition-colors">
            <PhoneCall className="w-3 h-3 text-amber-300" />
            +91 94421 88990
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#0f121e]/95 backdrop-blur-md border-b border-amber-500/20 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl crimson-gradient-bg flex items-center justify-center shadow-lg shadow-red-500/25 border border-amber-400/30">
              <Sparkles className="w-6 h-6 text-amber-300 animate-sparkle" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight gold-gradient-text font-serif">
                  Lakaram Crackers
                </span>
                <span className="text-xs bg-red-600/80 text-white font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                  Sivakasi
                </span>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sparklers, chakkars, pots, sky shots..."
                className="w-full bg-[#161a29] border border-slate-700/80 rounded-full py-2 pl-10 pr-9 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action buttons & mode toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle (Visual Catalog vs Sivakasi Order Sheet) */}
            <div className="flex bg-[#161a29] p-1 rounded-xl border border-slate-800 shadow-inner">
              <button
                onClick={() => setViewMode('catalog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'catalog'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Visual Card Catalog"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Catalog</span>
              </button>

              <button
                onClick={() => setViewMode('quick-order')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'quick-order'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Sivakasi Price List Quick Order Sheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Quick Order Sheet</span>
              </button>
            </div>

            {/* Safety Guidelines Button */}
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safety Guide</span>
            </button>

            {/* Admin Console Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/40 transition-colors"
              title="Store Admin Console (Add Products, Stock, Orders)"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 sm:px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Cart</span>
                <span className="text-xs font-extrabold">₹{subtotal.toFixed(0)}</span>
              </div>
              {totalItemCount > 0 && (
                <span className="bg-red-600 text-white text-[11px] font-black rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center shadow-md animate-bounce">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-2.5 sm:hidden">
          <div className="relative w-full">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sparklers, pots, rockets..."
              className="w-full bg-[#161a29] border border-slate-700/80 rounded-lg py-2 pl-9 pr-8 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

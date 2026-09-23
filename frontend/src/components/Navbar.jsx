import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  FileSpreadsheet, 
  LayoutGrid, 
  Search, 
  PhoneCall, 
  Zap,
  X,
  Settings
} from 'lucide-react';
import { useCart } from '../context/CartContext';

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

  return (
    <header className="sticky top-0 z-40 w-full overflow-hidden">
      {/* Festive top notification banner */}
      <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-amber-100 text-xs py-1.5 px-3 sm:px-4 font-medium flex items-center justify-between shadow-inner overflow-hidden">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap min-w-0">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <p className="text-[11px] sm:text-xs truncate min-w-0">
            <span className="sm:hidden">✨ <strong>80% Off</strong> – Sivakasi Factory Direct</span>
            <span className="hidden sm:inline">✨ <strong>Diwali Mega Discount:</strong> Flat 80% Off Directly from Sivakasi Factory • 100% Eco-Friendly Green Crackers</span>
          </p>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-semibold flex-shrink-0 ml-2">
          <a href="tel:+918973015070" className="flex items-center gap-1 hover:text-white transition-colors">
            <PhoneCall className="w-3 h-3 text-amber-300" />
            +91 89730 15070
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#0f121e]/95 backdrop-blur-md border-b border-amber-500/20 px-2 sm:px-6 lg:px-8 py-2 sm:py-3.5 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">

          {/* Logo & Brand — shrinks gracefully on small screens */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 min-w-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl crimson-gradient-bg flex items-center justify-center shadow-lg shadow-red-500/25 border border-amber-400/30 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-amber-300 animate-sparkle" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* On xs: show "Lakaram", on sm+: show full "Lakaram Crackers" */}
                <span className="font-bold tracking-tight gold-gradient-text font-serif whitespace-nowrap text-sm sm:text-xl leading-tight">
                  <span className="sm:hidden">Lakaram</span>
                  <span className="hidden sm:inline">Lakaram Crackers</span>
                </span>
                {/* Sivakasi badge – hide on xs to save space */}
                <span className="hidden xs:inline-block sm:inline-block text-[9px] sm:text-xs bg-red-600/80 text-white font-black px-1 sm:px-1.5 py-0.5 rounded tracking-wider uppercase flex-shrink-0">
                  Sivakasi
                </span>
              </div>
            </div>
          </div>

          {/* Search bar — only on sm+ */}
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

          {/* Action buttons — always visible, icon-only on mobile */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">

            {/* View Mode Toggle — icons only on mobile */}
            <div className="flex bg-[#161a29] p-0.5 rounded-xl border border-slate-800 shadow-inner">
              <button
                onClick={() => setViewMode('catalog')}
                className={`flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'catalog'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Visual Card Catalog"
              >
                <LayoutGrid className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden md:inline ml-1">Catalog</span>
              </button>

              <button
                onClick={() => setViewMode('quick-order')}
                className={`flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'quick-order'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Sivakasi Price List Quick Order Sheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden md:inline ml-1">Quick Order</span>
              </button>
            </div>

            {/* Safety Guidelines Button — large screens only */}
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safety</span>
            </button>

            {/* Admin Console Button — icon-only on mobile */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-amber-300 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/40 transition-colors flex items-center gap-1"
              title="Store Admin Console"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="hidden sm:inline text-xs font-semibold">Admin</span>
            </button>

            {/* Cart Trigger — icon + count on mobile, full label on sm+ */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex-shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Cart</span>
                <span className="text-xs font-extrabold">₹{subtotal.toFixed(0)}</span>
              </div>
              {totalItemCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-md animate-bounce flex-shrink-0">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar — shown below the icon row */}
        <div className="mt-2 sm:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sparklers, pots, rockets..."
              className="w-full bg-[#161a29] border border-slate-700/80 rounded-lg py-1.5 pl-8 pr-8 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400"
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

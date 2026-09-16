import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Trash2, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../services/api';
import { CATEGORIES } from '../data/defaultProducts';

export default function QuickOrderSheet() {
  const { 
    cart, 
    setItemQuantity, 
    clearCart, 
    subtotal, 
    actualTotal, 
    festiveSavings, 
    totalItemCount,
    setIsCartOpen,
    setIsCheckoutOpen,
    isMinOrderMet,
    minOrderThreshold
  } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [sheetSearch, setSheetSearch] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  useEffect(() => {
    fetchProducts().then(res => setAllProducts(res.data));
  }, []);

  // Filter products by tab and sheetSearch
  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = activeCategoryTab === 'all' || p.category === activeCategoryTab;
    const matchesSearch = !sheetSearch || 
      p.name.toLowerCase().includes(sheetSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(sheetSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(sheetSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group products by category for neat Sivakasi price sheet sections
  const groupedProducts = filteredProducts.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const getCategoryTitle = (catId) => {
    const found = CATEGORIES.find(c => c.id === catId);
    return found ? found.name : catId.toUpperCase();
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32">
      {/* Title & Info Banner */}
      <div className="bg-gradient-to-r from-[#181d30] via-[#121624] to-[#181d30] rounded-2xl p-4 sm:p-6 border border-amber-500/20 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-red-600/20 text-red-400">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                Sivakasi Direct Bulk Price List & Order Form
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Type or adjust quantities below. Your total amount and festive savings are calculated live automatically!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-slate-700/60 text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Standard Discount</span>
              <span className="text-sm font-black text-amber-400">FLAT 75% OFF</span>
            </div>
            {totalItemCount > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-950/30 px-3 py-2 rounded-xl border border-red-500/20 transition-colors"
                title="Reset all quantities"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Search & Category Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={sheetSearch}
              onChange={(e) => setSheetSearch(e.target.value)}
              placeholder="Quick filter price sheet..."
              className="w-full bg-[#0d101a] border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategoryTab === 'all'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-[#0d101a] text-slate-400 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryTab(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategoryTab === cat.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-[#0d101a] text-slate-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grouped Table */}
      <div className="space-y-6">
        {Object.keys(groupedProducts).length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No items match your filter criteria.
          </div>
        ) : (
          Object.entries(groupedProducts).map(([catKey, items]) => (
            <div key={catKey} className="bg-[#121522] rounded-2xl border border-slate-800/90 overflow-hidden shadow-lg">
              {/* Category Header */}
              <div className="bg-[#171b2d] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{getCategoryTitle(catKey)}</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {items.length} Varieties
                </span>
              </div>

              {/* Table Header */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#0e111d] text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 w-16">Code</th>
                      <th className="py-2.5 px-3">Product Name & Specifications</th>
                      <th className="py-2.5 px-3 w-28 text-center">Pack Size</th>
                      <th className="py-2.5 px-3 w-24 text-right">Actual Rate</th>
                      <th className="py-2.5 px-3 w-24 text-right">75% Offer</th>
                      <th className="py-2.5 px-3 w-36 text-center">Quantity</th>
                      <th className="py-2.5 px-3 w-28 text-right font-bold">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {items.map((prod) => {
                      const qty = cart[prod.id] ? cart[prod.id].quantity : 0;
                      const lineTotal = qty * prod.discountedPrice;

                      return (
                        <tr 
                          key={prod.id} 
                          className={`transition-colors ${
                            qty > 0 ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-slate-800/30'
                          }`}
                        >
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-400 font-bold">
                            {prod.id}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-100 flex items-center gap-1.5 flex-wrap">
                              <span>{prod.name}</span>
                              {prod.kidSafe && (
                                <span className="bg-blue-950/60 text-blue-400 text-[9px] px-1.5 py-0.2 rounded border border-blue-500/30">
                                  Kid-Safe
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-normal">
                                ({prod.soundLevel})
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center text-slate-300 text-xs whitespace-nowrap">
                            {prod.packSize}
                          </td>
                          <td className="py-3 px-3 text-right text-slate-400 line-through text-xs">
                            ₹{prod.originalPrice.toFixed(0)}
                          </td>
                          <td className="py-3 px-3 text-right font-black text-amber-400">
                            ₹{prod.discountedPrice.toFixed(0)}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setItemQuantity(prod, qty - 1)}
                                className="w-7 h-7 rounded-lg bg-[#181c2d] hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs border border-slate-700"
                                disabled={qty === 0}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={qty === 0 ? '' : qty}
                                placeholder="0"
                                onChange={(e) => setItemQuantity(prod, e.target.value)}
                                className="w-12 h-7 bg-[#0d0f19] border border-slate-700 rounded-lg text-center font-bold text-xs text-white focus:outline-none focus:border-amber-400"
                              />
                              <button
                                onClick={() => setItemQuantity(prod, qty + 1)}
                                className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center transition-colors text-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-black text-white">
                            {lineTotal > 0 ? `₹${lineTotal.toFixed(0)}` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sivakasi Fixed Bottom Live Calculation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0e111d]/95 backdrop-blur-md border-t border-amber-500/30 p-3 sm:p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Summary stats */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-8">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Items</span>
              <span className="text-sm sm:text-base font-extrabold text-white">
                {totalItemCount} Units
              </span>
            </div>

            <div className="hidden md:block">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Actual Rate</span>
              <span className="text-sm font-semibold text-slate-400 line-through">
                ₹{actualTotal.toFixed(0)}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-emerald-400 block uppercase font-semibold">Festive Savings (75%)</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-400">
                ₹{festiveSavings.toFixed(0)}
              </span>
            </div>

            <div className="border-l border-slate-700 pl-4">
              <span className="text-[10px] text-amber-400 block uppercase font-extrabold">Net Total</span>
              <span className="text-lg sm:text-xl font-black text-amber-300">
                ₹{subtotal.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b2034] hover:bg-[#252b45] text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>View Cart ({totalItemCount})</span>
            </button>

            <button
              onClick={() => {
                if (totalItemCount === 0) {
                  alert('Please select at least 1 item before checkout!');
                  return;
                }
                setIsCheckoutOpen(true);
              }}
              disabled={totalItemCount === 0}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-lg ${
                totalItemCount > 0
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Instant Checkout / WhatsApp Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

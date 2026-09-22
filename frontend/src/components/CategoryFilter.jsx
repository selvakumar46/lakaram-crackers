import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../data/defaultProducts';

export default function CategoryFilter() {
  const { selectedCategory, setSelectedCategory, catalogProducts, categories: dynamicCategories } = useCart();

  const displayCategories = (dynamicCategories && dynamicCategories.length > 0) ? dynamicCategories : CATEGORIES;

  // Get count for each category
  const getCount = (catId) => {
    if (catalogProducts && catalogProducts.length > 0) {
      return catId === 'all'
        ? catalogProducts.length
        : catalogProducts.filter(p => p.category === catId).length;
    }
    const cat = displayCategories.find(c => c.id === catId);
    return cat?.itemCount ?? 0;
  };

  const selectedCat = displayCategories.find(c => c.id === selectedCategory) || displayCategories[0];
  const selectedCount = getCount(selectedCategory || 'all');

  return (
    <div className="w-full bg-[#111422] border-b border-slate-800/80 py-2.5 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dropdown wrapper */}
        <div className="relative">
          {/* Left filter icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none z-10">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Category:</span>
          </div>

          {/* The actual select element */}
          <select
            value={selectedCategory || 'all'}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="
              w-full
              appearance-none
              bg-[#181c2d]
              border border-amber-500/40
              hover:border-amber-400
              focus:border-amber-400
              focus:ring-1 focus:ring-amber-400/30
              focus:outline-none
              rounded-xl
              pl-8 sm:pl-24
              pr-10
              py-2.5
              text-sm font-semibold
              text-amber-300
              cursor-pointer
              transition-all
              shadow-sm
            "
          >
            {displayCategories.map(cat => {
              const count = getCount(cat.id);
              return (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="bg-[#181c2d] text-slate-200"
                >
                  {cat.name}{count > 0 ? ` (${count})` : ''}
                </option>
              );
            })}
          </select>

          {/* Right chevron icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Active filter chip — shown when not "all" */}
        {selectedCategory && selectedCategory !== 'all' && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-400">Filtering:</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {selectedCat?.name}
              <span className="bg-amber-500/30 text-amber-200 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {selectedCount}
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className="ml-0.5 text-amber-400 hover:text-white transition-colors leading-none"
                title="Clear filter"
              >
                ✕
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

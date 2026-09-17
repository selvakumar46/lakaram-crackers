import React from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Flame, 
  Rocket, 
  Sun, 
  Zap, 
  Bomb, 
  Package, 
  Smile,
  Layers
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../data/defaultProducts';

const ICON_MAP = {
  Sparkles,
  RotateCw,
  Flame,
  Rocket,
  Sun,
  Zap,
  Bomb,
  Package,
  Smile,
  Layers
};

export default function CategoryFilter() {
  const { selectedCategory, setSelectedCategory, catalogProducts, categories: dynamicCategories } = useCart();

  const displayCategories = (dynamicCategories && dynamicCategories.length > 0) ? dynamicCategories : CATEGORIES;

  return (
    <div className="w-full bg-[#111422] border-b border-slate-800/80 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {displayCategories.map(cat => {
          const IconComponent = ICON_MAP[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          // Count strictly from the actual records loaded from the DB
          let count = 0;
          if (catalogProducts && catalogProducts.length > 0) {
            count = cat.id === 'all' 
              ? catalogProducts.length 
              : catalogProducts.filter(p => p.category === cat.id).length;
          } else if (cat.itemCount !== undefined) {
            count = cat.itemCount;
          }

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-[#181c2d] text-slate-300 hover:text-white hover:bg-[#22273e] border border-slate-800'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected ? 'bg-black/20 text-slate-900' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

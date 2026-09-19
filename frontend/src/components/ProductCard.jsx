import React, { useState } from 'react';
import { Plus, Minus, Heart, ShieldCheck, Volume2, Star, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { cart, addToCart, wishlist, toggleWishlist } = useCart();
  const [imgError, setImgError] = useState(false);
  const cartItem = cart[product.id];
  const quantity = cartItem ? cartItem.quantity : 0;
  const isWishlisted = wishlist.includes(product.id);

  const getSoundColor = (sound) => {
    switch (sound) {
      case 'Zero Sound': return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
      case 'Low': return 'text-blue-400 bg-blue-950/60 border-blue-500/30';
      case 'Medium': return 'text-amber-400 bg-amber-950/60 border-amber-500/30';
      case 'High': return 'text-red-400 bg-red-950/60 border-red-500/30';
      default: return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="festive-glass-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1">
      {/* Image & Badges Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#121625] via-[#1a1f35] to-[#101320] flex items-center justify-center">
        {product.image && !imgError ? (
          <img 
            src={product.image} 
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-1.5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-300/80">{product.id}</span>
            <span className="text-[11px] font-bold text-slate-300 line-clamp-1">{product.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f121e] via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Discount Badge */}
        <div className="absolute top-2.5 left-2.5 bg-red-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
          <span>{product.discountPercent}% OFF</span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all ${
            isWishlisted 
              ? 'bg-red-600 text-white shadow-md shadow-red-600/40' 
              : 'bg-black/40 text-slate-300 hover:text-white hover:bg-black/60'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Feature Tags (Bottom of Image) */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px]">
          <span className={`px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1 backdrop-blur-md ${getSoundColor(product.soundLevel)}`}>
            <Volume2 className="w-2.5 h-2.5" />
            {product.soundLevel}
          </span>

          {product.greenCrackerCertified && (
            <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 backdrop-blur-md">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
              Green Cracker
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
        <div>
          {/* Header & Pack details */}
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-bold text-white text-xs sm:text-sm leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="text-[10px] sm:text-[11px] bg-slate-800 text-amber-300 font-semibold px-1.5 sm:px-2 py-0.5 rounded-md">
              {product.packSize}
            </span>
            <div className="flex items-center gap-0.5 text-amber-400 text-[10px] sm:text-xs">
              <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-300">5.0</span>
            </div>
          </div>

          <p className="hidden sm:block text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and Cart controls */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 sm:mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-lg font-black text-white">
                ₹{product.discountedPrice.toFixed(0)}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toFixed(0)}
              </span>
            </div>
            <span className="text-[9px] sm:text-[11px] text-emerald-400 font-semibold">
              Save ₹{(product.originalPrice - product.discountedPrice).toFixed(0)}
            </span>
          </div>

          {/* Add to Cart / Counter */}
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl bg-[#1e2338] hover:bg-amber-500 text-slate-200 hover:text-slate-950 font-bold text-[11px] sm:text-xs border border-amber-500/20 hover:border-transparent transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl p-0.5 sm:p-1">
              <button
                onClick={() => addToCart(product, -1)}
                className="w-7 sm:w-8 h-6 sm:h-7 flex items-center justify-center rounded-lg bg-[#161a29] text-slate-200 hover:bg-red-600 hover:text-white transition-colors"
                title="Decrease"
              >
                <Minus className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              </button>
              
              <span className="text-[11px] sm:text-xs font-black text-amber-300 px-1 sm:px-2">
                {quantity}
              </span>

              <button
                onClick={() => addToCart(product, 1)}
                className="w-7 sm:w-8 h-6 sm:h-7 flex items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
                title="Increase"
              >
                <Plus className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

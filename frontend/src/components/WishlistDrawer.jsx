import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Heart, 
  ShoppingCart,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';

function WishlistItemImage({ src, alt }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#1a1f35] to-[#101320] flex items-center justify-center flex-shrink-0 border border-slate-800">
        <Sparkles className="w-6 h-6 text-rose-400/50" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="w-16 h-16 rounded-lg object-cover bg-slate-900 flex-shrink-0"
    />
  );
}

export default function WishlistDrawer() {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    catalogProducts,
    toggleWishlist,
    addToCart
  } = useCart();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = catalogProducts.filter(p => wishlist.includes(p.id));

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10 animate-toast-in">
        <div className="w-screen max-w-md bg-[#0f121e] border-l border-rose-500/20 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#151928]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              <h2 className="text-base font-bold text-white">
                My Wishlist ({wishlist.length})
              </h2>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-slate-300">Your wishlist is empty</p>
                <p className="text-xs text-slate-500 mt-1">Tap the heart icon on products you love</p>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-[#161a29] rounded-xl p-3 border border-slate-800/80 flex gap-3 items-center"
                >
                  <WishlistItemImage src={product.image} alt={product.name} />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate mb-0.5">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-1.5">
                      {product.packSize}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-amber-300">
                        ₹{product.discountedPrice.toFixed(0)}
                      </span>
                      <span className="text-[10px] text-slate-500 line-through">
                        ₹{product.originalPrice.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

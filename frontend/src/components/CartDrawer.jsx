import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Gift, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItemsList,
    totalItemCount,
    subtotal,
    actualTotal,
    festiveSavings,
    minOrderThreshold,
    isMinOrderMet,
    packingCharges,
    grandTotal,
    addToCart,
    removeFromCart,
    clearCart,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f121e] border-l border-amber-500/20 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#151928]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">
                Your Fireworks Basket ({totalItemCount})
              </h2>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItemsList.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-slate-300">Your basket is empty</p>
                <p className="text-xs text-slate-500 mt-1">Browse our Sivakasi catalog or bulk sheet to add items</p>
              </div>
            ) : (
              cartItemsList.map(({ product, quantity }) => (
                <div 
                  key={product.id}
                  className="bg-[#161a29] rounded-xl p-3 border border-slate-800/80 flex gap-3 items-center"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                  />
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

                  {/* Quantity Stepper */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center bg-[#0e111d] rounded-lg border border-slate-700 p-0.5">
                      <button
                        onClick={() => addToCart(product, -1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-xs font-bold text-white px-2">
                        {quantity}
                      </span>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-5 h-5 flex items-center justify-center text-amber-400 hover:text-amber-300"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Bill & Checkout */}
          {cartItemsList.length > 0 && (
            <div className="p-4 bg-[#141827] border-t border-slate-800 space-y-3">
              {/* Cost breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Actual Market Rate:</span>
                  <span className="line-through">₹{actualTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Festive Discount (80% Off):</span>
                  <span>- ₹{festiveSavings.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-slate-200 font-semibold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Packing & Transport:</span>
                  <span className="text-slate-200 font-medium">₹{packingCharges.toFixed(0)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Net Total:</span>
                  <span className="text-lg font-black text-amber-400">
                    ₹{grandTotal.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  if (totalItemCount === 0) {
                    alert('Please add at least 1 item to proceed to checkout.');
                    return;
                  }
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                disabled={totalItemCount === 0}
                className={`w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  totalItemCount > 0
                    ? 'bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 hover:opacity-95 text-slate-950 shadow-amber-500/20 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400">
                <button
                  onClick={clearCart}
                  className="hover:text-red-400 transition-colors"
                >
                  Empty Basket
                </button>
                <span className="text-[10px] text-slate-500">🔒 Direct Sivakasi Transport Verified</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

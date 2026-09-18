import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  Phone, 
  MapPin, 
  User, 
  CreditCard, 
  Sparkles, 
  MessageCircle, 
  ArrowRight, 
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/api';
import { lookupPincode } from '../services/pincodeLookup';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItemsList,
    subtotal,
    actualTotal,
    festiveSavings,
    packingCharges,
    grandTotal,
    clearCart,
    setCompletedOrder
  } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '',
    paymentMethod: 'WHATSAPP',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);
  const [pinLookupSuccess, setPinLookupSuccess] = useState('');

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: pin }));
    setPinLookupSuccess('');

    if (pin.length === 6) {
      setIsLookingUpPin(true);
      try {
        const result = await lookupPincode(pin);
        if (result && result.city && result.state) {
          setFormData(prev => ({
            ...prev,
            city: result.city,
            state: result.state
          }));
          setPinLookupSuccess(`Auto-filled: ${result.city}, ${result.state}`);
        }
      } catch (err) {
        console.warn('Pincode lookup failed:', err);
      } finally {
        setIsLookingUpPin(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.address || !formData.pincode) {
      setErrorMsg('Please complete all required address and contact fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        ...formData,
        items: cartItemsList.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          category: item.product.category,
          packSize: item.product.packSize,
          price: item.product.discountedPrice,
          quantity: item.quantity,
          subtotal: item.product.discountedPrice * item.quantity
        }))
      };

      const result = await submitOrder(orderPayload);
      
      // Trigger festive fireworks celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      clearCart();
      setIsCheckoutOpen(false);
      setCompletedOrder(result);

      // Automatically open WhatsApp to Admin (+91 9442188990) with the complete invoice!
      if (result?.whatsappShareUrl) {
        // Direct automatic window open or location redirect
        const waWindow = window.open(result.whatsappShareUrl, '_blank');
        if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
          // If popup blocker blocked the new tab, redirect smoothly
          window.location.href = result.whatsappShareUrl;
        }
      }
    } catch (err) {
      setErrorMsg('Failed to create order. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#121625] border border-amber-500/20 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-800 via-[#181d30] to-amber-700 p-4 sm:p-5 flex items-center justify-between text-white border-b border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-300/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif">
                Direct Sivakasi Transport Order Booking
              </h2>
              <p className="text-xs text-amber-200">
                Doorstep dispatch with live WhatsApp order verification
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Form & Order Summary */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>1. Contact & Delivery Address</span>
              </h3>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Selvaganapathy"
                  className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">
                    WhatsApp Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">
                  Door No, Street & Landmark <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="No 12, Gandhi Road, Near Bus Stand"
                  className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Other States">Other States</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium flex items-center justify-between">
                    <span>Pincode <span className="text-red-400">*</span></span>
                    {isLookingUpPin && <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />}
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    placeholder="600001"
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {pinLookupSuccess && (
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>{pinLookupSuccess}</span>
                </div>
              )}
            </div>

            {/* Order Payment & Summary */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
                  <CreditCard className="w-4 h-4" />
                  <span>2. Payment Preference</span>
                </h3>

                <div className="space-y-2">
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'WHATSAPP' 
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-white' 
                      : 'bg-[#181c2d] border-slate-700/80 text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="WHATSAPP"
                      checked={formData.paymentMethod === 'WHATSAPP'}
                      onChange={handleChange}
                      className="mt-0.5 text-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold">WhatsApp Order & UPI (Recommended)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Send invoice directly to vendor WhatsApp. Pay securely via GPay / PhonePe / Paytm after bill verification.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD_DEPOT' 
                      ? 'bg-amber-950/30 border-amber-500/50 text-white' 
                      : 'bg-[#181c2d] border-slate-700/80 text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD_DEPOT"
                      checked={formData.paymentMethod === 'COD_DEPOT'}
                      onChange={handleChange}
                      className="mt-0.5 text-amber-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold">Transport Depot Pay on Delivery</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Pay at your local city transport hub depot upon parcel arrival.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Amount Snapshot Box */}
              <div className="bg-[#181c2d] p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Actual Market Price:</span>
                  <span className="line-through">₹{actualTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Festival Discount (80% Off):</span>
                  <span>- ₹{festiveSavings.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Packing & Transport:</span>
                  <span>{packingCharges === 0 ? 'FREE' : `₹${packingCharges.toFixed(0)}`}</span>
                </div>
                <div className="pt-2 border-t border-slate-700/80 flex justify-between items-baseline font-black">
                  <span className="text-sm text-white">Final Payable Amount:</span>
                  <span className="text-xl text-amber-400">₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Orders are packed in standard heavy-duty waterproof wooden/corrugated boxes.</span>
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-500 hover:opacity-95 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting & Sending Invoice...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 text-slate-950 fill-current" />
                  <span>Confirm Order & Send Invoice to WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

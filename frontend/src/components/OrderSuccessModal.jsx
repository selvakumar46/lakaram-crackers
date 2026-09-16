import React from 'react';
import { 
  CheckCircle2, 
  MessageCircle, 
  Printer, 
  ShoppingBag, 
  Truck, 
  Calendar, 
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function OrderSuccessModal() {
  const { completedOrder, setCompletedOrder, setViewMode } = useCart();

  if (!completedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-[#121625] border border-amber-500/30 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:text-black print:bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-[#161a29] to-amber-700 p-5 text-white flex items-center justify-between border-b border-slate-800 print:bg-white print:text-black">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 print:hidden">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif print:text-xl">
                Order Booked Successfully!
              </h2>
              <p className="text-xs text-emerald-300 print:text-gray-600">
                Order ID: <span className="font-mono font-bold text-white print:text-black">{completedOrder.orderId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setCompletedOrder(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 print:p-4">
          {/* WhatsApp Direct Action Banner */}
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Instant WhatsApp Confirmation</span>
              </h4>
              <p className="text-xs text-slate-300">
                Click below to send your itemized bill to our Sivakasi order desk.
              </p>
            </div>

            <a
              href={completedOrder.whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </a>
          </div>

          {/* Customer & Delivery Details */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#181c2d] p-3.5 rounded-2xl border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Customer</span>
              <p className="font-semibold text-white print:text-black">{completedOrder.customerName}</p>
              <p className="text-slate-300 print:text-gray-600">{completedOrder.phone}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Delivery Address</span>
              <p className="font-semibold text-white truncate print:text-black">{completedOrder.deliveryAddress}</p>
              <p className="text-slate-300 print:text-gray-600">PIN: {completedOrder.pincode}</p>
            </div>
          </div>

          {/* Ordered items table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 print:text-black">
              Order Items ({completedOrder.totalItemCount} Units)
            </h4>
            <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-[#161a29] print:max-h-none print:bg-white print:border-gray-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f121e] text-slate-400 text-[10px] uppercase print:bg-gray-100 print:text-gray-700">
                  <tr>
                    <th className="py-2 px-3">Item</th>
                    <th className="py-2 px-2 text-center">Pack</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                  {completedOrder.items.map((item, idx) => (
                    <tr key={idx} className="text-slate-200 print:text-black">
                      <td className="py-2 px-3 font-medium">{item.productName}</td>
                      <td className="py-2 px-2 text-center text-slate-400">{item.packSize}</td>
                      <td className="py-2 px-2 text-center font-bold text-amber-300 print:text-black">{item.quantity}</td>
                      <td className="py-2 px-3 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-[#181c2d] p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs print:bg-gray-50 print:border-gray-200">
            <div className="flex justify-between text-slate-400 print:text-gray-600">
              <span>Actual Market Value:</span>
              <span className="line-through">₹{completedOrder.actualValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold print:text-green-700">
              <span>Diwali Festive Savings (75% Off):</span>
              <span>- ₹{completedOrder.festiveDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-gray-600">
              <span>Packing & Transport:</span>
              <span>{completedOrder.packingAndForwarding === 0 ? 'FREE' : `₹${completedOrder.packingAndForwarding.toFixed(2)}`}</span>
            </div>
            <div className="pt-2 border-t border-slate-700 flex justify-between items-baseline font-black print:border-gray-300">
              <span className="text-sm text-white print:text-black">Net Total Payable:</span>
              <span className="text-xl text-amber-400 print:text-black">₹{completedOrder.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Dispatch Notice */}
          <div className="flex items-center gap-2 text-xs text-slate-400 print:text-gray-600">
            <Truck className="w-4 h-4 text-amber-400 print:hidden" />
            <span>Estimated delivery: <strong>{completedOrder.estimatedDelivery}</strong></span>
          </div>

          {/* Footer actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b2033] hover:bg-[#262c45] text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print / Save PDF Bill</span>
            </button>

            <button
              onClick={() => {
                setCompletedOrder(null);
                setViewMode('catalog');
              }}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

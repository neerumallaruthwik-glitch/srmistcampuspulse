import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CreditCard, CheckCircle2, ShieldCheck, AlertCircle, X, ArrowRight, Lock, Smartphone } from 'lucide-react';

export function PaymentModal({ event, onClose, onPaymentSuccess }) {
  const { user, showToast } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState(`${user?.studentOrStaffId?.toLowerCase() || 'alex'}@oksrm`);

  if (!event) return null;

  const handlePayNow = async () => {
    try {
      setLoading(true);
      // 1. Create payment order
      const orderRes = await api.createPaymentOrder({
        eventId: event.id,
        userId: user.id,
        amount: event.feeAmount
      });

      if (!orderRes.success) {
        throw new Error('Failed to initiate payment gateway');
      }

      // Simulate instantaneous sandbox verification
      const testPaymentId = `TXN_SRM_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const verifyRes = await api.verifyPayment({
        orderId: orderRes.orderId,
        paymentId: testPaymentId,
        eventId: event.id,
        userId: user.id,
        amount: event.feeAmount
      });

      if (verifyRes.success) {
        showToast(`Payment of ₹${event.feeAmount} Verified! (Ref: ${testPaymentId})`, 'success');
        onPaymentSuccess(testPaymentId, event.feeAmount);
      }
    } catch (err) {
      showToast(err.message || 'Payment processing error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Campus Payment Gateway</span>
          </div>
          <h3 className="text-xl font-bold text-white">Event Registration Fee</h3>
          <p className="text-xs text-slate-400 truncate">{event.title}</p>
        </div>

        {/* Fee Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Total Payable</span>
            <strong className="text-2xl font-extrabold text-white">₹{event.feeAmount}</strong>
            <span className="text-[10px] text-emerald-400 block font-medium">Standard Student Delegate Rate</span>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold">
              INR (₹)
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 block">Select Payment Method:</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>UPI / QR</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                paymentMethod === 'card'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Card / NetBanking</span>
            </button>
          </div>

          {paymentMethod === 'upi' ? (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1">
              <label className="text-[11px] text-slate-400 block">Virtual Payment Address (VPA / UPI ID)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-2">
              <input
                type="text"
                placeholder="4111 •••• •••• 1111 (Sandbox Test Card)"
                disabled
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono"
              />
            </div>
          )}
        </div>

        {/* Sandbox Test Notice */}
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>Sandbox Test Mode Active:</strong> No real bank charges will be incurred. Simulates server-side verification and generates a legitimate payment reference.
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePayNow}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Verifying Transaction with Gateway...' : `Authorize & Pay ₹${event.feeAmount}`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PaymentModal } from './PaymentModal';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Tag, 
  Sparkles, 
  ArrowRight,
  Info,
  DollarSign,
  Download,
  Mail,
  Phone,
  FileText,
  AlertTriangle
} from 'lucide-react';

export function EventDetailModal({ event, onClose, onRegisteredSuccess, isAlreadyRegistered, existingTicket }) {
  const { user, role, showToast } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [specialReq, setSpecialReq] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!event) return null;

  const isFull = (event.registeredCount || 0) >= event.capacity;

  const initiateRegistration = () => {
    if (!user) {
      showToast('Please sign in or select a demo student profile', 'error');
      return;
    }

    if (isAlreadyRegistered) {
      showToast('You are already registered for this event!', 'info');
      return;
    }

    // If paid event, open Payment Modal first!
    if (event.isPaid && event.feeAmount > 0) {
      setShowPaymentModal(true);
      return;
    }

    // Free event: complete registration directly
    executeRegistration();
  };

  const executeRegistration = async (paymentId = null, paymentAmount = 0) => {
    try {
      setSubmitting(true);
      setErrorMsg(null);

      const res = await api.registerForEvent({
        eventId: event.id,
        userId: user.id,
        specialRequirements: specialReq,
        paymentId,
        paymentAmount
      });

      if (res.success) {
        setShowPaymentModal(false);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        showToast(`Registration Confirmed! Allocated Seat: ${res.registration.seatNumber}`);
        onRegisteredSuccess(res.registration);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Poster Header */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 shrink-0">
            <img
              src={event.posterUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-lg">
                  {event.category}
                </span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900/80 text-slate-200 border border-slate-700">
                  {event.format === 'online' ? '🌐 Online/Hybrid' : '🏫 In-Person'}
                </span>
                {event.isPaid ? (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Fee: ₹{event.feeAmount}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Free Entry
                  </span>
                )}
              </div>

              <span className="text-xs font-medium text-slate-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-700/50">
                {event.clubName || event.organizerName}
              </span>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {event.title}
              </h2>
              <p className="text-xs text-indigo-400 font-semibold mt-1">
                Faculty Coordinator: {event.facultyCoordinator || 'Department Advisory Committee'}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2.5">
                {event.description}
              </p>
            </div>

            {/* Logistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Date & Day</p>
                  <p className="font-bold text-white text-sm">{event.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Timing</p>
                  <p className="font-bold text-white text-sm">{event.startTime} – {event.endTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Campus Venue</p>
                  <p className="font-bold text-white text-sm truncate">{event.venueName}</p>
                </div>
              </div>
            </div>

            {/* Seat Capacity Bar */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  Live Registration Status
                </span>
                <span className={isFull ? 'text-rose-400' : 'text-emerald-400'}>
                  {isFull ? 'Sold Out' : `${event.capacity - (event.registeredCount || 0)} seats remaining (${event.registeredCount || 0}/${event.capacity} filled)`}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(((event.registeredCount || 0) / event.capacity) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Eligibility & Prerequisites */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Eligibility Criteria</p>
                <p className="text-slate-200">{event.eligibility || 'Open to all enrolled students.'}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Required Prerequisites</p>
                <p className="text-slate-200">{event.prerequisites || 'None specified.'}</p>
              </div>
            </div>

            {/* Participation Guidelines */}
            {event.rules && event.rules.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  Official Participation Rules & Guidelines
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resource Attachments */}
            {event.resources && event.resources.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Official Event Resources & Materials
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {event.resources.map((res, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white truncate max-w-[200px]">{res.name}</p>
                        <span className="text-[10px] text-slate-400">{res.size} • {res.type.toUpperCase()}</span>
                      </div>
                      <button
                        onClick={() => showToast(`Downloading ${res.name}...`, 'info')}
                        className="p-2 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer Contact Info */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Organizer Helpdesk</p>
                <p className="font-bold text-white">{event.contactEmail || 'events@srmist.edu.in'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Helpline Contact</p>
                <p className="font-mono text-slate-300">{event.contactPhone || '+91 44 2249 2882'}</p>
              </div>
            </div>

            {/* Registration Action Section */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isAlreadyRegistered ? (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-200">You are Registered!</p>
                      <p className="text-xs text-emerald-400/80">Ticket Token: {existingTicket?.qrCodeToken || 'Generated'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRegisteredSuccess(existingTicket)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    View QR Pass
                  </button>
                </div>
              ) : role !== 'student' ? (
                <div className="p-3.5 rounded-xl bg-slate-800/80 text-center text-xs text-slate-400">
                  You are currently viewing as an <strong>{role.toUpperCase()}</strong>. Switch to a student profile in the top bar to test registration and QR ticketing.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">Student: </span>
                      <strong className="text-white">{user?.name}</strong> ({user?.studentOrStaffId || user?.rollNumber})
                    </div>
                    <span className="text-[11px] text-indigo-400 font-semibold">{user?.department}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Optional: Dietary requirement or team name..."
                      value={specialReq}
                      onChange={(e) => setSpecialReq(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />

                    <button
                      onClick={initiateRegistration}
                      disabled={submitting || isFull}
                      className={`py-2.5 px-6 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center gap-2 ${
                        isFull
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : submitting
                          ? 'bg-indigo-700 text-indigo-200 cursor-wait'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      }`}
                    >
                      <span>
                        {submitting
                          ? 'Processing...'
                          : isFull
                          ? 'Capacity Reached'
                          : event.isPaid
                          ? `Pay ₹${event.feeAmount} & Register`
                          : 'Confirm Free Registration'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal if paid event */}
      {showPaymentModal && (
        <PaymentModal
          event={event}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={(txnId, amount) => {
            executeRegistration(txnId, amount);
          }}
        />
      )}
    </>
  );
}

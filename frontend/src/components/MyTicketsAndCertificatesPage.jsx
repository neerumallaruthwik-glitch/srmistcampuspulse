import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DigitalTicketPass } from './DigitalTicketPass';
import { CertificateModal } from './CertificateModal';
import { 
  Ticket, 
  Award, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Printer, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export function MyTicketsAndCertificatesPage({ onNavigateExplore }) {
  const { user, showToast } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' or 'certificates'
  const [ticketFilter, setTicketFilter] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedPass, setSelectedPass] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [ticketsRes, certsRes] = await Promise.all([
        api.getMyRegistrations(user.id),
        api.getCertificates(user.id)
      ]);

      if (ticketsRes.success) setTickets(ticketsRes.registrations);
      if (certsRes.success) setCertificates(certsRes.certificates);
    } catch (e) {
      console.error('Error fetching tickets and certificates:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleCancelTicket = async (ticketId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"? Your seat will be released.`)) {
      return;
    }
    try {
      const res = await api.cancelRegistration(ticketId);
      if (res.success) {
        showToast('Registration cancelled as requested', 'info');
        fetchUserData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel', 'error');
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (ticketFilter === 'upcoming') return t.status === 'registered';
    if (ticketFilter === 'completed') return t.status === 'attended';
    if (ticketFilter === 'cancelled') return t.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-emerald-400" />
            <span>My Campus Passes & Credentials</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered events, tamper-proof QR tickets, and verifiable certificates for {user?.name} ({user?.studentOrStaffId || user?.rollNumber}).
          </p>
        </div>

        {/* Tab switcher: Tickets vs Certificates */}
        <div className="flex rounded-xl bg-slate-800 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'tickets' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Digital Passes ({tickets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'certificates' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Earned Certificates ({certificates.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: DIGITAL TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {/* Status Sub-Filters */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setTicketFilter('upcoming')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                ticketFilter === 'upcoming'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Upcoming Active ({tickets.filter(t => t.status === 'registered').length})
            </button>
            <button
              onClick={() => setTicketFilter('completed')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                ticketFilter === 'completed'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Attended / Completed ({tickets.filter(t => t.status === 'attended').length})
            </button>
            <button
              onClick={() => setTicketFilter('cancelled')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                ticketFilter === 'cancelled'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Cancelled ({tickets.filter(t => t.status === 'cancelled').length})
            </button>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-dashed border-slate-800 space-y-3">
              <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No passes in this category</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore approved events on campus to register and claim your verified QR boarding pass.
              </p>
              {onNavigateExplore && (
                <button
                  onClick={onNavigateExplore}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Explore Events
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTickets.map((ticket) => {
                const isAttended = ticket.status === 'attended';
                const isCancelled = ticket.status === 'cancelled';

                return (
                  <div
                    key={ticket.id}
                    className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-400 text-[10px] truncate max-w-[140px]">
                          {ticket.qrCodeToken}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isAttended ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          isCancelled ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {isAttended ? 'Attended' : isCancelled ? 'Cancelled' : 'Confirmed'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                        {ticket.eventTitle}
                      </h3>

                      <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{ticket.eventDate} ({ticket.eventStartTime})</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="truncate">{ticket.eventVenue}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <span className="text-slate-400">Seat: <strong className="text-indigo-300">{ticket.seatNumber}</strong></span>
                          <span className="text-slate-400">
                            {ticket.paymentStatus === 'paid' ? `Paid (₹${ticket.amountPaid})` : 'Free Registration'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      {!isCancelled && (
                        <button
                          onClick={() => setSelectedPass(ticket)}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                        >
                          <Ticket className="w-4 h-4" />
                          <span>View Official QR Pass</span>
                        </button>
                      )}

                      {!isAttended && !isCancelled && (
                        <button
                          onClick={() => handleCancelTicket(ticket.id, ticket.eventTitle)}
                          className="w-full py-1.5 rounded-lg text-rose-400 hover:text-rose-300 text-[11px] font-semibold transition-colors"
                        >
                          Cancel Registration
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: EARNED CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-dashed border-slate-800 space-y-3">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Certificates Issued Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Certificates are automatically generated and cryptographically signed when you attend and check in at events.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-6 flex flex-col justify-between space-y-4 shadow-xl transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-amber-400 text-[11px] font-bold">
                        {cert.certificateNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Verified
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-snug">
                      {cert.eventTitle}
                    </h3>

                    <div className="space-y-1 text-xs text-slate-300">
                      <p><span className="text-slate-400">Recipient:</span> <strong>{cert.userName}</strong> ({cert.userRegNo})</p>
                      <p><span className="text-slate-400">Date Completed:</span> {cert.eventDate}</p>
                      <p><span className="text-slate-400">Issued by:</span> {cert.issuedBy}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-600/20"
                    >
                      <Award className="w-4 h-4 text-slate-950" />
                      <span>View & Download Certificate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Digital QR Ticket Pass Modal */}
      {selectedPass && (
        <DigitalTicketPass
          registration={selectedPass}
          onClose={() => setSelectedPass(null)}
        />
      )}

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}

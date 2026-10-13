import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  History, 
  RotateCcw,
  Check,
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export function AdminDashboard({ activeTab, setActiveTab, onRefreshCounts }) {
  const { user, showToast } = useAuth();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Approval Modal
  const [approvingEvent, setApprovingEvent] = useState(null);
  const [approvalNote, setApprovalNote] = useState('');

  // Rejection Modal
  const [rejectingEvent, setRejectingEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Venue already booked for University Convocation / Campus Assembly');
  const [rejectionNote, setRejectionNote] = useState('');

  const rejectionPresetReasons = [
    'Venue already booked for University Convocation / Campus Assembly',
    'Safety hazard / equipment specifications incomplete',
    'Event hours exceed campus night curfew regulations',
    'Missing department faculty advisory endorsement',
    'High sound decibel restriction during exam study week',
    'Other / Custom Administrative Directive'
  ];

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [pendingRes, historyRes] = await Promise.all([
        api.getPendingEvents(),
        api.getApprovalHistory()
      ]);

      if (pendingRes.success) setPendingEvents(pendingRes.pendingEvents);
      if (historyRes.success) setApprovalHistory(historyRes.approvalHistory);

      if (onRefreshCounts && pendingRes.pendingEvents) {
        onRefreshCounts(pendingRes.pendingEvents.length);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handle Approve Event
  const confirmApprove = async () => {
    if (!approvingEvent) return;
    try {
      setLoading(true);
      const res = await api.approveEvent(approvingEvent.id, {
        adminName: user?.name || 'Dr. Robert Vance (Dean)',
        notes: approvalNote || 'Event proposal approved. All campus facilities authorized.'
      });

      if (res.success) {
        showToast(`Event "${approvingEvent.title}" has been approved!`, 'success');
        setApprovingEvent(null);
        setApprovalNote('');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Approval failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reject Event
  const confirmReject = async () => {
    if (!rejectingEvent) return;
    try {
      setLoading(true);
      const res = await api.rejectEvent(rejectingEvent.id, {
        adminName: user?.name || 'Dr. Robert Vance (Dean)',
        reason: rejectionReason,
        notes: rejectionNote || 'Please modify the proposed venue/timing and resubmit.'
      });

      if (res.success) {
        showToast(`Event "${rejectingEvent.title}" rejected with feedback sent to organizer.`, 'info');
        setRejectingEvent(null);
        setRejectionReason(rejectionPresetReasons[0]);
        setRejectionNote('');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Rejection failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Campus Administration & Governance Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Dean & Student Affairs Review Desk
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Logged in as <strong className="text-slate-200">{user?.name}</strong> ({user?.title || 'Dean'}). Authorize campus events, detect scheduling bottlenecks, and maintain audit integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('admin-approvals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admin-approvals'
                ? 'bg-amber-600 text-slate-950 shadow-lg shadow-amber-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Pending Queue ({pendingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('admin-history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admin-history'
                ? 'bg-amber-600 text-slate-950 shadow-lg shadow-amber-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {/* Tab 1: PENDING APPROVAL QUEUE */}
      {(activeTab === 'admin-approvals' || activeTab === 'browse') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Reviewing incoming student proposals with real-time automated venue conflict analysis:</span>
            <span className="font-bold text-white">{pendingEvents.length} Pending Proposals</span>
          </div>

          {pendingEvents.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">All Event Proposals Cleared!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are currently no pending event approval requests in the administration queue.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvents.map((event) => {
                const conflictCheck = event.realtimeConflictStatus;
                const hasConflict = conflictCheck?.hasConflict;

                return (
                  <div
                    key={event.id}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl"
                  >
                    {/* Event Info */}
                    <div className="flex items-start gap-4">
                      <img
                        src={event.posterUrl}
                        alt=""
                        className="w-24 h-24 rounded-2xl object-cover shrink-0 ring-1 ring-white/10"
                      />
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {event.category}
                          </span>

                          {/* Real-time Conflict Verification Tag */}
                          {hasConflict ? (
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              <span>Schedule Conflict Detected</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Venue Feasibility Verified</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-white leading-snug">{event.title}</h3>

                        <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{event.date} ({event.startTime} - {event.endTime})</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{event.venueName}</span>
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Users className="w-3.5 h-3.5" />
                            <span>Cap: {event.capacity} seats</span>
                          </span>
                          <span className="text-slate-400">
                            By: <strong className="text-slate-200">{event.organizerName}</strong> ({event.organizerClub})
                          </span>
                        </div>

                        {/* Conflict Detail Snippet if any */}
                        {hasConflict && conflictCheck.conflicts && (
                          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200">
                            <strong>Note for Dean:</strong> Overlaps with "{conflictCheck.conflicts[0]?.title}" ({conflictCheck.conflicts[0]?.startTime} - {conflictCheck.conflicts[0]?.endTime}).
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                      <button
                        onClick={() => {
                          setRejectingEvent(event);
                          setRejectionReason(rejectionPresetReasons[0]);
                        }}
                        className="flex-1 lg:flex-initial px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Decline / Reject</span>
                      </button>

                      <button
                        onClick={() => {
                          setApprovingEvent(event);
                          setApprovalNote('');
                        }}
                        className="flex-1 lg:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Request</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: APPROVAL AUDIT TRAIL */}
      {activeTab === 'admin-history' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span>Executive Approval Audit Trail</span>
              </h3>
              <p className="text-slate-400">Chronological history of all event approval and rejection decisions.</p>
            </div>
            <span className="font-mono text-slate-400 font-bold">{approvalHistory.length} Recorded Actions</span>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-slate-900 border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Event Proposal</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Administrator</th>
                  <th className="p-4">Decision Notes / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {approvalHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">{item.eventTitle}</p>
                      <p className="text-[11px] text-slate-400">{item.venueName} ({item.date})</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        item.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">
                      {item.adminName}
                    </td>
                    <td className="p-4 text-slate-300 text-[11px] leading-relaxed max-w-xs">
                      {item.reason && <p className="font-semibold text-rose-300 mb-0.5">Reason: {item.reason}</p>}
                      <p className="text-slate-400">{item.notes}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPROVE CONFIRMATION MODAL */}
      {approvingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Confirm Event Approval</span>
              </h3>
              <button onClick={() => setApprovingEvent(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 text-xs space-y-1">
              <p className="font-bold text-white text-sm">{approvingEvent.title}</p>
              <p className="text-slate-400">Venue: {approvingEvent.venueName} | Date: {approvingEvent.date}</p>
              <p className="text-slate-400">Organizer: {approvingEvent.organizerName} ({approvingEvent.organizerClub})</p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-300">Dean Notes & Facilities Clearance (Optional)</label>
              <textarea
                rows={2}
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="e.g. Approved. Stage lighting and acoustic permission granted."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setApprovingEvent(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
              >
                Sign & Authorize Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {rejectingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>Decline Event Proposal</span>
              </h3>
              <button onClick={() => setRejectingEvent(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 text-xs space-y-1">
              <p className="font-bold text-white text-sm">{rejectingEvent.title}</p>
              <p className="text-slate-400">Venue: {rejectingEvent.venueName} | Date: {rejectingEvent.date}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Formal Reason for Rejection *</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500 text-xs"
                >
                  {rejectionPresetReasons.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Feedback & Corrective Advice for Organizer</label>
                <textarea
                  rows={2}
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="e.g. Please pick an alternative venue such as Hall B, or reschedule to morning hours."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingEvent(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Reject & Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

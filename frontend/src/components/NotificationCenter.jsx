import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, Ticket, Award, CreditCard, ShieldCheck, Clock, X } from 'lucide-react';

export function NotificationCenter({ isOpen, onClose }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.getNotifications(user.id);
      if (res.success) {
        setNotifications(res.notifications);
      }
    } catch (e) {
      console.error('Error fetching notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifs();
    }
  }, [isOpen, user]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await api.markAllNotificationsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {}
  };

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'registration': return <Ticket className="w-4 h-4 text-emerald-400" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-purple-400" />;
      case 'certificate': return <Award className="w-4 h-4 text-amber-400" />;
      case 'approval': return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      default: return <Bell className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Campus In-App Notifications</h3>
              <p className="text-[11px] text-slate-400">Official updates for {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filter === 'unread' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
        </div>

        {/* Notification List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notifications to display.
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  n.read
                    ? 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                    : 'bg-indigo-950/30 border-indigo-500/40 text-white shadow-md'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-800 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold leading-tight">{n.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  User, 
  Calendar, 
  Ticket, 
  Award, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  ChevronRight
} from 'lucide-react';

export function StudentDashboardPage({ onNavigate, onSelectEvent }) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      try {
        setLoading(true);
        const [ticketsRes, certsRes, eventsRes, notifsRes] = await Promise.all([
          api.getMyRegistrations(user.id),
          api.getCertificates(user.id),
          api.getEvents({ status: 'approved', userId: user.id }),
          api.getNotifications(user.id)
        ]);

        if (ticketsRes.success) setTickets(ticketsRes.registrations);
        if (certsRes.success) setCertificates(certsRes.certificates);
        if (eventsRes.success) {
          // Sort top 3 recommendations
          const rec = [...eventsRes.events].sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0)).slice(0, 3);
          setRecommended(rec);
        }
        if (notifsRes.success) setNotifications(notifsRes.notifications.slice(0, 3));
      } catch (e) {
        console.error('Failed to load student dashboard:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  const upcomingCount = tickets.filter(t => t.status === 'registered').length;
  const attendedCount = tickets.filter(t => t.status === 'attended').length;

  // Monthly participation chart data
  const monthlyData = [
    { month: 'Jul', events: 1 },
    { month: 'Aug', events: 2 },
    { month: 'Sep', events: 3 },
    { month: 'Oct', events: tickets.length || 2 }
  ];

  // Category participation data
  const categoryData = [
    { name: 'Technical & Hackathons', value: 3 },
    { name: 'Cultural & Music', value: 1 },
    { name: 'Workshops', value: 2 },
    { name: 'Sports', value: 1 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome & Profile Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Welcome, {user?.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                STUDENT
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              Reg No: <strong className="text-white">{user?.studentOrStaffId || user?.rollNumber}</strong> • {user?.department}
            </p>
            <p className="text-[11px] text-slate-400">
              {user?.academicYear || '3rd Year B.Tech'} • SRM IST Ramapuram Campus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => onNavigate('tickets')}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
          >
            <Ticket className="w-4 h-4" />
            <span>My QR Tickets</span>
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Explore Events</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-semibold uppercase">Total Registered</span>
            <Ticket className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-white">{tickets.length}</p>
          <span className="text-[10px] text-slate-400 block">Across 2026 Academic Term</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold uppercase">Upcoming Events</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-300">{upcomingCount}</p>
          <span className="text-[10px] text-emerald-400 block font-medium">Active Passes Ready</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-semibold uppercase">Attended Events</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-blue-300">{attendedCount}</p>
          <span className="text-[10px] text-slate-400 block">Verified Gate Scans</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold uppercase">Certificates Earned</span>
            <Award className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-amber-300">{certificates.length}</p>
          <span className="text-[10px] text-amber-400 block font-medium">Digital Credentials Issued</span>
        </div>
      </div>

      {/* Participation Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Participation Activity */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Monthly Event Participation Graph</span>
              </h3>
              <p className="text-[11px] text-slate-400">Your campus engagement velocity across terms</p>
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">
              2026 Term
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gradStudent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="events" name="Events Joined" stroke="#6366f1" strokeWidth={2} fill="url(#gradStudent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Participation Chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Category Breakdown</span>
          </h3>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-[10px] border-t border-slate-800 pt-2">
            {categoryData.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {c.name}
                </span>
                <span className="font-bold">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recommended Events & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended for You */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recommended Based on Your Major & Interests</span>
            </h3>
            <button
              onClick={() => onNavigate('explore')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {recommended.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={evt.posterUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{evt.title}</h4>
                    <p className="text-[11px] text-slate-400">{evt.date} • {evt.venueName}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                    {evt.recommendationScore}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications & Reminders */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span>Recent Campus Updates</span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400">No new announcements</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <p className="font-semibold text-white leading-tight">{n.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

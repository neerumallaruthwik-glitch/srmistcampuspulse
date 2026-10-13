import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Building, 
  PieChart as PieIcon,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export function AnalyticsDashboard() {
  const { showToast } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.getAnalyticsOverview();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];

  const exportAnalyticsCSV = () => {
    if (!data || !data.topEvents) return;
    const headers = ['Event ID,Title,Category,Venue,Date,Capacity,Registered,Occupancy Rate\n'];
    const rows = data.topEvents.map(e =>
      `"${e.id}","${e.title}","${e.category}","${e.venue}","${e.date}",${e.capacity},${e.registered},"${e.occupancyRate}%"\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `CampusPulse_Event_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Analytics summary report downloaded!', 'success');
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Compiling Campus Event Intelligence & Analytics...</p>
      </div>
    );
  }

  const { summary, categoryStats, venueStats, approvalStats, registrationTrends, topEvents } = data;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Campus Event Intelligence & Analytics</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            CampusPulse Centralized Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time event discovery trends, venue capacity utilization, and digital attendance percentages.
          </p>
        </div>

        <button
          onClick={exportAnalyticsCSV}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Report (.CSV)</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between text-indigo-300">
            <span className="text-xs font-bold uppercase tracking-wider">Total Events</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-white">{summary.totalEvents}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-bold">{summary.approvedEvents} Approved</span>
            <span>•</span>
            <span className="text-amber-400">{summary.pendingEvents} Pending</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-xs font-bold uppercase tracking-wider">Registrations</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-white">{summary.totalRegistrations}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-indigo-300 font-bold">{summary.capacityUtilization}% of campus capacity</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Check-Ins</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-300">{summary.totalAttended}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-bold">{summary.overallAttendanceRate}% Global Turnout</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-xs font-bold uppercase tracking-wider">Total Seats Offered</span>
            <Building className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-white">{summary.totalCapacity}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Across 7 campus venues</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registration & Check-In Velocity (Area Chart) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Daily Registration & Check-In Velocity</span>
              </h3>
              <p className="text-[11px] text-slate-400">Growth trajectory over the past week</p>
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">
              Real-time
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationTrends}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCheck" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="registrations" name="Student Registrations" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorReg)" />
                <Area type="monotone" dataKey="checkIns" name="QR Check-Ins" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCheck)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (Donut Chart) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              <span>Event Categories</span>
            </h3>
            <span className="text-[10px] text-slate-400">{categoryStats.length} Clusters</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  dataKey="registrations"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-800 max-h-24 overflow-y-auto">
            {categoryStats.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-300 truncate">{c.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Venue Footfall & Occupancy (Bar Chart) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <span>Campus Venue Utilization & Footfall</span>
            </h3>
            <p className="text-[11px] text-slate-400">Total registered attendees across university halls & facilities</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={venueStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="venueName" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="totalAttendees" name="Total Registrants" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="capacity" name="Venue Capacity" fill="#334155" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Events Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>High-Demand Events & Conversion Rates</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Ranked by Registration Count</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-3">Rank & Event Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Venue</th>
                <th className="p-3">Bookings</th>
                <th className="p-3">Occupancy Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {topEvents.map((e, index) => (
                <tr key={e.id} className="hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                        #{index + 1}
                      </span>
                      <span className="font-bold text-white">{e.title}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-400">{e.category}</td>
                  <td className="p-3 text-slate-300">{e.venue}</td>
                  <td className="p-3 font-semibold text-white">{e.registered} / {e.capacity}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${Math.min(e.occupancyRate, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-emerald-400 font-mono text-[11px]">{e.occupancyRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

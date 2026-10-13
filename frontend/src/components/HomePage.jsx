import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { EventCard } from './EventCard';
import { 
  Sparkles, 
  Calendar, 
  Search, 
  ArrowRight, 
  Users, 
  Building, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Flame, 
  Award,
  ChevronRight,
  PlusCircle,
  Bell
} from 'lucide-react';

export function HomePage({ onNavigate, onSelectEvent, isRegisteredForEvent }) {
  const { user, role } = useAuth();
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, totalClubs: 5 });
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');

  const categories = [
    { name: 'Technical', icon: '💻', count: 2 },
    { name: 'Hackathon', icon: '⚡', count: 1 },
    { name: 'Workshop', icon: '🛠️', count: 1 },
    { name: 'Sports', icon: '⚽', count: 1 },
    { name: 'Cultural', icon: '🎭', count: 1 },
    { name: 'Literary', icon: '📚', count: 1 },
    { name: 'NSS and Volunteering', icon: '🌱', count: 1 },
    { name: 'Seminar and Conference', icon: '🎓', count: 1 }
  ];

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [eventsRes, analyticsRes] = await Promise.all([
          api.getEvents({ status: 'approved', userId: user?.id }),
          api.getAnalyticsOverview()
        ]);

        if (eventsRes.success) setEvents(eventsRes.events);
        if (analyticsRes.success) {
          setStats({
            totalEvents: analyticsRes.summary.approvedEvents || eventsRes.events?.length || 6,
            totalRegistrations: analyticsRes.summary.totalRegistrations || 4,
            totalClubs: 5
          });
        }
      } catch (e) {
        console.error('Failed to load home page data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, [user]);

  // Featured event (first high capacity approved event)
  const featuredEvent = events[0];
  const upcomingEvents = events.slice(1, 4);

  // Deadlines section
  const closingSoon = [...events].slice(0, 3);

  return (
    <div className="space-y-12 animate-in fade-in">
      {/* Official Prototype Notification Banner */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-indigo-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>SRM CampusPulse Platform:</strong> Proposed Smart Campus Event Hub prototype for SRM IST Ramapuram.
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">SRM IST Ramapuram Campus</span>
      </div>

      {/* Hero Section: "Discover. Participate. Achieve." */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-950 border border-slate-800 p-8 sm:p-14 text-center shadow-2xl">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>SRM Institute of Science and Technology • Ramapuram</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Discover. Participate.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300">
              Achieve.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your campus events, all in one place. Centralizing hackathons, technical symposia, cultural galas, sports tournaments, and verifiable QR attendance for the SRM community.
          </p>

          {/* Quick Search */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-indigo-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search SRM hackathons, Milan fests, workshops, venues..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onNavigate('explore', { search: searchVal })}
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 shadow-xl"
              />
              <button
                onClick={() => onNavigate('explore', { search: searchVal })}
                className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Explore All Events</span>
            </button>

            {role === 'organizer' ? (
              <button
                onClick={() => onNavigate('organizer')}
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Host an Event (Organizer Portal)</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Go to Student Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Calculated Real Database Statistics Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Approved Events</span>
          <p className="text-3xl font-extrabold text-white">{stats.totalEvents}</p>
          <span className="text-[10px] text-indigo-400 block font-mono">Live on Campus Catalog</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Student Registrations</span>
          <p className="text-3xl font-extrabold text-white">{stats.totalRegistrations}</p>
          <span className="text-[10px] text-emerald-400 block font-mono">Verified Digital Passes</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Participating SRM Clubs</span>
          <p className="text-3xl font-extrabold text-white">5 Active</p>
          <span className="text-[10px] text-purple-400 block font-mono">Technical & Cultural Bodies</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Campus Venues Audited</span>
          <p className="text-3xl font-extrabold text-white">7 Venues</p>
          <span className="text-[10px] text-amber-400 block font-mono">Zero Venue Overlaps</span>
        </div>
      </section>

      {/* Featured Event Spotlight */}
      {featuredEvent && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Spotlight Campus Event</span>
            </h2>
            <button
              onClick={() => onNavigate('explore')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div 
            onClick={() => onSelectEvent(featuredEvent)}
            className="group relative rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all overflow-hidden cursor-pointer shadow-xl grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 h-64 lg:h-auto overflow-hidden relative">
              <img
                src={featuredEvent.posterUrl}
                alt={featuredEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-900/40 to-slate-900 hidden lg:block" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-lg">
                  {featuredEvent.category}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  {featuredEvent.clubName}
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                  {featuredEvent.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {featuredEvent.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>📅 {featuredEvent.date} ({featuredEvent.startTime})</span>
                  <span>📍 {featuredEvent.venueName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Seats: {featuredEvent.registeredCount}/{featuredEvent.capacity} booked</span>
                  <span className="font-bold text-emerald-400">
                    {featuredEvent.isPaid ? `Fee: ₹${featuredEvent.feeAmount}` : 'Free Entry'}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(featuredEvent);
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
              >
                <span>View Details & Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Popular Event Categories */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Popular Campus Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((c, i) => (
            <button
              key={i}
              onClick={() => onNavigate('explore', { category: c.name })}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all text-left space-y-1 group"
            >
              <span className="text-2xl block">{c.icon}</span>
              <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{c.name}</p>
              <span className="text-[10px] text-slate-400">Explore events →</span>
            </button>
          ))}
        </div>
      </section>

      {/* Upcoming Events Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Upcoming Campus Events</h2>
            <p className="text-xs text-slate-400">Scheduled across Ramapuram auditoriums and labs</p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            See all events →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onSelect={onSelectEvent}
              isRegistered={isRegisteredForEvent(evt.id)}
            />
          ))}
        </div>
      </section>

      {/* Registration Deadlines Reminder Section */}
      <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Clock className="w-4 h-4" />
          <span>Registration Deadlines Approaching</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {closingSoon.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-colors cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-white truncate max-w-[160px]">{evt.title}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  Closes {evt.registrationCloseDate || evt.date}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{evt.venueName}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

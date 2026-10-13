import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { HeroBanner } from './HeroBanner';
import { EventCard } from './EventCard';
import { EventDetailModal } from './EventDetailModal';
import { DigitalTicketPass } from './DigitalTicketPass';
import { 
  Sparkles, 
  Calendar, 
  Ticket, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';

export function StudentDashboard({ activeTab, setActiveTab }) {
  const { user, showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVenue, setSelectedVenue] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  // Selected event modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Active ticket pass modal
  const [activeTicketPass, setActiveTicketPass] = useState(null);

  const categories = [
    'All',
    'Tech & Coding',
    'Cultural & Arts',
    'Workshops & Seminars',
    'Sports & Fitness',
    'Career & Placements',
    'Gaming & Esports'
  ];

  // Fetch events and student's tickets
  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, venuesRes] = await Promise.all([
        api.getEvents({ userId: user?.id, status: 'approved' }),
        api.getVenues()
      ]);

      if (eventsRes.success) setEvents(eventsRes.events);
      if (venuesRes.success) setVenues(venuesRes.venues);

      if (user?.id) {
        const ticketsRes = await api.getMyRegistrations(user.id);
        if (ticketsRes.success) setMyTickets(ticketsRes.registrations);
      }
    } catch (err) {
      console.error('Failed to load student data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Check if student already holds a ticket for an event
  const isRegisteredForEvent = (eventId) => {
    return myTickets.some(t => t.eventId === eventId && t.status !== 'cancelled');
  };

  const getExistingTicket = (eventId) => {
    return myTickets.find(t => t.eventId === eventId && t.status !== 'cancelled');
  };

  // Filtered Events
  const filteredEvents = events.filter(e => {
    if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
    if (selectedVenue !== 'all' && e.venueId !== selectedVenue) return false;
    if (selectedDate && e.date !== selectedDate) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchDesc = e.description.toLowerCase().includes(q);
      const matchVenue = e.venueName.toLowerCase().includes(q);
      const matchTags = (e.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchVenue && !matchTags) return false;
    }
    return true;
  });

  // Personalized events sorted by score
  const recommendedEvents = [...events]
    .sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0));

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Hero Banner when in Discover mode */}
      {activeTab === 'browse' && (
        <HeroBanner
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          role="student"
        />
      )}

      {/* Tab: MY REGISTERED TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                <Ticket className="w-6 h-6 text-emerald-400" />
                <span>My Campus Event Passes</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                All confirmed registrations, digital tickets, and verified QR check-ins for {user?.name}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {myTickets.length} Passes Active
              </span>
            </div>
          </div>

          {myTickets.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-dashed border-slate-800 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No Tickets Booked Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore exciting upcoming hackathons, tech workshops, and cultural fests to claim your instant QR pass!
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 inline-flex items-center gap-1.5"
              >
                <span>Browse Campus Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myTickets.map((ticket) => {
                const isCheckedIn = ticket.status === 'attended';
                return (
                  <div
                    key={ticket.id}
                    className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-400 text-[11px] truncate max-w-[140px]">
                          {ticket.qrCodeToken}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isCheckedIn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {isCheckedIn ? 'Checked In' : 'Active Pass'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
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
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Seat Allocation:</span>
                          <strong className="text-indigo-300 font-mono">{ticket.seatNumber}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTicketPass(ticket)}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>View Scannable QR Pass</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: FOR YOU (PERSONALIZED RECOMMENDATIONS) */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Personalized CampusPulse Recommendation Engine</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Curated for {user?.name}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Based on your enrolled department ({user?.department}) and declared interest tags:{' '}
              <strong className="text-indigo-300 font-semibold">{user?.interests?.join(', ') || 'Tech, Coding, AI'}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedEvents.slice(0, 6).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={(e) => setSelectedEvent(e)}
                isRegistered={isRegisteredForEvent(event.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: BROWSE ALL EVENTS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Detailed Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-400" />
                Refine by:
              </span>

              {/* Venue Selector */}
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Venues</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>

              {/* Date Filter */}
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />

              {(selectedCategory !== 'All' || selectedVenue !== 'all' || selectedDate || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedVenue('all');
                    setSelectedDate('');
                    setSearchQuery('');
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="text-slate-400 font-medium">
              Showing <strong className="text-white">{filteredEvents.length}</strong> upcoming campus events
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
              <p className="text-base font-bold text-slate-300">No events matched your current filters.</p>
              <p className="text-xs text-slate-400">Try adjusting the category, date, or search term.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedVenue('all');
                  setSelectedDate('');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={(e) => setSelectedEvent(e)}
                  isRegistered={isRegisteredForEvent(event.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Event Details & Registration Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isAlreadyRegistered={isRegisteredForEvent(selectedEvent.id)}
          existingTicket={getExistingTicket(selectedEvent.id)}
          onRegisteredSuccess={(newTicket) => {
            setSelectedEvent(null);
            fetchData();
            setActiveTicketPass(newTicket);
          }}
        />
      )}

      {/* Digital QR Ticket Pass Modal */}
      {activeTicketPass && (
        <DigitalTicketPass
          registration={activeTicketPass}
          onClose={() => setActiveTicketPass(null)}
        />
      )}
    </div>
  );
}

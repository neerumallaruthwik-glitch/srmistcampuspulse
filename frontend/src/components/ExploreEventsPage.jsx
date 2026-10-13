import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EventCard } from './EventCard';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  DollarSign, 
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export function ExploreEventsPage({ onSelectEvent, isRegisteredForEvent, initialCategory = 'All', initialSearch = '' }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [venueId, setVenueId] = useState('all');
  const [format, setFormat] = useState('all'); // all, online, offline
  const [fee, setFee] = useState('all'); // all, free, paid
  const [availability, setAvailability] = useState('all'); // all, open, sold-out
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState('upcoming'); // upcoming, popularity, newest, recommended
  const [visibleCount, setVisibleCount] = useState(6);

  const categories = [
    'All',
    'Technical',
    'Hackathon',
    'Workshop',
    'Sports',
    'Cultural',
    'Literary',
    'Awareness Rally',
    'NSS and Volunteering',
    'Music, Dance and Drama',
    'Seminar and Conference'
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [eventsRes, venuesRes] = await Promise.all([
        api.getEvents({
          status: 'approved',
          category,
          search,
          venueId,
          format,
          fee,
          availability,
          dateFrom,
          dateTo,
          sort,
          userId: user?.id
        }),
        api.getVenues()
      ]);

      if (eventsRes.success) setEvents(eventsRes.events);
      if (venuesRes.success) setVenues(venuesRes.venues);
    } catch (e) {
      console.error('Failed to query events:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, venueId, format, fee, availability, dateFrom, dateTo, sort, user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setVenueId('all');
    setFormat('all');
    setFee('all');
    setAvailability('all');
    setDateFrom('');
    setDateTo('');
    setSort('upcoming');
  };

  const visibleEvents = events.slice(0, visibleCount);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <span>Explore Campus Events</span>
        </h1>
        <p className="text-xs text-slate-400">
          Discover approved events organized by student clubs and departments at SRM IST Ramapuram.
        </p>
      </div>

      {/* Search and Filter Control Bar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-5 h-5 text-indigo-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by event title, organizer club, venue, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-24 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            Filter
          </button>
        </form>

        {/* Filter Pills / Dropdowns Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {/* Category Dropdown */}
          <div>
            <label className="text-[10px] text-slate-400 block font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Venue Dropdown */}
          <div>
            <label className="text-[10px] text-slate-400 block font-semibold mb-1">Campus Venue</label>
            <select
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Venues</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Format (Online / Offline) */}
          <div>
            <label className="text-[10px] text-slate-400 block font-semibold mb-1">Event Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Formats</option>
              <option value="offline">In-Person (On-Campus)</option>
              <option value="online">Online / Hybrid</option>
            </select>
          </div>

          {/* Fee Filter */}
          <div>
            <label className="text-[10px] text-slate-400 block font-semibold mb-1">Fee Type</label>
            <select
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All (Free & Paid)</option>
              <option value="free">Free Events Only</option>
              <option value="paid">Paid Events Only</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="text-[10px] text-slate-400 block font-semibold mb-1">Availability</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Seats Open</option>
              <option value="sold-out">Capacity Reached</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] text-slate-400 block font-semibold mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="upcoming">Upcoming Date</option>
              <option value="recommended">Personalized Match</option>
              <option value="popularity">Most Popular</option>
              <option value="newest">Recently Published</option>
            </select>
          </div>
        </div>

        {/* Filter Reset Strip */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            Showing <strong className="text-white">{events.length}</strong> approved events matching criteria
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs space-y-2">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Querying verified SRM event database...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <p className="text-base font-bold text-white">No events match your current filter parameters.</p>
          <p className="text-xs text-slate-400">Try loosening your category, fee, or format criteria.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onSelect={onSelectEvent}
                isRegistered={isRegisteredForEvent(evt.id)}
              />
            ))}
          </div>

          {/* Load More Option */}
          {visibleCount < events.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                Load More Events ({events.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

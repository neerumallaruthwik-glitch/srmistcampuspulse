import React from 'react';
import { Calendar, Clock, MapPin, Users, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export function EventCard({ event, onSelect, isRegistered }) {
  const occupancyRate = event.capacity > 0 ? Math.round(((event.registeredCount || 0) / event.capacity) * 100) : 0;
  const isFull = (event.registeredCount || 0) >= event.capacity;

  // Format human-friendly date
  const eventDateObj = new Date(event.date + 'T' + (event.startTime || '00:00'));
  const dateFormatted = eventDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  });

  return (
    <div 
      onClick={() => onSelect(event)}
      className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={event.posterUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide bg-slate-900/90 text-white backdrop-blur-md border border-white/10 shadow-md">
            {event.category}
          </span>

          {event.recommendationScore && event.recommendationScore >= 70 && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600/90 text-indigo-100 backdrop-blur-md shadow-lg border border-indigo-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{event.recommendationScore}% Match</span>
            </span>
          )}
        </div>

        {/* Status or Already Registered Indicator */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {isRegistered ? (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/90 text-white flex items-center gap-1 shadow-md">
              <CheckCircle className="w-3.5 h-3.5" />
              Registered
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
              Organized by {event.organizerClub || event.organizerName}
            </span>
          )}

          <span className="text-[11px] font-bold text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
            {event.date}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Date, Time & Venue Details */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{dateFormatted}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{event.startTime} – {event.endTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{event.venueName}</span>
          </div>
        </div>

        {/* Capacity Bar & CTA */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              <span>{event.registeredCount || 0} / {event.capacity} seats</span>
            </span>
            <span className={`font-semibold ${isFull ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isFull ? 'Sold Out' : `${Math.max(event.capacity - (event.registeredCount || 0), 0)} left`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupancyRate > 90 ? 'bg-rose-500' : occupancyRate > 60 ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(occupancyRate, 100)}%` }}
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(event);
            }}
            className={`w-full mt-2 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              isRegistered
                ? 'bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/40'
                : isFull
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            <span>{isRegistered ? 'View My Ticket Pass' : isFull ? 'Join Waitlist' : 'View Details & Register'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

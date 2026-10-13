import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Building, Sparkles, ArrowRight } from 'lucide-react';

export function ConflictWarningBanner({ conflictReport, onApplySlot, onApplyVenue }) {
  if (!conflictReport) return null;

  if (!conflictReport.hasConflict) {
    return (
      <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
        <div className="flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><strong>Venue Clear:</strong> No scheduling overlaps detected for {conflictReport.venueName}.</span>
        </div>
        <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">CLEAR</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 to-rose-950/70 border border-amber-500/50 shadow-xl text-xs space-y-3 animate-in fade-in">
      {/* Alert Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <h4 className="font-extrabold text-amber-200 text-sm">
              Smart Venue Conflict Warning!
            </h4>
            <p className="text-amber-300/90 text-xs mt-0.5">
              {conflictReport.message}
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 shrink-0 uppercase tracking-wider">
          Conflict Detected
        </span>
      </div>

      {/* Conflicting Events List */}
      {conflictReport.conflicts && conflictReport.conflicts.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Overlapping Booking(s):</p>
          {conflictReport.conflicts.map((c, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] text-slate-200">
              <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{c.title}</span>
              <span className="font-mono text-amber-300 font-bold">{c.startTime} – {c.endTime}</span>
            </div>
          ))}
        </div>
      )}

      {/* Smart Suggestions Matrix */}
      <div className="pt-2 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Suggested Alternative Time Slots */}
        {conflictReport.suggestedTimeSlots && conflictReport.suggestedTimeSlots.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-400" />
              Suggested Time Slots (Same Venue):
            </span>
            <div className="space-y-1">
              {conflictReport.suggestedTimeSlots.map((slot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onApplySlot && onApplySlot(slot)}
                  className="w-full text-left p-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-indigo-200 text-[11px] flex items-center justify-between transition-colors group"
                >
                  <span className="font-medium">{slot.label}</span>
                  <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Apply <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Alternative Available Venues */}
        {conflictReport.suggestedVenues && conflictReport.suggestedVenues.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-300 flex items-center gap-1">
              <Building className="w-3 h-3 text-emerald-400" />
              Alternative Free Venues (Same Slot):
            </span>
            <div className="space-y-1">
              {conflictReport.suggestedVenues.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onApplyVenue && onApplyVenue(v)}
                  className="w-full text-left p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-200 text-[11px] flex items-center justify-between transition-colors group"
                >
                  <div>
                    <span className="font-medium text-white">{v.name}</span>
                    <span className="text-[10px] text-emerald-300/80 block">Capacity: {v.capacity} seats</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Switch <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

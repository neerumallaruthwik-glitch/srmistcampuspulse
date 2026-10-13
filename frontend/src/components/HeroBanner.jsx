import React from 'react';
import { Search, Sparkles, Calendar, MapPin, Zap, Flame, ShieldCheck, ArrowRight } from 'lucide-react';

export function HeroBanner({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories, onActionClick, role }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-900/90 to-slate-950 border border-slate-800/80 p-6 md:p-10 mb-8 shadow-2xl">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
        {/* Campus Live Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span>CampusPulse Live Fall Semester 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Discover Better. Organize Smarter.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            Connect Campus.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The two-sided smart campus event platform. Stop hunting through WhatsApp groups and posters.
          Explore verified events, claim instant QR passes, or create events in seconds with AI poster extraction.
        </p>

        {/* Live Search Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-indigo-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search hackathons, guest lectures, cultural fests, sports, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-20 text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {}}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Live Feature Highlights Row */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto border-t border-slate-800/80 text-left">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-200">AI Poster OCR</p>
              <p className="text-[10px] text-slate-400">Auto-fill in 3 seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-200">Zero Venue Clashes</p>
              <p className="text-[10px] text-slate-400">Smart Conflict Radar</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
            <Flame className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-200">Tamper-Proof QR</p>
              <p className="text-[10px] text-slate-400">Anti-duplicate check-in</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-200">For You Match</p>
              <p className="text-[10px] text-slate-400">Personalized feeds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

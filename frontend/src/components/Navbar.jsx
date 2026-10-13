import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Calendar, 
  Ticket, 
  UploadCloud, 
  ShieldCheck, 
  BarChart3, 
  QrCode, 
  Users, 
  Bell, 
  RotateCcw, 
  ChevronDown, 
  UserCheck,
  Building,
  Menu,
  X,
  Compass,
  LayoutDashboard
} from 'lucide-react';

export function Navbar({ 
  currentView, 
  setCurrentView, 
  onOpenAuth, 
  onResetDemo, 
  onOpenNotifications,
  unreadNotifsCount = 0,
  pendingAdminCount = 2
}) {
  const { user, role, demoUsers, switchRoleUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
      {/* Top Banner: SRM Ramapuram Persona Switcher for Live Evaluation */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline text-slate-400">SRM IST Demo Persona:</span>
            <span className="text-slate-200">Logged in as <strong className="text-indigo-300 font-semibold">{user?.name}</strong></span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              role === 'organizer' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {role}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[11px] text-slate-400 mr-1 hidden md:inline">1-Click Role Switch:</span>
            {demoUsers.map((u) => {
              const isActive = user?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => switchRoleUser(u.id)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`Switch persona to ${u.name} (${u.role})`}
                >
                  <img src={u.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                  <span>{u.name.split(' ')[0]}</span>
                  <span className="text-[9px] opacity-75">({u.role === 'admin' ? 'Dean' : u.role === 'organizer' ? 'Org' : 'Std'})</span>
                </button>
              );
            })}

            <button
              onClick={onResetDemo}
              className="ml-2 px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-amber-300 hover:bg-slate-800 flex items-center gap-1 transition-colors border border-dashed border-slate-700"
              title="Reset all demo data to fresh seeds"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Public & Portal Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Academic Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  SRM CampusPulse
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  HUB
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium hidden sm:block">
                Smart Campus Event Hub • SRM IST Ramapuram
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'home'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentView('explore')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'explore'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Explore Events
            </button>

            <button
              onClick={() => setCurrentView('tickets')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'tickets'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-emerald-400" />
              My Tickets & Certificates
            </button>

            <button
              onClick={() => setCurrentView('student-dashboard')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'student-dashboard'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
              Student Dashboard
            </button>

            <button
              onClick={() => setCurrentView('organizer')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'organizer'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-purple-400" />
              Organizer Portal
            </button>

            {role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`relative px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                    : 'text-amber-300 hover:text-white hover:bg-amber-900/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Dean Review
                {pendingAdminCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    {pendingAdminCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'analytics'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              Analytics
            </button>
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950 animate-pulse" />
              )}
            </button>

            {/* Profile Avatar Card */}
            <div 
              onClick={onOpenAuth}
              className="flex items-center gap-2.5 pl-2 border-l border-slate-800 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={user?.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/30"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-200 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">{user?.studentOrStaffId || user?.department}</p>
              </div>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => { setCurrentView('explore'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800"
          >
            Explore Events
          </button>
          <button
            onClick={() => { setCurrentView('tickets'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800"
          >
            My Tickets & Certificates
          </button>
          <button
            onClick={() => { setCurrentView('student-dashboard'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800"
          >
            Student Dashboard
          </button>
          <button
            onClick={() => { setCurrentView('organizer'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-purple-300 hover:bg-purple-900/30"
          >
            Organizer Portal
          </button>
          {role === 'admin' && (
            <button
              onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-amber-300 hover:bg-amber-900/30"
            >
              Dean Review Queue ({pendingAdminCount})
            </button>
          )}
          <button
            onClick={() => { setCurrentView('analytics'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-cyan-300 hover:bg-slate-800"
          >
            Campus Analytics
          </button>
        </div>
      )}
    </header>
  );
}

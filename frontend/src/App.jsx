import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ExploreEventsPage } from './components/ExploreEventsPage';
import { MyTicketsAndCertificatesPage } from './components/MyTicketsAndCertificatesPage';
import { StudentDashboardPage } from './components/StudentDashboardPage';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { EventDetailModal } from './components/EventDetailModal';
import { DigitalTicketPass } from './components/DigitalTicketPass';
import { NotificationCenter } from './components/NotificationCenter';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { api } from './services/api';

function MainApp() {
  const { user, role, showToast } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // 'home', 'explore', 'tickets', 'student-dashboard', 'organizer', 'admin', 'analytics'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [pendingAdminCount, setPendingAdminCount] = useState(2);

  // Active Event Modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Active Ticket Pass Modal
  const [activeTicketPass, setActiveTicketPass] = useState(null);
  // Student's registered tickets cache
  const [myTickets, setMyTickets] = useState([]);

  // Fetch student tickets & pending admin items
  const refreshUserTickets = async () => {
    if (user?.id) {
      try {
        const [ticketsRes, notifsRes, adminRes] = await Promise.all([
          api.getMyRegistrations(user.id),
          api.getNotifications(user.id),
          api.getPendingEvents()
        ]);

        if (ticketsRes.success) setMyTickets(ticketsRes.registrations);
        if (notifsRes.success) setUnreadCount(notifsRes.unreadCount || 0);
        if (adminRes.success) setPendingAdminCount(adminRes.pendingEvents?.length || 0);
      } catch (e) {
        console.error('Failed to sync user state:', e);
      }
    }
  };

  useEffect(() => {
    refreshUserTickets();
  }, [user, currentView]);

  const isRegisteredForEvent = (eventId) => {
    return myTickets.some(t => t.eventId === eventId && t.status !== 'cancelled');
  };

  const getExistingTicket = (eventId) => {
    return myTickets.find(t => t.eventId === eventId && t.status !== 'cancelled');
  };

  const handleResetDemoData = async () => {
    if (window.confirm('Reset SRM CampusPulse demo events, registrations, venues, and check-in logs to fresh seed defaults?')) {
      try {
        await api.resetDemoData();
        showToast('SRM CampusPulse demo data reset successfully!', 'success');
        setTimeout(() => window.location.reload(), 500);
      } catch (err) {
        showToast('Failed to reset demo data', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAuth={() => setIsAuthOpen(true)}
        onResetDemo={handleResetDemoData}
        onOpenNotifications={() => setIsNotifsOpen(true)}
        unreadNotifsCount={unreadCount}
        pendingAdminCount={pendingAdminCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'home' && (
          <HomePage
            onNavigate={(view, params) => {
              setCurrentView(view);
            }}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            isRegisteredForEvent={isRegisteredForEvent}
          />
        )}

        {currentView === 'explore' && (
          <ExploreEventsPage
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            isRegisteredForEvent={isRegisteredForEvent}
          />
        )}

        {currentView === 'tickets' && (
          <MyTicketsAndCertificatesPage
            onNavigateExplore={() => setCurrentView('explore')}
          />
        )}

        {currentView === 'student-dashboard' && (
          <StudentDashboardPage
            onNavigate={(view) => setCurrentView(view)}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
          />
        )}

        {currentView === 'organizer' && (
          <OrganizerDashboard
            activeTab="organizer-events"
            setActiveTab={() => {}}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            activeTab="admin-approvals"
            setActiveTab={() => {}}
            onRefreshCounts={setPendingAdminCount}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsDashboard />
        )}
      </main>

      {/* University Footer */}
      <Footer />

      {/* Event Details & Registration Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isAlreadyRegistered={isRegisteredForEvent(selectedEvent.id)}
          existingTicket={getExistingTicket(selectedEvent.id)}
          onRegisteredSuccess={(newTicket) => {
            setSelectedEvent(null);
            refreshUserTickets();
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

      {/* In-App Notifications Drawer */}
      <NotificationCenter
        isOpen={isNotifsOpen}
        onClose={() => {
          setIsNotifsOpen(false);
          refreshUserTickets();
        }}
      />

      {/* Sign In / Sign Up Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

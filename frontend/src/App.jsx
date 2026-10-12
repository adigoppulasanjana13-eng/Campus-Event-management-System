import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { eventService, registrationService } from './services/api';
import { Navbar } from './components/Navbar';
import { EventCard } from './components/EventCard';
import { EventModal } from './components/EventModal';
import { EventFormModal } from './components/EventFormModal';
import { MyTicketsModal } from './components/MyTicketsModal';
import { AdminRegistrationsModal } from './components/AdminRegistrationsModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Search, Sparkles, Calendar, Users, Award, Shield, PlusCircle, RefreshCw } from 'lucide-react';

export function App() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Events & Filters
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Modals & State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);
  const [isAdminRosterOpen, setIsAdminRosterOpen] = useState(false);

  // Tickets & Attendees
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [lastRegistration, setLastRegistration] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const data = await eventService.getAll(selectedCategory, searchQuery);
      setEvents(data);
    } catch (err) {
      showToast('Failed to load events: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await eventService.getCategories();
      setCategories(['All', ...(data || [])]);
    } catch (err) {
      console.warn('Failed to fetch categories:', err);
      setCategories(['All', 'Hackathon', 'Workshop', 'Cultural', 'Seminar', 'Sports']);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenMyTickets = async () => {
    setIsTicketsOpen(true);
    if (isAuthenticated) {
      try {
        setIsLoadingTickets(true);
        const data = await registrationService.getMyRegistrations();
        setMyRegistrations(data);
      } catch (err) {
        showToast('Failed to load registrations: ' + (err.response?.data?.message || err.message), 'error');
      } finally {
        setIsLoadingTickets(false);
      }
    }
  };

  const handleRegister = async (event) => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
      showToast('Please sign in or register to book a ticket', 'info');
      return;
    }

    try {
      setIsRegistering(true);
      const res = await registrationService.register(event.id);
      setLastRegistration(res);
      showToast(`Success! You have registered for ${event.title}`, 'success');

      // Refresh event capacity
      fetchEvents();

      // If viewing modal, refresh it
      if (selectedEvent && selectedEvent.id === event.id) {
        setSelectedEvent({
          ...selectedEvent,
          currentCapacity: (selectedEvent.currentCapacity || 0) + 1,
        });
      }
    } catch (err) {
      const errorResponse = err.response?.data;
      const message = errorResponse?.message || err.message || 'Registration failed';
      showToast(message, 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    try {
      await registrationService.cancel(registrationId);
      showToast('Registration cancelled successfully', 'info');
      // Refresh my registrations list
      const data = await registrationService.getMyRegistrations();
      setMyRegistrations(data);
      // Refresh events to reflect decremented capacity
      fetchEvents();
    } catch (err) {
      showToast('Failed to cancel registration: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleViewAttendees = async (event) => {
    setSelectedEvent(event);
    setIsAdminRosterOpen(true);
    try {
      setIsLoadingAttendees(true);
      const data = await registrationService.getEventRegistrations(event.id);
      setAttendees(data);
    } catch (err) {
      showToast('Failed to load attendees: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsLoadingAttendees(false);
    }
  };

  const handleCreateOrUpdateEvent = async (formData) => {
    try {
      if (editingEvent) {
        await eventService.update(editingEvent.id, formData);
        showToast('Event updated successfully!', 'success');
      } else {
        await eventService.create(formData);
        showToast('Event created successfully!', 'success');
      }
      setIsEventFormOpen(false);
      setEditingEvent(null);
      fetchEvents();
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save event';
      showToast(msg, 'error');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    try {
      await eventService.delete(id);
      showToast('Event deleted successfully', 'info');
      fetchEvents();
    } catch (err) {
      showToast('Failed to delete event: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  // Calculations for Hero Stats
  const totalSpots = events.reduce((acc, curr) => acc + (curr.maxCapacity || 0), 0);
  const filledSpots = events.reduce((acc, curr) => acc + (curr.currentCapacity || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMyTickets={handleOpenMyTickets}
        onOpenCreateEvent={() => {
          setEditingEvent(null);
          setIsEventFormOpen(true);
        }}
        showToast={showToast}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Hero Section */}
        <section className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-800 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Event Management System (CEMS)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Discover, Organize & Attend Premier Campus Events.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore upcoming hackathons, tech workshops, symposiums, and cultural festivals. 
              Real-time capacity tracking, instant digital ticket reservations, and secure campus administration.
            </p>

            {/* Live Stats */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                <div className="flex items-center gap-2 text-indigo-400 text-xs mb-1">
                  <Calendar className="w-4 h-4" /> Live Events
                </div>
                <div className="text-2xl font-bold text-white">{events.length}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1">
                  <Users className="w-4 h-4" /> Enrolled
                </div>
                <div className="text-2xl font-bold text-white">{filledSpots}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                <div className="flex items-center gap-2 text-purple-400 text-xs mb-1">
                  <Award className="w-4 h-4" /> Total Seats
                </div>
                <div className="text-2xl font-bold text-white">{totalSpots}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                <div className="flex items-center gap-2 text-cyan-400 text-xs mb-1">
                  <Shield className="w-4 h-4" /> Security
                </div>
                <div className="text-sm font-bold text-white mt-1">JWT & RBAC</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Category Filter Controls */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events by title, keyword, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={fetchEvents}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-2 transition-all"
                title="Refresh events"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setIsEventFormOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Events Grid */}
        <section>
          {isLoadingEvents ? (
            <div className="py-24 text-center">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-400">Loading campus events directory...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="py-20 text-center glass-panel rounded-3xl p-8 border border-slate-800">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Events Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No events matched your search query or selected category filter. Try clearing your filters or create a new event.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelectEvent={(ev) => setSelectedEvent(ev)}
                  onRegister={handleRegister}
                  onEdit={(ev) => {
                    setEditingEvent(ev);
                    setIsEventFormOpen(true);
                  }}
                  onDelete={handleDeleteEvent}
                  onViewAttendees={handleViewAttendees}
                  isRegistering={isRegistering}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Campus Event Management System (CEMS). High-Performance Enterprise Architecture.</p>
          <p className="text-slate-400 font-medium">Spring Boot 3 • Spring Security 6 • React 18 • MySQL 8.0</p>
        </div>
      </footer>

      {/* Modals */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRegister={handleRegister}
        isRegistering={isRegistering}
        lastRegistration={lastRegistration}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <EventFormModal
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleCreateOrUpdateEvent}
        editingEvent={editingEvent}
        isLoading={false}
      />

      <MyTicketsModal
        isOpen={isTicketsOpen}
        onClose={() => setIsTicketsOpen(false)}
        registrations={myRegistrations}
        isLoading={isLoadingTickets}
        onCancelRegistration={handleCancelRegistration}
      />

      <AdminRegistrationsModal
        event={selectedEvent}
        isOpen={isAdminRosterOpen}
        onClose={() => {
          setIsAdminRosterOpen(false);
          setSelectedEvent(null);
        }}
        attendees={attendees}
        isLoading={isLoadingAttendees}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        showToast={showToast}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;

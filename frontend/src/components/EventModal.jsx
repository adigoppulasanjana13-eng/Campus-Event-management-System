import React from 'react';
import { X, Calendar, MapPin, Users, User, CheckCircle2, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EventModal = ({
  event,
  onClose,
  onRegister,
  isRegistering,
  lastRegistration,
  onOpenAuth,
}) => {
  if (!event) return null;
  const { isAuthenticated } = useAuth();

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(event.eventDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const current = event.currentCapacity || 0;
  const max = event.maxCapacity || 1;
  const percentFilled = Math.min(100, Math.round((current / max) * 100));
  const isFull = current >= max;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 max-h-[90vh] flex flex-col">
        {/* Banner with Close button */}
        <div className="relative h-64 w-full bg-slate-800 shrink-0">
          <img
            src={
              event.bannerUrl ||
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
            }
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
              {event.category}
            </span>
            <h2 className="text-2xl font-bold text-white mt-2 drop-shadow-md">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Recent Registration Confirmation Alert */}
          {lastRegistration && lastRegistration.eventId === event.id && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Registration Confirmed!</h4>
                <p className="text-xs text-emerald-400/90 mt-0.5">
                  Your ticket has been generated: <span className="font-mono font-bold">{lastRegistration.ticketCode}</span>
                </p>
              </div>
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400">Date & Time</p>
                <p className="font-semibold text-white">{formattedDate} at {formattedTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400">Location / Venue</p>
                <p className="font-semibold text-white">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400">Organized By</p>
                <p className="font-semibold text-white">{event.organizerName || 'Campus Administration'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400">Capacity Status</p>
                <p className="font-semibold text-white">{current} / {max} Registered ({percentFilled}%)</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">About this Event</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed whitespace-pre-line">
              {event.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Capacity Bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Enrollment Progress</span>
              <span className={isFull ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                {isFull ? 'Event is Full' : `${max - current} seats remaining`}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/40 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all"
          >
            Close
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => onRegister(event)}
              disabled={isFull || isRegistering}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg transition-all ${
                isFull
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25 active:scale-95'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>{isRegistering ? 'Registering...' : isFull ? 'Event Full' : 'Confirm Registration'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              Sign In to Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

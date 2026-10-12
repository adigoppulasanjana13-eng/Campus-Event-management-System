import React from 'react';
import { Calendar, MapPin, Users, Edit3, Trash2, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EventCard = ({
  event,
  onSelectEvent,
  onRegister,
  onEdit,
  onDelete,
  onViewAttendees,
  isRegistering,
}) => {
  const { isAdmin, isAuthenticated } = useAuth();

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
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

  const categoryColors = {
    Hackathon: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    Workshop: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Cultural: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    Seminar: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Sports: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  };

  const badgeClass =
    categoryColors[event.category] || 'bg-slate-700/40 text-slate-300 border-slate-600/40';

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 group">
      {/* Banner Media */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={
            event.bannerUrl ||
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
          }
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border backdrop-blur-md ${badgeClass}`}>
            {event.category}
          </span>
        </div>

        {/* Status Pill */}
        <div className="absolute top-3 right-3">
          {isFull ? (
            <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-rose-500/90 text-white shadow-lg shadow-rose-500/30">
              Sold Out
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              {max - current} spots left
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1 mb-2 group-hover:text-indigo-300 transition-colors">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {event.description || 'No additional description provided.'}
          </p>
        </div>

        {/* Capacity Progress Bar */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Capacity
            </span>
            <span className={isFull ? 'text-rose-400 font-bold' : 'text-slate-300'}>
              {current} / {max} ({percentFilled}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isFull
                  ? 'bg-rose-500'
                  : percentFilled > 80
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>

          {/* Actions Bar */}
          <div className="mt-4 flex items-center gap-2">
            {isAdmin ? (
              <>
                <button
                  onClick={() => onViewAttendees(event)}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  title="View attendee list"
                >
                  <Shield className="w-3.5 h-3.5" /> Attendees ({current})
                </button>
                <button
                  onClick={() => onEdit(event)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all"
                  title="Edit event"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-all"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSelectEvent(event)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
                >
                  Details
                </button>
                <button
                  onClick={() => onRegister(event)}
                  disabled={isFull || isRegistering}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isFull
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95'
                  }`}
                >
                  <span>{isFull ? 'Capacity Reached' : 'Register'}</span>
                  {!isFull && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

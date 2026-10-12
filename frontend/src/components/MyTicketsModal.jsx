import React from 'react';
import { X, Ticket, Calendar, MapPin, Trash2, CheckCircle2, Clock } from 'lucide-react';

export const MyTicketsModal = ({
  isOpen,
  onClose,
  registrations,
  isLoading,
  onCancelRegistration,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">My Registered Tickets</h3>
              <p className="text-xs text-slate-400">
                Active passes and event registrations for your student ID
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading your tickets...</div>
          ) : registrations.length === 0 ? (
            <div className="py-12 text-center">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-slate-300">No event registrations found</h4>
              <p className="text-xs text-slate-500 mt-1">
                Browse our upcoming campus workshops, hackathons, and sports events to claim your spot!
              </p>
            </div>
          ) : (
            registrations.map((reg) => {
              const formattedDate = reg.eventDate
                ? new Date(reg.eventDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Date TBA';

              const isCancelled = reg.status === 'CANCELLED';

              return (
                <div
                  key={reg.id}
                  className={`relative p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCancelled
                      ? 'bg-slate-900/40 border-slate-800/80 opacity-60'
                      : 'bg-slate-900/90 border-slate-700/80 shadow-lg'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        {reg.ticketCode}
                      </span>
                      {isCancelled ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Cancelled
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white tracking-tight">
                      {reg.eventTitle || 'Campus Event'}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {reg.eventLocation || 'Campus Venue'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" /> Booked: {new Date(reg.registeredAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="sm:border-l sm:border-slate-800 sm:pl-4 flex items-center">
                      <button
                        onClick={() => onCancelRegistration(reg.id)}
                        className="w-full sm:w-auto px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        title="Cancel this ticket reservation"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Cancel Ticket
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

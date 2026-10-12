import React from 'react';
import { X, Users, Mail, GraduationCap, Ticket, Shield } from 'lucide-react';

export const AdminRegistrationsModal = ({
  event,
  isOpen,
  onClose,
  attendees,
  isLoading,
}) => {
  if (!isOpen || !event) return null;

  const confirmedCount = attendees.filter((a) => a.status === 'REGISTERED').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Attendee Roster</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                  {confirmedCount} / {event.maxCapacity} Confirmed
                </span>
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Event: <span className="text-slate-200 font-semibold">{event.title}</span>
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

        {/* Attendee Table */}
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading attendees...</div>
          ) : attendees.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-slate-300">No registrations yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                No students have enrolled in this event yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Attendee</th>
                    <th className="py-3 px-4">Dept / ID</th>
                    <th className="py-3 px-4">Ticket Code</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {attendees.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{attendee.userName}</div>
                        <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{attendee.userEmail}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1 font-medium">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{attendee.department || 'General'}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 font-mono">
                          {attendee.studentId || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                        {attendee.ticketCode}
                      </td>
                      <td className="py-3.5 px-4">
                        {attendee.status === 'REGISTERED' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Confirmed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(attendee.registeredAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Total Records: <span className="font-semibold text-white">{attendees.length}</span>
          </div>
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

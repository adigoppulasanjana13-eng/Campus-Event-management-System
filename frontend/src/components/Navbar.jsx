import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Ticket, ShieldCheck, LogIn, LogOut, User, Sparkles, PlusCircle } from 'lucide-react';

export const Navbar = ({ onOpenAuth, onOpenMyTickets, onOpenCreateEvent, showToast }) => {
  const { user, isAuthenticated, isAdmin, logout, quickLogin } = useAuth();

  const handleQuick = async (role) => {
    try {
      const u = await quickLogin(role);
      showToast(`Signed in as ${u.name} (${role})`, 'success');
    } catch (err) {
      showToast('Quick login failed: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                CEMS
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Campus Events
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Campus Event Management System</p>
          </div>
        </div>

        {/* Demo Quick Logins */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo Switcher:
          </span>
          <button
            onClick={() => handleQuick('STUDENT')}
            className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all font-medium active:scale-95"
            title="Log in as Student Alex Rivera"
          >
            Student Mode
          </button>
          <button
            onClick={() => handleQuick('ADMIN')}
            className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-all font-medium active:scale-95"
            title="Log in as Admin Dean of Affairs"
          >
            Admin Mode
          </button>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <button
                  onClick={onOpenCreateEvent}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Event</span>
                </button>
              )}

              <button
                onClick={onOpenMyTickets}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all"
              >
                <Ticket className="w-4 h-4 text-indigo-400" />
                <span>My Tickets</span>
              </button>

              {/* User Profile Chip */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 text-sm font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    {user.name}
                    {isAdmin ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                        ADMIN
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                        STUDENT
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                    {user.department || user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  showToast('Signed out successfully', 'info');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Calendar, LogOut, Bot } from 'lucide-react';

const Profile = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl">
        
        <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-brand-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 ${
                isAdmin ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
              }`}>
                {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <span>🎓</span>}
                {user?.role?.toUpperCase()} ROLE
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm">
            <div className="flex items-center space-x-3 text-slate-400">
              <User className="w-4 h-4 text-brand-400" />
              <span>Full Name</span>
            </div>
            <span className="font-semibold text-white">{user?.name}</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm">
            <div className="flex items-center space-x-3 text-slate-400">
              <Mail className="w-4 h-4 text-purple-400" />
              <span>Email Address</span>
            </div>
            <span className="font-semibold text-white">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm">
            <div className="flex items-center space-x-3 text-slate-400">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Account Registered</span>
            </div>
            <span className="font-semibold text-white">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Account</span>
        </button>

      </div>
    </div>
  );
};

export default Profile;

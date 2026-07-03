import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="glass-panel sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            HireTrack
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Personal
          </span>
        </div>
      </div>

      {user && (
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
              {user.username ? user.username.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <span className="hidden md:inline text-sm font-medium text-slate-700">
              {user.username}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

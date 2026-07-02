import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { Loader2, Briefcase } from 'lucide-react';

function App() {
  const { user, loading } = useContext(AuthContext);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <span className="text-sm font-semibold tracking-wider text-slate-400">Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-indigo-200">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center">
        {user ? (
          <div className="w-full">
            <Dashboard />
          </div>
        ) : (
          <div className="py-12 px-4 w-full flex justify-center">
            {isRegisterMode ? (
              <Register onSwitchToLogin={() => setIsRegisterMode(false)} />
            ) : (
              <Login onSwitchToRegister={() => setIsRegisterMode(true)} />
            )}
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} HireTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Stats from './Stats';
import InterviewCard from './InterviewCard';
import InterviewModal from './InterviewModal';
import { Search, Filter, Plus, CalendarRange, History, Loader2, Sparkles, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviewToEdit, setInterviewToEdit] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (statusFilter && statusFilter !== 'All') {
          queryParams.append('status', statusFilter);
        }
        if (search) {
          queryParams.append('search', search);
        }

        const res = await fetch(`${API_URL}/interviews?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setInterviews(data);
        }
      } catch (err) {
        console.error('Error fetching interviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [token, statusFilter, search, refreshTrigger, API_URL]);

  // Handle Add/Edit Form submission
  const handleModalSubmit = async (payload) => {
    try {
      const url = interviewToEdit
        ? `${API_URL}/interviews/${interviewToEdit._id}`
        : `${API_URL}/interviews`;
      const method = interviewToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error submitting interview:', err);
      return false;
    }
  };

  // Handle quick status update from card
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/interviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Optimistic UI update or trigger refresh
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interview application?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/interviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error deleting interview:', err);
    }
  };

  const handleEdit = (interview) => {
    setInterviewToEdit(interview);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setInterviewToEdit(null);
    setIsModalOpen(true);
  };

  // Divide interviews into Upcoming vs Completed/Past
  const now = new Date();
  const upcomingInterviews = interviews
    .filter(i => new Date(i.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Soonest first

  const pastInterviews = interviews
    .filter(i => new Date(i.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            Interview Dashboard <Sparkles className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Organize your job search pipeline, track outcomes, and manage schedule.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="mt-4 md:mt-0 flex items-center justify-center space-x-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Interview</span>
        </button>
      </div>

      {/* Stats component */}
      <Stats interviews={interviews} />

      {/* Search and Filters bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-slate-200 text-sm focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3.5">
          <div className="flex items-center space-x-2 text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Status:</span>
          </div>

          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
            {['All', 'Pending', 'Selected', 'Rejected'].map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => setStatusFilter(statusOption)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-tight transition duration-150 cursor-pointer ${
                  statusFilter === statusOption
                    ? statusOption === 'Selected'
                      ? 'bg-emerald-600 text-white'
                      : statusOption === 'Rejected'
                      ? 'bg-rose-600 text-white'
                      : statusOption === 'Pending'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {statusOption === 'Selected' ? 'Offer' : statusOption}
              </button>
            ))}
          </div>

          <button
            onClick={() => setRefreshTrigger(p => p + 1)}
            className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main List Columns */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Loading interview log...</span>
        </div>
      ) : interviews.length === 0 ? (
        <div className="glass-panel border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center max-w-xl mx-auto mt-6">
          <CalendarRange className="w-16 h-16 text-indigo-500/40 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No interviews found</h3>
          <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
            {search || statusFilter !== 'All'
              ? "We couldn't find any results matching your search or filters. Try resetting them."
              : "You haven't added any interview logs yet. Keep track of your recruitment funnel."}
          </p>
          {(search || statusFilter !== 'All') ? (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
              className="px-4 py-2 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Reset Search & Filters
            </button>
          ) : (
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
            >
              Add Your First Application
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-800">
              <CalendarRange className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Upcoming Interviews</h2>
              <span className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {upcomingInterviews.length}
              </span>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-800/80 rounded-2xl text-slate-500 text-xs sm:text-sm">
                No upcoming interviews scheduled.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {upcomingInterviews.map((interview) => (
                  <InterviewCard
                    key={interview._id}
                    interview={interview}
                    onUpdateStatus={handleUpdateStatus}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Past/Completed Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-800">
              <History className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Completed / Past</h2>
              <span className="bg-slate-800 text-slate-400 border border-slate-700/50 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {pastInterviews.length}
              </span>
            </div>

            {pastInterviews.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-800/80 rounded-2xl text-slate-500 text-xs sm:text-sm">
                No completed or past interviews.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pastInterviews.map((interview) => (
                  <InterviewCard
                    key={interview._id}
                    interview={interview}
                    onUpdateStatus={handleUpdateStatus}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal addition/edit */}
      <InterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        interviewToEdit={interviewToEdit}
      />
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  DollarSign,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Layers,
  FileText,
  AlertTriangle
} from 'lucide-react';

const SHORTLIST_LEVELS = ['Screening', 'Aptitude', 'Technical', 'HR', 'Final'];

const InterviewCard = ({ interview, onUpdateStatus, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Selected':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          border: 'border-emerald-200'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          border: 'border-rose-200'
        };
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          border: 'border-amber-200'
        };
    }
  };

  const statusStyles = getStatusStyles(interview.status);

  // Get the index of the current shortlist level
  const currentLevelIndex = SHORTLIST_LEVELS.indexOf(interview.shortlistLevel || 'Screening');

  // Format Date & Time
  const interviewDate = new Date(interview.date);
  const formattedDate = interviewDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = interviewDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleRejectClick = () => {
    setShowRejectInput(true);
    setRejectReason('');
  };

  const handleRejectSubmit = () => {
    if (rejectReason.trim()) {
      onUpdateStatus(interview._id, 'Rejected', rejectReason.trim());
      setShowRejectInput(false);
      setRejectReason('');
    }
  };

  const handleRejectCancel = () => {
    setShowRejectInput(false);
    setRejectReason('');
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-3.5">
          <div>
            <h4 className="font-bold text-lg text-slate-800 leading-tight">{interview.company}</h4>
            <p className="text-slate-500 text-sm font-medium mt-0.5">{interview.role}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1.5 ${statusStyles.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`}></span>
            <span>{interview.status}</span>
          </span>
        </div>

        {/* Shortlist Level Step Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Round Progress</span>
            <span className="text-[10px] font-semibold text-indigo-600">
              {interview.shortlistLevel || 'Screening'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {SHORTLIST_LEVELS.map((level, idx) => {
              const isCompleted = idx < currentLevelIndex;
              const isCurrent = idx === currentLevelIndex;
              const isRejectedHere = interview.status === 'Rejected' && isCurrent;

              return (
                <div key={level} className="flex-1 flex flex-col items-center gap-1">
                  {/* Step bar */}
                  <div
                    className={`w-full h-1.5 rounded-full transition-all duration-500 ${
                      isRejectedHere
                        ? 'bg-rose-500 shadow-sm shadow-rose-500/30'
                        : isCompleted
                        ? 'bg-indigo-500'
                        : isCurrent
                        ? interview.status === 'Selected'
                          ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
                          : 'bg-indigo-500 shadow-sm shadow-indigo-500/30'
                        : 'bg-slate-200'
                    }`}
                  />
                  {/* Step label */}
                  <span
                    className={`text-[8px] font-bold tracking-wide leading-none ${
                      isRejectedHere
                        ? 'text-rose-500'
                        : isCompleted || isCurrent
                        ? 'text-slate-600'
                        : 'text-slate-300'
                    }`}
                  >
                    {level.slice(0, 4)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rejection Reason Callout */}
        {interview.status === 'Rejected' && interview.rejectionReason && (
          <div className="mb-3 p-3 bg-rose-50 border border-rose-100 rounded-xl animate-fade-in">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block mb-0.5">Rejection Reason</span>
                <p className="text-xs text-slate-600 leading-relaxed">{interview.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Date and Type */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs sm:text-sm text-slate-600 space-x-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-slate-600 space-x-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>{interview.type} Round</span>
          </div>
        </div>

        {/* Status quick changer */}
        {!showRejectInput ? (
          <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Set Status:</span>
            {['Pending', 'Selected', 'Rejected'].map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => {
                  if (statusOption === 'Rejected') {
                    handleRejectClick();
                  } else {
                    onUpdateStatus(interview._id, statusOption);
                  }
                }}
                className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                  interview.status === statusOption
                    ? statusOption === 'Selected'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : statusOption === 'Rejected'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                {statusOption === 'Selected' ? 'Offer' : statusOption === 'Rejected' ? 'Rej.' : 'Pend.'}
              </button>
            ))}
          </div>
        ) : (
          /* Inline reject reason input */
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 mb-3 animate-fade-in">
            <label className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block mb-1.5">
              Why was this rejected?
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg glass-input text-slate-700 text-xs resize-none border-rose-200 focus:border-rose-500 mb-2"
              autoFocus
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={handleRejectCancel}
                className="px-3 py-1 rounded-lg text-[11px] font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className="px-3 py-1 rounded-lg text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="border-t border-slate-200 pt-4 mt-1.5 space-y-3.5 text-xs sm:text-sm text-slate-600 animate-fade-in">
          {interview.location && (
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Location</span>
                <span>{interview.location}</span>
              </div>
            </div>
          )}

          {interview.salary && (
            <div className="flex items-start space-x-2">
              <DollarSign className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Salary/Comp</span>
                <span>{interview.salary}</span>
              </div>
            </div>
          )}

          {interview.jobDescriptionUrl && (
            <div className="flex items-start space-x-2">
              <ExternalLink className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Job Post</span>
                <a
                  href={interview.jobDescriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline inline-flex items-center space-x-1"
                >
                  <span>Link to Job Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {interview.notes && (
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="w-full">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Preparations / Notes</span>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1 whitespace-pre-line text-slate-600 leading-relaxed max-h-32 overflow-y-auto">
                  {interview.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Actions Footer */}
      <div className="border-t border-slate-200 pt-3 mt-4 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-indigo-600 font-semibold transition cursor-pointer"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Hide Details</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>Show Details</span>
            </>
          )}
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(interview)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
            title="Edit Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(interview._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Delete Application"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;

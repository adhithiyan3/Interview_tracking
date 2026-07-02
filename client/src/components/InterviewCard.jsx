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
  FileText
} from 'lucide-react';

const InterviewCard = ({ interview, onUpdateStatus, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Selected':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-500',
          border: 'border-emerald-500/20'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          dot: 'bg-rose-500',
          border: 'border-rose-500/20'
        };
      default:
        return {
          bg: 'bg-amber-500/10 text-yellow-500 border-yellow-500/20',
          dot: 'bg-yellow-500',
          border: 'border-yellow-500/20'
        };
    }
  };

  const statusStyles = getStatusStyles(interview.status);

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

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-3.5">
          <div>
            <h4 className="font-bold text-lg text-white leading-tight">{interview.company}</h4>
            <p className="text-slate-400 text-sm font-medium mt-0.5">{interview.role}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1.5 ${statusStyles.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`}></span>
            <span>{interview.status}</span>
          </span>
        </div>

        {/* Date and Type */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs sm:text-sm text-slate-300 space-x-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-slate-300 space-x-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>{interview.type} Round</span>
          </div>
        </div>

        {/* Status quick changer */}
        <div className="flex items-center space-x-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800/80 mb-3">
          <span className="text-[10px] uppercase font-bold text-slate-500 px-2">Set Status:</span>
          {['Pending', 'Selected', 'Rejected'].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => onUpdateStatus(interview._id, statusOption)}
              className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                interview.status === statusOption
                  ? statusOption === 'Selected'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : statusOption === 'Rejected'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {statusOption === 'Selected' ? 'Offer' : statusOption === 'Rejected' ? 'Rej.' : 'Pend.'}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="border-t border-slate-800/80 pt-4 mt-1.5 space-y-3.5 text-xs sm:text-sm text-slate-300 animate-fade-in">
          {interview.location && (
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Location</span>
                <span>{interview.location}</span>
              </div>
            </div>
          )}

          {interview.salary && (
            <div className="flex items-start space-x-2">
              <DollarSign className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Salary/Comp</span>
                <span>{interview.salary}</span>
              </div>
            </div>
          )}

          {interview.jobDescriptionUrl && (
            <div className="flex items-start space-x-2">
              <ExternalLink className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Job Post</span>
                <a
                  href={interview.jobDescriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline inline-flex items-center space-x-1"
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
                <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Preparations / Notes</span>
                <p className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50 mt-1 whitespace-pre-line text-slate-300 leading-relaxed max-h-32 overflow-y-auto">
                  {interview.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Actions Footer */}
      <div className="border-t border-slate-800/80 pt-3 mt-4 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-indigo-400 font-semibold transition cursor-pointer"
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition cursor-pointer"
            title="Edit Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(interview._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
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

import React, { useState, useEffect } from 'react';
import { X, Briefcase, PlusCircle, Check } from 'lucide-react';

const SHORTLIST_LEVELS = ['Screening', 'Aptitude', 'Technical', 'HR', 'Final'];

const InterviewModal = ({ isOpen, onClose, onSubmit, interviewToEdit }) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Pending');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Technical');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [salary, setSalary] = useState('');
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('');
  const [shortlistLevel, setShortlistLevel] = useState('Screening');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle editing populate
  useEffect(() => {
    if (interviewToEdit) {
      setCompany(interviewToEdit.company || '');
      setRole(interviewToEdit.role || '');
      setStatus(interviewToEdit.status || 'Pending');
      // Format Date to fit input type datetime-local (YYYY-MM-DDTHH:MM)
      if (interviewToEdit.date) {
        const d = new Date(interviewToEdit.date);
        // Adjust for local time representation
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        setDate(`${year}-${month}-${day}T${hours}:${minutes}`);
      } else {
        setDate('');
      }
      setType(interviewToEdit.type || 'Technical');
      setLocation(interviewToEdit.location || '');
      setNotes(interviewToEdit.notes || '');
      setSalary(interviewToEdit.salary || '');
      setJobDescriptionUrl(interviewToEdit.jobDescriptionUrl || '');
      setShortlistLevel(interviewToEdit.shortlistLevel || 'Screening');
      setRejectionReason(interviewToEdit.rejectionReason || '');
    } else {
      // Clear for new interview
      setCompany('');
      setRole('');
      setStatus('Pending');
      // Default to today/now
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      setDate(`${year}-${month}-${day}T${hours}:00`);
      setType('Technical');
      setLocation('');
      setNotes('');
      setSalary('');
      setJobDescriptionUrl('');
      setShortlistLevel('Screening');
      setRejectionReason('');
    }
    setError('');
  }, [interviewToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!company.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!role.trim()) {
      setError('Job role is required.');
      return;
    }
    if (!date) {
      setError('Interview date and time is required.');
      return;
    }
    if (status === 'Rejected' && !rejectionReason.trim()) {
      setError('Please provide a reason for rejection.');
      return;
    }

    const payload = {
      company: company.trim(),
      role: role.trim(),
      status,
      date: new Date(date).toISOString(),
      type,
      location: location.trim(),
      notes: notes.trim(),
      salary: salary.trim(),
      jobDescriptionUrl: jobDescriptionUrl.trim(),
      shortlistLevel,
      rejectionReason: status === 'Rejected' ? rejectionReason.trim() : ''
    };

    setSubmitting(true);
    const success = await onSubmit(payload);
    setSubmitting(false);

    if (success) {
      onClose();
    } else {
      setError('Failed to save interview. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              {interviewToEdit ? 'Edit Interview Application' : 'Add New Interview'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs sm:text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Google, Stripe, etc."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-800 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Job Role *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Frontend Developer, PM, etc."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-800 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Interview Date & Time *
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-800 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Interview Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-800 text-sm focus:ring-indigo-500"
              >
                <option value="Pending">Pending Response</option>
                <option value="Selected">Selected / Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Interview Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-800 text-sm focus:ring-indigo-500"
              >
                <option value="Technical">Technical Interview</option>
                <option value="Online">Online / Video Call</option>
                <option value="On-site">On-site Interview</option>
                <option value="Phone">Phone Screen</option>
                <option value="HR">HR Interview</option>
                <option value="Behavioral">Behavioral Round</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Shortlist Level
              </label>
              <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                {SHORTLIST_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setShortlistLevel(level)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                      shortlistLevel === level
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Expected Salary / Comp (Optional)
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="$120k + stock, €90k, etc."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Location / Link (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Zoom, Google Meet, London HQ, remote, etc."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-800 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Job Description URL (Optional)
              </label>
              <input
                type="url"
                value={jobDescriptionUrl}
                onChange={(e) => setJobDescriptionUrl(e.target.value)}
                placeholder="https://careers.google.com/jobs/..."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-800 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Preparations / Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Prepare system design questions, check company core values, review projects..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-800 text-sm resize-none"
              />
            </div>

            {/* Rejection Reason — only visible when status is Rejected */}
            {status === 'Rejected' && (
              <div className="md:col-span-2 animate-fade-in">
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-500 mb-1.5">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Describe the reason for rejection (e.g., didn't clear technical round, salary mismatch, etc.)"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-slate-800 text-sm resize-none border-rose-200 focus:border-rose-500"
                  required
                />
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 disabled:text-white text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center space-x-1.5 cursor-pointer text-sm"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : interviewToEdit ? (
                <>
                  <Check className="w-4.5 h-4.5" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4.5 h-4.5" />
                  <span>Add Interview</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewModal;

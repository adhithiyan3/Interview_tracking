import React, { useState, useEffect } from 'react';
import { X, Briefcase, PlusCircle, Check } from 'lucide-react';

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

    const payload = {
      company: company.trim(),
      role: role.trim(),
      status,
      date: new Date(date).toISOString(),
      type,
      location: location.trim(),
      notes: notes.trim(),
      salary: salary.trim(),
      jobDescriptionUrl: jobDescriptionUrl.trim()
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="bg-indigo-600/10 p-2 rounded-xl text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {interviewToEdit ? 'Edit Interview Application' : 'Add New Interview'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm rounded-xl">
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
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
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
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
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
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
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
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm focus:ring-indigo-500"
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
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm focus:ring-indigo-500"
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
                Expected Salary / Comp (Optional)
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="$120k + stock, €90k, etc."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Location / Link (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Zoom, Google Meet, London HQ, remote, etc."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
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
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
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
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm resize-none"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-slate-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 cursor-pointer text-sm"
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

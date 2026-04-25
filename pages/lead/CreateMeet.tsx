
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { CLUBS } from '../../services/mockData';
import { sendWhatsApp } from "../../services/whatsappService";


// ── Professor list ────────────────────────────────────────────────────────────
const PROFESSORS = [
  { id: 'p1', name: 'Dr. Shravani Dalvi', phone: '+919082888285', branch: 'Computer Engineering' },
  { id: 'p2', name: 'Dr. Priya Sharma',   phone: '+919812345678', branch: 'Electronics Engineering' },
  { id: 'p3', name: 'Dr. Rajesh Mehta',   phone: '+919823456789', branch: 'Mechanical Engineering' },
  { id: 'p4', name: 'Dr. Neha Kapoor',    phone: '+919834567890', branch: 'Information Technology' },
  { id: 'p5', name: 'Dr. Suresh Pillai',  phone: '+919845678901', branch: 'Civil Engineering' },
];

declare const gsap: any;

type SmsStatus = 'idle' | 'sending' | 'success' | 'error';

const buildSmsText = (
  title: string, date: string, startTime: string, endTime: string, location: string
) =>
  `📢 Committee Meeting Notification\nCommittee: ${title || '(meeting title)'}\nTime: ${date} at ${startTime} – ${endTime}\nVenue: ${location}\n\nStudents request permission to attend the meeting.`;

export const CreateMeet: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── Form state ────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading]             = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title:       '',
    description: '',
    date:        new Date().toISOString().split('T')[0],
    startTime:   '16:00',
    endTime:     '18:00',
    location:    'Lecture Hall Complex (LHC)',
    type:        'Offline',
  });

  // ── SMS state ─────────────────────────────────────────────────────────────
  const [profSearch,   setProfSearch]   = useState('');
  const [selectedProf, setSelectedProf] = useState<typeof PROFESSORS[0] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [smsStatus,    setSmsStatus]    = useState<SmsStatus>('idle');
  const [smsMessage,   setSmsMessage]   = useState('');
  const [smsText,      setSmsText]      = useState('');
  const [smsEdited,    setSmsEdited]    = useState(false);

  // Sync SMS preview with form fields (unless manually edited)
  useEffect(() => {
    if (!smsEdited) {
      setSmsText(buildSmsText(
        formData.title, formData.date, formData.startTime, formData.endTime, formData.location
      ));
    }
  }, [formData.title, formData.date, formData.startTime, formData.endTime, formData.location, smsEdited]);

  // Animation on load
  useEffect(() => {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        '.form-section',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError(null);
  };

  // ── handleSubmit: uses old working logic + adds clubId/clubName/status ────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Time check (from old working code)
    if (formData.startTime >= formData.endTime) {
      setValidationError('End time must be after start time.');
      return;
    }

    // Past date check (from old working code)
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setValidationError('You cannot schedule a meeting in the past.');
      return;
    }

    setIsLoading(true);

    try {
      const meetingsRef = collection(db, 'meetings');

      // Resolve club info for dashboard display
      const clubId   = user?.clubId || (user as any)?.clubId || null;
      const clubName = CLUBS.find((c: any) => c.id === clubId)?.name || 'Your Club';

      // Save to Firestore — same pattern as old working code + extra fields
      await addDoc(meetingsRef, {
        ...formData,
        createdBy: user?.id || (user as any)?.uid || 'unknown',
        clubId,
        clubName,
        createdAt: serverTimestamp(),
        status:    'scheduled',
      });

      setIsLoading(false);
      navigate('/dashboard');

    } catch (error) {
      console.error('Error creating meeting:', error);
      setValidationError('Failed to save to database. Check your connection.');
      setIsLoading(false);
    }
  };
  // ── handleReset: clear all meetings & attendance (Dev Tool) ───────────────
  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to delete ALL meetings and attendance? This cannot be undone.")) return;
    setIsLoading(true);
    setValidationError(null);
    try {
      const dbMeetings = collection(db, 'meetings');
      const meetingSnap = await getDocs(dbMeetings);
      const meetingPromises = meetingSnap.docs.map(d => deleteDoc(doc(db, 'meetings', d.id)));
      await Promise.all(meetingPromises);

      const dbAttendance = collection(db, 'attendance');
      const attSnap = await getDocs(dbAttendance);
      const attPromises = attSnap.docs.map(d => deleteDoc(doc(db, 'attendance', d.id)));
      await Promise.all(attPromises);

      alert(`Successfully deleted ${meetingPromises.length} meetings and ${attPromises.length} attendance records.`);
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      setValidationError("Failed to reset database.");
    } finally {
      setIsLoading(false);
    }
  };
  // ── Professor helpers ─────────────────────────────────────────────────────
  const filteredProfs = PROFESSORS.filter(p =>
    p.name.toLowerCase().includes(profSearch.toLowerCase()) ||
    p.branch.toLowerCase().includes(profSearch.toLowerCase())
  );

  const selectProfessor = (prof: typeof PROFESSORS[0]) => {
    setSelectedProf(prof);
    setProfSearch(prof.name);
    setShowDropdown(false);
    setSmsStatus('idle');
    setSmsMessage('');
  };

  const clearProfessor = () => {
    setSelectedProf(null);
    setProfSearch('');
    setSmsStatus('idle');
    setSmsMessage('');
  };

  const resetSmsText = () => {
    setSmsEdited(false);
    setSmsText(buildSmsText(
      formData.title, formData.date, formData.startTime, formData.endTime, formData.location
    ));
  };

  // ── Send SMS ──────────────────────────────────────────────────────────────
  const handleSendSMS = async () => {
    if (!selectedProf) {
      setSmsStatus('error');
      setSmsMessage('Please select a professor first.');
      return;
    }

    setSmsStatus('sending');
    setSmsMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/send-sms', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber:   selectedProf.phone,
          committeeName: formData.title || 'Committee Meeting',
          meetingTime:   `${formData.date} at ${formData.startTime} – ${formData.endTime}`,
          venue:         formData.location,
          customMessage: smsText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSmsStatus('success');
        setSmsMessage(`SMS sent to ${selectedProf.name} (${selectedProf.phone})`);
      } else {
        throw new Error(data.message || 'SMS failed');
      }
    } catch (error) {
      // Fallback: use your custom WhatsApp service
      try {
        // Assuming your service handles the async call or URL formatting
        await sendWhatsApp(selectedProf.phone, smsText);
        setSmsStatus('error'); // You might want to change this to 'success' or a new 'warning' state
        setSmsMessage('Backend unreachable — routed via WhatsApp fallback.');
      } catch (waError) {
        setSmsStatus('error');
        setSmsMessage('Both SMS backend and WhatsApp fallback failed.');
      }
    }
  };

  const fallbackSmsHref = selectedProf
    ? `sms:${selectedProf.phone}?body=${encodeURIComponent(smsText)}`
    : '#';

    

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto pb-20">

      {/* Header */}
      <div className="mb-8 pt-4 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-bold text-slate-400 hover:text-slate-600 mb-2 flex items-center gap-1 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Create Session</h2>
          <p className="text-slate-500 mt-1">
            Schedule a new gathering for{' '}
            <span className="font-bold text-primary-600">
              {user?.role === 'LEAD' ? 'your club' : 'the committee'}
            </span>.
          </p>
        </div>
        <div className="hidden md:flex w-14 h-14 bg-indigo-50 rounded-2xl items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>

      <div className="mb-6 flex justify-end">
          <button 
             type="button" 
             onClick={handleReset}
             className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             Reset All App Data (Zero Start)
          </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── SECTION 1: Session Details ──────────────────────────────────── */}
        <div className="form-section bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Details</h3>
              <div className="flex gap-2">
                {['Offline', 'Online'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                      formData.type === type
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        : 'bg-white text-slate-500 border-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Meeting Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Hackathon Prep: Week 1"
                  className="w-full text-lg font-medium placeholder:font-normal rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description / Agenda</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Briefly describe what this session is about..."
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Logistics ────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Date & Time */}
          <div className="form-section bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Timing</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                  <input
                    required name="date" value={formData.date} onChange={handleChange} type="date"
                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Start Time</label>
                    <input
                      required name="startTime" value={formData.startTime} onChange={handleChange} type="time"
                      className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">End Time</label>
                    <input
                      required name="endTime" value={formData.endTime} onChange={handleChange} type="time"
                      className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="form-section bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Location</h3>
            <div className="flex-grow space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Venue</label>
                <select
                  name="location" value={formData.location} onChange={handleChange}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-2 font-medium appearance-none"
                >
                  <option>Lecture Hall Complex (LHC)</option>
                  <option>Computer Center (CC)</option>
                  <option>Main Auditorium</option>
                  <option>Library Conference Room</option>
                  <option>Student Activity Center (SAC)</option>
                  <option>Remote / Online</option>
                </select>
              </div>
              <div className={`rounded-xl p-4 flex items-start gap-3 border ${
                formData.type === 'Online' ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'
              }`}>
                <span className={`mt-0.5 ${formData.type === 'Online' ? 'text-blue-500' : 'text-amber-500'}`}>
                  {formData.type === 'Online'
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  }
                </span>
                <p className={`text-xs leading-relaxed ${formData.type === 'Online' ? 'text-blue-800' : 'text-amber-800'}`}>
                  {formData.type === 'Online'
                    ? <><strong>Virtual Meet:</strong> Don't forget to paste the Zoom/Meet link in the description or share it via Announcements.</>
                    : <><strong>Physical Venue:</strong> Ensure you have booked the venue with the Admin Department 24 hrs prior to the event.</>
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Notify Professor via SMS ─────────────────────────── */}
        <div className="form-section bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">
          <div className="p-6 md:p-8 space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notify Professor</h3>
                <p className="text-xs text-slate-400 mt-0.5">Send a permission SMS before the meeting</p>
              </div>
              <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center border border-violet-100">
                <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>

            {/* Professor search */}
            <div className="relative">
              <label className="block text-sm font-bold text-slate-700 mb-2">Search Professor</label>

              {selectedProf ? (
                <div className="flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 bg-violet-200 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
                    {selectedProf.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{selectedProf.name}</p>
                    <p className="text-xs text-slate-500 truncate">{selectedProf.phone} · {selectedProf.branch}</p>
                  </div>
                  <button type="button" onClick={clearProfessor} className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Type professor name or department..."
                    value={profSearch}
                    onChange={e => { setProfSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 pl-9 pr-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all font-medium text-sm"
                  />
                  {showDropdown && profSearch.length > 0 && filteredProfs.length > 0 && (
                    <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                      {filteredProfs.map(prof => (
                        <li key={prof.id} onMouseDown={() => selectProfessor(prof)} className="flex items-center gap-3 px-4 py-3 hover:bg-violet-50 cursor-pointer transition-colors">
                          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm flex-shrink-0">
                            {prof.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate">{prof.name}</p>
                            <p className="text-xs text-slate-400 truncate">{prof.branch}</p>
                          </div>
                          <span className="text-xs text-slate-400 font-mono flex-shrink-0">{prof.phone}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {showDropdown && profSearch.length > 0 && filteredProfs.length === 0 && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-3 text-sm text-slate-400">
                      No professors found for "{profSearch}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Editable SMS Preview */}
            {selectedProf && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    SMS Preview
                    <span className="ml-2 text-violet-400 font-normal normal-case tracking-normal">— editable</span>
                  </label>
                  {smsEdited && (
                    <button type="button" onClick={resetSmsText} className="text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors">
                      ↺ Reset to default
                    </button>
                  )}
                </div>
                <textarea
                  rows={6}
                  value={smsText}
                  onChange={e => { setSmsText(e.target.value); setSmsEdited(true); }}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-700 text-xs font-mono leading-relaxed focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all resize-none"
                  placeholder="Your SMS message..."
                />
                <p className="text-xs text-slate-400 text-right">{smsText.length} characters</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleSendSMS}
                disabled={!selectedProf || smsStatus === 'sending'}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                  !selectedProf
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : smsStatus === 'sending'
                    ? 'bg-violet-400 text-white cursor-wait'
                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25'
                }`}
              >
                {smsStatus === 'sending' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Send SMS to Professor
                  </>
                )}
              </button>

              {selectedProf && (
                <a href={fallbackSmsHref} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-600 transition-colors font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Open in SMS app (fallback)
                </a>
              )}
            </div>

            {/* Status banners */}
            {smsStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
                <svg className="w-4 h-4 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                {smsMessage}
              </div>
            )}
            {smsStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                <svg className="w-4 h-4 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {smsMessage}
              </div>
            )}

          </div>
        </div>

        {/* ── Validation Error Banner ──────────────────────────────────────── */}
        {validationError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2 animate-pulse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-sm">{validationError}</span>
          </div>
        )}

        {/* ── Footer Actions ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          <Button variant="ghost" type="button" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800">
            Cancel
          </Button>
          <Button size="lg" type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 px-8 h-12">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Event...
              </div>
            ) : 'Confirm & Schedule'}
          </Button>
        </div>

      </form>
    </div>
  );
};
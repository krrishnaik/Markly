import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

declare const gsap: any;

export const CreateMeet: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for logic & validation
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    startTime: '16:00',
    endTime: '18:00',
    location: 'Lecture Hall Complex (LHC)',
    type: 'Offline'
  });

  // Animation on load
  useEffect(() => {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(".form-section", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    }
  }, []);

  // --- Logic: Handle Input Changes ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error on interact
    if (validationError) setValidationError(null);
  };

  // --- Logic: Validation & Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Time Logic Check
    if (formData.startTime >= formData.endTime) {
        setValidationError("End time must be after start time.");
        return;
    }

    // 2. Date Logic Check (Prevent past dates)
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) {
        setValidationError("You cannot schedule a meeting in the past.");
        return;
    }

    setIsLoading(true);

    // 3. Simulate Backend API Call with Delay
    setTimeout(() => {
        setIsLoading(false);
        // In real app: await api.createMeeting(formData);
        alert(`Success! "${formData.title}" has been scheduled for ${formData.date}.`);
        navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Navigation Header */}
      <div className="mb-8 pt-4 flex items-center justify-between">
        <div>
            <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-slate-400 hover:text-slate-600 mb-2 flex items-center gap-1 transition-colors">
                ← Back to Dashboard
            </button>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Create Session</h2>
            <p className="text-slate-500 mt-1">Schedule a new gathering for <span className="font-bold text-primary-600">{user?.role === 'LEAD' ? 'your club' : 'the committee'}</span>.</p>
        </div>
        <div className="hidden md:flex w-14 h-14 bg-indigo-50 rounded-2xl items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Details (Primary Info) */}
        <div className="form-section bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Details</h3>
                    <div className="flex gap-2">
                        {['Offline', 'Online'].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setFormData({...formData, type})}
                                className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${formData.type === type ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-500 border-slate-200'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Meeting Title <span className="text-red-500">*</span></label>
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

        {/* SECTION 2: Logistics (Grid Layout) */}
        <div className="grid md:grid-cols-2 gap-6">
            
            {/* Date & Time Card */}
            <div className="form-section bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                 <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Timing</h3>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                            <div className="relative">
                                <input 
                                    required 
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    type="date" 
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Start Time</label>
                                <input 
                                    required 
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    type="time" 
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">End Time</label>
                                <input 
                                    required 
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    type="time" 
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                                />
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Venue Card */}
            <div className="form-section bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Location</h3>
                
                <div className="flex-grow space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Select Venue</label>
                        <select 
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
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

                    {/* Dynamic Warning Logic based on location */}
                    <div className={`rounded-xl p-4 flex items-start gap-3 border ${formData.type === 'Online' ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
                         <span className={`mt-0.5 ${formData.type === 'Online' ? 'text-blue-500' : 'text-amber-500'}`}>
                            {formData.type === 'Online' 
                                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> 
                                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            }
                         </span>
                         <p className={`text-xs leading-relaxed ${formData.type === 'Online' ? 'text-blue-800' : 'text-amber-800'}`}>
                            {formData.type === 'Online' 
                                ? <>
                                    <strong>Virtual Meet:</strong> Don't forget to paste the Zoom/Meet link in the description or share it via Announcements.
                                  </>
                                : <>
                                    <strong>Physical Venue:</strong> Ensure you have booked the venue with the Admin Department 24 hrs prior to the event.
                                  </>
                            }
                         </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2 animate-pulse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-bold text-sm">{validationError}</span>
            </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
            <Button variant="ghost" type="button" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800">Cancel</Button>
            <Button size="lg" type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 px-8 h-12">
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Creating Event...
                    </div>
                ) : 'Confirm & Schedule'}
            </Button>
        </div>
      </form>
    </div>
  );
};
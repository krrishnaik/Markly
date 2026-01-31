import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { CLUBS } from '../services/mockData';
import { useNavigate } from 'react-router-dom';

// Declare GSAP for animation (assuming it's loaded globally or via npm)
declare const gsap: any;

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // --- Refs for Animation ---
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // --- Form State ---
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clubId, setClubId] = useState(CLUBS[0].id);
  
  // --- UI/UX State ---
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showDemoOptions, setShowDemoOptions] = useState(false);

  // --- Animation: Entry Sequence ---
  useEffect(() => {
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        
        // Slide image in from left
        tl.fromTo(imageRef.current, 
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
        )
        // Fade form up
        .fromTo(formRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
            "-=0.6"
        );
    }
  }, []);

  // --- Logic: Reset fields when switching roles ---
  useEffect(() => {
    setError(null);
    setEmail('');
    setPassword('');
    // If switching to lead, ensure a club is selected
    if (role === UserRole.LEAD) {
        setClubId(CLUBS[0].id);
    }
  }, [role]);

  // --- Logic: Demo Autofill System ---
  const fillDemoCredentials = () => {
    // Visual feedback: Flash input backgrounds green
    if (typeof gsap !== 'undefined') {
        gsap.fromTo("input", 
            { backgroundColor: "#d1fae5" }, // emerald-100
            { backgroundColor: "#f8fafc", duration: 0.5, clearProps: "backgroundColor" }
        );
    }

    switch (role) {
        case UserRole.STUDENT:
            setEmail('student@markly.edu');
            setPassword('student123');
            break;
        case UserRole.LEAD:
            setEmail('lead@markly.edu');
            setClubId('c1'); 
            setPassword('club123');
            break;
        case UserRole.FACULTY:
            setEmail('faculty@markly.edu');
            setPassword('faculty123');
            break;
    }
    setError(null);
  };

  // --- Logic: Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Client-side Validation
    if (!email.includes('@')) {
        setError("Please enter a valid academic email address.");
        return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    try {
        const success = await login(email, role, clubId, password);
        if (success) {
            // Success Animation: Fade out container before redirect
            if (typeof gsap !== 'undefined') {
                gsap.to(containerRef.current, { opacity: 0, y: -20, duration: 0.5 });
            }
            setTimeout(() => navigate('/dashboard'), 500);
        } else {
            setError("Invalid credentials. Please check your details or use Demo Mode.");
            // Error Animation: Shake the form
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(formRef.current, { x: -10 }, { x: 0, duration: 0.1, repeat: 5, ease: "linear" });
            }
        }
    } catch (err) {
        setError("Connection failed. Please check your network.");
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full flex bg-white overflow-hidden font-sans">
      
      {/* LEFT PANEL: Branding & Visuals (The "Green Thing") */}
      <div ref={imageRef} className="hidden lg:flex lg:w-5/12 relative bg-emerald-950 flex-col justify-between p-12 text-white z-0">
        {/* Abstract Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-slate-900/90 z-10"></div>
        
        {/* Content Layer */}
        <div className="relative z-20 h-full flex flex-col justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-900 flex items-center justify-center font-bold text-xl shadow-lg">M</div>
                <span className="text-xl font-bold tracking-tight">Markly Systems</span>
            </div>

            {/* Hero Text */}
            <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                    Campus Life, <br/>
                    <span className="text-emerald-400">Simplified.</span>
                </h1>
                <p className="text-lg text-emerald-100/80 max-w-sm leading-relaxed">
                    The integrated platform for student clubs, academic tracking, and real-time conflict resolution.
                </p>
                
                {/* Social Proof Bubbles */}
                <div className="flex gap-4 pt-4 border-t border-emerald-800/50">
                    <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-emerald-950 bg-emerald-800 flex items-center justify-center text-[10px]">
                                👤
                            </div>
                        ))}
                    </div>
                    <div className="text-sm text-emerald-200/80 flex items-center">
                        <span className="text-white font-bold mr-1">1,200+</span> students verified today
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end text-xs text-emerald-300/50 font-mono">
                <p>© 2026 Markly Academic</p>
                <p>v2.1.4 (Stable)</p>
            </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 bg-slate-50/50">
        <div ref={formRef} className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
            
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 mt-2">Sign in to access your customized dashboard.</p>
            </div>

            {/* Role Switcher - Updated for Title Case Consistency */}
            <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1 relative">
                {[UserRole.STUDENT, UserRole.LEAD, UserRole.FACULTY].map((r) => (
                    <button
                        key={r}
                        type="button" // Prevent form submission
                        onClick={() => setRole(r)}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 relative z-10 ${
                            role === r 
                            ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        {/* Consistent Casing Logic: 'Club Lead' or Title Case */}
                        {r === UserRole.LEAD ? 'Club Lead' : r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                    <div className={`flex items-center border rounded-xl px-4 py-3 transition-colors bg-slate-50 ${focusedField === 'email' ? 'border-emerald-500 ring-4 ring-emerald-500/10 bg-white' : 'border-slate-200'}`}>
                        <svg className={`w-5 h-5 mr-3 transition-colors ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={role === UserRole.FACULTY ? "prof.name@markly.edu" : "student.id@markly.edu"}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 outline-none text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Conditional Club Selector (Lead Only) */}
                {role === UserRole.LEAD && (
                    <div className="space-y-1.5 animate-fadeIn">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Club</label>
                        <div className="relative">
                            <select
                                value={clubId}
                                onChange={(e) => setClubId(e.target.value)}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                            >
                                {CLUBS.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* Password Field */}
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                        <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Forgot Password?</a>
                    </div>
                    <div className={`flex items-center border rounded-xl px-4 py-3 transition-colors bg-slate-50 ${focusedField === 'password' ? 'border-emerald-500 ring-4 ring-emerald-500/10 bg-white' : 'border-slate-200'}`}>
                        <svg className={`w-5 h-5 mr-3 transition-colors ${focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 outline-none text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Submit Button */}
                <Button 
                    fullWidth 
                    size="lg" 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 h-12 text-base tracking-wide"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>Verifying...</span>
                        </div>
                    ) : (
                        'Sign In to Dashboard'
                    )}
                </Button>
            </form>

            {/* DEMO / AUTOFILL SECTION */}
            <div className="pt-6 border-t border-slate-100">
                <button 
                    onClick={() => setShowDemoOptions(!showDemoOptions)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors mb-4"
                >
                    <span>{showDemoOptions ? 'Hide Demo Options' : 'Need Demo Credentials?'}</span>
                    <svg className={`w-4 h-4 transition-transform ${showDemoOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                
                {showDemoOptions && (
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 animate-fadeIn">
                        <p className="text-xs text-emerald-800 mb-3 text-center">
                            Use this to auto-populate the form for <strong>{role === UserRole.LEAD ? 'Club Lead' : role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</strong>.
                        </p>
                        <Button 
                            fullWidth 
                            variant="outline" 
                            onClick={fillDemoCredentials}
                            className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        >
                            🪄 Autofill Demo Data
                        </Button>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};
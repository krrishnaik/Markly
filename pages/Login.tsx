import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { CLUBS } from '../services/mockData';
import { useNavigate } from 'react-router-dom';

// Declare GSAP for animation
declare const gsap: any;

// --- SECRETS (In a production app, these would go in your .env file) ---
const FACULTY_SECRET_CODE = "MARKLY-FACULTY-26";
const LEAD_SECRET_CODE = "MARKLY-LEAD-26";

export const Login: React.FC = () => {
    const { login, register, isLoading } = useAuth();
    const navigate = useNavigate();

    // --- Refs for Animation ---
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    // --- Mode State ---
    const [isLoginMode, setIsLoginMode] = useState(true);

    // --- Form State ---
    const [name, setName] = useState(''); 
    const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [clubId, setClubId] = useState(CLUBS[0].id);
    const [accessCode, setAccessCode] = useState(''); // NEW: Security code state
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [division, setDivision] = useState('');
    const [collegeYear, setCollegeYear] = useState('First Year');
    const [committee, setCommittee] = useState(CLUBS[0].name);

    // --- UI/UX State ---
    const [error, setError] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // --- Animation: Entry Sequence ---
    useEffect(() => {
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            tl.fromTo(imageRef.current,
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
            )
            .fromTo(formRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                "-=0.6"
            );
        }
    }, []);

    // --- Logic: Reset fields when switching roles or modes ---
    useEffect(() => {
        setError(null);
        setAccessCode(''); // Clear the access code if they switch roles
        if (role === UserRole.LEAD) {
            setClubId(CLUBS[0].id);
        }
        if (role === UserRole.STUDENT) {
            setCommittee(CLUBS[0].name);
        }
    }, [role, isLoginMode]);

    // --- Logic: Handle Form Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic Client-side Validation
        if (!isLoginMode && name.trim() === '') {
            setError("Please enter your full name.");
            return;
        }
        if (!email.includes('@')) {
            setError("Please enter a valid academic email address.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        // NEW: Security Code Validation
        if (!isLoginMode) {
            if (role === UserRole.FACULTY && accessCode !== FACULTY_SECRET_CODE) {
                setError("Invalid Faculty Access Code. Please contact administration.");
                return;
            }
            if (role === UserRole.LEAD && accessCode !== LEAD_SECRET_CODE) {
                setError("Invalid Club Lead Access Code. Please contact administration.");
                return;
            }
        }

        try {
            let success = false;
            
            if (isLoginMode) {
                // REAL LOGIN
                success = await login(email, password);
            } else {
                // REAL REGISTRATION
                success = await register(
                    email, 
                    password, 
                    name, 
                    role, 
                    {
                        clubId: role === UserRole.LEAD ? clubId : undefined,
                        admissionNumber: role === UserRole.STUDENT ? admissionNumber : undefined,
                        division: role === UserRole.STUDENT ? division : undefined,
                        collegeYear: role === UserRole.STUDENT ? collegeYear : undefined,
                        committee: role === UserRole.STUDENT ? committee : undefined
                    }
                );
            }

            if (success) {
                navigate('/dashboard'); 
            } else {
                setError(isLoginMode 
                    ? "Invalid credentials. Please check your details." 
                    : "Registration failed. Email might already be in use."
                );
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

            {/* LEFT PANEL: Branding & Visuals */}
            <div ref={imageRef} className="hidden lg:flex lg:w-5/12 relative bg-primary-950 flex-col justify-between p-12 text-white z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=50&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-slate-900/90 z-10"></div>

                <div className="relative z-20 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white text-primary-900 flex items-center justify-center font-bold text-xl shadow-lg">M</div>
                        <span className="text-xl font-bold tracking-tight">Markly Systems</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold leading-tight tracking-tight">
                            Campus Life, <br />
                            <span className="text-primary-400">Simplified.</span>
                        </h1>
                        <p className="text-lg text-primary-100/80 max-w-sm leading-relaxed">
                            The integrated platform for student clubs, academic tracking, and real-time conflict resolution.
                        </p>

                        <div className="flex gap-4 pt-4 border-t border-primary-800/50">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-primary-950 bg-primary-800 flex items-center justify-center text-[10px]">
                                        👤
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-primary-200/80 flex items-center">
                                <span className="text-white font-bold mr-1">1,200+</span> students verified today
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end text-xs text-primary-300/50 font-mono">
                        <p>© 2026 Markly Academic</p>
                        <p>v2.1.4 (Stable)</p>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Login/Signup Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-6 bg-slate-50/50">
                <div ref={formRef} className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {isLoginMode ? 'Welcome Back' : 'Create an Account'}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {isLoginMode ? 'Sign in to access your customized dashboard.' : 'Sign up to get started with Markly.'}
                        </p>
                    </div>

                    {/* Role Switcher */}
                    <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1 relative">
                        {[UserRole.STUDENT, UserRole.LEAD, UserRole.FACULTY].map((r) => (
                            <button
                                key={r}
                                type="button" 
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 relative z-10 ${role === r
                                    ? 'bg-white text-primary-700 shadow-sm border border-primary-100'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                    }`}
                            >
                                {r === UserRole.LEAD ? 'Club Lead' : r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Name Field - ONLY SHOWS ON SIGN UP */}
                        {!isLoginMode && (
                            <div className="space-y-1.5 animate-fadeIn">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                                <div className={`flex items-center border rounded-xl px-4 py-3 transition-colors bg-slate-50 ${focusedField === 'name' ? 'border-primary-500 ring-4 ring-primary-500/10 bg-white' : 'border-slate-200'}`}>
                                    <svg className={`w-5 h-5 mr-3 transition-colors ${focusedField === 'name' ? 'text-primary-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    <input
                                        type="text"
                                        required={!isLoginMode}
                                        value={name}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Student Specific Fields - ONLY ON SIGN UP */}
                        {!isLoginMode && role === UserRole.STUDENT && (
                            <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Admission No.</label>
                                    <div className={`flex items-center border rounded-xl px-4 py-3 transition-colors bg-slate-50 ${focusedField === 'admissionNumber' ? 'border-primary-500 ring-4 ring-primary-500/10 bg-white' : 'border-slate-200'}`}>
                                        <input
                                            type="text"
                                            required={!isLoginMode}
                                            value={admissionNumber}
                                            onFocus={() => setFocusedField('admissionNumber')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) => setAdmissionNumber(e.target.value)}
                                            placeholder="e.g. 2023001"
                                            className="flex-1 w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 outline-none text-sm font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Division</label>
                                    <div className={`flex items-center border rounded-xl px-4 py-3 transition-colors bg-slate-50 ${focusedField === 'division' ? 'border-primary-500 ring-4 ring-primary-500/10 bg-white' : 'border-slate-200'}`}>
                                        <input
                                            type="text"
                                            required={!isLoginMode}
                                            value={division}
                                            onFocus={() => setFocusedField('division')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) => setDivision(e.target.value)}
                                            placeholder="e.g. A"
                                            className="flex-1 w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 outline-none text-sm font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">College Year</label>
                                    <div className="relative">
                                        <select
                                            value={collegeYear}
                                            onChange={(e) => setCollegeYear(e.target.value)}
                                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
                                        >
                                            <option value="First Year">First Year</option>
                                            <option value="Second Year">Second Year</option>
                                            <option value="Third Year">Third Year</option>
                                            <option value="Fourth Year">Fourth Year</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Committee</label>
                                    <div className="relative">
                                        <select
                                            value={committee}
                                            onChange={(e) => setCommittee(e.target.value)}
                                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
                                        >
                                            <option value="None">None</option>
                                            {CLUBS.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                            <div className={`flex items-center border rounded-xl px-4 py-3 transition-colors bg-slate-50 ${focusedField === 'email' ? 'border-primary-500 ring-4 ring-primary-500/10 bg-white' : 'border-slate-200'}`}>
                                <svg className={`w-5 h-5 mr-3 transition-colors ${focusedField === 'email' ? 'text-primary-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
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
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
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

                        {/* NEW: Security Access Code (Only for Lead/Faculty during Sign Up) */}
                        {!isLoginMode && (role === UserRole.LEAD || role === UserRole.FACULTY) && (
                            <div className="space-y-1.5 animate-fadeIn">
                                <label className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                                    {role === UserRole.LEAD ? 'Club Lead' : 'Faculty'} Access Code
                                </label>
                                <div className={`flex items-center border rounded-xl px-4 py-3 transition-colors bg-amber-50/50 ${focusedField === 'accessCode' ? 'border-amber-500 ring-4 ring-amber-500/10 bg-white' : 'border-amber-200'}`}>
                                    <svg className={`w-5 h-5 mr-3 transition-colors ${focusedField === 'accessCode' ? 'text-amber-500' : 'text-amber-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                                    <input
                                        type="text"
                                        required
                                        value={accessCode}
                                        onFocus={() => setFocusedField('accessCode')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        placeholder="Enter secure invite code"
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-amber-300 outline-none text-sm font-medium"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400">Restricted role. A valid code is required to register.</p>
                            </div>
                        )}

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                                {isLoginMode && (
                                    <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot Password?</a>
                                )}
                            </div>
                            <div className={`flex items-center border rounded-xl px-4 py-3 transition-colors bg-slate-50 ${focusedField === 'password' ? 'border-primary-500 ring-4 ring-primary-500/10 bg-white' : 'border-slate-200'}`}>
                                <svg className={`w-5 h-5 mr-3 transition-colors ${focusedField === 'password' ? 'text-primary-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
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
                            className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 h-12 text-base tracking-wide"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>{isLoginMode ? 'Verifying...' : 'Creating Account...'}</span>
                                </div>
                            ) : (
                                isLoginMode ? 'Sign In to Dashboard' : 'Create Account'
                            )}
                        </Button>
                    </form>

                    {/* --- TOGGLE SIGN UP / SIGN IN --- */}
                    <div className="text-center mt-6">
                        <button 
                            type="button"
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setError(null);
                            }}
                            className="text-sm text-slate-500 hover:text-primary-600 font-semibold transition-colors"
                        >
                            {isLoginMode 
                                ? "Don't have an account? Sign Up" 
                                : "Already have an account? Sign In"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { CLUBS } from '../services/mockData';
import { useNavigate } from 'react-router-dom';

declare const gsap: any;

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [email, setEmail] = useState('');
  const [clubId, setClubId] = useState(CLUBS[0].id);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, [role]);

  useEffect(() => {
    if (cardRef.current && typeof gsap !== 'undefined') {
      gsap.fromTo(cardRef.current, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
    }

    const success = await login(email, role, clubId, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please use the demo credentials below.');
    }
  };

  const fillDemoCredentials = () => {
    setError('');
    if (role === UserRole.STUDENT) {
      setEmail('alex@college.edu');
    } else if (role === UserRole.LEAD) {
      setEmail('sarah@college.edu');
      setClubId('c1');
      setPassword('club123');
    } else if (role === UserRole.FACULTY) {
      setEmail('johnson@college.edu');
    }
  };

  const roleCardClass = (active: boolean) => 
    `flex-1 p-3 text-sm font-semibold border rounded-lg cursor-pointer transition-all text-center select-none ${
      active 
      ? 'border-primary-500 bg-primary-100/50 text-primary-800 shadow-sm ring-1 ring-primary-500/20' 
      : 'border-slate-200 bg-bg-card text-slate-500 hover:border-slate-300 hover:bg-bg-DEFAULT'
    }`;

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-bg-DEFAULT overflow-hidden p-4">
      {/* Background Decorative Elements - Warm Neutrals */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-stone-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      </div>

      <div ref={cardRef} className="relative z-10 w-full max-w-md bg-bg-card rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-xl mx-auto mb-5 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to Markly</h1>
          <p className="text-slate-500 mt-2 text-sm">The Institutional Attendance Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Role</label>
            <div className="flex gap-3">
              <div 
                className={roleCardClass(role === UserRole.STUDENT)}
                onClick={() => setRole(UserRole.STUDENT)}
              >
                Student
              </div>
              <div 
                className={roleCardClass(role === UserRole.LEAD)}
                onClick={() => setRole(UserRole.LEAD)}
              >
                Lead
              </div>
              <div 
                className={roleCardClass(role === UserRole.FACULTY)}
                onClick={() => setRole(UserRole.FACULTY)}
              >
                Faculty
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">College Email ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <input 
                    type="email" 
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 text-slate-900"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {role === UserRole.LEAD && (
              <div className="p-5 bg-bg-DEFAULT rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Club</label>
                  <div className="relative">
                    <select 
                      className="w-full pl-4 pr-10 py-2.5 bg-bg-card border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/50 outline-none appearance-none cursor-pointer text-slate-900"
                      value={clubId}
                      onChange={(e) => setClubId(e.target.value)}
                    >
                      {CLUBS.map(club => (
                        <option key={club.id} value={club.id}>{club.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Club Password</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    </div>
                    <input 
                        type="password"
                        required 
                        placeholder="Enter secret key"
                        className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">Provided by faculty coordinator</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <Button type="submit" fullWidth disabled={isLoading} className="h-12 text-base font-semibold shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700">
            {isLoading ? 'Verifying Credentials...' : 'Access Portal'}
          </Button>

          <div className="pt-6 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium hover:underline transition-colors"
            >
              Autofill Demo Credentials ({role === UserRole.STUDENT ? 'Student' : role === UserRole.LEAD ? 'Lead' : 'Faculty'})
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8">
          © 2023 Markly System. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};
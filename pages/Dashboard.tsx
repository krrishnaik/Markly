import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

declare const gsap: any;

type StatColor = 'emerald' | 'primary' | 'secondary' | 'accent';

const StatCard: React.FC<{ title: string; value: string; icon: string; color: StatColor; delay?: number }> = ({ title, value, icon, color, delay = 0 }) => {
  
  // Explicit mapping required for Tailwind to detect classes
  const styles = {
    emerald: {
      accent: 'bg-emerald-100',
      iconBg: 'bg-emerald-50',
      iconText: 'text-emerald-700',
      iconBorder: 'border-emerald-200'
    },
    primary: { // Muted Orange
      accent: 'bg-primary-100',
      iconBg: 'bg-primary-50',
      iconText: 'text-primary-700',
      iconBorder: 'border-primary-200'
    },
    secondary: { // Soft Yellow
      accent: 'bg-secondary-100',
      iconBg: 'bg-secondary-50',
      iconText: 'text-secondary-700',
      iconBorder: 'border-secondary-200'
    },
    accent: { // Muted Red
      accent: 'bg-accent-100',
      iconBg: 'bg-accent-50',
      iconText: 'text-accent-700',
      iconBorder: 'border-accent-200'
    }
  };

  const currentStyle = styles[color] || styles.primary;

  return (
    <div className={`gsap-card bg-white p-6 rounded-xl shadow-card border border-stone-200 relative overflow-hidden group hover:border-stone-300 transition-colors`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${currentStyle.accent} rounded-bl-full opacity-50 transition-transform duration-500 group-hover:scale-110`}></div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-lg ${currentStyle.iconBg} ${currentStyle.iconText} flex items-center justify-center text-xl mb-4 border ${currentStyle.iconBorder} shadow-sm`}>
          {icon}
        </div>
        <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-bold text-stone-900 mt-1 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string, subtitle?: string, action?: React.ReactNode }> = ({ title, subtitle, action }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-stone-500 mt-1 text-sm">{subtitle}</p>}
        </div>
        {action}
    </div>
);

const StudentDashboard = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(".gsap-card", 
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    clearProps: "all"
                }
            );
        }
    }, []);

    return (
        <div className="space-y-10">
            <SectionHeader 
                title="Welcome back, Alex! 👋" 
                subtitle="Computer Science • 3rd Year"
                action={<Button onClick={() => navigate('/attendance')}>Declare Attendance</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Attendance Rate" value="85%" icon="📈" color="emerald" />
                <StatCard title="Clubs Joined" value="2" icon="🛡️" color="primary" />
                <StatCard title="Pending Declarations" value="1" icon="⏳" color="secondary" />
            </div>

            {/* Upcoming */}
            <div className="gsap-card bg-white rounded-xl shadow-card border border-stone-200 p-8">
                <h3 className="font-bold text-stone-800 mb-6 text-lg">Today's Schedule</h3>
                <div className="space-y-4">
                    <div className="flex items-center p-5 bg-stone-50 rounded-xl border border-stone-100 transition-colors hover:border-primary-200 group">
                        <div className="w-14 h-14 rounded-xl bg-white text-primary-700 border border-stone-200 flex items-center justify-center font-bold mr-5 shadow-sm group-hover:border-primary-200 group-hover:text-primary-800">
                            17:00
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-stone-900 group-hover:text-primary-800 transition-colors">Intro to React Workshop</h4>
                            <p className="text-sm text-stone-500">Coding Club • Seminar Hall A</p>
                        </div>
                        <span className="px-3 py-1 bg-secondary-100 text-secondary-800 border border-secondary-200 rounded-full text-xs font-semibold uppercase tracking-wide">
                            Scheduled
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LeadDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(".gsap-card", 
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    clearProps: "all"
                }
            );
        }
    }, []);

    return (
        <div className="space-y-10">
             <SectionHeader 
                title="Club Dashboard" 
                subtitle="Coding Club • Technical Society"
                action={<Button onClick={() => navigate('/mark-attendance')}>Mark Attendance</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Members" value="124" icon="👥" color="primary" />
                <StatCard title="Avg. Attendance" value="92%" icon="📊" color="emerald" />
                <StatCard title="Pending Reviews" value="15" icon="📝" color="secondary" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="gsap-card bg-white rounded-xl shadow-card border border-stone-200 p-8">
                    <h3 className="font-bold text-stone-800 mb-6 text-lg">Recent Meetings</h3>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center py-3 border-b border-stone-100 last:border-0">
                            <div>
                                <div className="font-medium text-stone-800">Hackathon Prep</div>
                                <div className="text-xs text-stone-400 mt-0.5">Lab 301</div>
                            </div>
                            <span className="text-xs font-medium bg-stone-100 text-stone-600 px-2 py-1 rounded">Oct 25</span>
                        </li>
                        <li className="flex justify-between items-center py-3 border-b border-stone-100 last:border-0">
                            <div>
                                <div className="font-medium text-stone-800">Intro to Python</div>
                                <div className="text-xs text-stone-400 mt-0.5">Seminar Hall B</div>
                            </div>
                            <span className="text-xs font-medium bg-stone-100 text-stone-600 px-2 py-1 rounded">Oct 18</span>
                        </li>
                    </ul>
                </div>
                <div className="gsap-card bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-8 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-bold text-lg opacity-90">Next Meeting</h3>
                                <p className="text-primary-100 text-sm mt-1">Intro to React</p>
                             </div>
                             <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">Technical</span>
                        </div>
                        
                        <div className="mt-8">
                             <div className="text-4xl font-bold tracking-tight">Today</div>
                             <div className="text-primary-100 mt-1 font-medium">17:00 - 19:00</div>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-sm text-primary-50 font-medium">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                             Seminar Hall A
                        </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-primary-400 opacity-20 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
    );
};

const FacultyDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(".gsap-card", 
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    clearProps: "all"
                }
            );
        }
    }, []);

    return (
        <div className="space-y-10">
            <SectionHeader 
                title="Faculty Overview" 
                subtitle="Prof. Johnson • CS Department"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Active Conflicts" value="2" icon="⚠️" color="accent" />
                <StatCard title="Pending Approvals" value="0" icon="✅" color="emerald" />
                <StatCard title="Clubs Supervised" value="3" icon="📚" color="primary" />
            </div>

            <div className="gsap-card bg-white rounded-xl shadow-card border border-stone-200 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-stone-800 text-lg">Lecture Conflict Alerts</h3>
                    <Button variant="outline" size="sm" onClick={() => navigate('/conflicts')}>View Details</Button>
                </div>
                <div className="space-y-4">
                    <div className="p-5 bg-accent-50 border border-accent-100 rounded-xl flex items-start gap-5">
                        <div className="p-3 bg-white rounded-lg text-accent-600 shadow-sm border border-accent-100">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-stone-900">Database Management (CS302)</h4>
                            <p className="text-sm text-stone-600 mt-1 leading-relaxed">12 students marked present in <span className="font-medium text-stone-800">"Coding Club: Hackathon Prep"</span> during this lecture time.</p>
                            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-accent-700 bg-accent-100/50 px-2 py-1 rounded inline-flex">
                                <span>Oct 25</span>
                                <span>•</span>
                                <span>16:00 - 17:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case UserRole.STUDENT:
      return <StudentDashboard />;
    case UserRole.LEAD:
      return <LeadDashboard />;
    case UserRole.FACULTY:
      return <FacultyDashboard />;
    default:
      return <div>Unknown Role</div>;
  }
};
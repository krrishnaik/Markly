import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

declare const gsap: any;

const StatCard: React.FC<{ title: string; value: string; icon: string; accentColor?: string }> = ({ title, value, icon, accentColor = 'bg-primary-500' }) => {
  return (
    <div className={`gsap-card bg-bg-card p-6 rounded-xl border border-slate-200 shadow-card relative overflow-hidden group hover:border-slate-300 transition-colors`}>
      <div className={`absolute top-0 right-0 w-32 h-32 ${accentColor} rounded-full blur-[60px] opacity-10 transition-opacity duration-500 group-hover:opacity-15 translate-x-10 -translate-y-10`}></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-bg-DEFAULT flex items-center justify-center text-xl border border-slate-200 shadow-sm text-slate-600">
                {icon}
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        </div>
        <h3 className="text-3xl font-bold text-slate-800 mt-2 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string, subtitle?: string, action?: React.ReactNode }> = ({ title, subtitle, action }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-slate-200 pb-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
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
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
            );
        }
    }, []);

    return (
        <div className="space-y-8">
            <SectionHeader 
                title="Dashboard" 
                subtitle="Computer Science • 3rd Year"
                action={<Button onClick={() => navigate('/attendance')}>View Full History</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Attendance Rate" value="85%" icon="📈" accentColor="bg-primary-500" />
                <StatCard title="Clubs Joined" value="2" icon="🛡️" accentColor="bg-stone-500" />
            </div>

            {/* Announcements */}
            <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 shadow-card p-8">
                <h3 className="font-bold text-slate-800 mb-6 text-lg flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary-500 rounded-full"></span>
                    Announcements
                </h3>
                <div className="space-y-4">
                     <div className="p-4 rounded-lg bg-bg-DEFAULT border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                             <h4 className="font-semibold text-slate-800">Hackathon Registration Open</h4>
                             <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">Today</span>
                        </div>
                        <p className="text-sm text-slate-600">Register for the annual inter-college hackathon before Friday.</p>
                     </div>
                     <div className="p-4 rounded-lg bg-bg-DEFAULT border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                             <h4 className="font-semibold text-slate-800">Robotics Workshop Rescheduled</h4>
                             <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">Yesterday</span>
                        </div>
                        <p className="text-sm text-slate-600">The workshop will now be held in Lab 301 due to maintenance.</p>
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
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
            );
        }
    }, []);

    return (
        <div className="space-y-8">
             <SectionHeader 
                title="Committee Dashboard" 
                subtitle="Coding Club • Technical Society"
                action={<Button variant="primary" onClick={() => navigate('/mark-attendance')}>Mark Attendance</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Members" value="124" icon="👥" accentColor="bg-stone-500" />
                <StatCard title="Avg. Attendance" value="92%" icon="📊" accentColor="bg-primary-500" />
                <StatCard title="Pending Reviews" value="15" icon="📝" accentColor="bg-amber-600" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Upcoming Meeting Card */}
                <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 shadow-card p-8 relative overflow-hidden flex flex-col justify-between group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110"></div>
                     <div className="relative z-10">
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-bold text-lg text-slate-800">Next Meeting</h3>
                                <p className="text-primary-600 text-sm mt-1">Intro to React</p>
                             </div>
                             <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-600 shadow-sm">Technical</span>
                        </div>
                        
                        <div className="mt-8">
                             <div className="text-4xl font-bold tracking-tight text-slate-900">Today</div>
                             <div className="text-slate-500 mt-1 font-medium">17:00 - 19:00</div>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                             Seminar Hall A
                        </div>
                    </div>
                </div>

                <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 shadow-card p-8">
                    <h3 className="font-bold text-slate-800 mb-6 text-lg">Recent Meetings</h3>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                            <div>
                                <div className="font-medium text-slate-700">Hackathon Prep</div>
                                <div className="text-xs text-slate-400 mt-0.5">Lab 301</div>
                            </div>
                            <span className="text-xs font-medium bg-bg-DEFAULT text-slate-500 px-2 py-1 rounded border border-slate-200">Oct 25</span>
                        </li>
                        <li className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                            <div>
                                <div className="font-medium text-slate-700">Intro to Python</div>
                                <div className="text-xs text-slate-400 mt-0.5">Seminar Hall B</div>
                            </div>
                            <span className="text-xs font-medium bg-bg-DEFAULT text-slate-500 px-2 py-1 rounded border border-slate-200">Oct 18</span>
                        </li>
                    </ul>
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
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
            );
        }
    }, []);

    return (
        <div className="space-y-8">
            <SectionHeader 
                title="Faculty Overview" 
                subtitle="Prof. Johnson • CS Department"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Active Conflicts" value="2" icon="⚠️" accentColor="bg-red-200" />
                <StatCard title="Pending Approvals" value="0" icon="✅" accentColor="bg-primary-500" />
                <StatCard title="Clubs Supervised" value="3" icon="📚" accentColor="bg-stone-400" />
            </div>

            <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 shadow-card p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">Recent Conflict Alerts</h3>
                    <Button variant="outline" size="sm" onClick={() => navigate('/conflicts')}>Manage All</Button>
                </div>
                <div className="space-y-4">
                    <div className="p-5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-5">
                        <div className="p-3 bg-white rounded-lg text-red-700 shadow-sm border border-red-100">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Database Management (CS302)</h4>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">12 students marked present in <span className="font-medium text-slate-800">"Coding Club: Hackathon Prep"</span> during this lecture time.</p>
                            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-red-700 bg-red-100/50 border border-red-100 px-2 py-1 rounded inline-flex">
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
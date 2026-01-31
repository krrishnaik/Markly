import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, Meeting, AttendanceStatus } from '../types';
import { MOCK_MEETINGS, MOCK_ATTENDANCE, CLUBS } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

declare const gsap: any;

// --- Helper Components ---

const SectionHeader: React.FC<{ 
  title: string, 
  subtitle?: string, 
  action?: React.ReactNode 
}> = ({ title, subtitle, action }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-slate-200 pb-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
        </div>
        {action}
    </div>
);

const MeetingCard: React.FC<{ meeting: Meeting, onClick?: () => void }> = ({ meeting, onClick }) => (
    <div 
        onClick={onClick}
        className="gsap-card group cursor-pointer bg-bg-card p-6 rounded-xl border border-slate-200 shadow-card hover:shadow-soft hover:border-primary-200 transition-all duration-300 relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-150 duration-500"></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <Badge status="SCHEDULED" size="sm" />
                <span className="text-xs font-mono text-slate-400 bg-bg-DEFAULT px-2 py-1 rounded border border-slate-200">
                    {meeting.date}
                </span>
            </div>
            
            <h4 className="text-lg font-bold text-slate-800 group-hover:text-primary-700 transition-colors mb-1">
                {meeting.title}
            </h4>
            <p className="text-sm text-primary-600 font-medium mb-4">{meeting.clubName}</p>
            
            <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {meeting.startTime} - {meeting.endTime}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {meeting.location}
                </div>
            </div>
        </div>
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-slate-400 text-sm">{message}</p>
    </div>
);

// --- Role Views ---

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Logic: Get meetings for clubs the student has joined
    const myClubIds = user?.joinedClubIds || [];
    const relevantMeetings = MOCK_MEETINGS.filter(m => myClubIds.includes(m.clubId));
    
    const upcoming = relevantMeetings
        .filter(m => m.status === 'SCHEDULED')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Logic: Get past meetings where the student has an attendance record
    const history = MOCK_ATTENDANCE
        .filter(a => a.studentId === user?.id)
        .map(record => {
            const meeting = MOCK_MEETINGS.find(m => m.id === record.meetingId);
            return { record, meeting };
        })
        .filter(item => item.meeting !== undefined)
        .sort((a, b) => new Date(b.meeting!.date).getTime() - new Date(a.meeting!.date).getTime());

    useEffect(() => {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(".gsap-card", 
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
            );
        }
    }, []);

    return (
        <div className="space-y-10">
            <SectionHeader 
                title={`Welcome, ${user?.name.split(' ')[0]}`}
                subtitle={`${user?.branch} • ${user?.year}`}
            />

            {/* Upcoming Section */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
                    <h3 className="text-xl font-bold text-slate-800">Upcoming Schedule</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcoming.length > 0 ? (
                        upcoming.map(meeting => (
                            <MeetingCard key={meeting.id} meeting={meeting} />
                        ))
                    ) : (
                        <EmptyState message="No upcoming meetings scheduled for your clubs." />
                    )}
                </div>
            </section>

            {/* Past History Section */}
            <section>
                 <div className="flex items-center gap-2 mb-6">
                    <span className="w-1.5 h-6 bg-slate-400 rounded-full"></span>
                    <h3 className="text-xl font-bold text-slate-800">Recent Attendance</h3>
                </div>

                <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history.length > 0 ? (
                                    history.map(({ record, meeting }) => (
                                        <tr key={record.id} className="hover:bg-bg-DEFAULT transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                                {meeting?.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-800">{meeting?.title}</div>
                                                <div className="text-xs text-slate-500">{meeting?.clubName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge status={record.status} size="sm" />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm">
                                            No attendance history recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {history.length > 0 && (
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                            <button onClick={() => navigate('/attendance')} className="text-xs font-semibold text-primary-700 hover:text-primary-800">
                                View Full History →
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

const LeadDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Logic: Lead sees meetings for their managed club
    const myClub = CLUBS.find(c => c.id === user?.clubId);
    const meetings = MOCK_MEETINGS.filter(m => m.clubId === user?.clubId);
    
    const upcoming = meetings
        .filter(m => m.status === 'SCHEDULED')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
    const past = meetings
        .filter(m => m.status === 'COMPLETED')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    useEffect(() => {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(".gsap-card", 
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
            );
        }
    }, []);

    return (
        <div className="space-y-10">
            <SectionHeader 
                title={`${myClub?.name || 'Committee'} Dashboard`} 
                subtitle="Committee Lead Panel"
                action={
                    <Button onClick={() => alert("Navigate to Create Meet Page")} variant="primary" className="shadow-lg shadow-primary-500/20">
                        <span className="mr-2">+</span> Create New Meet
                    </Button>
                }
            />

            {/* Upcoming Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
                        <h3 className="text-xl font-bold text-slate-800">Scheduled Meetings</h3>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcoming.length > 0 ? (
                        upcoming.map(meeting => (
                            <MeetingCard 
                                key={meeting.id} 
                                meeting={meeting} 
                                onClick={() => navigate('/mark-attendance')}
                            />
                        ))
                    ) : (
                        <EmptyState message="No upcoming meetings scheduled. Create one to get started." />
                    )}
                </div>
            </section>

            {/* Past Section */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <span className="w-1.5 h-6 bg-slate-400 rounded-full"></span>
                    <h3 className="text-xl font-bold text-slate-800">Past Meetings & Reports</h3>
                </div>

                <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Venue</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {past.length > 0 ? (
                                past.map(meeting => (
                                    <tr key={meeting.id} className="hover:bg-bg-DEFAULT transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                            {meeting.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800">{meeting.title}</div>
                                            <div className="text-xs text-slate-500">{meeting.startTime} - {meeting.endTime}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {meeting.location}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="sm" className="text-primary-700 hover:text-primary-800 hover:bg-primary-50">
                                                View Report
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                                        No past meeting history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(".gsap-card", 
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
            );
        }
    }, []);

    return (
        <div className="space-y-10">
            <SectionHeader 
                title="Faculty Overview" 
                subtitle={`Prof. ${user?.name.split(' ')[1]} • ${user?.branch}`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Card 1 */}
                <div className="gsap-card p-6 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white text-red-600 flex items-center justify-center border border-red-100 shadow-sm text-xl">
                        ⚠️
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-red-900">Action Required</h4>
                        <p className="text-red-700 text-sm mt-1">2 Lecture conflicts detected this week.</p>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-3 text-red-700 hover:bg-red-100 -ml-2 font-semibold"
                            onClick={() => navigate('/conflicts')}
                        >
                            Resolve Conflicts →
                        </Button>
                    </div>
                </div>

                {/* Status Card 2 */}
                <div className="gsap-card p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm text-xl">
                        ✅
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-emerald-900">System Status</h4>
                        <p className="text-emerald-700 text-sm mt-1">Attendance sync active. No errors reported.</p>
                    </div>
                </div>
            </div>

            <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 shadow-card p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                         <span className="w-1.5 h-6 bg-slate-800 rounded-full"></span>
                         Recent Activity
                    </h3>
                </div>
                <div className="space-y-4">
                    <div className="p-5 bg-bg-DEFAULT border border-slate-200 rounded-xl flex items-start gap-5 hover:border-slate-300 transition-colors">
                        <div className="p-3 bg-white rounded-lg text-slate-500 shadow-sm border border-slate-100">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Database Management (CS302)</h4>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                12 students marked present in <span className="font-medium text-slate-800">"Coding Club: Hackathon Prep"</span> during this lecture time.
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="bg-slate-200 px-2 py-1 rounded">Oct 25</span>
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
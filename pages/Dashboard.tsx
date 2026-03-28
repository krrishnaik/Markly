// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { UserRole, Meeting, AttendanceStatus } from '../types';
// import { CLUBS } from '../services/mockData';
// import { Button } from '../components/ui/Button';
// import { Badge } from '../components/ui/Badge';

// import { collection, query, where, onSnapshot } from 'firebase/firestore';
// import { db } from '../firebase';

// declare const gsap: any;

// // --- Helper Components ---

// const SectionHeader: React.FC<{ 
//   title: string, 
//   subtitle?: string, 
//   action?: React.ReactNode 
// }> = ({ title, subtitle, action }) => (
//     <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-slate-200 pb-4">
//         <div>
//             <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
//             {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
//         </div>
//         {action}
//     </div>
// );

// const MeetingCard: React.FC<{ meeting: Meeting, onClick?: () => void }> = ({ meeting, onClick }) => (
//     <div 
//         onClick={onClick}
//         className="gsap-card group cursor-pointer bg-bg-card p-6 rounded-xl border border-slate-200 shadow-card hover:shadow-soft hover:border-primary-200 transition-all duration-300 relative overflow-hidden"
//     >
//         <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-150 duration-500"></div>
        
//         <div className="relative z-10">
//             <div className="flex justify-between items-start mb-4">
//                 <Badge status={(meeting.status || 'SCHEDULED').toUpperCase()} size="sm" />
//                 <span className="text-xs font-mono text-slate-400 bg-bg-DEFAULT px-2 py-1 rounded border border-slate-200">
//                     {meeting.date}
//                 </span>
//             </div>
            
//             <h4 className="text-lg font-bold text-slate-800 group-hover:text-primary-700 transition-colors mb-1">
//                 {meeting.title}
//             </h4>
//             <p className="text-sm text-primary-600 font-medium mb-4">{meeting.clubName}</p>
            
//             <div className="space-y-2 pt-4 border-t border-slate-100">
//                 <div className="flex items-center gap-2 text-sm text-slate-500">
//                     <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                     {meeting.startTime} - {meeting.endTime}
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-slate-500">
//                     <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
//                     {meeting.location}
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// const EmptyState: React.FC<{ message: string }> = ({ message }) => (
//     <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
//         <p className="text-slate-400 text-sm">{message}</p>
//     </div>
// );

// const LoadingSpinner = () => (
//     <div className="col-span-full py-12 flex justify-center items-center">
//         <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//     </div>
// );

// // --- Role Views ---

// const StudentDashboard = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
    
//     const [upcoming, setUpcoming] = useState<Meeting[]>([]);
//     const [history, setHistory] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);

//     const getClubName = (id: string) => CLUBS.find(c => c.id === id)?.name || 'Unknown Club';

//     useEffect(() => {
//         if (!user?.id) return;

//         const myClubIds = user.joinedClubIds || [];
//         let allMeetings: Meeting[] = [];
//         let currentAttendanceRecords: any[] = [];

//         // Helper to combine and sort history whenever meetings or attendance updates
//         const updateHistoryView = (meetings: Meeting[], records: any[]) => {
//             const historyData = records.map(record => {
//                 const meeting = meetings.find(m => m.id === record.meetingId);
//                 return { record, meeting };
//             }).filter(item => item.meeting !== undefined)
//               .sort((a, b) => new Date(b.meeting!.date).getTime() - new Date(a.meeting!.date).getTime());
            
//             setHistory(historyData);
//             setLoading(false);
            
//             setTimeout(() => {
//                 if (typeof gsap !== 'undefined') {
//                     gsap.fromTo(".gsap-card", 
//                         { y: 20, opacity: 0 },
//                         { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
//                     );
//                 }
//             }, 100);
//         };

//         // Real-time listener for all meetings
//         const unsubMeetings = onSnapshot(collection(db, 'meetings'), (meetingsSnap) => {
//             allMeetings = meetingsSnap.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//                 clubName: getClubName(doc.data().clubId)
//             } as Meeting));

//             const relevantUpcoming = allMeetings
//                 .filter(m => myClubIds.includes(m.clubId) && m.status?.toLowerCase() === 'scheduled')
//                 .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
//             setUpcoming(relevantUpcoming);
//             updateHistoryView(allMeetings, currentAttendanceRecords);
//         });

//         // Real-time listener for student's personal attendance
//         const unsubAttendance = onSnapshot(query(collection(db, 'attendance'), where('studentId', '==', user.id)), (attSnap) => {
//             currentAttendanceRecords = attSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             updateHistoryView(allMeetings, currentAttendanceRecords);
//         });

//         return () => {
//             unsubMeetings();
//             unsubAttendance();
//         };
//     }, [user]);

//     return (
//         <div className="space-y-10">
//             <SectionHeader 
//                 title={`Welcome, ${user?.name?.split(' ')[0] || 'Student'}`}
//                 subtitle={`${user?.branch || 'General'} • ${user?.year || '1st Year'}`}
//             />

//             {/* Upcoming Section */}
//             <section>
//                 <div className="flex items-center gap-2 mb-6">
//                     <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
//                     <h3 className="text-xl font-bold text-slate-800">Upcoming Schedule</h3>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {loading ? <LoadingSpinner /> : upcoming.length > 0 ? (
//                         upcoming.map(meeting => (
//                             <MeetingCard key={meeting.id} meeting={meeting} />
//                         ))
//                     ) : (
//                         <EmptyState message="No upcoming meetings scheduled for your clubs." />
//                     )}
//                 </div>
//             </section>

//             {/* Past History Section */}
//             <section>
//                  <div className="flex items-center gap-2 mb-6">
//                     <span className="w-1.5 h-6 bg-slate-400 rounded-full"></span>
//                     <h3 className="text-xl font-bold text-slate-800">Recent Attendance</h3>
//                 </div>

//                 <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 overflow-hidden shadow-sm">
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left">
//                             <thead className="bg-slate-50 border-b border-slate-200">
//                                 <tr>
//                                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
//                                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting</th>
//                                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-slate-100">
//                                 {loading ? (
//                                     <tr><td colSpan={3}><LoadingSpinner /></td></tr>
//                                 ) : history.length > 0 ? (
//                                     history.map(({ record, meeting }) => (
//                                         <tr key={record.id} className="hover:bg-bg-DEFAULT transition-colors">
//                                             <td className="px-6 py-4 text-sm font-mono text-slate-500">
//                                                 {meeting?.date}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="text-sm font-bold text-slate-800">{meeting?.title}</div>
//                                                 <div className="text-xs text-slate-500">{meeting?.clubName}</div>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <Badge status={record.status.toUpperCase()} size="sm" />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm">
//                                             No attendance history recorded yet.
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                     {history.length > 0 && (
//                         <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
//                             <button onClick={() => navigate('/attendance')} className="text-xs font-semibold text-primary-700 hover:text-primary-800">
//                                 View Full History →
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </section>
//         </div>
//     );
// };

// const LeadDashboard = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
    
//     const [upcoming, setUpcoming] = useState<Meeting[]>([]);
//     const [past, setPast] = useState<Meeting[]>([]);
//     const [loading, setLoading] = useState(true);

//     const myClub = CLUBS.find(c => c.id === user?.clubId);

//     useEffect(() => {
//         if (!user?.clubId) return;

//         const q = query(collection(db, 'meetings'), where('clubId', '==', user.clubId));
        
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const fetched = snapshot.docs.map(doc => {
//                 const data = doc.data();
//                 return {
//                     id: doc.id,
//                     ...data,
//                     clubName: myClub?.name || 'Your Club'
//                 } as Meeting; 
//             });

//             const upcomingMeets = fetched
//                 .filter(m => m.status?.toLowerCase() === 'scheduled')
//                 .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                
//             const pastMeets = fetched
//                 .filter(m => m.status?.toLowerCase() === 'completed')
//                 .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//             setUpcoming(upcomingMeets);
//             setPast(pastMeets);
//             setLoading(false);

//             setTimeout(() => {
//                 if (typeof gsap !== 'undefined') {
//                     gsap.fromTo(".gsap-card", 
//                         { y: 20, opacity: 0 },
//                         { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
//                     );
//                 }
//             }, 100);
//         });

//         return () => unsubscribe();
//     }, [user?.clubId, myClub?.name]);

//     return (
//         <div className="space-y-10">
//             <SectionHeader 
//                 title={`${myClub?.name || 'Committee'} Dashboard`} 
//                 subtitle="Committee Lead Panel"
//                 action={
//                     <Button onClick={() => navigate('/create-meet')} variant="primary" className="shadow-lg shadow-primary-500/20">
//                         <span className="mr-2">+</span> Create New Meet
//                     </Button>
//                 }
//             />

//             {/* Upcoming Section */}
//             <section>
//                 <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-2">
//                         <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
//                         <h3 className="text-xl font-bold text-slate-800">Scheduled Meetings</h3>
//                     </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {loading ? <LoadingSpinner /> : upcoming.length > 0 ? (
//                         upcoming.map(meeting => (
//                             <MeetingCard 
//                                 key={meeting.id} 
//                                 meeting={meeting} 
//                                 onClick={() => navigate('/mark-attendance')}
//                             />
//                         ))
//                     ) : (
//                         <EmptyState message="No upcoming meetings scheduled. Create one to get started." />
//                     )}
//                 </div>
//             </section>

//             {/* Past Section */}
//             <section>
//                 <div className="flex items-center gap-2 mb-6">
//                     <span className="w-1.5 h-6 bg-slate-400 rounded-full"></span>
//                     <h3 className="text-xl font-bold text-slate-800">Past Meetings & Reports</h3>
//                 </div>

//                 <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 overflow-hidden shadow-sm">
//                     <table className="w-full text-left">
//                         <thead className="bg-slate-50 border-b border-slate-200">
//                             <tr>
//                                 <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
//                                 <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting Title</th>
//                                 <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Venue</th>
//                                 <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100">
//                             {loading ? (
//                                 <tr><td colSpan={4}><LoadingSpinner /></td></tr>
//                             ) : past.length > 0 ? (
//                                 past.map(meeting => (
//                                     <tr key={meeting.id} className="hover:bg-bg-DEFAULT transition-colors">
//                                         <td className="px-6 py-4 text-sm font-mono text-slate-500">
//                                             {meeting.date}
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <div className="text-sm font-bold text-slate-800">{meeting.title}</div>
//                                             <div className="text-xs text-slate-500">{meeting.startTime} - {meeting.endTime}</div>
//                                         </td>
//                                         <td className="px-6 py-4 text-sm text-slate-600">
//                                             {meeting.location}
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <Button variant="ghost" size="sm" className="text-primary-700 hover:text-primary-800 hover:bg-primary-50">
//                                                 View Report
//                                             </Button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
//                                         No past meeting history found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>
//         </div>
//     );
// };

// const FacultyDashboard = () => {
//     const navigate = useNavigate();
//     const { user } = useAuth();
    
//     const [recentActivity, setRecentActivity] = useState<Meeting[]>([]);
//     const [stats, setStats] = useState({ totalMeetings: 0, activeClubs: 0 });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Fetch all meetings across clubs to generate dynamic faculty overview stats
//         const unsubMeetings = onSnapshot(collection(db, 'meetings'), (snapshot) => {
//             const meetings = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//                 clubName: CLUBS.find(c => c.id === doc.data().clubId)?.name || 'Unknown Club'
//             } as Meeting));

//             setStats({
//                 totalMeetings: meetings.length,
//                 activeClubs: new Set(meetings.map(m => m.clubId)).size
//             });

//             // Filter out just the 3 most recently completed meetings
//             const past = meetings
//                 .filter(m => m.status?.toLowerCase() === 'completed')
//                 .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//                 .slice(0, 3); 

//             setRecentActivity(past);
//             setLoading(false);

//             setTimeout(() => {
//                 if (typeof gsap !== 'undefined') {
//                     gsap.fromTo(".gsap-card", 
//                         { y: 20, opacity: 0 },
//                         { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
//                     );
//                 }
//             }, 100);
//         });

//         return () => unsubMeetings();
//     }, []);

//     return (
//         <div className="space-y-10">
//             <SectionHeader 
//                 title="Faculty Overview" 
//                 subtitle={`Prof. ${user?.name?.split(' ')[1] || ''} • ${user?.branch || 'General'}`}
//             />

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Status Card 1 */}
//                 <div className="gsap-card p-6 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-4">
//                     <div className="w-12 h-12 rounded-lg bg-white text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm text-xl">
//                         📊
//                     </div>
//                     <div>
//                         <h4 className="text-lg font-bold text-indigo-900">System Activity</h4>
//                         <p className="text-indigo-700 text-sm mt-1">
//                             Tracking {stats.totalMeetings} total meetings across {stats.activeClubs} active clubs.
//                         </p>
//                         <Button 
//                             variant="ghost" 
//                             size="sm" 
//                             className="mt-3 text-indigo-700 hover:bg-indigo-100 -ml-2 font-semibold"
//                             onClick={() => navigate('/reports')}
//                         >
//                             View Master Reports →
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Status Card 2 */}
//                 <div className="gsap-card p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-4">
//                     <div className="w-12 h-12 rounded-lg bg-white text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm text-xl">
//                         ✅
//                     </div>
//                     <div>
//                         <h4 className="text-lg font-bold text-emerald-900">Health Status</h4>
//                         <p className="text-emerald-700 text-sm mt-1">Real-time attendance syncing is active. No conflicts reported.</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 shadow-card p-8">
//                 <div className="flex justify-between items-center mb-6">
//                     <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
//                          <span className="w-1.5 h-6 bg-slate-800 rounded-full"></span>
//                          Recently Completed Meetings
//                     </h3>
//                 </div>
                
//                 <div className="space-y-4">
//                     {loading ? <LoadingSpinner /> : recentActivity.length > 0 ? (
//                         recentActivity.map(activity => (
//                             <div key={activity.id} className="p-5 bg-bg-DEFAULT border border-slate-200 rounded-xl flex items-start gap-5 hover:border-slate-300 transition-colors">
//                                 <div className="p-3 bg-white rounded-lg text-slate-500 shadow-sm border border-slate-100">
//                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
//                                 </div>
//                                 <div>
//                                     <h4 className="font-bold text-slate-800">{activity.title} ({activity.clubName})</h4>
//                                     <p className="text-sm text-slate-600 mt-1 leading-relaxed">
//                                         Meeting successfully concluded at venue: <span className="font-medium text-slate-800">{activity.location}</span>.
//                                     </p>
//                                     <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
//                                         <span className="bg-slate-200 px-2 py-1 rounded">{activity.date}</span>
//                                         <span>{activity.startTime} - {activity.endTime}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                          <div className="text-sm text-slate-400 py-4">No recent meeting activity to show.</div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export const Dashboard: React.FC = () => {
//   const { user } = useAuth();

//   if (!user) return null;

//   switch (user.role) {
//     case UserRole.STUDENT:
//       return <StudentDashboard />;
//     case UserRole.LEAD:
//       return <LeadDashboard />;
//     case UserRole.FACULTY:
//       return <FacultyDashboard />;
//     default:
//       return <div>Unknown Role</div>;
//   }
// };

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, Meeting } from '../types';
import { CLUBS } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

declare const gsap: any;

// ── Helper Components ─────────────────────────────────────────────────────────

const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-slate-200 pb-4">
    <div>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const MeetingCard: React.FC<{ meeting: Meeting; onClick?: () => void }> = ({ meeting, onClick }) => (
  <div
    onClick={onClick}
    className="gsap-card group cursor-pointer bg-bg-card p-6 rounded-xl border border-slate-200 shadow-card hover:shadow-soft hover:border-primary-200 transition-all duration-300 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-150 duration-500"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <Badge status={(meeting.status || 'SCHEDULED').toUpperCase()} size="sm" />
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
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {meeting.startTime} - {meeting.endTime}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
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

const LoadingSpinner = () => (
  <div className="col-span-full py-12 flex justify-center items-center">
    <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  </div>
);

// ── Firestore helper: map a doc to a Meeting object ───────────────────────────
const docToMeeting = (docSnap: any): Meeting => {
  const data = docSnap.data();
  return {
    id:        docSnap.id,
    clubId:    data.clubId    || '',
    clubName:  data.clubName  || CLUBS.find(c => c.id === data.clubId)?.name || 'Unknown Club',
    title:     data.title     || '(Untitled)',
    description: data.description || '',
    date:      data.date      || '',
    startTime: data.startTime || '',
    endTime:   data.endTime   || '',
    location:  data.location  || '',
    status:    data.status    || 'scheduled',
  } as Meeting;
};

// ── GSAP animate after data loads ────────────────────────────────────────────
const animateCards = () => {
  setTimeout(() => {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        '.gsap-card',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, 100);
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [upcoming, setUpcoming]   = useState<Meeting[]>([]);
  const [history,  setHistory]    = useState<any[]>([]);
  const [loading,  setLoading]    = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const myClubIds = (user as any).joinedClubIds || [];
    let allMeetings: Meeting[]  = [];
    let attendanceRecs: any[]   = [];

    const rebuildHistory = (meetings: Meeting[], records: any[]) => {
      const rows = records
        .map(rec => ({ rec, meeting: meetings.find(m => m.id === rec.meetingId) }))
        .filter(x => x.meeting)
        .sort((a, b) => new Date(b.meeting!.date).getTime() - new Date(a.meeting!.date).getTime());
      setHistory(rows);
      setLoading(false);
      animateCards();
    };

    // All meetings — student sees any club they joined
    const unsubMeetings = onSnapshot(collection(db, 'meetings'), snap => {
      allMeetings = snap.docs.map(docToMeeting);

      const relevant = allMeetings
        .filter(m =>
          myClubIds.length === 0        // if no clubs joined, show all (fallback)
          || myClubIds.includes(m.clubId)
        )
        .filter(m => (m.status || '').toLowerCase() === 'scheduled')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setUpcoming(relevant);
      rebuildHistory(allMeetings, attendanceRecs);
    });

    // Student's personal attendance records
    const unsubAtt = onSnapshot(
      query(collection(db, 'attendance'), where('studentId', '==', user.id)),
      snap => {
        attendanceRecs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        rebuildHistory(allMeetings, attendanceRecs);
      }
    );

    return () => { unsubMeetings(); unsubAtt(); };
  }, [user]);

  return (
    <div className="space-y-10">
      <SectionHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Student'}`}
        subtitle={`${(user as any)?.branch || 'General'} • ${(user as any)?.year || '1st Year'}`}
      />

      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-6 bg-primary-500 rounded-full" />
          <h3 className="text-xl font-bold text-slate-800">Upcoming Schedule</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <LoadingSpinner /> : upcoming.length > 0
            ? upcoming.map(m => <MeetingCard key={m.id} meeting={m} />)
            : <EmptyState message="No upcoming meetings scheduled for your clubs." />
          }
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-6 bg-slate-400 rounded-full" />
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
                {loading ? (
                  <tr><td colSpan={3}><LoadingSpinner /></td></tr>
                ) : history.length > 0 ? (
                  history.map(({ rec, meeting }) => (
                    <tr key={rec.id} className="hover:bg-bg-DEFAULT transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{meeting?.date}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-800">{meeting?.title}</div>
                        <div className="text-xs text-slate-500">{meeting?.clubName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={rec.status.toUpperCase()} size="sm" />
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

// ─────────────────────────────────────────────────────────────────────────────
// LEAD DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const LeadDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState<Meeting[]>([]);
  const [past,     setPast]     = useState<Meeting[]>([]);
  const [loading,  setLoading]  = useState(true);

  // Club name: prefer stored in Firestore doc, fallback to CLUBS list
  const myClubName = CLUBS.find(c => c.id === (user as any)?.clubId)?.name || 'Your Club';

  useEffect(() => {
    if (!user?.id) return;

    // ── KEY FIX: query by createdBy (user uid) so meetings always show
    //    regardless of whether clubId was saved correctly.
    //    We also run a parallel query by clubId for completeness.
    // ─────────────────────────────────────────────────────────────────

    const processSnapshot = (docs: any[]) => {
      const meetings: Meeting[] = docs.map(docToMeeting);

      // De-duplicate by id in case both queries return same doc
      const seen = new Set<string>();
      const unique = meetings.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });

      setUpcoming(
        unique
          .filter(m => (m.status || '').toLowerCase() === 'scheduled')
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
      setPast(
        unique
          .filter(m => (m.status || '').toLowerCase() === 'completed')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
      setLoading(false);
      animateCards();
    };

    let docsFromCreatedBy: any[] = [];
    let docsFromClubId:    any[] = [];

    // Query 1: meetings created by this user (most reliable)
    const unsubCreatedBy = onSnapshot(
      query(collection(db, 'meetings'), where('createdBy', '==', user.id)),
      snap => {
        docsFromCreatedBy = snap.docs;
        processSnapshot([...docsFromCreatedBy, ...docsFromClubId]);
      }
    );

    // Query 2: meetings with matching clubId (for legacy/other data)
    const clubId = (user as any)?.clubId;
    let unsubClubId = () => {};
    if (clubId) {
      unsubClubId = onSnapshot(
        query(collection(db, 'meetings'), where('clubId', '==', clubId)),
        snap => {
          docsFromClubId = snap.docs;
          processSnapshot([...docsFromCreatedBy, ...docsFromClubId]);
        }
      );
    } else {
      // No clubId — just rely on createdBy query, stop loading after first result
      setLoading(false);
    }

    return () => { unsubCreatedBy(); unsubClubId(); };
  }, [user?.id, (user as any)?.clubId]);

  return (
    <div className="space-y-10">
      <SectionHeader
        title={`${myClubName} Dashboard`}
        subtitle="Committee Lead Panel"
        action={
          <Button onClick={() => navigate('/create-meeting')} variant="primary" className="shadow-lg shadow-primary-500/20">
            <span className="mr-2">+</span> Create New Meet
          </Button>
        }
      />

      {/* Scheduled Meetings */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-6 bg-primary-500 rounded-full" />
          <h3 className="text-xl font-bold text-slate-800">Scheduled Meetings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <LoadingSpinner /> : upcoming.length > 0
            ? upcoming.map(m => (
                <MeetingCard key={m.id} meeting={m} onClick={() => navigate('/mark-attendance')} />
              ))
            : <EmptyState message="No upcoming meetings. Create one to get started!" />
          }
        </div>
      </section>

      {/* Past Meetings */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-6 bg-slate-400 rounded-full" />
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
              {loading ? (
                <tr><td colSpan={4}><LoadingSpinner /></td></tr>
              ) : past.length > 0 ? (
                past.map(m => (
                  <tr key={m.id} className="hover:bg-bg-DEFAULT transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{m.date}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-800">{m.title}</div>
                      <div className="text-xs text-slate-500">{m.startTime} - {m.endTime}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{m.location}</td>
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

// ─────────────────────────────────────────────────────────────────────────────
// FACULTY DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const FacultyDashboard = () => {
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const [recentActivity, setRecentActivity] = useState<Meeting[]>([]);
  const [stats,          setStats]          = useState({ totalMeetings: 0, activeClubs: 0 });
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'meetings'), snap => {
      const meetings = snap.docs.map(docToMeeting);
      setStats({
        totalMeetings: meetings.length,
        activeClubs:   new Set(meetings.map(m => m.clubId)).size,
      });
      setRecentActivity(
        meetings
          .filter(m => (m.status || '').toLowerCase() === 'completed')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
      );
      setLoading(false);
      animateCards();
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Faculty Overview"
        subtitle={`Prof. ${user?.name?.split(' ')[1] || ''} • ${(user as any)?.branch || 'General'}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="gsap-card p-6 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-white text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm text-xl">📊</div>
          <div>
            <h4 className="text-lg font-bold text-indigo-900">System Activity</h4>
            <p className="text-indigo-700 text-sm mt-1">
              Tracking {stats.totalMeetings} total meetings across {stats.activeClubs} active clubs.
            </p>
            <Button variant="ghost" size="sm" className="mt-3 text-indigo-700 hover:bg-indigo-100 -ml-2 font-semibold" onClick={() => navigate('/reports')}>
              View Master Reports →
            </Button>
          </div>
        </div>
        <div className="gsap-card p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-white text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm text-xl">✅</div>
          <div>
            <h4 className="text-lg font-bold text-emerald-900">Health Status</h4>
            <p className="text-emerald-700 text-sm mt-1">Real-time attendance syncing is active. No conflicts reported.</p>
          </div>
        </div>
      </div>

      <div className="gsap-card bg-bg-card rounded-xl border border-slate-200 shadow-card p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <span className="w-1.5 h-6 bg-slate-800 rounded-full" />
            Recently Completed Meetings
          </h3>
        </div>
        <div className="space-y-4">
          {loading ? <LoadingSpinner /> : recentActivity.length > 0 ? (
            recentActivity.map(a => (
              <div key={a.id} className="p-5 bg-bg-DEFAULT border border-slate-200 rounded-xl flex items-start gap-5 hover:border-slate-300 transition-colors">
                <div className="p-3 bg-white rounded-lg text-slate-500 shadow-sm border border-slate-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{a.title} ({a.clubName})</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Concluded at venue: <span className="font-medium text-slate-800">{a.location}</span>.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="bg-slate-200 px-2 py-1 rounded">{a.date}</span>
                    <span>{a.startTime} - {a.endTime}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-400 py-4">No recent meeting activity to show.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case UserRole.STUDENT:  return <StudentDashboard />;
    case UserRole.LEAD:     return <LeadDashboard />;
    case UserRole.FACULTY:  return <FacultyDashboard />;
    default:                return <div>Unknown Role</div>;
  }
};
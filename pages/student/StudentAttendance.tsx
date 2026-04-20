import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, getDocs, doc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { MOCK_MEETINGS, MOCK_ATTENDANCE } from '../../services/mockData';
import { Meeting, AttendanceStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

declare const gsap: any;

export const StudentAttendance: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [isLocating, setIsLocating] = useState<string | null>(null);

    const [activeMeetings, setActiveMeetings] = useState<Meeting[]>([]);
    const [historyRecords, setHistoryRecords] = useState<any[]>([]);

    useEffect(() => {
        if (!user?.id) return;

        const myClubIds = (user as any).joinedClubIds || [];
        let allMeetings: Meeting[] = [];

        // Real-time listener for all meetings
        const unsubMeetings = onSnapshot(collection(db, 'meetings'), snap => {
            const fetchedMeetings = snap.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    clubId: data.clubId || '',
                    clubName: data.clubName || 'Unknown Club',
                    title: data.title || '(Untitled)',
                    date: data.date || '',
                    startTime: data.startTime || '',
                    endTime: data.endTime || '',
                    location: data.location || '',
                    status: data.status || 'scheduled'
                } as Meeting;
            });
            allMeetings = fetchedMeetings;

            const relevantUpcoming = fetchedMeetings
                .filter(m => (myClubIds.length === 0 || myClubIds.includes(m.clubId)) && m.status.toLowerCase() === 'scheduled')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            setActiveMeetings(relevantUpcoming);
        });

        // Real-time listener for history
        const unsubAttendance = onSnapshot(query(collection(db, 'attendance'), where('studentId', '==', user.id)), snap => {
            const records = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // We combine with all meetings later in the render loop or update state
            setHistoryRecords(records);
        });

        return () => { unsubMeetings(); unsubAttendance(); };
    }, [user]);

    // Animation
    useEffect(() => {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(".attendance-card",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, [activeTab]);

    const handleDeclare = async (meetingId: string, status: 'attending' | 'not attending') => {
        if (!user) return;
        setIsLocating(meetingId);

        try {
            await addDoc(collection(db, 'attendance'), {
                meetingId,
                studentId: user.id,
                studentName: user.name || 'Unknown Student',
                studentDiv: (user as any).div || 'A',
                studentYear: (user as any).year || '1st Year',
                studentAdmissionNumber: (user as any).admissionNumber || 'UNKNOWN',
                status: status === 'attending' ? 'DECLARED' : 'ABSENT', // mapped values: DECLARED means pending verification by lead
                createdAt: serverTimestamp()
            });

            alert(`Successfully marked as ${status}.`);
        } catch (error) {
            console.error("Error marking attendance: ", error);
            alert("Failed to mark attendance.");
        } finally {
            setIsLocating(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Attendance Portal</h2>
                    <p className="text-slate-500 mt-2 text-lg">Mark your presence for active club sessions.</p>
                </div>

                {/* Tab Switcher */}
                <div className="bg-slate-100 p-1 rounded-lg flex">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Active Sessions
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        My History
                    </button>
                </div>
            </div>

            {/* VIEW 1: Active Meetings (Action Required) */}
            {activeTab === 'active' && (
                <div className="grid md:grid-cols-2 gap-6">
                    {activeMeetings.length > 0 ? (
                        activeMeetings.map(meeting => {
                            const hasMarked = historyRecords.find(r => r.meetingId === meeting.id);
                            return (
                            <div key={meeting.id} className="attendance-card bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all relative">
                                {/* Status Stripe */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Live Now
                                        </span>
                                        <span className="text-slate-400 text-xs font-mono">{meeting.date}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mb-1">{meeting.title}</h3>
                                    <p className="text-primary-600 font-medium text-sm mb-6">{meeting.clubName}</p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <span>{meeting.startTime} - {meeting.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            <span>{meeting.location}</span>
                                        </div>
                                    </div>

                                    {hasMarked ? (
                                        <div className="py-2 px-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-600 text-sm font-bold">
                                            You marked: {hasMarked.status}
                                        </div>
                                    ) : (
                                        <div className="flex gap-3">
                                            <Button
                                                fullWidth
                                                onClick={() => handleDeclare(meeting.id, 'attending')}
                                                disabled={isLocating === meeting.id}
                                                className={isLocating === meeting.id ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"}
                                            >
                                                Attending
                                            </Button>
                                            <Button
                                                fullWidth
                                                onClick={() => handleDeclare(meeting.id, 'not attending')}
                                                disabled={isLocating === meeting.id}
                                                className={isLocating === meeting.id ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-red-600 hover:bg-red-700 shadow-red-500/20"}
                                            >
                                                Not Attending
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )})
                    ) : (
                        <div className="col-span-full py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm text-slate-300">😴</div>
                            <h3 className="text-lg font-bold text-slate-700">No Active Sessions</h3>
                            <p className="text-slate-400 text-sm mt-1">There are no ongoing meetings for your clubs right now.</p>
                        </div>
                    )}
                </div>
            )}

            {/* VIEW 2: History Table */}
            {activeTab === 'history' && (
                <div className="attendance-card bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                                {historyRecords.map(record => {
                                    // Normally we join with meeting details. For display, we can show basic known details.
                                    return (
                                        <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                                {/* Requires full meeting fetch to show exact date/name if not cached, simplistic display here */}
                                                Meeting ID: {record.meetingId}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-800">History</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge status={record.status} size="sm" />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};
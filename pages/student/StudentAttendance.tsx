import React, { useState, useEffect } from 'react';
import { MOCK_MEETINGS, MOCK_ATTENDANCE, CLUBS } from '../../services/mockData';
import { Meeting, AttendanceStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

declare const gsap: any;

export const StudentAttendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [isLocating, setIsLocating] = useState<string | null>(null);

  // Mock Data Logic
  const myClubIds = ['c1', 'c2']; // Simulating logged-in user's clubs
  
  const activeMeetings = MOCK_MEETINGS.filter(m => 
    m.status === 'SCHEDULED' && myClubIds.includes(m.clubId)
  );

  const history = MOCK_ATTENDANCE.filter(a => a.studentId === 'u1'); // Mock User ID

  // Animation
  useEffect(() => {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(".attendance-card", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  const handleDeclare = (meetingId: string) => {
    setIsLocating(meetingId);
    
    // Simulate Geolocation Delay
    setTimeout(() => {
        setIsLocating(null);
        alert("Location Verified! Attendance Marked Successfully.");
    }, 1500);
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
                activeMeetings.map(meeting => (
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

                            <Button 
                                fullWidth 
                                onClick={() => handleDeclare(meeting.id)}
                                disabled={isLocating === meeting.id}
                                className={isLocating === meeting.id ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"}
                            >
                                {isLocating === meeting.id ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Verifying Location...
                                    </span>
                                ) : "📍 Declare Presence"}
                            </Button>
                            <p className="text-center text-xs text-slate-400 mt-3">
                                Requires location permission
                            </p>
                         </div>
                    </div>
                ))
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
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {history.map(record => {
                            const meeting = MOCK_MEETINGS.find(m => m.id === record.meetingId);
                            return (
                                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                        {meeting?.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-800">{meeting?.title}</div>
                                        <div className="text-xs text-slate-500">{meeting?.clubName}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {meeting?.startTime}
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
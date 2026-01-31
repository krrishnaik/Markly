import React, { useState, useEffect } from 'react';
import { MOCK_MEETINGS, MOCK_ATTENDANCE, MOCK_USERS } from '../../services/mockData';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AttendanceStatus, UserRole } from '../../types';

declare const gsap: any;

export const LeadMarking: React.FC = () => {
  // 1. Select the most recent active meeting by default
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(MOCK_MEETINGS[0].id);
  
  // 2. Mock Logic: Get attendance records + merge with user details
  // In a real app, this join happens on the backend
  const [records, setRecords] = useState(() => {
    return MOCK_ATTENDANCE.map(record => {
        const user = MOCK_USERS.find(u => u.id === record.studentId);
        return { ...record, user };
    });
  });

  const activeMeeting = MOCK_MEETINGS.find(m => m.id === selectedMeetingId);

  // Filter records for the selected meeting
  const currentRecords = records.filter(r => r.meetingId === selectedMeetingId);

  // Stats
  const stats = {
    total: currentRecords.length,
    present: currentRecords.filter(r => r.status === AttendanceStatus.PRESENT).length,
    pending: currentRecords.filter(r => r.status === AttendanceStatus.DECLARED).length
  };

  useEffect(() => {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(".attendance-row", 
            { y: 10, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" }
        );
    }
  }, [selectedMeetingId]);

  const handleStatusChange = (recordId: string, newStatus: AttendanceStatus) => {
    setRecords(prev => prev.map(r => 
        r.id === recordId ? { ...r, status: newStatus } : r
    ));
  };

  const handleSubmitFinal = () => {
    // Logic to lock the meeting
    alert(`Attendance finalized for ${activeMeeting?.title}. ${stats.present} students marked present.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Attendance Manager</h2>
          <p className="text-slate-500 mt-2 text-lg">Verify student presence for your sessions.</p>
        </div>
        
        <div className="flex items-center gap-3">
             <div className="flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Select Session</span>
                <select 
                    value={selectedMeetingId}
                    onChange={(e) => setSelectedMeetingId(e.target.value)}
                    className="mt-1 block w-64 rounded-lg border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm font-medium text-slate-700"
                >
                    {MOCK_MEETINGS.map(m => (
                        <option key={m.id} value={m.id}>{m.title} ({m.date})</option>
                    ))}
                </select>
             </div>
        </div>
      </div>

      {/* Meeting Context Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{activeMeeting?.title}</h3>
                    <p className="text-sm text-slate-500">{activeMeeting?.startTime} - {activeMeeting?.endTime} • {activeMeeting?.location}</p>
                </div>
            </div>

            <div className="flex gap-8 border-l border-slate-100 pl-8">
                <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{stats.present}</div>
                    <div className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider">Verified</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-amber-500">{stats.pending}</div>
                    <div className="text-xs font-bold text-amber-600/70 uppercase tracking-wider">Pending</div>
                </div>
            </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">Admission No.</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {currentRecords.map((record) => (
                        <tr key={record.id} className="attendance-row hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{record.user?.name || record.studentName}</div>
                                <div className="text-xs text-slate-400">{record.user?.branch || 'Computer Engineering'}</div>
                            </td>
                            <td className="px-6 py-4 font-mono text-sm text-slate-600">
                                {record.studentAdmissionNumber || '2024HE00XX'}
                            </td>
                            <td className="px-6 py-4">
                                <Badge status={record.status} size="sm" />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleStatusChange(record.id, AttendanceStatus.PRESENT)}
                                        className={`p-2 rounded-lg transition-all duration-200 border ${
                                            record.status === AttendanceStatus.PRESENT 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm' 
                                            : 'bg-white text-slate-400 border-slate-200 hover:text-emerald-600 hover:border-emerald-200'
                                        }`}
                                        title="Mark Present"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(record.id, AttendanceStatus.ABSENT)}
                                        className={`p-2 rounded-lg transition-all duration-200 border ${
                                            record.status === AttendanceStatus.ABSENT 
                                            ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' 
                                            : 'bg-white text-slate-400 border-slate-200 hover:text-red-600 hover:border-red-200'
                                        }`}
                                        title="Mark Absent"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {currentRecords.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                No attendance records found for this session yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        
        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <p className="text-sm text-slate-500">
                Ensure all students are verified before finalizing.
            </p>
            <Button onClick={handleSubmitFinal} className="shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700">
                Finalize & Submit Report
            </Button>
        </div>
      </div>
    </div>
  );
};
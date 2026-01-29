import React, { useState } from 'react';
import { MOCK_MEETINGS, MOCK_ATTENDANCE } from '../../services/mockData';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AttendanceStatus } from '../../types';

export const LeadMarking: React.FC = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(MOCK_MEETINGS[1].id);
  
  // Filter attendance records for the selected meeting
  const [records, setRecords] = useState(
    MOCK_ATTENDANCE.filter(a => a.meetingId === selectedMeetingId)
  );

  const meeting = MOCK_MEETINGS.find(m => m.id === selectedMeetingId);

  const handleStatusChange = (recordId: string, newStatus: AttendanceStatus) => {
    setRecords(prev => prev.map(r => 
        r.id === recordId ? { ...r, status: newStatus } : r
    ));
  };

  const handleSubmitFinal = () => {
    alert("Final attendance list submitted successfully!");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Mark Attendance</h2>
          <p className="text-stone-500 mt-2 text-lg">Verify and submit final attendance for your club meetings.</p>
        </div>
        <select 
            className="px-5 py-3 border border-stone-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 bg-white text-stone-700 font-medium outline-none min-w-[250px]"
            value={selectedMeetingId}
            onChange={(e) => setSelectedMeetingId(e.target.value)}
        >
            {MOCK_MEETINGS.filter(m => m.clubId === 'c1').map(m => (
                <option key={m.id} value={m.id}>{m.date}: {m.title}</option>
            ))}
        </select>
      </div>

      {/* Meeting Summary Card */}
      <div className="bg-white p-8 rounded-xl shadow-card border border-stone-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
                <h3 className="text-xl font-bold text-stone-900">{meeting?.title}</h3>
                <div className="text-sm text-stone-500 mt-2 flex flex-wrap gap-4 md:gap-8 font-medium">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {meeting?.date}
                    </span>
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {meeting?.location}
                    </span>
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {meeting?.startTime} - {meeting?.endTime}
                    </span>
                </div>
            </div>
            <div className="mt-6 md:mt-0 flex gap-4">
                <div className="text-center px-5 py-3 bg-stone-50 rounded-lg border border-stone-100 min-w-[100px]">
                    <div className="text-2xl font-bold text-stone-700">{records.length}</div>
                    <div className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mt-1">Total</div>
                </div>
                <div className="text-center px-5 py-3 bg-primary-50 rounded-lg border border-primary-100 min-w-[100px]">
                    <div className="text-2xl font-bold text-primary-700">
                        {records.filter(r => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.DECLARED).length}
                    </div>
                    <div className="text-[10px] text-primary-600 uppercase font-bold tracking-widest mt-1">Present</div>
                </div>
            </div>
        </div>
    </div>

      {/* Verification Table */}
      <div className="bg-white rounded-xl shadow-card border border-stone-200 overflow-hidden">
        <div className="px-8 py-5 bg-stone-50/50 border-b border-stone-200 flex justify-between items-center">
            <div>
                <h4 className="font-bold text-stone-800">Member Declarations</h4>
                <p className="text-xs text-stone-500 mt-1">Review and approve declarations</p>
            </div>
            
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-100">
                <thead>
                    <tr className="bg-stone-50">
                        <th className="px-8 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Declared Status</th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Time</th>
                        <th className="px-8 py-4 text-center text-xs font-bold text-stone-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                    {records.map(record => (
                        <tr key={record.id} className="hover:bg-stone-50 transition-colors">
                            <td className="px-8 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-stone-900">{record.studentName}</div>
                                <div className="text-xs text-stone-500 mt-0.5">{record.studentId}</div>
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap">
                                <Badge status={record.status} size="sm" />
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap text-sm text-stone-500 font-mono">
                                {record.timestamp ? new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-center gap-3">
                                    <button 
                                        onClick={() => handleStatusChange(record.id, AttendanceStatus.PRESENT)}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            record.status === AttendanceStatus.PRESENT 
                                            ? 'bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-500/30' 
                                            : 'bg-stone-100 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50'
                                        }`}
                                        title="Mark Present"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(record.id, AttendanceStatus.ABSENT)}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            record.status === AttendanceStatus.ABSENT 
                                            ? 'bg-rose-100 text-rose-700 shadow-sm ring-1 ring-rose-500/30' 
                                            : 'bg-stone-100 text-stone-400 hover:text-rose-600 hover:bg-rose-50'
                                        }`}
                                        title="Mark Absent"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex justify-end">
            <Button onClick={handleSubmitFinal} size="lg" className="shadow-md">
                Submit Final Attendance
            </Button>
        </div>
      </div>
    </div>
  );
};
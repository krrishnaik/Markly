import React, { useState } from 'react';
import { MOCK_MEETINGS, MOCK_ATTENDANCE, CLUBS } from '../../services/mockData';
import { Meeting } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const StudentAttendance: React.FC = () => {
  // Use mock data for display
  const [meetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [history] = useState(MOCK_ATTENDANCE.filter(a => a.studentId === 'u1')); 
  const [selectedClub, setSelectedClub] = useState<string>('all');

  const activeMeetings = meetings.filter(m => m.status === 'SCHEDULED');
  
  const filteredHistory = selectedClub === 'all' 
    ? history 
    : history.filter(h => {
        const meeting = meetings.find(m => m.id === h.meetingId);
        return meeting?.clubId === selectedClub;
    });

  const handleDeclare = (meetingId: string, present: boolean) => {
    alert(`Marked as ${present ? 'Present' : 'Not Attended'} for meeting ${meetingId}`);
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">My Attendance</h2>
        <p className="text-slate-500 mt-2 text-lg">Declare presence for active meetings and view history.</p>
      </div>

      {/* Active Declarations */}
      <section>
        <div className="flex items-center gap-3 mb-6">
             <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="text-lg font-bold text-slate-700 tracking-tight">Active Meetings</h3>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeMeetings.map(meeting => (
            <div key={meeting.id} className="bg-bg-card p-6 rounded-xl shadow-card border border-slate-200 hover:border-primary-300 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-5">
                <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 rounded border border-primary-100">
                  {meeting.clubName}
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-bg-DEFAULT px-2 py-1 rounded">{meeting.date}</span>
              </div>
              <h4 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-primary-700 transition-colors">{meeting.title}</h4>
              <div className="text-sm text-slate-500 mb-8 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{meeting.startTime} - {meeting.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{meeting.location}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                    variant="outline" 
                    fullWidth 
                    className="text-xs border-slate-300 hover:bg-slate-50"
                    onClick={() => handleDeclare(meeting.id, false)}
                >
                    Missed
                </Button>
                <Button 
                    variant="primary" 
                    fullWidth 
                    className="text-xs"
                    onClick={() => handleDeclare(meeting.id, true)}
                >
                    I Was There
                </Button>
              </div>
            </div>
          ))}
          {activeMeetings.length === 0 && (
            <div className="col-span-full py-16 text-center bg-bg-card rounded-xl border border-dashed border-slate-300">
                <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-slate-500 font-medium">No active meetings require declaration right now.</p>
            </div>
          )}
        </div>
      </section>

      {/* History Table */}
      <section className="bg-bg-card rounded-xl shadow-card border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-bg-DEFAULT/30">
          <h3 className="font-bold text-slate-800">Attendance History</h3>
          <div className="flex gap-2">
            <div className="relative">
                <select 
                    className="text-sm border border-slate-200 rounded-lg text-slate-600 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white py-2 pl-3 pr-8 shadow-sm outline-none appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                >
                    <option value="all">All Clubs</option>
                    {CLUBS.map(club => (
                        <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-bg-DEFAULT text-slate-500">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider">Club & Meeting</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider">Time</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-bg-card divide-y divide-slate-100">
              {filteredHistory.length > 0 ? (
                  filteredHistory.map(record => {
                    const meeting = meetings.find(m => m.id === record.meetingId);
                    return (
                      <tr key={record.id} className="hover:bg-bg-DEFAULT/80 transition-colors group">
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-slate-600">
                          {meeting?.date}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-slate-800 group-hover:text-primary-700 transition-colors">{meeting?.clubName}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{meeting?.title}</div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-mono">
                          {meeting?.startTime}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <Badge status={record.status} size="sm" />
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                    <td colSpan={4} className="px-8 py-8 text-center text-slate-400 text-sm">
                        No history found for this selection.
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
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';
import { MOCK_ATTENDANCE, CLUBS, MOCK_MEETINGS } from '../services/mockData';

declare const gsap: any;

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  
  useEffect(() => {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(".profile-card", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    }
  }, []);

  if (!user) return null;

  // Calculate stats based on role
  const getStats = () => {
    if (user.role === UserRole.STUDENT) {
        const myAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === user.id);
        const presentCount = myAttendance.filter(a => ['PRESENT', 'DECLARED'].includes(a.status)).length;
        const totalMeetings = 10; // Mock total
        const percentage = Math.round((presentCount / totalMeetings) * 100);
        return [
            { label: 'Attendance Rate', value: `${percentage}%` },
            { label: 'Meetings Attended', value: presentCount },
            { label: 'Clubs Joined', value: '2' },
        ];
    } else if (user.role === UserRole.LEAD) {
        return [
            { label: 'Members Managed', value: '124' },
            { label: 'Meetings Hosted', value: '8' },
            { label: 'Pending Reviews', value: '15' },
        ];
    } else {
        return [
            { label: 'Clubs Supervised', value: '3' },
            { label: 'Conflicts Resolved', value: '12' },
            { label: 'Active Alerts', value: '2' },
        ];
    }
  };

  const stats = getStats();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Profile Card - Clean Version */}
      <div className="profile-card bg-bg-card rounded-xl shadow-card border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-bg-DEFAULT p-1 shadow-inner border border-slate-100 flex-shrink-0">
                  <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-3xl font-bold text-slate-600">
                      {user.name.charAt(0)}
                  </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-slate-500 text-sm mt-2">
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">{user.email}</span>
                      <span className="hidden md:inline">•</span>
                      <span className="capitalize bg-slate-100 px-2 py-1 rounded text-slate-600">{user.role.toLowerCase()}</span>
                  </div>
              </div>

              <div className="flex-shrink-0">
                  <Button variant="outline" onClick={logout} className="border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800">
                      Sign Out
                  </Button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-8 border-t border-slate-100">
              {stats.map((stat, idx) => (
                  <div key={idx} className="text-center md:text-left bg-bg-DEFAULT/50 p-4 rounded-lg border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
                      <div className="text-2xl font-bold text-primary-600 mt-1">{stat.value}</div>
                  </div>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Academic Details */}
        <div className="profile-card md:col-span-2 bg-bg-card rounded-xl shadow-card border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-slate-300 rounded-full"></span>
                Academic Information
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Department</label>
                    <div className="text-slate-700 font-medium mt-1">{user.department || 'Not Assigned'}</div>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Year / Batch</label>
                    <div className="text-slate-700 font-medium mt-1">{user.year || 'N/A'}</div>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Student ID</label>
                    <div className="text-slate-700 font-medium mt-1 font-mono text-sm bg-slate-100 inline-block px-2 py-1 rounded border border-slate-200">
                        {user.id.toUpperCase()}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Status</label>
                    <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Active
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Club Affiliations */}
        <div className="profile-card bg-bg-card rounded-xl shadow-card border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-400 rounded-full"></span>
                {user.role === UserRole.STUDENT ? 'My Clubs' : 'Managed Club'}
            </h3>
            
            <div className="space-y-4">
                {user.role === UserRole.STUDENT ? (
                    <>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-DEFAULT border border-slate-200">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg text-slate-500">💻</div>
                            <div>
                                <div className="font-bold text-slate-700 text-sm">Coding Club</div>
                                <div className="text-xs text-slate-500">Member • Since 2022</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-DEFAULT border border-slate-200">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg text-slate-500">🤖</div>
                            <div>
                                <div className="font-bold text-slate-700 text-sm">Robotics Team</div>
                                <div className="text-xs text-slate-500">Member • Since 2023</div>
                            </div>
                        </div>
                    </>
                ) : user.role === UserRole.LEAD && user.clubId ? (
                     <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 border border-primary-100">
                        <div className="w-10 h-10 rounded-lg bg-white border border-primary-200 flex items-center justify-center text-lg text-primary-600">⚡</div>
                        <div>
                            <div className="font-bold text-primary-900 text-sm">{CLUBS.find(c => c.id === user.clubId)?.name}</div>
                            <div className="text-xs text-primary-700">Committee Lead</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-slate-500 italic">Faculty Coordinator</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
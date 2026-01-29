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
      {/* Header Profile Card */}
      <div className="profile-card bg-white rounded-2xl shadow-card border border-stone-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600 relative">
            <div className="absolute inset-0 opacity-20 pattern-dots"></div>
        </div>
        <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                    <div className="w-full h-full bg-secondary-100 rounded-xl flex items-center justify-center text-3xl font-bold text-secondary-700 border border-secondary-200">
                        {user.name.charAt(0)}
                    </div>
                </div>
                <div className="flex-1 mb-2">
                    <h1 className="text-2xl font-bold text-stone-900">{user.name}</h1>
                    <div className="flex items-center gap-2 text-stone-500 text-sm mt-1">
                        <span>{user.email}</span>
                        <span>•</span>
                        <span className="capitalize">{user.role.toLowerCase()}</span>
                    </div>
                </div>
                <div className="mb-2">
                    <Button variant="outline" onClick={logout} className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300">
                        Sign Out
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-100">
                {stats.map((stat, idx) => (
                    <div key={idx} className="text-center md:text-left">
                        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">{stat.label}</div>
                        <div className="text-2xl font-bold text-primary-600 mt-1">{stat.value}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Academic Details */}
        <div className="profile-card md:col-span-2 bg-white rounded-2xl shadow-card border border-stone-200 p-8">
            <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-secondary-400 rounded-full"></span>
                Academic Information
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                    <label className="text-xs font-medium text-stone-400">Department</label>
                    <div className="text-stone-900 font-medium mt-1">{user.department || 'Not Assigned'}</div>
                </div>
                <div>
                    <label className="text-xs font-medium text-stone-400">Year / Batch</label>
                    <div className="text-stone-900 font-medium mt-1">{user.year || 'N/A'}</div>
                </div>
                <div>
                    <label className="text-xs font-medium text-stone-400">Student ID</label>
                    <div className="text-stone-900 font-medium mt-1 font-mono text-sm bg-stone-50 inline-block px-2 py-1 rounded border border-stone-100">
                        {user.id.toUpperCase()}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-medium text-stone-400">Status</label>
                    <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Active
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Club Affiliations */}
        <div className="profile-card bg-white rounded-2xl shadow-card border border-stone-200 p-8">
            <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
                {user.role === UserRole.STUDENT ? 'My Clubs' : 'Managed Club'}
            </h3>
            
            <div className="space-y-4">
                {user.role === UserRole.STUDENT ? (
                    <>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                            <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-lg">💻</div>
                            <div>
                                <div className="font-bold text-stone-800 text-sm">Coding Club</div>
                                <div className="text-xs text-stone-500">Member • Since 2022</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                            <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-lg">🤖</div>
                            <div>
                                <div className="font-bold text-stone-800 text-sm">Robotics Team</div>
                                <div className="text-xs text-stone-500">Member • Since 2023</div>
                            </div>
                        </div>
                    </>
                ) : user.role === UserRole.LEAD && user.clubId ? (
                     <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100">
                        <div className="w-10 h-10 rounded-lg bg-white border border-primary-200 flex items-center justify-center text-lg text-primary-600">⚡</div>
                        <div>
                            <div className="font-bold text-primary-900 text-sm">{CLUBS.find(c => c.id === user.clubId)?.name}</div>
                            <div className="text-xs text-primary-700">Committee Lead</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-stone-500 italic">Faculty Coordinator</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
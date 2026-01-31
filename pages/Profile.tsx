import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';
import { MOCK_ATTENDANCE, CLUBS } from '../services/mockData';

declare const gsap: any;

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Entry Animation
  useEffect(() => {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(".profile-item", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    }
  }, []);

  if (!user) return null;

  // --- Stats Calculation Logic ---
  const getStats = () => {
    if (user.role === UserRole.STUDENT) {
        const myAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === user.id);
        const attendedCount = myAttendance.filter(a => ['PRESENT', 'DECLARED'].includes(a.status)).length;
        // Mock total meetings for calculation
        const totalMeetings = 12; 
        const percentage = Math.round((attendedCount / totalMeetings) * 100);
        
        return [
            { label: 'Attendance Rate', value: `${percentage}%` },
            { label: 'Meetings Attended', value: attendedCount },
            { label: 'Active Memberships', value: user.joinedClubIds?.length || 0 },
        ];
    } else if (user.role === UserRole.LEAD) {
        return [
             { label: 'Club Members', value: 124 }, 
             { label: 'Meetings Hosted', value: 8 },
             { label: 'Reports Filed', value: 12 },
        ];
    }
    return [];
  };

  const stats = getStats();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* 1. Header Section (Clean, no banners) */}
      <div className="profile-item flex flex-col md:flex-row items-center md:items-start gap-6 pb-8 border-b border-slate-200">
        <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-slate-500">
            {user.name.charAt(0)}
        </div>
        <div className="text-center md:text-left space-y-1">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{user.name}</h1>
            <p className="text-slate-500 font-medium text-lg">{user.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 uppercase tracking-wide border border-primary-100">
                    {user.role}
                </span>
                {user.role === UserRole.STUDENT && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {user.year}
                    </span>
                )}
            </div>
        </div>
        <div className="md:ml-auto pt-4 md:pt-0">
            <Button variant="outline" onClick={logout} className="border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-colors">
                Sign Out
            </Button>
        </div>
      </div>

      {/* 2. Statistics Grid (Moved from Dashboard) */}
      {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, idx) => (
                <div key={idx} className="profile-item bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center hover:border-slate-300 transition-colors">
                    <div className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
          </div>
      )}

      {/* 3. Detailed Info & Clubs */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Academic Details */}
        <div className="profile-item bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-4">Academic Profile</h3>
            
            <div className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Admission Number</label>
                    <div className="font-mono text-slate-700 bg-slate-50 px-3 py-2 rounded border border-slate-200 inline-block text-sm">
                        {user.admissionNumber || 'N/A'}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Branch / Department</label>
                    <div className="font-medium text-slate-800">{user.branch || 'Not Assigned'}</div>
                </div>
                 {user.year && (
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Current Year</label>
                        <div className="font-medium text-slate-800">{user.year}</div>
                    </div>
                )}
            </div>
        </div>

        {/* Club Memberships */}
        <div className="profile-item bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-4">
                {user.role === UserRole.LEAD ? 'Managing Committee' : 'Club Memberships'}
            </h3>

            <div className="space-y-4">
                {user.role === UserRole.STUDENT && user.joinedClubIds ? (
                    user.joinedClubIds.map(clubId => {
                        const club = CLUBS.find(c => c.id === clubId);
                        return club ? (
                            <div key={clubId} className="flex items-center gap-4 p-4 rounded-lg bg-bg-DEFAULT border border-slate-200 hover:border-slate-300 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-500 shadow-sm">
                                    {club.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-700">{club.name}</div>
                                    <div className="text-xs text-slate-500">{club.category}</div>
                                </div>
                            </div>
                        ) : null;
                    })
                ) : user.role === UserRole.LEAD && user.clubId ? (
                     <div className="flex items-center gap-4 p-4 rounded-lg bg-primary-50 border border-primary-100">
                        <div className="w-10 h-10 rounded-lg bg-white border border-primary-200 flex items-center justify-center text-lg font-bold text-primary-600 shadow-sm">
                            {CLUBS.find(c => c.id === user.clubId)?.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-primary-900">{CLUBS.find(c => c.id === user.clubId)?.name}</div>
                            <div className="text-xs text-primary-700 font-medium">Committee Lead</div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center border border-dashed border-slate-200 rounded-lg">
                        <p className="text-slate-400 text-sm italic">No active club memberships found.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
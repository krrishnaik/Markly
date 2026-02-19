import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { UserRole, AttendanceStatus } from '../types';
import { MOCK_ATTENDANCE, MOCK_MEETINGS, CLUBS, MOCK_USERS } from '../services/mockData';

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

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Shared Header */}
            <div className="profile-item flex flex-col md:flex-row items-center md:items-start gap-6 pb-8 border-b border-slate-200">
                <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-slate-500 overflow-hidden">
                    {/* Simple Avatar Placeholder */}
                    {user.name.charAt(0)}
                </div>
                <div className="text-center md:text-left space-y-1">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{user.name}</h1>
                    <p className="text-slate-500 font-medium text-lg">{user.email}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${user.role === UserRole.FACULTY
                                ? 'bg-amber-50 text-amber-700 border-amber-100' // Distinguish Faculty slightly 
                                : 'bg-primary-50 text-primary-700 border-primary-100'
                            }`}>
                            {user.role === UserRole.LEAD ? 'Club Lead' : user.role}
                        </span>
                        {user.role === UserRole.STUDENT && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {user.year}
                            </span>
                        )}
                        {user.role === UserRole.FACULTY && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {user.branch}
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

            {/* Role-Based Views */}
            {user.role === UserRole.STUDENT && <StudentView user={user} />}
            {user.role === UserRole.LEAD && <LeadView user={user} />}
            {user.role === UserRole.FACULTY && <FacultyView user={user} />}

        </div>
    );
};

// --- STUDENT VIEW ---
const StudentView: React.FC<{ user: any }> = ({ user }) => {
    // Calc Overall Stats
    const myAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === user.id);
    const attendedCount = myAttendance.filter(a => [AttendanceStatus.PRESENT, AttendanceStatus.DECLARED].includes(a.status)).length;
    // Mock total potential meetings (for demo purposes, assume 20)
    const totalPotentialMeetings = 20;
    const overallPercentage = Math.round((attendedCount / totalPotentialMeetings) * 100);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                <StatCard label="Attendance Rate" value={`${overallPercentage}%`} />
                <StatCard label="Meetings Attended" value={attendedCount} />
                <StatCard label="Active Clubs" value={user.joinedClubIds?.length || 0} />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Col: Academic Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="profile-item bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3">Academic Info</h3>
                        <div className="space-y-4">
                            <InfoRow label="Admission No" value={user.admissionNumber || 'N/A'} />
                            <InfoRow label="Department" value={user.branch || 'N/A'} />
                            <InfoRow label="Year / Batch" value={user.year || 'N/A'} />
                            <InfoRow label="Status" value="Active Student" />
                        </div>
                    </div>
                </div>

                {/* Right Col: Club Breakdown */}
                <div className="md:col-span-2 space-y-6">
                    <div className="profile-item bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-4 mb-4">Club Attendance</h3>
                        <div className="space-y-4">
                            {user.joinedClubIds?.map((clubId: string) => {
                                const club = CLUBS.find(c => c.id === clubId);
                                if (!club) return null;

                                // Calc per-club stats
                                const clubMeetings = MOCK_MEETINGS.filter(m => m.clubId === clubId && m.status === 'COMPLETED');
                                const attendedClubMeetings = myAttendance.filter(a =>
                                    clubMeetings.some(m => m.id === a.meetingId) &&
                                    [AttendanceStatus.PRESENT, AttendanceStatus.DECLARED].includes(a.status)
                                ).length;
                                const clubTotal = clubMeetings.length || 1; // Prevent div by zero
                                const clubPct = Math.round((attendedClubMeetings / clubTotal) * 100);

                                return (
                                    <div key={clubId} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-500 shadow-sm">
                                                {club.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-700">{club.name}</div>
                                                <div className="text-xs text-slate-500">{attendedClubMeetings} / {clubTotal} Sessions</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-primary-600">{clubPct}%</div>
                                            <div className="text-xs text-slate-400 font-bold uppercase">Attendance</div>
                                        </div>
                                    </div>
                                );
                            })}
                            {(!user.joinedClubIds || user.joinedClubIds.length === 0) && (
                                <p className="text-slate-400 text-sm italic">No clubs joined yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- LEAD VIEW ---
const LeadView: React.FC<{ user: any }> = ({ user }) => {
    const myClub = CLUBS.find(c => c.id === user.clubId);

    // Stats for Club
    const clubMeetings = MOCK_MEETINGS.filter(m => m.clubId === user.clubId);
    const completedMeetings = clubMeetings.filter(m => m.status === 'COMPLETED');
    // Mock member count
    const memberCount = MOCK_USERS.filter(u => u.role === UserRole.STUDENT && u.joinedClubIds?.includes(user.clubId || '')).length + 15; // +15 for mock data padding

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                <StatCard label="Total Members" value={memberCount} />
                <StatCard label="Meetings Conducted" value={completedMeetings.length} />
                <StatCard label="Upcoming Sessions" value={clubMeetings.length - completedMeetings.length} />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Club Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="profile-item bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3">Club Details</h3>
                        {myClub ? (
                            <div className="space-y-4">
                                <InfoRow label="Club Name" value={myClub.name} />
                                <InfoRow label="Category" value={myClub.category} />
                                <InfoRow label="Your Role" value="Chairperson / Lead" />
                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                                    <p className="text-sm text-slate-600 leading-relaxed">{myClub.description}</p>
                                </div>
                            </div>
                        ) : <p className="text-slate-500">No club assigned.</p>}
                    </div>
                </div>

                {/* Right: Recent Activity */}
                <div className="md:col-span-2 space-y-6">
                    <div className="profile-item bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-4 mb-4">Recent Meetings</h3>
                        <div className="space-y-0 divide-y divide-slate-100">
                            {clubMeetings.slice(0, 5).map(meeting => (
                                <div key={meeting.id} className="py-4 flex items-center justify-between hover:bg-slate-50 transition-colors px-2 rounded">
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{meeting.title}</div>
                                        <div className="text-xs text-slate-500">{meeting.date} • {meeting.startTime}</div>
                                    </div>
                                    <Badge status={meeting.status === 'COMPLETED' ? 'PRESENT' : 'SCHEDULED'} />
                                </div>
                            ))}
                            {clubMeetings.length === 0 && <p className="text-slate-400 py-4">No meetings scheduled.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- FACULTY VIEW ---
const FacultyView: React.FC<{ user: any }> = ({ user }) => {
    // Simulate Faculty Coordinator Logic
    // In a real app, this would be a relation in the DB.
    // For demo: User u3 (Faculty) coordinates 'c1' (Coding Club).
    const coordinatedClubId = 'c1';
    const coordinatedClub = CLUBS.find(c => c.id === coordinatedClubId);

    // Get Reports
    const clubMeetingss = MOCK_MEETINGS.filter(m => m.clubId === coordinatedClubId && m.status === 'COMPLETED');

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Faculty Info Card */}
            <div className="profile-item bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3 mb-4">Faculty Information</h3>
                <div className="grid md:grid-cols-4 gap-6">
                    <InfoRow label="Designation" value="Assistant Professor" />
                    <InfoRow label="Department" value={user.branch || 'Engineering'} />
                    <InfoRow label="Employee ID" value="FAC-0042" />
                    <InfoRow label="Role" value="Club Coordinator" />
                </div>
            </div>

            {/* Coordinated Club Section */}
            {coordinatedClub ? (
                <div className="profile-item bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Coordinated Club: {coordinatedClub.name}</h3>
                            <p className="text-slate-500 text-sm">Review meeting reports and attendance logs.</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-500 shadow-sm">
                            {coordinatedClub.name.charAt(0)}
                        </div>
                    </div>

                    <div className="p-0">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Meeting Title</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Attendees</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {clubMeetingss.map(meeting => {
                                    // Calc attendees for this meeting
                                    const attendees = MOCK_ATTENDANCE.filter(a => a.meetingId === meeting.id && a.status === AttendanceStatus.PRESENT);

                                    return (
                                        <tr key={meeting.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-700">{meeting.title}</td>
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">{meeting.date}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {attendees.length > 0 ? (
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {attendees.slice(0, 5).map(a => (
                                                            <div key={a.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600" title={a.studentName}>
                                                                {a.studentName.charAt(0)}
                                                            </div>
                                                        ))}
                                                        {attendees.length > 5 && (
                                                            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                                                +{attendees.length - 5}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : <span className="text-slate-400 italic">No Data</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button size="sm" variant="outline" className="text-primary-600 border-primary-200 hover:bg-primary-50">
                                                    View Report
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {clubMeetingss.length === 0 && (
                                    <tr><td colSpan={4} className="p-8 text-center text-slate-400">No completed meetings found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                    <p className="text-slate-500 font-medium">You are not assigned as a coordinator for any club.</p>
                </div>
            )}
        </div>
    );
};


// --- Helper Components ---

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="profile-item bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center hover:border-primary-200 hover:shadow-md transition-all">
        <div className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{value}</div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-primary-600">{label}</div>
    </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{label}</label>
        <div className="font-medium text-slate-800 text-sm">{value}</div>
    </div>
);

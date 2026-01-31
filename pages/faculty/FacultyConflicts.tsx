import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';

declare const gsap: any;

// Mock Data Types
interface Conflict {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  academicClass: string; // The class they missed
  clubActivity: string; // The meeting name
  timeSlot: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
}

interface GroupedConflict {
    meetingName: string;
    date: string;
    timeSlot: string;
    conflicts: Conflict[];
}

export const FacultyConflicts: React.FC = () => {
  // Mock Data
  const [allConflicts, setAllConflicts] = useState<Conflict[]>([
    {
      id: 'c1',
      studentId: 'u1',
      studentName: 'Rohan Sharma',
      admissionNo: '2024CS001',
      academicClass: 'Database Mgmt (CS302)',
      clubActivity: 'Hackathon Prep',
      timeSlot: '14:00 - 15:00',
      date: 'Oct 25, 2023',
      severity: 'medium'
    },
    {
      id: 'c2',
      studentId: 'u2',
      studentName: 'Amit Verma',
      admissionNo: '2024CS012',
      academicClass: 'Database Mgmt (CS302)',
      clubActivity: 'Hackathon Prep',
      timeSlot: '14:00 - 15:00',
      date: 'Oct 25, 2023',
      severity: 'medium'
    },
    {
      id: 'c3',
      studentId: 'u4',
      studentName: 'Priya Patel',
      admissionNo: '2024IT021',
      academicClass: 'Operating Systems Lab',
      clubActivity: 'Robotics Workshop',
      timeSlot: '14:00 - 16:00',
      date: 'Oct 25, 2023',
      severity: 'high'
    },
    {
      id: 'c4',
      studentId: 'u5',
      studentName: 'Aditya Singh',
      admissionNo: '2024CS045',
      academicClass: 'Software Eng. Lecture',
      clubActivity: 'Debate Club Meet',
      timeSlot: '11:00 - 12:00',
      date: 'Oct 24, 2023',
      severity: 'low'
    }
  ]);

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Helper: Group the flat list by Club Activity (Meeting Name)
  const getGroupedConflicts = (): GroupedConflict[] => {
    const groups: { [key: string]: GroupedConflict } = {};

    allConflicts.forEach(conflict => {
        const key = `${conflict.clubActivity}-${conflict.date}`; // Unique key for grouping
        if (!groups[key]) {
            groups[key] = {
                meetingName: conflict.clubActivity,
                date: conflict.date,
                timeSlot: conflict.timeSlot,
                conflicts: []
            };
        }
        groups[key].conflicts.push(conflict);
    });

    return Object.values(groups);
  };

  const groupedData = getGroupedConflicts();

  useEffect(() => {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(".group-card", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }
        );
    }
  }, []);

  const toggleGroup = (meetingName: string) => {
    setExpandedGroups(prev => 
        prev.includes(meetingName) 
        ? prev.filter(n => n !== meetingName) 
        : [...prev, meetingName]
    );
  };

  // Resolve a single student
  const handleResolveSingle = (conflictId: string, action: 'approve' | 'reject') => {
    setAllConflicts(prev => prev.filter(c => c.id !== conflictId));
  };

  // Bulk Approve: Resolve ALL conflicts in a specific group
  const handleBulkApprove = (meetingName: string) => {
    if (confirm(`Are you sure you want to approve OD for all students in "${meetingName}"?`)) {
        setAllConflicts(prev => prev.filter(c => c.clubActivity !== meetingName));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Attendance Conflicts</h2>
        <p className="text-slate-500 mt-2 text-lg">
            Review discrepancies grouped by Club Event.
        </p>
      </div>

      {/* Group List */}
      <div className="space-y-6">
        {groupedData.length > 0 ? (
            groupedData.map((group, idx) => (
                <div key={idx} className="group-card bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    
                    {/* Group Header (Clickable) */}
                    <div 
                        className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => toggleGroup(group.meetingName)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg transition-transform duration-300 ${expandedGroups.includes(group.meetingName) ? 'rotate-90' : ''}`}>
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{group.meetingName}</h3>
                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                    <span className="font-mono bg-white border border-slate-200 px-2 py-0.5 rounded">{group.date}</span>
                                    <span>{group.timeSlot}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6 mt-4 md:mt-0 pl-11 md:pl-0">
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-slate-800">{group.conflicts.length}</span>
                                <span className="text-xs text-slate-500 font-bold uppercase">Students Involved</span>
                            </div>
                            
                            {/* Bulk Action Button (Stop propagation to prevent toggle) */}
                            <div onClick={(e) => e.stopPropagation()}>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleBulkApprove(group.meetingName)}
                                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                                >
                                    Approve All
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Students List (Collapsible) */}
                    {expandedGroups.includes(group.meetingName) && (
                        <div className="border-t border-slate-100 divide-y divide-slate-100 bg-white">
                            {group.conflicts.map(conflict => (
                                <div key={conflict.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                    
                                    {/* Student Info */}
                                    <div className="flex items-center gap-4 pl-4 md:pl-12">
                                        <div className={`w-2 h-2 rounded-full ${conflict.severity === 'high' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                                        <div>
                                            <div className="font-bold text-slate-700">{conflict.studentName}</div>
                                            <div className="text-xs text-slate-400 font-mono">{conflict.admissionNo}</div>
                                        </div>
                                    </div>

                                    {/* Conflict Detail */}
                                    <div className="bg-red-50 px-3 py-2 rounded border border-red-100">
                                        <div className="text-xs font-bold text-red-500 uppercase">Missed Class</div>
                                        <div className="text-sm font-semibold text-slate-800">{conflict.academicClass}</div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleResolveSingle(conflict.id, 'reject')}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Reject (Mark Absent)"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        <button 
                                            onClick={() => handleResolveSingle(conflict.id, 'approve')}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                            title="Approve OD"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))
        ) : (
            <div className="p-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm text-slate-300">🎉</div>
                 <h3 className="text-lg font-bold text-slate-700">No Conflicts Pending</h3>
                 <p className="text-slate-400 text-sm mt-1">All attendance records have been reconciled.</p>
            </div>
        )}
      </div>
    </div>
  );
};
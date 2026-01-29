import React, { useState } from 'react';
import { MOCK_CONFLICTS, MOCK_USERS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';

export const FacultyConflicts: React.FC = () => {
  // Mock grouping structure for the demo
  const groupedConflicts = {
    '3rd Year': {
      'Div A': [
        { student: 'Alex Student', club: 'Coding Club', status: 'Pending', id: 'u1' },
        { student: 'Emma Watson', club: 'Coding Club', status: 'Pending', id: 'u5' }
      ],
      'Div B': [
        { student: 'John Doe', club: 'Debate Society', status: 'Pending', id: 'uX' }
      ]
    },
    '2nd Year': {
      'Div A': [
         { student: 'Michael Chen', club: 'Robotics Team', status: 'Pending', id: 'u4' }
      ]
    }
  };

  const [expandedYear, setExpandedYear] = useState<string | null>('3rd Year');

  const handleAction = (studentId: string, action: 'excuse' | 'reject') => {
    alert(`${action === 'excuse' ? 'Excused' : 'Marked Absent'}: Student ${studentId}`);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Lecture Conflicts</h2>
        <p className="text-slate-500 mt-2 text-lg">Review absentees due to club activities. Grouped by Year and Division.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Summary Stats */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-bg-card p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Conflict Summary</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <span className="text-slate-600">Total Absentees</span>
                        <span className="text-xl font-bold text-slate-900">12</span>
                    </div>
                     <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <span className="text-slate-600">Affected Divisions</span>
                        <span className="text-xl font-bold text-slate-900">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Involved Clubs</span>
                        <span className="text-xl font-bold text-slate-900">3</span>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                 <h4 className="font-bold text-amber-700 mb-2">Policy Reminder</h4>
                 <p className="text-sm text-amber-600/80">Students are eligible for attendance credit only if the club activity duration overlapped with more than 40 minutes of the lecture.</p>
            </div>
        </div>

        {/* Right: Grouped List */}
        <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedConflicts).map(([year, divs]) => (
                <div key={year} className="bg-bg-card border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div 
                        className="px-6 py-4 bg-bg-DEFAULT flex justify-between items-center cursor-pointer hover:bg-slate-200 transition-colors"
                        onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                    >
                        <h3 className="font-bold text-lg text-slate-800">{year}</h3>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedYear === year ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    
                    {expandedYear === year && (
                        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                            {Object.entries(divs).map(([div, students]) => (
                                <div key={div} className="relative pl-6 border-l-2 border-slate-200">
                                    <h4 className="font-semibold text-primary-600 mb-4">{div}</h4>
                                    
                                    <div className="space-y-3">
                                        {students.map((student, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-bg-DEFAULT p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-all">
                                                <div className="mb-3 sm:mb-0">
                                                    <div className="font-bold text-slate-800">{student.student}</div>
                                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                                                        {student.club}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="danger" onClick={() => handleAction(student.id, 'reject')}>
                                                        Absent
                                                    </Button>
                                                    <Button size="sm" variant="secondary" className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300" onClick={() => handleAction(student.id, 'excuse')}>
                                                        Excuse
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
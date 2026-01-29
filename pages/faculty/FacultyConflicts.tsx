import React, { useState } from 'react';
import { MOCK_CONFLICTS, MOCK_USERS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';

export const FacultyConflicts: React.FC = () => {
  const [selectedConflictId, setSelectedConflictId] = useState(MOCK_CONFLICTS[0].id);
  
  const conflict = MOCK_CONFLICTS.find(c => c.id === selectedConflictId);
  // Mock students affected by this conflict
  const affectedStudents = MOCK_USERS.filter(u => u.role === 'STUDENT').map(u => ({
    ...u,
    club: 'Coding Club',
    status: Math.random() > 0.5 ? 'Present (Club)' : 'Pending'
  }));

  const handleExcuse = (studentId: string) => {
    alert(`Excused student ${studentId} for Club Activity`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Lecture Conflicts</h2>
        <p className="text-stone-500 mt-2 text-lg">Manage attendance for students missing lectures due to club activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Conflict List */}
        <div className="md:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Detected Conflicts</h3>
            <div className="space-y-3">
            {MOCK_CONFLICTS.map(c => (
                <div 
                    key={c.id}
                    onClick={() => setSelectedConflictId(c.id)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                        selectedConflictId === c.id 
                        ? 'bg-white border-primary-500 shadow-md ring-1 ring-primary-500/20' 
                        : 'bg-white border-stone-200 hover:border-primary-300 hover:shadow-sm'
                    }`}
                >
                    {selectedConflictId === c.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>}
                    <div className="flex justify-between items-start mb-2">
                        <span className={`font-bold text-lg ${selectedConflictId === c.id ? 'text-primary-800' : 'text-stone-700'}`}>{c.subjectCode}</span>
                        <span className="text-xs bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full font-semibold">{c.affectedStudents} students</span>
                    </div>
                    <div className="text-sm font-medium text-stone-800 mb-2">{c.subjectName}</div>
                    <div className="text-xs text-stone-500 flex items-center gap-2">
                        <span>{c.date}</span>
                        <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                        <span>{c.timeSlot}</span>
                    </div>
                </div>
            ))}
            </div>
        </div>

        {/* Right: Student List */}
        <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-card border border-stone-200 overflow-hidden h-full flex flex-col">
                <div className="px-8 py-6 border-b border-stone-200 bg-stone-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-stone-800">Affected Student List</h3>
                        <p className="text-sm text-stone-500 mt-1">Reviewing for: <span className="font-semibold text-stone-700">{conflict?.subjectName}</span></p>
                    </div>
                </div>
                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full divide-y divide-stone-100">
                        <thead className="bg-stone-50">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Student Details</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Club Event</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Club Status</th>
                                <th className="px-8 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Lecture Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-stone-100">
                            {affectedStudents.map(student => (
                                <tr key={student.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-8 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-stone-900">{student.name}</div>
                                        <div className="text-xs text-stone-500 mt-0.5">{student.department} • {student.year}</div>
                                    </td>
                                    <td className="px-8 py-4 whitespace-nowrap text-sm text-stone-600 font-medium">
                                        {student.club}
                                    </td>
                                    <td className="px-8 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            Verified Present
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 whitespace-nowrap text-right">
                                        <Button size="sm" variant="secondary" onClick={() => handleExcuse(student.id)} className="shadow-none border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300">
                                            Mark Excused
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
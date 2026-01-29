import { User, UserRole, Club, Meeting, AttendanceRecord, AttendanceStatus, LectureConflict } from '../types';

export const CLUBS: Club[] = [
  { id: 'c1', name: 'Coding Club', category: 'Technical' },
  { id: 'c2', name: 'Debate Society', category: 'Literary' },
  { id: 'c3', name: 'Robotics Team', category: 'Technical' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Student', email: 'alex@college.edu', role: UserRole.STUDENT, department: 'CS', year: '3rd' },
  { id: 'u2', name: 'Sarah Lead', email: 'sarah@college.edu', role: UserRole.LEAD, clubId: 'c1', department: 'CS', year: '4th' },
  { id: 'u3', name: 'Prof. Johnson', email: 'johnson@college.edu', role: UserRole.FACULTY, department: 'CS' },
  { id: 'u4', name: 'Michael Chen', email: 'michael@college.edu', role: UserRole.STUDENT, department: 'IT', year: '2nd' },
  { id: 'u5', name: 'Emma Watson', email: 'emma@college.edu', role: UserRole.STUDENT, department: 'CS', year: '3rd' },
];

export const MOCK_MEETINGS: Meeting[] = [
  { 
    id: 'm1', 
    clubId: 'c1', 
    clubName: 'Coding Club', 
    title: 'Hackathon Prep', 
    date: '2023-10-25', 
    startTime: '16:00', 
    endTime: '18:00', 
    location: 'Lab 301',
    status: 'COMPLETED'
  },
  { 
    id: 'm2', 
    clubId: 'c1', 
    clubName: 'Coding Club', 
    title: 'Intro to React', 
    date: new Date().toISOString().split('T')[0], // Today
    startTime: '17:00', 
    endTime: '19:00', 
    location: 'Seminar Hall A',
    status: 'SCHEDULED'
  },
  { 
    id: 'm3', 
    clubId: 'c2', 
    clubName: 'Debate Society', 
    title: 'Weekly Jam', 
    date: '2023-10-26', 
    startTime: '16:30', 
    endTime: '18:30', 
    location: 'Room 101',
    status: 'SCHEDULED'
  }
];

// Initial attendance state
export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', meetingId: 'm1', studentId: 'u1', studentName: 'Alex Student', status: AttendanceStatus.PRESENT, timestamp: '2023-10-25T16:05:00Z' },
  { id: 'a2', meetingId: 'm1', studentId: 'u4', studentName: 'Michael Chen', status: AttendanceStatus.ABSENT, timestamp: '2023-10-25T16:00:00Z' },
  { id: 'a3', meetingId: 'm2', studentId: 'u1', studentName: 'Alex Student', status: AttendanceStatus.DECLARED, timestamp: new Date().toISOString() },
  { id: 'a4', meetingId: 'm2', studentId: 'u4', studentName: 'Michael Chen', status: AttendanceStatus.NOT_DECLARED, timestamp: '' },
  { id: 'a5', meetingId: 'm2', studentId: 'u5', studentName: 'Emma Watson', status: AttendanceStatus.DECLARED, timestamp: new Date().toISOString() },
];

export const MOCK_CONFLICTS: LectureConflict[] = [
  { id: 'lc1', subjectCode: 'CS302', subjectName: 'Database Management', date: '2023-10-25', timeSlot: '16:00 - 17:00', affectedStudents: 12 },
  { id: 'lc2', subjectCode: 'CS305', subjectName: 'Operating Systems', date: '2023-10-26', timeSlot: '14:00 - 15:00', affectedStudents: 5 },
];
import { User, UserRole, Club, Meeting, AttendanceRecord, AttendanceStatus, Announcement } from '../types';

export const CLUBS: Club[] = [
  { 
    id: 'c1', 
    name: 'Coding Club', 
    category: 'Technical', 
    description: 'Community of software developers and competitive programmers.' 
  },
  { 
    id: 'c2', 
    name: 'Robotics Team', 
    category: 'Technical', 
    description: 'Designing and building autonomous robots.' 
  },
  { 
    id: 'c3', 
    name: 'Debate Society', 
    category: 'Cultural', 
    description: 'Fostering public speaking and critical thinking.' 
  },
];

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Alex Student', 
    email: 'student@markly.edu', 
    role: UserRole.STUDENT,
    admissionNumber: '2024HE0064',
    branch: 'Computer Engineering',
    year: '3rd Year',
    joinedClubIds: ['c1', 'c2']
  },
  { 
    id: 'u2', 
    name: 'Sarah Lead', 
    email: 'lead@markly.edu', 
    role: UserRole.LEAD, 
    clubId: 'c1', // Lead of Coding Club
    admissionNumber: '2023HE0012',
    branch: 'Computer Engineering',
    year: '4th Year'
  },
  { 
    id: 'u3', 
    name: 'Dr. Alan Grant', 
    email: 'faculty@markly.edu', 
    role: UserRole.FACULTY,
    branch: 'Computer Engineering'
  }
];

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    clubId: 'c1',
    clubName: 'Coding Club',
    title: 'Hackathon Prep',
    description: 'Team formation and theme discussion for the upcoming Hex-Hackathon.',
    date: '2026-10-25',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Lab 304, IT Building',
    status: 'COMPLETED'
  },
  {
    id: 'm2',
    clubId: 'c1',
    clubName: 'Coding Club',
    title: 'Intro to Generative AI',
    description: 'Guest lecture on LLM architecture and fine-tuning.',
    date: '2026-11-02',
    startTime: '10:00',
    endTime: '11:30',
    location: 'Seminar Hall A',
    status: 'SCHEDULED'
  },
  {
    id: 'm3',
    clubId: 'c2',
    clubName: 'Robotics Team',
    title: 'Drone Motor Assembly',
    description: 'Hands-on workshop for calibrating BLDC motors.',
    date: '2026-11-05',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Workshop Bay 2',
    status: 'SCHEDULED'
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { 
    id: 'a1', 
    meetingId: 'm1', 
    studentId: 'u1', 
    studentName: 'Alex Student', 
    studentAdmissionNumber: '2024HE0064', 
    status: AttendanceStatus.PRESENT, 
    timestamp: '2026-10-25T14:05:00' 
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    clubId: 'c1',
    clubName: 'Coding Club',
    title: 'Registration Open: Hex-Hackathon',
    content: 'Registration is now live! Form teams of 4 and submit your ideas by Friday.',
    date: '2026-10-20',
    priority: 'HIGH'
  },
  {
    id: 'ann2',
    clubId: 'c2',
    clubName: 'Robotics Team',
    title: 'Lab Maintenance Schedule',
    content: 'The robotics lab will be closed for maintenance this Saturday.',
    date: '2026-10-22',
    priority: 'NORMAL'
  }
];

export const MOCK_CONFLICTS = [
    { 
        id: 'con1',
        subjectCode: 'CS302',
        subjectName: 'Database Management',
        date: '2026-10-25',
        timeSlot: '14:00 - 15:00',
        affectedStudents: 12
    }
];
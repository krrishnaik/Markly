export enum UserRole {
  STUDENT = 'STUDENT',
  LEAD = 'LEAD',
  FACULTY = 'FACULTY'
}

export enum AttendanceStatus {
  NOT_DECLARED = 'NOT_DECLARED',
  DECLARED = 'DECLARED', // Student says "I was there"
  PRESENT = 'PRESENT',   // Lead confirms
  ABSENT = 'ABSENT',     // Lead marks absent or rejects
  EXCUSED = 'EXCUSED'    // Faculty excuses for conflict
}

export interface Club {
  id: string;
  name: string;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  year?: string;
  clubId?: string; // For Leads
}

export interface Meeting {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  location: string;
  status: 'SCHEDULED' | 'COMPLETED';
}

export interface AttendanceRecord {
  id: string;
  meetingId: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  timestamp: string;
}

export interface LectureConflict {
  id: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  timeSlot: string;
  affectedStudents: number;
}
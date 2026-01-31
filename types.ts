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
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Student specific fields
  admissionNumber?: string; 
  branch?: string;          
  year?: string;
  joinedClubIds?: string[]; 
  // Lead specific fields
  clubId?: string;          
}

export interface Meeting {
  id: string;
  clubId: string;
  clubName: string;
  title: string;       // Purpose of meeting
  description?: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
  location: string;    // Venue
  status: 'SCHEDULED' | 'COMPLETED';
}

export interface AttendanceRecord {
  id: string;
  meetingId: string;
  studentId: string;
  studentName: string;
  studentAdmissionNumber?: string;
  status: AttendanceStatus;
  timestamp: string;
}

export interface Announcement {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  content: string;
  date: string;
  priority?: 'NORMAL' | 'HIGH';
}

export interface LectureConflict {
  id: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  timeSlot: string;
  affectedStudents: number;
}
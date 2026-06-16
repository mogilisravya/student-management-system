export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
}

export interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  address: string;
  parentName: string;
  parentContact: string;
  admissionDate: string;
  departmentId: number;
  departmentName?: string;
  departmentCode?: string;
  semester: number;
  profilePhoto?: string;
  username?: string;
}

export interface Teacher {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  departmentId: number;
  departmentName?: string;
  departmentCode?: string;
  qualification: string;
  experience: number;
  username?: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  teacherId?: number;
  teacherName?: string;
  departmentId: number;
  departmentName?: string;
  departmentCode?: string;
  semester: number;
}

export interface Attendance {
  id: number;
  studentId: number;
  studentName: string;
  studentCode: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export interface Exam {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  name: string;
  examDate: string;
  totalMarks: number;
}

export interface Result {
  id: number;
  examId: number;
  examName: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  studentId: number;
  studentName: string;
  studentCode: string;
  obtainedMarks: number;
  totalMarks: number;
  grade: string;
  remarks?: string;
}

export interface RecentActivity {
  action: string;
  details: string;
  timestamp: string;
  username: string;
}

export interface PerformanceData {
  subject: string;
  averageMarks: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  attendancePercentage: number;
  recentActivities: RecentActivity[];
  performanceCharts: PerformanceData[];
}

export interface Profile {
  username: string;
  email: string;
  role: string;
  
  // Student fields
  studentId?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  mobileNumber?: string;
  address?: string;
  parentName?: string;
  parentContact?: string;
  semester?: number;
  profilePhoto?: string;

  // Teacher fields
  employeeId?: string;
  teacherName?: string;
  phone?: string;
  qualification?: string;
  experience?: number;
  departmentName?: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword?: string;
}

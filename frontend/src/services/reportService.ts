import api from './api';

export const reportService = {
  exportStudents: async () => {
    const res = await api.get('/api/reports/students/export', { responseType: 'blob' });
    downloadFile(res.data, 'students_report.csv');
  },
  exportAttendance: async (courseId: number) => {
    const res = await api.get(`/api/reports/attendance/export/${courseId}`, { responseType: 'blob' });
    downloadFile(res.data, `attendance_report_course_${courseId}.csv`);
  },
  exportPerformance: async (courseId: number) => {
    const res = await api.get(`/api/reports/performance/export/${courseId}`, { responseType: 'blob' });
    downloadFile(res.data, `performance_report_course_${courseId}.csv`);
  },
  downloadReportCard: async (studentId: number) => {
    const res = await api.get(`/api/reports/report-card/${studentId}/download`, { responseType: 'blob' });
    downloadFile(res.data, `report_card_student_${studentId}.txt`);
  },
};

const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

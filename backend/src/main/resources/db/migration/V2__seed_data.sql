-- Seed Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN');
INSERT INTO roles (id, name) VALUES (2, 'ROLE_TEACHER');
INSERT INTO roles (id, name) VALUES (3, 'ROLE_STUDENT');

-- Seed Users (Password is 'password' for all: BCrypt hash is $2a$10$gR5xG29hQ919M113.o1Wb.uP381eS3N/X2D3O6S8.V.e9E2.u2T/S)
-- Admin User
INSERT INTO users (id, username, password, email, role_id, enabled)
VALUES (1, 'admin', '$2a$10$gR5xG29hQ919M113.o1Wb.uP381eS3N/X2D3O6S8.V.e9E2.u2T/S', 'admin@university.edu', 1, TRUE);

-- Teacher Users
INSERT INTO users (id, username, password, email, role_id, enabled)
VALUES (2, 'johndoe', '$2a$10$gR5xG29hQ919M113.o1Wb.uP381eS3N/X2D3O6S8.V.e9E2.u2T/S', 'johndoe@university.edu', 2, TRUE);
INSERT INTO users (id, username, password, email, role_id, enabled)
VALUES (3, 'janesmith', '$2a$10$gR5xG29hQ919M113.o1Wb.uP381eS3N/X2D3O6S8.V.e9E2.u2T/S', 'janesmith@university.edu', 2, TRUE);

-- Student Users
INSERT INTO users (id, username, password, email, role_id, enabled)
VALUES (4, 'alicej', '$2a$10$gR5xG29hQ919M113.o1Wb.uP381eS3N/X2D3O6S8.V.e9E2.u2T/S', 'alice.j@student.edu', 3, TRUE);
INSERT INTO users (id, username, password, email, role_id, enabled)
VALUES (5, 'bobw', '$2a$10$gR5xG29hQ919M113.o1Wb.uP381eS3N/X2D3O6S8.V.e9E2.u2T/S', 'bob.w@student.edu', 3, TRUE);

-- Seed Departments
INSERT INTO departments (id, name, code) VALUES (1, 'Computer Science & Engineering', 'CSE');
INSERT INTO departments (id, name, code) VALUES (2, 'Information Technology', 'IT');
INSERT INTO departments (id, name, code) VALUES (3, 'Electrical Engineering', 'EE');

-- Seed Teachers
INSERT INTO teachers (id, user_id, employee_id, name, email, phone, department_id, qualification, experience)
VALUES (1, 2, 'EMP001', 'Dr. John Doe', 'johndoe@university.edu', '+1234567890', 1, 'Ph.D. in Computer Science', 10);
INSERT INTO teachers (id, user_id, employee_id, name, email, phone, department_id, qualification, experience)
VALUES (2, 3, 'EMP002', 'Prof. Jane Smith', 'janesmith@university.edu', '+1987654321', 2, 'M.Tech in IT', 8);

-- Seed Students
INSERT INTO students (id, user_id, student_id, first_name, last_name, gender, date_of_birth, email, mobile_number, address, parent_name, parent_contact, admission_date, department_id, semester, profile_photo)
VALUES (1, 4, 'STU001', 'Alice', 'Johnson', 'FEMALE', '2004-05-14', 'alice.j@student.edu', '+1122334455', '123 University Ave, Campus Town', 'Richard Johnson', '+1122334466', '2023-08-01', 1, 2, NULL);
INSERT INTO students (id, user_id, student_id, first_name, last_name, gender, date_of_birth, email, mobile_number, address, parent_name, parent_contact, admission_date, department_id, semester, profile_photo)
VALUES (2, 5, 'STU002', 'Bob', 'Williams', 'MALE', '2003-11-22', 'bob.w@student.edu', '+1122334477', '456 College Rd, University Town', 'Mary Williams', '+1122334488', '2022-08-01', 2, 4, NULL);

-- Seed Courses
INSERT INTO courses (id, code, name, description, credits, teacher_id, department_id, semester)
VALUES (1, 'CSE-101', 'Data Structures & Algorithms', 'Fundamental algorithms, complexity analysis, trees, graphs, and sorting.', 4, 1, 1, 2);
INSERT INTO courses (id, code, name, description, credits, teacher_id, department_id, semester)
VALUES (2, 'IT-202', 'Web Development Frameworks', 'Frontend and backend development using modern frameworks.', 3, 2, 2, 4);
INSERT INTO courses (id, code, name, description, credits, teacher_id, department_id, semester)
VALUES (3, 'EE-101', 'Basic Electrical Engineering', 'Introduction to electrical networks, AC circuits, and electromagnetism.', 3, NULL, 3, 1);

-- Seed Enrollments
INSERT INTO enrollments (id, student_id, course_id, enrollment_date) VALUES (1, 1, 1, '2024-01-15');
INSERT INTO enrollments (id, student_id, course_id, enrollment_date) VALUES (2, 2, 2, '2024-01-15');

-- Seed Attendance
INSERT INTO attendance (id, student_id, course_id, date, status, remarks)
VALUES (1, 1, 1, '2026-06-01', 'PRESENT', 'On time');
INSERT INTO attendance (id, student_id, course_id, date, status, remarks)
VALUES (2, 1, 1, '2026-06-02', 'PRESENT', 'On time');
INSERT INTO attendance (id, student_id, course_id, date, status, remarks)
VALUES (3, 1, 1, '2026-06-03', 'ABSENT', 'Sick leave');
INSERT INTO attendance (id, student_id, course_id, date, status, remarks)
VALUES (4, 2, 2, '2026-06-01', 'PRESENT', 'On time');
INSERT INTO attendance (id, student_id, course_id, date, status, remarks)
VALUES (5, 2, 2, '2026-06-02', 'LATE', 'Traffic delay');

-- Seed Exams
INSERT INTO exams (id, course_id, name, exam_date, total_marks)
VALUES (1, 1, 'DSA Midterm', '2026-04-15', 50.0);
INSERT INTO exams (id, course_id, name, exam_date, total_marks)
VALUES (2, 2, 'Web Dev Final', '2026-05-20', 100.0);

-- Seed Results
INSERT INTO results (id, exam_id, student_id, obtained_marks, grade, remarks)
VALUES (1, 1, 1, 45.5, 'A+', 'Excellent logical thinking');
INSERT INTO results (id, exam_id, student_id, obtained_marks, grade, remarks)
VALUES (2, 2, 2, 82.0, 'A', 'Good project work');

-- Seed Notifications
INSERT INTO notifications (id, user_id, title, message, read, created_at)
VALUES (1, 1, 'System Initialized', 'The Student Management System has been successfully initialized.', FALSE, NOW());
INSERT INTO notifications (id, user_id, title, message, read, created_at)
VALUES (2, 4, 'Welcome Alice', 'Welcome to the new Student Portal. Explore your courses and attendance.', FALSE, NOW());

-- Seed Audit Logs
INSERT INTO audit_logs (id, username, action, details, timestamp)
VALUES (1, 'system', 'SYSTEM_INITIALIZATION', 'Seeded initial database schema and administrative users.', NOW());

-- Reset ID Sequences for Serial Columns
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));
SELECT setval('teachers_id_seq', (SELECT MAX(id) FROM teachers));
SELECT setval('students_id_seq', (SELECT MAX(id) FROM students));
SELECT setval('courses_id_seq', (SELECT MAX(id) FROM courses));
SELECT setval('enrollments_id_seq', (SELECT MAX(id) FROM enrollments));
SELECT setval('attendance_id_seq', (SELECT MAX(id) FROM attendance));
SELECT setval('exams_id_seq', (SELECT MAX(id) FROM exams));
SELECT setval('results_id_seq', (SELECT MAX(id) FROM results));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));
SELECT setval('audit_logs_id_seq', (SELECT MAX(id) FROM audit_logs));

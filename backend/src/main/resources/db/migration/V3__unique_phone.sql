ALTER TABLE teachers ADD CONSTRAINT unique_teacher_phone UNIQUE (phone);
ALTER TABLE students ADD CONSTRAINT unique_student_mobile UNIQUE (mobile_number);

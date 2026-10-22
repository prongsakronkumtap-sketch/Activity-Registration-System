CREATE DATABASE IF NOT EXISTS activity_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE activity_db;

CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  activity_date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'เปิดรับสมัคร',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  activity_id INT NOT NULL,
  student_id VARCHAR(20) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_participants_activity
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  CONSTRAINT uq_activity_student UNIQUE (activity_id, student_id)
);

INSERT INTO activities (title, description, activity_date, location, status) VALUES
('อบรม React เบื้องต้น', 'เรียนรู้การพัฒนาเว็บแอปพลิเคชันด้วย React และ Vite', '2026-05-10', 'ห้อง Lab คอมพิวเตอร์ 301', 'เปิดรับสมัคร'),
('กิจกรรมจิตอาสาพัฒนา 2026', 'ร่วมพัฒนาและปรับปรุงภูมิทัศน์ภายในมหาวิทยาลัย', '2026-05-15', 'ลานกิจกรรมกลางแจ้ง', 'เปิดรับสมัคร');

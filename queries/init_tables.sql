-- Active: 1723438824473@@127.0.0.1@3306@hospital_management

-- DROP DATABASE IF EXISTS `hospital_management`;

CREATE DATABASE IF NOT EXISTS `hospital_management`;

USE `hospital_management`;

-- 1. CREATE TABLE

CREATE TABLE departments (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    contact_info VARCHAR(255),
    address VARCHAR(255),
    allergies TEXT,
    deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE staffs (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    job_type ENUM('Doctor', 'Nurse', 'Admin'),
    qualifications TEXT,
    department_id INT,
    salary DECIMAL(10, 2),
    deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments (`id`)
);

CREATE TABLE staff_job_history (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    job_type VARCHAR(100),
    salary DECIMAL(10, 2),
    department_id INT,
    deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staffs (`id`),
    FOREIGN KEY (department_id) REFERENCES departments (`id`)
);

CREATE TABLE appointments (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    staff_id INT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    purpose TEXT,
    deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (`id`),
    FOREIGN KEY (staff_id) REFERENCES staffs (`id`)
);

CREATE TABLE treatments (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    staff_id INT,
    treatment_date DATE,
    treatment_details TEXT,
    deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (`id`),
    FOREIGN KEY (staff_id) REFERENCES staffs (`id`)
);
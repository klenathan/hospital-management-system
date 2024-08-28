DROP DATABASE IF EXISTS `hospital_management`;

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

CREATE INDEX staff_del_idx ON staffs (deleted);

CREATE INDEX departments_del_idx ON departments (deleted);

CREATE INDEX patient_del_idx ON patients (deleted);

CREATE FULLTEXT INDEX fx_name ON patients (first_name, last_name);

CREATE INDEX appointment_del_idx ON appointments (deleted);

CREATE INDEX staff_del_job_idx ON staffs (deleted, job_type);

CREATE INDEX staff_depIdx_del_idx ON staffs(`department_id`, `deleted`);

CREATE INDEX idx_deleted_staff_id ON appointments (deleted, staff_id);

CREATE INDEX treatments_del_idx ON treatments (deleted);

CREATE INDEX staff_job_his_del_idx ON staff_job_history (deleted);
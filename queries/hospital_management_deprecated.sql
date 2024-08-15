CREATE DATABASE hospital_management;

USE hospital_management;

-- 1. CREATE TABLE
CREATE TABLE Patients (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    First_Name varchar(100),
    Last_Name varchar(100),
    DOB date,
    Contact_Info varchar(255),
    Address varchar(255),
    Allergies TEXT
);

CREATE TABLE Staffs (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    First_Name varchar(100),
    Last_Name varchar(100),
    Job_Type ENUM ('Doctor', 'Nurse', 'Admin'),
    Qualifications text,
    deparment_id int,
    Schedule text,
    Salary decimal(10, 2),
    FOREIGN KEY (department_id) REFERENCES Departments (id)
);

CREATE TABLE Departments (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    Department_Name varchar(100)
);

CREATE TABLE Appointments (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    patient_id int,
    staff_id int,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    Purpose TEXT,
    FOREIGN KEY (Patient_id) REFERENCES Patients (id),
    FOREIGN KEY (staff_id) REFERENCES Staffs (id)
);

CREATE TABLE Treatment_Records (
    Treatment_id int AUTO_INCREMENT PRIMARY KEY,
    patient_id int,
    staff_id int,
    Treatment_Date date,
    Treatment_Details text,
    FOREIGN KEY (patient_id) REFERENCES Patients (id),
    FOREIGN KEY (staff_id) REFERENCES Staffs (id)
);

CREATE TABLE Staff_Job_History (
    History_id int AUTO_INCREMENT PRIMARY KEY,
    Staff_id int,
    Job_Type varchar(100),
    Salary decimal(10, 2),
    Department_id int,
    Start_Date date,
    FOREIGN KEY (Staff_id) REFERENCES Staffs (Staff_id),
    FOREIGN KEY (Department_id) REFERENCES Departments (Department_id)
);

-- 3. Indexing
ALTER TABLE Patients
ADD INDEX idx_patient_name (First_Name, Last_Name);

ALTER TABLE Satffs
ADD INDEX idx_staff_department (Department_id);

ALTER TABLE Appointments
ADD INDEX idx_appointment_date (Date_Time);

-- 4. Stored procedures & transaction management
-- Patient
-- Add new patient
DELIMITER / / CREATE PROCEDURE SP_RegisterNewPatient (
    IN First_Name varchar(50),
    IN Last_Name varchar(50),
    IN DOB date,
    IN Contact_Info varchar(255),
    IN Address varchar(255),
    IN Allergies text
) BEGIN START transaction;

INSERT INTO Patients (
        First_Name,
        Last_Name,
        DOB,
        Contact_Info,
        Address,
        Allergies
    )
VALUES (
        First_Name,
        Last_Name,
        DOB,
        Contact_Info,
        Address,
        Allergies
    );

COMMIT;

END / / DELIMITER;

-- Find patient by name or ID
DELIMITER / / CREATE PROCEDURE SP_SearchPatientByNameOrid (IN Patientid int, IN Patient_Name varchar(50)) BEGIN IF Patientid IS NOT NULL THEN
SELECT *
FROM Patients
WHERE Patient_id = Patientid;

ELSE
SELECT *
FROM Patients
WHERE First_Name LIKE ('%', Patient_Name, '%')
    OR Last_Name LIKE ('%', Patient_Name, '%');

END IF;

END / / DELIMITER;

-- Add treatment
DELIMITER / / CREATE PROCEDURE SP_AddTreatment (
    IN Patientid int,
    IN Staffid int,
    IN TreatmentDate date,
    IN TreatmentDetails text
) BEGIN START transaction;

INSERT INTO Treatment_Records (
        Patient_id,
        Staff_id,
        Treatment_Date,
        Treatment_Details
    )
VALUES (
        Patientid,
        Staffid,
        TreatmentDate,
        TreatmentDetails
    );

COMMIT;

END / / DELIMITER;

-- Staff
-- Add staff
DELIMITER / / CREATE PROCEDURE SP_AddStaff (
    IN Full_Name varchar(50),
    IN Last_Name varchar(50),
    IN Job_Type varchar(50),
    IN Qualification text,
    IN Salary decimal(10, 2),
    IN Department_id int,
    IN Schedule text
) BEGIN START transaction;

INSERT INTO Staffs (
        First_Name,
        Last_Name,
        Job_Type,
        Qualification,
        Salary,
        Department_id,
        Schedule
    )
VALUES (
        First_Name,
        Last_Name,
        Job_Type,
        Qualification,
        Salary,
        Department_id,
        Schedule
    );

-- Also save information to Staff_Job_History 
INSERT INTO Staff_Job_History (
        Staff_id,
        Job_Type,
        Salary,
        Department_id,
        Start_Date
    )
VALUES (
        Insertid (),
        Job_Type,
        Salary,
        Department_id,
        current_date()
    );

COMMIT;

END / / DELIMITER;

-- List the staff by department
DELIMITER / / CREATE PROCEDURE SP_ListSatffByDepartment (IN Departmentid int) BEGIN
SELECT *
FROM Staffs
WHERE Department_id = Departmentid;

END / / DELIMITER;

-- List staff by name
DELIMITER / / CREATE PROCEDURE SP_ListStaffByName (IN p_order varchar(4)) BEGIN IF p_order = 'ASC' THEN
SELECT *
FROM Staffs
ORDER BY Full_Name,
    Last_Name ASC;

ELSE
SELECT *
FROM Staffs
ORDER BY Full_Name,
    Last_Name DESC;

END IF;

END / / DELIMITER;

-- Update staff info
DELIMITER / / CREATE PROCEDURE SP_UpdateStaffInfo (
    IN Staffid int,
    IN JobType varchar(50),
    IN salary decimal(10, 2),
    IN Departmentid int
) BEGIN START transaction;

UPDATE Staffs
SET Job_Type = JobType,
    Salary = salary,
    Department_id = Departmentid
WHERE Staff_id = Staffid;

-- Also save information to Staff_Job_History
INSERT INTO Staff_Job_History (
        Staff_id,
        Job_Type,
        Salary,
        Department_id,
        Start_Date
    )
VALUES (
        Staffid,
        JobType,
        salary,
        Departmentid,
        current_date()
    );

COMMIT;

END / / DELIMITER;

-- View staff's schedule
DELIMITER / / CREATE PROCEDURE SP_ViewStaffSchedule (IN Staffid int) BEGIN
SELECT *
FROM Appointments
WHERE Staff_id = Staffid
ORDER BY Date_Time;

END / / DELIMITER;

-- Update staff's schedule
Delimiter / / CREATE PROCEDURE SP_UpdateStaffSchedule (
    IN Staffid int,
    IN Appointmentid int,
    IN NewDate_Time datetime
) BEGIN
DECLARE Appointment_Count int;

START transaction;

SELECT COUNT(*) INTO Appointment_Count
FROM Appointments
WHERE Staff_id = Staffid
    AND Date_Time = NewDate_Time
    AND Appointment_id != Appointmentid;

IF Appointment_Count = 0 THEN
UPDATE Appointments
SET Date_Time = NewDate_Time
WHERE Appointment_id = Appointmentid;

COMMIT;

ELSE ROLLBACK;

END IF;

END / / DELIMITER;

-- Appointment
-- Schedule an appointment
DELIMITER / / CREATE PROCEDURE SP_BookAppointment (
    IN Patientid int,
    IN Staffid int,
    IN DateTime datetime,
    IN purpose text
) BEGIN
DECLARE Apointment_Count int;

START transaction;

SELECT COUNT(*) INTO Appointment_Count
FROM Appointments
WHERE Staff_id = Staffid
    AND Date_Time = DateTime;

-- TODO: Handle not same time frame
IF Appointment_Count = 0 THEN
INSERT INTO Appointments (Patient_id, Staff_id, Date_Time, Purpose)
VALUES (Patientid, Staffid, DateTime, purpose);

COMMIT;

ELSE ROLLBACK;

END IF;

END / / DELIMITER;

-- Cancel Appointment
DELIMITER / / CREATE PROCEDURE SP_CancelAppoinment (IN Appointmentid int) BEGIN
DELETE FROM Appointments
WHERE Appointment_id = Appointmentid;

END / / DELIMITER;
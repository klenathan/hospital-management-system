
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
    salary BIGINT,
    username VARCHAR(100) UNIQUE,
    deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments (`id`)
);

CREATE TABLE staff_job_history (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    job_type VARCHAR(100),
    salary BIGINT,
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

CREATE INDEX staff_depIdx_del_idx ON staffs (`department_id`, `deleted`);

CREATE INDEX idx_deleted_staff_id ON appointments (deleted, staff_id);

CREATE INDEX treatments_del_idx ON treatments (deleted);

CREATE INDEX staff_job_his_del_idx ON staff_job_history (deleted);
DELIMITER $$

CREATE PROCEDURE S_GetAllDepartment (
) BEGIN 

SELECT * FROM departments;

END $$

CREATE TRIGGER insert_staff_into_history
AFTER
INSERT ON staffs FOR EACH ROW BEGIN
INSERT INTO staff_job_history (
        staff_id,
        job_type,
        salary,
        department_id
    )
VALUES (
        new.id,
        new.job_type,
        new.salary,
        new.department_id
    );

END $$

CREATE TRIGGER update_staff_insert_into_history
AFTER
UPDATE ON staffs FOR EACH ROW BEGIN
INSERT INTO staff_job_history (
        staff_id,
        job_type,
        salary,
        department_id
    )
VALUES (
        new.id,
        new.job_type,
        new.salary,
        new.department_id
    );

END $$

CREATE PROCEDURE S_AddNewStaff(
    IN f_name varchar(50),
    IN l_name VARCHAR (50),
    IN j_type ENUM('Doctor', 'Nurse', 'Admin'),
    IN qualifications VARCHAR(50),
    IN department_id int,
    IN salary BIGINT,
    IN username VARCHAR(100)
) BEGIN
DECLARE `_rollback` BOOL DEFAULT 0;

DECLARE EXIT HANDLER FOR SQLWARNING BEGIN -- Rollback the transaction if something goes wrong
    ROLLBACK;

-- Log the error or set a custom message
SET @error_message = 'Error occurred while creating the user';

SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = @error_message;

END;

SET AUTOCOMMIT = 0;

START TRANSACTION;

INSERT INTO staffs (
        first_name,
        last_name,
        job_type,
        qualifications,
        department_id,
        salary,
        username
    )
VALUES (
        f_name,
        l_name,
        j_type,
        qualifications,
        department_id,
        salary,
        username
    );

-- Create a username by concatenating first name, last name, and user ID
SET @username = username;

-- Create the user
SET @query1 = CONCAT(
        'CREATE USER "',
        @username,
        '"@"%" IDENTIFIED BY "password"'
    );

PREPARE stmt
FROM @query1;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

-- Grant role and set default role
IF j_type = 'Doctor' THEN
SET @query2 = CONCAT('GRANT doctor TO "', @username, '"@"%"');

PREPARE stmt
FROM @query2;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

SET @query3 = CONCAT(
        'SET DEFAULT ROLE doctor TO "',
        @username,
        '"@"%"'
    );

PREPARE stmt
FROM @query3;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

ELSEIF j_type = 'Nurse' THEN
SET @query2 = CONCAT('GRANT nurse TO "', @username, '"@"%"');

PREPARE stmt
FROM @query2;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

SET @query3 = CONCAT(
        'SET DEFAULT ROLE nurse TO "',
        @username,
        '"@"%"'
    );

PREPARE stmt
FROM @query3;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

ELSEIF j_type = 'Admin' THEN
SET @query2 = CONCAT('GRANT adminStaff TO "', @username, '"@"%"');

PREPARE stmt
FROM @query2;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

SET @query3 = CONCAT(
        'SET DEFAULT ROLE adminStaff TO "',
        @username,
        '"@"%"'
    );

PREPARE stmt
FROM @query3;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

END IF;

SELECT @username AS username;

END $$

CREATE PROCEDURE S_ListStaffByDepartmentID (IN departmentID int) BEGIN
SELECT s.*
FROM staffs s
    JOIN departments d ON d.id = s.department_id
    AND d.deleted = 0
WHERE s.department_id = departmentID
    AND s.deleted = 0;

END $$

CREATE PROCEDURE S_ListStaffByName (IN listOrder ENUM ('asc', 'desc')) BEGIN IF listOrder = 'asc' THEN
SELECT *
FROM staffs s
WHERE s.deleted = 0
ORDER BY s.first_name ASC,
    s.last_name ASC;

ELSE
SELECT *
FROM staffs s
WHERE s.deleted = 0
ORDER BY s.first_name DESC,
    s.last_name DESC;

END IF;

END $$

CREATE PROCEDURE S_UpdateStaffInfo (
    IN Staff_Id INT,
    IN f_name varchar(50),
    IN l_name VARCHAR(50),
    IN Job_Type enum ('Doctor', 'Nurse', 'Admin'),
    IN Qualification VARCHAR(50),
    IN Salary BIGINT,
    IN Department_Id INT
) BEGIN
DECLARE `_rollback` BOOL DEFAULT 0;

DECLARE CONTINUE HANDLER FOR SQLWARNING
SET `_rollback` = 1;

SET AUTOCOMMIT = 0;

START TRANSACTION;

SAVEPOINT start_sp;

UPDATE staffs s
SET s.first_name = f_name,
    s.last_name = l_name,
    s.job_type = Job_Type,
    s.qualifications = Qualification,
    s.salary = Salary,
    s.department_id = Department_Id
WHERE s.id = Staff_Id;

IF `_rollback` THEN ROLLBACK TO SAVEPOINT start_sp;

ELSE COMMIT;

END IF;

END $$

CREATE PROCEDURE S_ViewStaffScheduleByID (IN staff_id int) BEGIN
SELECT s.*,
    a.id AS appointmentId,
    a.purpose,
    a.start_time,
    a.end_time
FROM appointments a
    LEFT JOIN staffs s ON s.id = a.staff_id
    AND s.deleted = 0
WHERE s.id = staff_id
    AND a.deleted = 0;

END $$

CREATE PROCEDURE S_UpdateStaffSchedule (
    IN Staff_Id int,
    IN Appointment_Id int,
    IN newStartTime datetime,
    IN newEndTime datetime
) BEGIN START transaction;

SELECT COUNT(*) INTO @Appointment_Count
FROM appointments
WHERE appointments.staff_id = Staff_Id
    AND appointments.start_time < newEndTime
    AND appointments.end_time > newStartTime
    AND appointments.id != Appointment_Id;

IF @Appointment_Count > 0 THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'TIME ALREADY BOOKED',
    MYSQL_ERRNO = 1001;

ELSEIF newStartTime >= newEndTime THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'INVALID TIME FRAME',
    MYSQL_ERRNO = 1001;

ELSEIF @Appointment_Count = 0 THEN START transaction;

UPDATE appointments a
SET a.start_time = newStartTime,
    a.end_time = newEndTime
WHERE a.id = Appointment_Id;

COMMIT;

ELSE SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'INVALID APPOINTMENT',
    MYSQL_ERRNO = 1001;

ROLLBACK;

END IF;

END $$

CREATE PROCEDURE S_GetStaffByUsername (
    IN Input_Username VARCHAR(100)
) BEGIN 

SELECT * FROM staffs WHERE username=Input_Username LIMIT 1;

END $$
DELIMITER $$

CREATE PROCEDURE P_RegisterNewPatient (
    IN First_Name VARCHAR(50),
    IN Last_Name VARCHAR(50),
    IN date_of_birth DATE,
    IN Contact_Info VARCHAR(255),
    IN Address VARCHAR(255),
    IN Allergies text
) BEGIN START TRANSACTION;

INSERT INTO patients (
        First_Name,
        Last_Name,
        date_of_birth,
        Contact_Info,
        Address,
        Allergies
    )
VALUES (
        First_Name,
        Last_Name,
        date_of_birth,
        Contact_Info,
        Address,
        Allergies
    );

COMMIT;

END $$

CREATE PROCEDURE P_SearchPatientById (IN patient_id int) BEGIN
SELECT *
FROM patients
WHERE `id` = patient_id
    AND deleted = 0;

END $$

CREATE PROCEDURE P_SearchPatitentByName (IN Patient_Name varchar(100)) BEGIN
SELECT *
FROM patients p
WHERE MATCH (p.first_name, p.last_name) AGAINST (Patient_Name IN BOOLEAN MODE)
    AND p.deleted = 0;

END $$

CREATE PROCEDURE P_AddTreatment (
    IN Patient_Id INT,
    IN Staff_Id INT,
    IN Treatment_Date DATE,
    IN Treatment_Details text
) BEGIN
SET @is_doctor = (
        CASE
            WHEN (
                SELECT job_type
                FROM staffs
                WHERE id = Staff_Id
            ) = 'Doctor' THEN TRUE
            ELSE FALSE
        END
    );

IF @is_doctor THEN START TRANSACTION;

INSERT INTO treatments (
        patient_id,
        staff_id,
        treatment_date,
        treatment_details
    )
VALUES (
        Patient_Id,
        Staff_Id,
        Treatment_Date,
        Treatment_Details
    );

COMMIT;

ELSE SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'INVALID STAFF',
    MYSQL_ERRNO = 01004;

ROLLBACK;

END IF;

END $$

CREATE PROCEDURE P_UpdatePatientInfo(
    IN p_id INT,
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_date_of_birth DATE,
    IN p_contact_info VARCHAR(255),
    IN p_address VARCHAR(255),
    IN p_allergies TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;

    UPDATE patients
    SET
        first_name = p_first_name,
        last_name = p_last_name,
        date_of_birth = p_date_of_birth,
        contact_info = p_contact_info,
        address = p_address,
        allergies = p_allergies
    WHERE id = p_id;

    
    COMMIT;
END $$
DELIMITER $$

CREATE PROCEDURE A_ViewDoctorScheduleByDuration (IN fromDate DATETIME, IN toDate DATETIME) BEGIN
SELECT s.id,
    s.first_name,
    s.last_name,
    s.job_type,
    -- s.qualifications,
    s.department_id,
    -- s.salary,
    s.deleted,
    IF (
        (COUNT(a.id) > 0),
        TRUE,
        FALSE
    ) AS busy
FROM staffs s
    LEFT JOIN (
        SELECT *
        FROM appointments a
        WHERE a.deleted = 0
            AND a.start_time <= toDate
            AND a.end_time >= fromDate
    ) a ON s.id = a.staff_id
WHERE s.job_type = 'Doctor'
    AND s.deleted = 0
GROUP BY (s.id);

END $$

CREATE PROCEDURE A_BookAppointmentWithDoctor (
    IN PatientId int,
    IN Staff_Id int,
    IN newStartTime datetime,
    IN newEndTime datetime,
    IN purpose text
) BEGIN

SELECT COUNT(*) INTO @Appointment_Count
FROM appointments ap
    JOIN staffs s ON s.id = ap.staff_id
WHERE ap.staff_id = Staff_Id
    AND ap.start_time < newEndTime
    AND ap.end_time > newStartTime
    AND s.job_type = 'Doctor'
    AND ap.deleted = 0
    AND s.deleted = 0;

IF @Appointment_Count > 0 THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'TIME ALREADY BOOKED',
    MYSQL_ERRNO = 1001;

ELSEIF newStartTime >= newEndTime THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'INVALID TIME FRAME',
    MYSQL_ERRNO = 1001;

ELSE START transaction;

INSERT INTO appointments (
        patient_id,
        staff_id,
        start_time,
        end_time,
        purpose
    )
VALUES (
        PatientId,
        Staff_Id,
        newStartTime,
        newEndTime,
        purpose
    );

COMMIT;

END IF;

END $$

CREATE PROCEDURE A_CancelAppoinment (IN appointment_Id INT) BEGIN
SET @is_doctor = (
        CASE
            WHEN (
                SELECT job_type
                FROM staffs s
                    JOIN appointments a ON a.staff_id = s.id
                WHERE a.id = appointment_Id
            ) = 'Doctor' THEN TRUE
            ELSE FALSE
        END
    );

IF @is_doctor THEN START TRANSACTION;

UPDATE appointments
SET appointments.deleted = 1
WHERE appointments.id = Appointment_Id;

COMMIT;

ELSE SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = "This is not a doctor's appointment ",
    MYSQL_ERRNO = 01004;

ROLLBACK;

END IF;

END $$
DELIMITER $$

CREATE PROCEDURE R_ViewOneOrManyTreatmentHistoryByDuration (
    IN patientID INT,
    IN fromDate DATETIME,
    IN toDate DATETIME
) BEGIN
SELECT p.first_name AS patient_first_name,
    p.last_name AS patient_last_name,
    s.first_name AS staff_first_name,
    s.last_name AS staff_last_name,
    s.job_type AS staff_job_type,
    t.treatment_date,
    t.treatment_details
FROM treatments t
    JOIN `patients` p ON p.id = t.patient_id
    AND p.deleted = 0
    JOIN staffs s ON s.id = t.staff_id
    AND s.deleted = 0
WHERE t.treatment_date BETWEEN fromDate AND toDate
    AND (
        patientID IS NULL
        OR t.patient_id = patientID
    )
    AND t.deleted = 0;

END $$

CREATE PROCEDURE R_ViewOneJobChangeHistoryByID(IN staffID int) BEGIN
SELECT *
FROM staff_job_history sj
WHERE staff_id = staffID
    AND sj.deleted = 0;

END $$

CREATE PROCEDURE R_ViewOneOrManyDoctorWorkByDuration(
    IN staffID int,
    IN fromDate DATETIME,
    IN toDate DATETIME
) BEGIN
SELECT s.first_name,
    s.last_name,
    s.job_type,
    COUNT(a.id) AS appointment_nums,
    COUNT(t.id) AS treatment_nums
FROM staffs s
    LEFT JOIN appointments a ON a.staff_id = s.id
    AND a.start_time <= toDate
    AND a.end_time >= fromDate
    AND a.deleted = 0
    LEFT JOIN treatments t ON t.staff_id = s.id
    AND t.treatment_date BETWEEN fromDate AND toDate
    AND t.deleted = 0
WHERE s.job_type = 'Doctor'
    AND (
        staffID IS NULL
        OR s.id = staffID
    )
    AND s.deleted = 0
GROUP BY s.id;

END $$
CREATE ROLE doctor, nurse, adminStaff;

GRANT
SELECT ON hospital_management.appointments TO doctor, nurse, adminStaff;

GRANT
SELECT ON hospital_management.departments TO doctor, nurse, adminStaff;

GRANT
SELECT ON hospital_management.patients TO doctor, nurse, adminStaff;

GRANT
SELECT ON hospital_management.staff_job_history TO doctor, nurse, adminStaff;

GRANT
SELECT ON hospital_management.staffs TO doctor, nurse, adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_RegisterNewPatient TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_SearchPatientById TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_SearchPatitentByName TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_AddTreatment TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_BookAppointmentWithDoctor TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_CancelAppoinment TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_UpdateStaffSchedule TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.R_ViewOneJobChangeHistoryByID TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.R_ViewOneOrManyTreatmentHistoryByDuration TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.R_ViewOneOrManyDoctorWorkByDuration TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetAllDepartment TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetStaffByUsername TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_RegisterNewPatient TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_SearchPatientById TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_SearchPatitentByName TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_AddTreatment TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_ViewDoctorScheduleByDuration TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_BookAppointmentWithDoctor TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_CancelAppoinment TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_UpdateStaffSchedule TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.R_ViewOneOrManyTreatmentHistoryByDuration TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.R_ViewOneOrManyDoctorWorkByDuration TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetStaffByUsername TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetAllDepartment TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_AddNewStaff TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_ListStaffByDepartmentID TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_ListStaffByName TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_UpdateStaffInfo TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_ViewStaffScheduleByID TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_UpdateStaffSchedule TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetStaffByUsername TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetAllDepartment TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_ViewDoctorScheduleByDuration TO adminStaff;
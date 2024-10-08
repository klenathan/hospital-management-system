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
    IN username VARCHAR(100),
    IN userPassword VARCHAR(100)
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
        '"@"%" IDENTIFIED BY "',userPassword,'"'
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
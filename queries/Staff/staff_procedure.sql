-- @block List the staff by department
CREATE PROCEDURE S_ListStaffByDepartmentID (IN departmentID int) BEGIN
SELECT *
FROM staffs s
    JOIN departments d ON d.id = s.department_id
    AND d.deleted = 0
WHERE s.department_id = departmentID
    AND s.deleted = 0;

END;

-- List the staff by name (in ASC and DESC order)
CREATE PROCEDURE S_ListStaffByName (IN listOrder ENUM ('asc', 'desc')) BEGIN IF listOrder = 'asc' THEN
SELECT *
FROM Staffs s
WHERE s.deleted = 0
ORDER BY s.first_name ASC,
    s.last_name ASC;

ELSE
SELECT *
FROM Staffs s
WHERE s.deleted = 0
ORDER BY s.first_name DESC,
    s.last_name DESC;

END IF;

END;

CREATE PROCEDURE S_ViewStaffScheduleByID (IN staff_id int) BEGIN
SELECT s.*,
    a.purpose,
    a.start_time,
    a.end_time
FROM appointments a
    LEFT JOIN staffs s ON s.id = a.staff_id
    AND s.deleted = 0
WHERE s.id = staff_id
    AND a.deleted = 0;

END;

CREATE PROCEDURE SP_UpdateStaffSchedule (
    IN Staff_Id int,
    IN Appointment_Id int,
    IN newStartTime datetime,
    IN newEndTime datetime
) BEGIN START transaction;

SELECT COUNT(*) INTO @Appointment_Count
FROM Appointments
WHERE appointments.staff_id = Staff_Id
    AND appointments.start_time < newEndTime
    AND appointments.end_time > newStartTime
    AND appointments.id != Appointment_Id;

IF @Appointment_Count = 0 THEN
UPDATE appointments
SET appointments.start_time = newStartTime,
    appointments.end_time = newEndTime
WHERE Appointment_Id = AppointmentId;

COMMIT;

ELSE ROLLBACK;

END IF;

END;

DROP PROCEDURE IF EXISTS S_AddNewStaff;

CREATE PROCEDURE S_AddNewStaff(
    IN f_name varchar(50),
    IN l_name VARCHAR (50),
    IN j_type ENUM('Doctor', 'Nurse', 'Admin'),
    IN qualifications VARCHAR(50),
    IN department_id int,
    IN salary BIGINT
) BEGIN
DECLARE `_rollback` BOOL DEFAULT 0;

DECLARE CONTINUE HANDLER FOR SQLWARNING
SET `_rollback` = 1;

SET AUTOCOMMIT = 0;

START TRANSACTION;

SAVEPOINT start_sp;

-- Insert into staffs table
INSERT INTO staffs (
        first_name,
        last_name,
        job_type,
        qualifications,
        department_id,
        salary
    )
VALUES (
        f_name,
        l_name,
        j_type,
        qualifications,
        department_id,
        salary
    );

-- Insert into staff job history
SET @userID = LAST_INSERT_ID();

INSERT INTO staff_job_history (staff_id, job_type, salary, department_id)
VALUES (@userID, j_type, salary, department_id);

-- Insert create user
SET @username = CONCAT(f_name, l_name, @userID);

SET @query1 = CONCAT(
        '
            CREATE USER "',
        @username,
        '"@"%" IDENTIFIED BY "',
        'password',
        '"'
    );

PREPARE stmt
FROM @query1;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

IF `_rollback` THEN ROLLBACK TO SAVEPOINT start_sp;

ELSE COMMIT;

END IF;

END;

----------------------------------
call A_ViewDoctorScheduleByDuration ("2024-08-19", "2024-08-19");

DELIMITER $$

CREATE PROCEDURE A_ViewDoctorScheduleByDuration (IN fromDate DATETIME, IN toDate DATETIME) BEGIN
SELECT DISTINCT (s.id),
    s.first_name,
    s.last_name,
    s.job_type,
    s.qualifications,
    s.department_id,
    s.salary,
    s.deleted,
    s.created_at,
    s.updated_at,
    IF (
        (
            a.start_time <= toDate
            AND a.end_time >= fromDate
        ),
        TRUE,
        FALSE
    ) AS busy
FROM staffs s
    LEFT JOIN appointments a ON s.id = a.staff_id
    AND a.deleted = 0
WHERE s.job_type = 'Doctor'
    AND s.deleted = 0;

END $$

CREATE PROCEDURE A_BookAppointmentWithDoctor (
    IN PatientId int,
    IN Staff_Id int,
    IN newStartTime datetime,
    IN newEndTime datetime,
    IN purpose text
) BEGIN
DECLARE Appointment_Count int;

SELECT IF (
        (s.job_type = 'Doctor'),
        TRUE,
        FALSE
    ),
    COUNT(*) INTO @isDocter,
    Appointment_Count
FROM appointments ap
    JOIN staffs s ON s.id = ap.staff_id
WHERE ap.staff_id = Staff_Id
    AND ap.start_time < newEndTime
    AND ap.end_time > newStartTime
    AND s.job_type = 'Doctor';

IF Appointment_Count > 0 THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'TIME ALREADY BOOKED',
    MYSQL_ERRNO = 1001;

ELSEIF newStartTime >= newEndTime THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'INVALID TIME FRAME',
    MYSQL_ERRNO = 1001;

ELSEIF ! @isDocter THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = "This is not a doctor's appointment ",
    MYSQL_ERRNO = 01004;

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
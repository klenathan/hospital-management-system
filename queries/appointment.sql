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
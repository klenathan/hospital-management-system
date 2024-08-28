DELIMITER $$ CREATE PROCEDURE A_ViewDoctorScheduleByDuration (IN fromDate DATETIME, IN toDate DATETIME) BEGIN
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

END $$ CAll `A_BookAppointmentWithDoctor` (
    1,
    4,
    "2024-08-10 07:00:00.",
    "2024-08-10 09:40:00",
    "Checkups"
);

CREATE PROCEDURE A_BookAppointmentWithDoctor (
    IN PatientId int,
    IN Staff_Id int,
    IN newStartTime datetime,
    IN newEndTime datetime,
    IN purpose text
) BEGIN
DECLARE Appointment_Count int;

SELECT COUNT (*) INTO Appointment_Count
FROM appointments ap
    JOIN staffs s ON s.id = ap.staff_id
    AND s.deleted = 0
WHERE ap.staff_id = Staff_Id
    AND ap.start_time < newEndTime
    AND ap.end_time > newStartTime
    AND s.job_type = 'Doctor'
    AND ap.deleted = 0;

-- SELECT IF (
--         (s.job_type = 'Doctor'),
--         TRUE,
--         FALSE
--     ) INTO @isDocter
-- FROM staffs s WHERE s.id = Staff_Id;
-- SELECT @isDoctor;
IF Appointment_Count > 0 THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'TIME ALREADY BOOKED',
    MYSQL_ERRNO = 1001;

ELSEIF newStartTime >= newEndTime THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'INVALID TIME FRAME',
    MYSQL_ERRNO = 1001;

-- ELSEIF !@isDocter THEN SIGNAL SQLSTATE '2201R'
-- SET MESSAGE_TEXT = "This is not a doctor's appointment ",
--     MYSQL_ERRNO = 01004;
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

END $$ CREATE PROCEDURE A_CancelAppoinment (IN appointment_Id INT) BEGIN
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
            AND a.start_time <= "2024-08-22"
            AND a.end_time >= "2024-08-20"
    ) a ON s.id = a.staff_id
WHERE s.job_type = 'Doctor'
    AND s.deleted = 0
GROUP BY (s.id);

->Group AGGREGATE: COUNT(a.id) (cost = 62.4 ROWS = 140) (actual time = 0.109..0.166 ROWS = 56 loops = 1)->Nested loop
LEFT JOIN (cost = 48.4 ROWS = 140) (actual time = 0.0989..0.15 ROWS = 57 loops = 1)->INDEX lookup ON s USING staff_del_job_idx (deleted = 0, job_type = 'Doctor'),
WITH INDEX condition: (s.job_type = 'Doctor') (cost = 6.35 ROWS = 56) (actual time = 0.0808..0.0878 ROWS = 56 loops = 1)->Filter: (
    (a.deleted = 0)
    AND (a.start_time <= '2024-08-22')
    AND (a.end_time >= '2024-08-20')
) (cost = 0.504 ROWS = 2.5) (
    actual time = 931e -6..956e -6 ROWS = 0.0357 loops = 56
)->INDEX lookup ON a USING staff_id (staff_id = s.id) (cost = 0.504 ROWS = 2.5) (
    actual time = 726e -6..770e -6 ROWS = 0.107 loops = 56
)
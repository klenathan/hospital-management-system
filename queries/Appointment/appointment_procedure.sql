-- @blocks View working schedule of all doctors for a given duration (with busy or available status)
---- Index for this procedure
CREATE INDEX staff_del_job_idx ON staffs (deleted, job_type);

CREATE INDEX idx_deleted_staff_id ON appointments (deleted, staff_id);

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

END;

-- @block Book an appointment WITH a doctor (FOR a given time, no more than one appointment FOR a doctor)
CREATE PROCEDURE A_BookAppointmentWithDoctor (
    IN PatientId int,
    IN Staff_Id int,
    IN newStartTime datetime,
    IN newEndTime datetime,
    IN purpose text
) BEGIN
DECLARE Appointment_Count int;

START transaction;

SELECT COUNT(*) INTO Appointment_Count
FROM appointments ap
    JOIN staffs s ON s.id = ap.staff_id
WHERE ap.staff_id = Staff_Id
    AND ap.start_time < newEndTime
    AND ap.end_time > newStartTime
    AND s.job_type = 'Doctor';

IF Appointment_Count > 0 THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'Trung lich',
    MYSQL_ERRNO = 1001;

ELSEIF newStartTime >= newEndTime THEN SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'INVALID TIME FRAME',
    MYSQL_ERRNO = 1001;

ELSE
INSERT INTO Appointments (
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

END;

-- @block Cancel an appointment WITH a doctor
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

END;
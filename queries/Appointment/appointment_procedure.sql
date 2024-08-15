-- View working schedule of all doctors for a given duration (with busy or available status)
---- Index for this procedure
CREATE INDEX staff_del_job_idx ON staffs (deleted, job_type);

CREATE INDEX idx_deleted_staff_id ON appointments (deleted, staff_id);

CREATE PROCEDURE A_ViewDoctorScheduleByDuration (in fromDate DATETIME, in toDate DATETIME) BEGIN
SELECT DISTINCT
    (s.id),
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
    ) as busy
FROM
    staffs s
    LEFT JOIN appointments a ON s.id = a.staff_id
    AND a.deleted = 0
WHERE
    s.job_type = 'Doctor'
    AND s.deleted = 0;

END;

create procedure A_BookAppointmentWithDoctor (
    in PatientId int,
    in Staff_Id int,
    in newStartTime datetime,
    in newEndTime datetime,
    in purpose text
) begin declare Appointment_Count int;

start transaction;

select
    count(*) into Appointment_Count
from
    appointments ap
    join staffs s on s.id = ap.staff_id
where
    ap.staff_id = Staff_Id
    and ap.start_time < newEndTime
    and ap.end_time > newStartTime
    and s.job_type = 'Doctor';

if Appointment_Count > 0 then SIGNAL SQLSTATE '2201R'
SET
    MESSAGE_TEXT = 'Trung lich',
    MYSQL_ERRNO = 1001;

ELSEIF newStartTime >= newEndTime then SIGNAL SQLSTATE '2201R'
SET
    MESSAGE_TEXT = 'INVALID TIME FRAME',
    MYSQL_ERRNO = 1001;

else
insert into
    Appointments (
        patient_id,
        staff_id,
        start_time,
        end_time,
        purpose
    )
values
    (
        PatientId,
        Staff_Id,
        newStartTime,
        newEndTime,
        purpose
    );

commit;

end if;

end;

call A_BookAppointmentWithDoctor (
    1,
    1,
    "2024-08-15 16:30:00",
    "2024-08-15 13:30:00",
    "Bui Kham"
);

-- SELECT
--     LAST_INSERT_ID ();
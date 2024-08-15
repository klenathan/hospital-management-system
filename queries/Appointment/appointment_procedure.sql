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
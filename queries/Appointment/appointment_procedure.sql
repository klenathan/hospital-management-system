-- View working schedule of all doctors for a given duration (with busy or available status)
---- Index for this procedure
CREATE INDEX staff_del_job_idx ON staffs (deleted, job_type);

CREATE PROCEDURE A_ViewDoctorScheduleByDuration (in fromDate DATETIME, in toDate DATETIME) BEGIN
SELECT
    s.first_name,
    s.last_name,
    a.start_time,
    a.end_time,
    a.*,
    IF (
        (
            a.start_time <= toDate
            AND a.end_time >= fromDate
        ),
        TRUE,
        FALSE
    ) as busy
FROM
    appointments a
    JOIN staffs s ON s.id = a.staff_id
    AND s.deleted = 0
WHERE
    s.job_type = 'Doctor'
    AND a.deleted = 0;

END;
-- View working schedule of all doctors for a given duration (with busy or available status)
SELECT
    s.first_name,
    s.last_name,
    a.start_time,
    a.end_time,
    a.*,
    IF (
        (
            a.start_time <= '2024-08-12 14:31:00'
            AND a.end_time >= '2024-08-11 13:00:00'
        ),
        TRUE,
        FALSE
    ) as busy
FROM
    appointments a
    LEFT JOIN staffs s on s.id = a.staff_id
WHERE
    s.job_type = 'Doctor';
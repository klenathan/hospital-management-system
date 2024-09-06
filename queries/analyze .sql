-- Active: 1723462847068@@127.0.0.1@3306@hospital_management
-- Appoinment
EXPLAIN ANALYZE
SELECT s.id,
    s.first_name,
    s.last_name,
    s.job_type,
    s.department_id,
    s.deleted,
    IF(
        COUNT(a.id) > 0,
        TRUE,
        FALSE
    ) AS busy
FROM staffs s
    LEFT JOIN (
        SELECT *
        FROM appointments a
        WHERE a.deleted = 0
            AND a.start_time <= '2024-08-22'
            AND a.end_time >= '2024-08-20'
    ) a ON s.id = a.staff_id
WHERE s.job_type = 'Doctor'
    AND s.deleted = 0
GROUP BY s.id;

EXPLAIN ANALYZE
SELECT COUNT(*)
FROM appointments ap
    JOIN staffs s ON s.id = ap.staff_id
    AND s.deleted = 0
WHERE ap.staff_id = 4
    AND ap.start_time < '2024-08-10 09:40:00'
    AND ap.end_time > '2024-08-10 07:00:00'
    AND s.job_type = 'Doctor'
    AND ap.deleted = 0;

EXPLAIN ANALYZE
SELECT job_type
FROM staffs s
    JOIN appointments a ON a.staff_id = s.id
WHERE a.id = 1 DROP INDEX idx_start_end_time ON appointments;

CREATE INDEX staff_job_del_idx ON staffs(`job_type`, `deleted`);

ALTER TABLE treatments PARTITION BY HASH(TO_DAYS(treatmet_date)) PARTITIONS 4;

EXPLAIN ANALYZE
SELECT *
FROM patients p
WHERE MATCH (p.first_name, p.last_name) AGAINST ('Victor' IN BOOLEAN MODE)
    AND p.deleted = 0;

EXPLAIN ANALYZE
SELECT job_type
FROM staffs
WHERE id = 1;

EXPLAIN ANALYZE
SELECT p.first_name AS patient_first_name,
    p.last_name AS patient_last_name,
    s.first_name AS staff_first_name,
    s.last_name AS staff_last_name,
    s.job_type AS staff_job_type,
    t.treatment_date,
    t.treatment_details
FROM treatments t
    JOIN `patients` p ON p.id = t.patient_id
    AND p.deleted = 0
    JOIN staffs s ON s.id = t.staff_id
    AND s.deleted = 0
WHERE t.treatment_date BETWEEN '2024-08-10 07:00:00' AND '2024-08-10 09:40:00'
    AND t.deleted = 0;

EXPLAIN ANALYZE
SELECT *
FROM staff_job_history sj
WHERE staff_id = 1
    AND sj.deleted = 0;

EXPLAIN ANALYZE
SELECT s.first_name,
    s.last_name,
    s.job_type,
    COUNT(a.id) AS appointment_nums,
    COUNT(t.id) AS treatment_nums
FROM staffs s
    LEFT JOIN appointments a ON a.staff_id = s.id
    AND a.start_time <= '2024-08-10 09:40:00'
    AND a.end_time >= '2024-08-10 07:00:00'
    AND a.deleted = 0
    LEFT JOIN treatments t ON t.staff_id = s.id
    AND t.treatment_date BETWEEN '2024-08-10 07:00:00' AND '2024-08-10 09:40:00'
    AND t.deleted = 0
WHERE s.job_type = 'Doctor'
    AND s.deleted = 0
GROUP BY s.id;

EXPLAIN ANALYZE
SELECT *
FROM staffs s
    JOIN departments d ON d.id = s.department_id
    AND d.deleted = 0
WHERE s.department_id = 2
    AND s.deleted = 0;

CREATE INDEX staff_depIdx_del_idx ON staffs(`department_id`, `deleted`);

EXPLAIN ANALYZE
SELECT *
FROM staffs s
WHERE s.deleted = 0
ORDER BY s.first_name ASC,
    s.last_name ASC;

DROP INDEX staff_name_idx ON staffs;

CREATE INDEX staff_name_idx ON staffs(`first_name`, `last_name`);

EXPLAIN ANALYZE
SELECT s.*,
    a.id AS appoimentId,
    a.purpose,
    a.start_time,
    a.end_time
FROM appointments a
    LEFT JOIN staffs s ON s.id = a.staff_id
    AND s.deleted = 0
WHERE s.id = 1
    AND a.deleted = 0;

EXPLAIN ANALYZE
SELECT COUNT(*)
FROM appointments
WHERE appointments.staff_id = Staff_Id
    AND appointments.start_time < '2024-08-10 09:43:00'
    AND appointments.end_time > '2024-08-10 09:40:00'
    AND appointments.id != 2;
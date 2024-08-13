-- List the staff by department
CREATE PROCEDURE S_ListStaffByDepartmentID () BEGIN
SELECT
    *
FROM
    staffs s
    JOIN departments d ON d.id = s.department_id
    AND s.deleted = 0;

END;

-- List the staff by name (in ASC and DESC order)
CREATE PROCEDURE S_ListStaffByName (in listOrder ENUM ('asc', 'desc')) BEGIN IF listOrder = 'asc' THEN
SELECT
    *
FROM
    Staffs s
WHERE
    s.deleted = 0
ORDER BY
    s.first_name,
    s.last_name ASC;

ELSE
SELECT
    *
FROM
    Staffs s
WHERE
    s.deleted = 0
ORDER BY
    s.first_name,
    s.last_name DESC;

END IF;

END;

-- View staff schedule by ID
CREATE PROCEDURE S_ViewStaffScheduleByID (in staff_id int) begin
SELECT
    s.first_name,
    s.last_name,
    a.start_time,
    a.end_time
FROM
    appointments a
    LEFT JOIN staffs s on s.id = a.id
    AND a.deleted = 0
WHERE
    s.id = staff_id
    AND a.deleted = 0;

END;

CALL `S_ViewStaffScheduleByID` (1);
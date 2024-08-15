-- List the staff by department
DROP PROCEDURE `S_ListStaffByDepartmentID`;
CREATE PROCEDURE S_ListStaffByDepartmentID (in departmentID int) BEGIN
SELECT
    s.*,
    d.name AS department_name
FROM
    staffs s
    JOIN departments d ON d.id = s.department_id
    AND d.deleted = 0
WHERE
    s.department_id = departmentID
    AND s.deleted = 0;

END;
call `S_ListStaffByDepartmentID`(1);
-- List the staff by name (in ASC and DESC order)
CREATE PROCEDURE S_ListStaffByName (in listOrder ENUM ('asc', 'desc')) BEGIN IF listOrder = 'asc' THEN
SELECT
    *
FROM
    Staffs s
WHERE
    s.deleted = 0
ORDER BY
    s.first_name ASC,
    s.last_name ASC;

ELSE
SELECT
    *
FROM
    Staffs s
WHERE
    s.deleted = 0
ORDER BY
    s.first_name DESC,
    s.last_name DESC;

END IF;

END;

CREATE PROCEDURE S_ViewStaffScheduleByID (in staff_id int) begin
SELECT
    s.*,
    a.purpose,
    a.start_time,
    a.end_time
FROM
    appointments a
    LEFT JOIN staffs s on s.id = a.staff_id
    AND s.deleted = 0
WHERE
    s.id = staff_id
    AND a.deleted = 0;

END;

create procedure SP_UpdateStaffSchedule (
    in Staff_Id int,
    in Appointment_Id int,
    in newStartTime datetime,
    in newEndTime datetime
) begin 

start transaction;

select
    count(*) into @Appointment_Count
from
    Appointments
where
    appointments.staff_id = Staff_Id
    and appointments.start_time < newEndTime
    and appointments.end_time > newStartTime
    and appointments.id != Appointment_Id;

if @Appointment_Count = 0 then
update appointments
set
    appointments.start_time = newStartTime,
    appointments.end_time = newEndTime
where
    Appointment_Id = AppointmentId;

commit;

else rollback;

end if;

end;


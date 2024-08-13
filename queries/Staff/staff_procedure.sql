-- List the staff by department
create PROCEDURE S_ListStaffByDepartmentID () begin
select
    *
from
    staffs s
    JOIN departments d ON d.id = s.department_id;

end;

-- List the staff by name (in ASC and DESC order)
create procedure S_ListStaffByName (in listOrder ENUM ('asc', 'desc')) begin if listOrder = 'asc' then
select
    *
from
    Staffs s
order by
    s.first_name,
    s.last_name asc;

else
select
    *
from
    Staffs s
order by
    s.first_name,
    s.last_name desc;

end if;

end;

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
WHERE
    s.id = staff_id;

END;

CALL `S_ViewStaffScheduleByID` (1);
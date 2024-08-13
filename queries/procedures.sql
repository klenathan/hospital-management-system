-- 4. Stored procedures & transaction management
-- Patient
-- Add new patient
create procedure SP_RegisterNewPatient (
    in First_Name varchar(50),
    in Last_Name varchar(50),
    in DOB date,
    in Contact_Info varchar(255),
    in Address varchar(255),
    in Allergies text
) begin

insert into
    patients (
        first_name,
        last_name,
        date_of_birth,
        contact_info,
        address,
        allergies
    )
values
    (
		First_Name,
		Last_Name,
        DOB,
        Contact_Info,
        Address,
        Allergies
    );

end;

-- Find patient by name or ID -> split into 2 procedures
create procedure SP_SearchPatientByName (in Patient_Name varchar(50)) begin
select
    *
from
    Patients
where
    first_name like ('%', Patient_Name, '%')
    or last_name like ('%', Patient_Name, '%');

end;

create procedure SP_SearchPatientById (in Patient_Id int) begin
select
	*
from
	patients
where
	id = Patient_Id;	

end;

-- Add treatment -> ok
create procedure SP_AddTreatment (
    in Patient_Id int,
    in Staff_Id int,
    in Treatment_Date date,
    in Treatment_Details text
) begin

insert into
    treatments (
        patient_id,
        staff_id,
        treatment_date,
        treatment_details
    )
values
    (
        Patient_Id,
        Staff_Id,
        Treatment_Date,
        Treatment_Details
    );

end;

-- Staff
-- Add staff
create procedure SP_AddStaff (
    in First_Name varchar(50),
    in Last_Name varchar(50),
    in Job_Type ENUM('Doctor', 'Nurse', 'Admin'),
    in Qualification text,
    in Department_Id int,
    in Salary decimal(10, 2)
) begin start transaction;

insert into
    staffs (
        first_name,
        last_name,
        job_type,
        qualification,
        deparment_id,
        salary
    )
values
    (
        First_Name,
        Last_Name,
        Job_Type,
        Qualification,
        Department_Id,
        Salary
    );

-- Also save information to Staff_Job_History 
insert into
    staff_job_history (
        staff_id,
        job_type,
        salary,
        department_id
    )
values
    (
        InsertId (),
        Job_Type,
        Salary,
        Department_Id
    );

commit;

end;

-- List the staff by department
create procedure SP_ListStaffByDepartment (
    in Department_Id int
) begin
select
	* 
from
	staffs 
WHERE 
	department_id = Department_Id;
END //
DELIMITER ;

-- List staff by name
create procedure SP_ListStaffByName (in p_order varchar(4)) begin if p_order = 'ASC' then
select
    *
from
    Staffs
order by
    Full_Name,
    Last_Name asc;

else
select
    *
from
    Staffs
order by
    Full_Name,
    Last_Name desc;

end if;

end;

-- Update staff info
create procedure SP_UpdateStaffInfo (
    in Staff_Id int,
    in Job_Type enum('Doctor', 'Nurse', 'Admin'),
    in Salary decimal(10, 2),
    in Department_Id int
) begin start transaction;

update staffs
set
    job_type = Job_Type,
    salary = Salary,
    department_id = Department_Id
where
    `Staffs`.id = Staff_Id;

-- Also save information to Staff_Job_History
insert into
    Staff_Job_History (
        staff_id,
        job_type,
        salary,
        department_id
    )
values
    (
        Staff_Id,
        Job_Type,
        Salary,
        Department_Id
    );

commit;

end;

-- View staff's schedule
create procedure SP_ViewStaffSchedule (in Staff_Id int) begin
select
    *
from
    appointments
where
    staff_id = Staff_Id
order by
    start_time;

end;

-- Update staff's schedule
create procedure SP_UpdateStaffSchedule (
    in Staff_Id int,
    in Appointment_Id int,
    in NewDate_Time datetime
) begin declare Appointment_Count int;

start transaction;

select
    count(*) into Appointment_Count
from
    appointments
where
    staff_id = Staff_Id
    and start_time = NewDate_Time
    and `Appointment`.id != Appointment_Id;

if Appointment_Count = 0 then
update 
	Appointment
set
    start_time = NewDate_Time
where
    `Appointment`.id = AppointmentId;

commit;

else rollback;

end if;

end;

-- Appointment
-- Schedule an appointment
create procedure SP_BookAppointment (
    in Patient_Id int,
    in Staff_Id int,
    in DateTime datetime,
    in purpose text
) begin declare Apointment_Count int;

start transaction;

select
    count(*) into Appointment_Count
from
    appointments
where
    staff_id = Staff_Id
    and start_time = DateTime;

if Appointment_Count = 0 then
insert into
    appointments (patient_id, staff_id, start_time, purpose)
values
    (Patient_Id, Staff_Id, DateTime, Purpose);

commit;

else rollback;

end if;

end;

-- Cancel Appointment
create procedure SP_CancelAppoinment (in AppointmentId int) begin
delete from Appointments
where
    Appointment_Id = AppointmentId;

end;
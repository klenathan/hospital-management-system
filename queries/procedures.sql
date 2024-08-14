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
) begin start transaction;

insert into
    Patients (
        First_Name,
        Last_Name,
        DOB,
        Contact_Info,
        Address,
        Allergies
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

commit;

end;

-- Find patient by name or ID -> split into 2 procedures
create procedure SP_SearchPatientByNameOrId (in patient_id int, in Patient_Name varchar(50)) begin if patient_id is not null then
select
    *
from
    Patients
where
    `id` = patient_id;

else
select
    *
from
    Patients
where
    First_Name like ('%', Patient_Name, '%')
    or Last_Name like ('%', Patient_Name, '%');

end if;

end;

-- Add treatment -> ok
create procedure SP_AddTreatment (
    in PatientId int,
    in StaffId int,
    in TreatmentDate date,
    in TreatmentDetails text
) begin start transaction;

insert into
    Treatment_Records (
        Patient_Id,
        Staff_id,
        Treatment_Date,
        Treatment_Details
    )
values
    (
        PatientId,
        StaffId,
        TreatmentDate,
        TreatmentDetails
    );

commit;

end;

-- Staff
-- Add staff
create procedure SP_AddStaff (
    in Full_Name varchar(50),
    in Last_Name varchar(50),
    in Job_Type varchar(50),
    in Qualification text,
    in Salary decimal(10, 2),
    in Department_Id int,
    in Schedule text
) begin start transaction;

insert into
    Staffs (
        First_Name,
        Last_Name,
        Job_Type,
        Qualification,
        Salary,
        Department_Id,
        Schedule
    )
values
    (
        First_Name,
        Last_Name,
        Job_Type,
        Qualification,
        Salary,
        Department_Id,
        Schedule
    );

-- Also save information to Staff_Job_History 
insert into
    Staff_Job_History (
        Staff_Id,
        Job_Type,
        Salary,
        Department_Id,
        Start_Date
    )
values
    (
        InsertId (),
        Job_Type,
        Salary,
        Department_Id,
        current_date()
    );

commit;

end;

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
    in StaffId int,
    in JobType varchar(50),
    in salary decimal(10, 2),
    in DepartmentId int
) begin start transaction;

update Staffs
set
    Job_Type = JobType,
    Salary = salary,
    Department_Id = DepartmentId
where
    `Staffs`.id = StaffId;

-- Also save information to Staff_Job_History
insert into
    Staff_Job_History (
        Staff_Id,
        Job_Type,
        Salary,
        Department_Id,
        Start_Date
    )
values
    (
        StaffId,
        JobType,
        salary,
        DepartmentId,
        current_date()
    );

commit;

end;

-- View staff's schedule
create procedure SP_ViewStaffSchedule (in StaffId int) begin
select
    *
from
    Appointments
where
    Staff_Id = StaffId
order by
    Date_Time;

end;

-- Update staff's schedule
create procedure SP_UpdateStaffSchedule (
    in StaffId int,
    in AppointmentId int,
    in NewDate_Time datetime
) begin declare Appointment_Count int;

start transaction;

select
    count(*) into Appointment_Count
from
    Appointments
where
    Staff_Id = StaffId
    and Date_Time = NewDate_Time
    and Appointment_Id != AppointmentId;

if Appointment_Count = 0 then
update Appointments
set
    Date_Time = NewDate_Time
where
    Appointment_Id = AppointmentId;

commit;

else rollback;

end if;

end;

-- Appointment
-- Schedule an appointment
create procedure SP_BookAppointment (
    in PatientId int,
    in StaffId int,
    in DateTime datetime,
    in purpose text
) begin declare Apointment_Count int;

start transaction;

select
    count(*) into Appointment_Count
from
    Appointments
where
    Staff_Id = StaffId
    and Date_Time = DateTime;

if Appointment_Count = 0 then
insert into
    Appointments (Patient_Id, Staff_Id, Date_Time, Purpose)
values
    (PatientId, StaffId, DateTime, purpose);

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
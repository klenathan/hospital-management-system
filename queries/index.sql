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
    patients
where
    patients.first_name like ('%', Patient_Name, '%')
    or patients.last_name like ('%', Patient_Name, '%');

end;

create procedure SP_SearchPatientById (in Patient_Id int) begin
select
    *
from
    patients
where
    patients.id = Patient_Id;

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
    in Job_Type ENUM ('Doctor', 'Nurse', 'Admin'),
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
    staff_job_history (staff_id, job_type, salary, department_id)
values
    (InsertId (), Job_Type, Salary, Department_Id);

commit;

end;

-- List the staff by department
create procedure SP_ListStaffByDepartment (in Department_Id int) begin
select
    *
from
    staffs
where
    staffs.department_id = Department_Id;

end;

-- List staff by name
create procedure SP_ListStaffByName (in p_order varchar(4)) begin if p_order = 'ASC' then
select
    *
from
    staffs
order by
    staffs.first_name,
    staffs.last_name asc;

else
select
    *
from
    staffs
order by
    staffs.first_name,
    staffs.last_name desc;

end if;

end;

-- Update staff info
create procedure SP_UpdateStaffInfo (
    in Staff_Id int,
    in Job_Type enum ('Doctor', 'Nurse', 'Admin'),
    in Salary decimal(10, 2),
    in Department_Id int
) begin start transaction;

update staffs
set
    staffs.job_type = Job_Type,
    staffs.salary = Salary,
    staffs.department_id = Department_Id
where
    staffs.id = Staff_Id;

-- Also save information to Staff_Job_History
insert into
    Staff_Job_History (staff_id, job_type, salary, department_id)
values
    (Staff_Id, Job_Type, Salary, Department_Id);

commit;

end;

-- View staff's schedule
create procedure SP_ViewStaffSchedule (in Staff_Id int) begin
select
    *
from
    appointments
where
    appointments.staff_id = Staff_Id
order by
    appointments.start_time;

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
    appointments.staff_id = Staff_Id
    and appointments.start_time = NewDate_Time
    and appointments.id != Appointment_Id;

if Appointment_Count = 0 then
update appointments
set
    appointments.start_time = NewDate_Time
where
    appointments.id = Appointment_Id;

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
    appointments.staff_id = Staff_Id
    and appointments.start_time = DateTime;

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
create procedure SP_CancelAppoinment (in Appointment_Id int) begin
delete from appointments
where
    appointments.id = Appointment_Id;

end;

-- MỚI ADD
-- View working schedule of all doctors for a given duration (with busy or available status)
create procedure SP_ViewDoctorsSchedule (in Start_Date datetime, in End_Date datetime) begin
select
    staffs.id,
    staffs.first_name,
    staffs.last_name,
    appointments.start_time,
    appointments.end_time,
    case
        when appointments.start_time is null then 'available'
        else 'busy'
    end as status
from
    staffs
    left join appointments on staffs.id = appointments.staff_id
where
    staffs.job_type = 'Doctor'
    and appointments.start_time between Start_Date and End_Date
order by
    3,
    2,
    4;

end;

-- Report
-- View a patient treatment history for a given duration
create procedure SP_ViewPatientTreatmentHistoryInDuration (
    in Patient_Id int,
    in Start_Date date,
    in End_Date date
) begin
select
    *
from
    treatments
where
    treatments.patient_id = Patient_Id
    and treatments.treatment_date between Start_Date and End_Date;

end;

-- View all patient treatment in a given duration\
create procedure SP_ViewAllPatientTreatments (in Start_Date date, in End_Date date) begin
select
    *
from
    treatments
where
    treatments.treatment_date between Start_Date and End_Date;

end;

-- View job change history of a staff
create procedure SP_ViewStaffJobChangeHistory (in Staff_Id int) begin
select
    *
from
    staff_job_history
where
    staff_job_history.staff_id = Staff_Id
order by
    staff_job_history.created_at desc;

end;

-- View the work of a doctor in a given duration
create procedure SP_ViewDoctorWorkInDuration (
    in Doctor_Id int,
    in Start_Date date,
    in End_Date date
) begin
select
    'Appointments' as work,
    appointments.start_time,
    appointments.end_time,
    appointments.purpose
from
    appointments
where
    appointments.staff_id = Doctor_Id
    and appointments.start_time between Start_Date and End_Date
union all
select
    'Treatments' as work,
    treatments.treatment_date,
    treatmennts.treatment_details
from
    treatments
where
    treatments.staff_id = Doctor_Id
    and treatments.treatment_date between Start_Dare and End_Date;

end;

-- View the work of all doctors in a given duration
create procedure SP_ViewAllDoctorsWorkInDuration (in Start_Date date, in End_Date date) begin
select
    'Appointments' as work,
    staffs.first_name,
    staffs.last_name,
    appointments.start_time,
    appointments.end_time,
    appointments.purpose
from
    appointments
    join staffs on appointments.staff_id = staffs.id
where
    staffs.job_type = 'Doctor'
    and appointments.start_time between Start_Date and End_Date
union all
select
    'Treatments' as work,
    staffs.first_name,
    staffs.last_name,
    treatments.treatment_date,
    treatments.treatment_details
from
    treatments
    join staffs on treatments.staff_id = staffs.id
where
    staffs.job_type = 'Doctor'
    and treatments.treatment_date between Start_Date and End_Date;

end;
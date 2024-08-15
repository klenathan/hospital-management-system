-- Use function for return the status of function (SUCCESS | FAIL)
-- Add new patient
create procedure SP_RegisterNewPatient (
    in First_Name varchar(50),
    in Last_Name varchar(50),
    in date_of_birth date,
    in Contact_Info varchar(255),
    in Address varchar(255),
    in Allergies text
) begin start transaction;

insert into
    Patients (
        First_Name,
        Last_Name,
        date_of_birth,
        Contact_Info,
        Address,
        Allergies
    )
values
    (
        First_Name,
        Last_Name,
        date_of_birth,
        Contact_Info,
        Address,
        Allergies
    );

commit;

end;

-- Add treatment -> (Only doctor can add, change to function using transaction)
create procedure SP_AddTreatment (
    in Patient_Id int,
    in Staff_Id int,
    in Treatment_Date date,
    in Treatment_Details text
) begin declare Staff_Job_Type enum ('Doctor', 'Nurse', 'Admin');

select
    job_type into Staff_Job_Type
from
    staffs
where
    staffs.id = Staff_Id;

if Staff_Job_Type = 'Doctor' then start transaction;

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

commit;

else rollback;

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

-- Cancel Appointment (SOFT DELETE AND CHECK DOCTOR FOR SAVE)
create procedure SP_CancelAppoinment (in Appointment_Id int) begin declare Staff_Job_Type enum ('Doctor', 'Nurse', 'Admin');

select
    staffs.job_type into Staff_Job_Type
from
    appointments
    join staffs on appointments.staff_id = staffs.id
where
    appointments.id = Appointment_Id;

if Staff_Job_Type = 'Doctor' then
update appointments
set
    appointments.deleted = 1
where
    appointments.id = Appointment_Id;

select
    'success' as status;

else
select
    'fail' as status;

end if;

end;
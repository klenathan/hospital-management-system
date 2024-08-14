-- Use function for return the status of function (SUCCESS | FAIL)
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

-- Add treatment -> (Only doctor can add, change to function using transaction)
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
create procedure SP_CancelAppoinment (in AppointmentId int) begin
delete from Appointments
where
    appointments.id = Appointment_Id;

end;
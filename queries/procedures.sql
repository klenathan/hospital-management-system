-- 4. Stored procedures & transaction management

-- Patient
-- Add new patient
DELIMITER / /

create procedure SP_RegisterNewPatient (
	in First_Name varchar(50),
    in Last_Name varchar(50),
    in DOB date,
    in Contact_Info varchar(255),
    in Address varchar(255),
    in Allergies text
)
begin
	start transaction;
    
    insert into Patients (First_Name, Last_Name, DOB, Contact_Info, Address, Allergies)
    values (First_Name, Last_Name, DOB, Contact_Info, Address, Allergies);
    commit;
end //

DELIMITER;

-- Find patient by name or ID
DELIMITER / /

create procedure SP_SearchPatientByNameOrId (
   in PatientId int,
   in Patient_Name varchar(50)
) 
begin 
	if PatientId is not null then
		select * from Patients where Patient_Id = PatientId;
	else
		select * from Patients where First_Name like ('%', Patient_Name, '%')
        or Last_Name like ('%', Patient_Name, '%');
	end if;
end //

DELIMITER;

-- Add treatment
DELIMITER / /

create procedure SP_AddTreatment (
	in PatientId int,
    in StaffId int,
    in TreatmentDate date,
    in TreatmentDetails text
)
begin 
	start transaction;
    
    insert into Treatment_Records (Patient_Id, Staff_id, Treatment_Date, Treatment_Details)
    values (PatientId, StaffId, TreatmentDate, TreatmentDetails);
    commit;
end //

DELIMITER;

-- Staff
-- Add staff
DELIMITER / /

create procedure SP_AddStaff (
    in Full_Name varchar(50),
    in Last_Name varchar(50),
    in Job_Type varchar(50),
    in Qualification text,
    in Salary decimal(10, 2),
    in Department_Id int,
    in Schedule text
)
begin
    start transaction;
    
    insert into Staffs (First_Name, Last_Name, Job_Type, Qualification, Salary, Department_Id, Schedule)
    values (First_Name, Last_Name, Job_Type, Qualification, Salary, Department_Id, Schedule);
    
    -- Also save information to Staff_Job_History 
	insert into Staff_Job_History (Staff_Id, Job_Type, Salary, Department_Id, Start_Date)
    values (InsertId(), Job_Type, Salary, Department_Id, current_date());
    commit;
end //

DELIMITER;

-- List the staff by department
DELIMITER / /

create procedure SP_ListSatffByDepartment (
	in DepartmentId int
)
begin 
    select * from Staffs where Department_Id = DepartmentId;
end //

DELIMITER;

-- List staff by name
DELIMITER / /

create procedure SP_ListStaffByName (
	in p_order varchar(4)
)
begin 
	if p_order = 'ASC' then
		select * from Staffs 
        order by Full_Name, Last_Name asc;
	else
		select * from Staffs
        order by Full_Name, Last_Name desc;
	end if;
end //

DELIMITER;
-- Update staff info
DELIMITER / /

create procedure SP_UpdateStaffInfo (
	in StaffId int,
    in JobType varchar(50),
    in salary decimal(10, 2),
    in DepartmentId int
)
begin 
	start transaction;
    
    update Staffs
    set Job_Type = JobType,
		Salary = salary,
        Department_Id = DepartmentId
	where Staff_Id = StaffId;
    
    -- Also save information to Staff_Job_History
    insert into Staff_Job_History (Staff_Id, Job_Type, Salary, Department_Id, Start_Date)
    values (StaffId, JobType, salary, DepartmentId, current_date());
    commit;
end //

DELIMITER;

-- View staff's schedule
DELIMITER / /

create procedure SP_ViewStaffSchedule (
	in StaffId int
)
begin
	select * from Appointments
    where Staff_Id = StaffId
    order by Date_Time;
end //

DELIMITER;
-- Update staff's schedule
Delimiter / /

create procedure SP_UpdateStaffSchedule (
    in StaffId int,
    in AppointmentId int,
    in NewDate_Time datetime
)
begin
    declare Appointment_Count int;

    start transaction;

    select count(*) into Appointment_Count
    from Appointments
    where Staff_Id = StaffId
    and Date_Time = NewDate_Time
    and Appointment_Id != AppointmentId;

    if Appointment_Count = 0 then
        update Appointments
        set Date_Time = NewDate_Time
        where Appointment_Id = AppointmentId;
        commit;
    else
        rollback;
    end if;
end //

DELIMITER;

-- Appointment
-- Schedule an appointment
DELIMITER / /

create procedure SP_BookAppointment(
    in PatientId int,
    in StaffId int,
    in DateTime datetime,
    in purpose text
)
begin
    declare Apointment_Count int;

    start transaction;

    select count(*) into Appointment_Count
    from Appointments
    where Staff_Id = StaffId
    and Date_Time = DateTime;

    if Appointment_Count = 0 then
        insert into Appointments (Patient_Id, Staff_Id, Date_Time, Purpose)
        values (PatientId, StaffId, DateTime, purpose);
    commit;
    else
		rollback;
	end if;
end //

DELIMITER;

-- Cancel Appointment
DELIMITER / /

create procedure SP_CancelAppoinment (
	in AppointmentId int
)
begin 
	delete from Appointments where Appointment_Id = AppointmentId;
end //

DELIMITER;
create database hospital_management;
use hospital_management;

-- 1. CREATE TABLE

create table Patients (
	Patient_Id int AUTO_INCREMENT PRIMARY KEY,
    First_Name varchar(100),
    Last_Name varchar(100),
    DOB date,
    Contact_Info varchar(255),
    Address varchar(255),
    Allergies TEXT
);

create table Staffs (
	Staff_Id int AUTO_INCREMENT PRIMARY KEY,
    First_Name varchar(100),
    Last_Name  varchar(100),
    Job_Type ENUM('Doctor', 'Nurse', 'Admin'),
    Qualifications text,
    Deparment_Id int,
    Schedule text,
    Salary decimal(10, 2),
    FOREIGN KEY (Department_Id) REFERENCES Departments(Department_Id)
);

create table Departments (
	Department_Id int AUTO_INCREMENT PRIMARY KEY,
    Department_Name varchar(100)
);

create table Appointments (
	Appointment_Id int AUTO_INCREMENT PRIMARY KEY,
    Patient_Id int,
    Staff_Id int,
    Date_Time datetime,
    Purpose text,
    FOREIGN KEY (Patient_Id) REFERENCES Patients(Patient_Id),
    FOREIGN KEY (Staff_Id) REFERENCES Staffs(Staff_Id)
);

create table Treatment_Records (
	Treatment_Id int AUTO_INCREMENT PRIMARY KEY,
    Patient_Id int,
    Staff_id int,
    Treatment_Date date,
    Treatment_Details text,
    FOREIGN KEY (Patient_Id) REFERENCES Patients(Patient_Id),
    FOREIGN KEY (Staff_Id) REFERENCES Staffs(Staff_Id)
);

create table Staff_Job_History (
	History_Id int AUTO_INCREMENT PRIMARY KEY,
    Staff_id int,
    Job_Type varchar(100),
    Salary decimal(10, 2),
    Department_Id int,
    Start_Date date,
    FOREIGN KEY (Staff_Id) REFERENCES Staffs(Staff_Id),
    FOREIGN KEY (Department_Id) REFERENCES Departments(Department_Id)
);


-- 2. INSERT SAMPLE DATA

insert into Patients 
values 
('Duong', 'Nguyen', '2000-08-18', 'duongnguyen@gmail.com', '199 bach dang', 'None'),
('Minh', 'Nguyen', '2005-05-11', 'minhnguyen@gmail.com', '255 nam ky khoi nghia', 'None'),
('Hoang', 'Dang', '1999-09-25', 'hoangdang@gmail.com', '87 le van luong', 'None'),
('Patrik', 'Bale', '1995-07-07', 'patrikbale@gmail.com', '55 nguyen van linh', 'None');

insert into Staffs
values
('Dr. Peter', 'Julian', 'Doctor', 'MD', 1, 'Mon-Sat 7AM-5PM', 40000000.00), 
('Dr. Phong', 'Tran', 'Doctor', 'MD', 2, 'Mon-Sat 7AM-5PM', 35000000.00), 
('Yen', 'Huynh', 'Nurse', 'BSN', 3, 'Mon-Sat 7AM-5PM', 20000000.00), 
('Hieu', 'Pham', 'Admin', 'MBA', 4, 'Mon-Sat 9AM-4PM', 30000000.00); 

insert into Departments
values
('Cardiology'),
('Neurology'),
('Pediatrics'),
('Emergency');

insert into Appointments 
values
(1, 1, '2024-08-11 13:00:00', 'General Checkup'),
(2, 2, '2024-08-12 14:00:00', 'Consulation'),
(3, 3, '2024-08-14 09:00:00', 'General Checkup'),
(1, 2, '2024-08-18 10:00:00', 'Emergency treatment');

insert into Treatment_Records
values
(1, 1, '2024-08-11', 'General examination'),
(2, 2, '2024-08-12', 'Health consulation'),
(3, 3, '2024-08-14', 'General examination'),
(4, 4, '2024-08-18', 'Emergency care');

insert into Staff_Job_History
values 
(1, 'Cardiologist', 40000000.00, 1, '2019-01-06'),
(2, 'Neurologist', 35000000.00, 2, '2020-05-07'),
(3, 'Head nurse', 20000000.00, 3, '2021-05-05'),
(4, 'Associate Administration', 30000000.00, 4, '2021-05-05');

-- 3. Indexing

alter table Patients
add index idx_patient_name (First_Name, Last_Name);

alter table Satffs
add index idx_staff_department (Department_Id);

alter table Appointments
add index idx_appointment_date (Date_Time);


-- 4. Stored procedures & transaction management

-- Patient
-- Add new patient
DELIMITER //
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
DELIMITER ;

-- Find patient by name or ID
DELIMITER //
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
DELIMITER ;

-- Add treatment
DELIMITER //
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
DELIMITER ;

-- Staff
-- Add staff
DELIMITER //
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
DELIMITER ;

-- List the staff by department
DELIMITER //
create procedure SP_ListSatffByDepartment (
	in DepartmentId int
)
begin 
    select * from Staffs where Department_Id = DepartmentId;
end //
DELIMITER ;

-- List staff by name
DELIMITER //
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
DELIMITER ;
    
-- Update staff info
DELIMITER //
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
DELIMITER ;

-- View staff's schedule
DELIMITER //
create procedure SP_ViewStaffSchedule (
	in StaffId int
)
begin
	select * from Appointments
    where Staff_Id = StaffId
    order by Date_Time;
end //
DELIMITER ;
    
-- Update staff's schedule
Delimiter //
create procedure SP_UpdateStaffSchedule (
    in StaffId int,
    in AppointmentId int,
    in NewDate_Time datetime
)
begin
    declare Appointment_Count int;

    start transaction;

    select count(*) into Appointment_count
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
DELIMITER ;

-- Appointment
-- Schedule an appointment
DELIMITER //
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
DELIMITER ;

-- Cancel Appointment
DELIMITER //
create procedure SP_CancelAppoinment (
	in AppointmentId int
)
begin 
	delete from Appointments where Appointment_Id = AppointmentId;
end //
DELIMITER ;


    
    
    


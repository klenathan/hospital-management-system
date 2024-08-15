create database hospital_management;

use hospital_management;

-- 1. CREATE TABLE
create table
    Patients (
        `id` int AUTO_INCREMENT PRIMARY KEY,
        First_Name varchar(100),
        Last_Name varchar(100),
        DOB date,
        Contact_Info varchar(255),
        Address varchar(255),
        Allergies TEXT
    );

create table
    Staffs (
        `id` int AUTO_INCREMENT PRIMARY KEY,
        First_Name varchar(100),
        Last_Name varchar(100),
        Job_Type ENUM ('Doctor', 'Nurse', 'Admin'),
        Qualifications text,
        deparment_id int,
        Schedule text,
        Salary decimal(10, 2),
        FOREIGN KEY (department_id) REFERENCES Departments (id)
    );

create table
    Departments (
        `id` int AUTO_INCREMENT PRIMARY KEY,
        Department_Name varchar(100)
    );

create table
    Appointments (
        `id` int AUTO_INCREMENT PRIMARY KEY,
        patient_id int,
        staff_id int,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        Purpose TEXT,
        FOREIGN KEY (Patient_id) REFERENCES Patients (id),
        FOREIGN KEY (staff_id) REFERENCES Staffs (id)
    );

create table
    Treatment_Records (
        Treatment_id int AUTO_INCREMENT PRIMARY KEY,
        patient_id int,
        staff_id int,
        Treatment_Date date,
        Treatment_Details text,
        FOREIGN KEY (patient_id) REFERENCES Patients (id),
        FOREIGN KEY (staff_id) REFERENCES Staffs (id)
    );

create table
    Staff_Job_History (
        History_id int AUTO_INCREMENT PRIMARY KEY,
        Staff_id int,
        Job_Type varchar(100),
        Salary decimal(10, 2),
        Department_id int,
        Start_Date date,
        FOREIGN KEY (Staff_id) REFERENCES Staffs (Staff_id),
        FOREIGN KEY (Department_id) REFERENCES Departments (Department_id)
    );

-- 3. Indexing
alter table Patients add index idx_patient_name (First_Name, Last_Name);

alter table Satffs add index idx_staff_department (Department_id);

alter table Appointments add index idx_appointment_date (Date_Time);

-- 4. Stored procedures & transaction management
-- Patient
-- Add new patient
DELIMITER / / create procedure SP_RegisterNewPatient (
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

end / / DELIMITER;

-- Find patient by name or ID
DELIMITER / / create procedure SP_SearchPatientByNameOrid (in Patientid int, in Patient_Name varchar(50)) begin if Patientid is not null then
select
    *
from
    Patients
where
    Patient_id = Patientid;

else
select
    *
from
    Patients
where
    First_Name like ('%', Patient_Name, '%')
    or Last_Name like ('%', Patient_Name, '%');

end if;

end / / DELIMITER;

-- Add treatment
DELIMITER / / create procedure SP_AddTreatment (
    in Patientid int,
    in Staffid int,
    in TreatmentDate date,
    in TreatmentDetails text
) begin start transaction;

insert into
    Treatment_Records (
        Patient_id,
        Staff_id,
        Treatment_Date,
        Treatment_Details
    )
values
    (
        Patientid,
        Staffid,
        TreatmentDate,
        TreatmentDetails
    );

commit;

end / / DELIMITER;

-- Staff
-- Add staff
DELIMITER / / create procedure SP_AddStaff (
    in Full_Name varchar(50),
    in Last_Name varchar(50),
    in Job_Type varchar(50),
    in Qualification text,
    in Salary decimal(10, 2),
    in Department_id int,
    in Schedule text
) begin start transaction;

insert into
    Staffs (
        First_Name,
        Last_Name,
        Job_Type,
        Qualification,
        Salary,
        Department_id,
        Schedule
    )
values
    (
        First_Name,
        Last_Name,
        Job_Type,
        Qualification,
        Salary,
        Department_id,
        Schedule
    );

-- Also save information to Staff_Job_History 
insert into
    Staff_Job_History (
        Staff_id,
        Job_Type,
        Salary,
        Department_id,
        Start_Date
    )
values
    (
        Insertid (),
        Job_Type,
        Salary,
        Department_id,
        current_date()
    );

commit;

end / / DELIMITER;

-- List the staff by department
DELIMITER / / create procedure SP_ListSatffByDepartment (in Departmentid int) begin
select
    *
from
    Staffs
where
    Department_id = Departmentid;

end / / DELIMITER;

-- List staff by name
DELIMITER / / create procedure SP_ListStaffByName (in p_order varchar(4)) begin if p_order = 'ASC' then
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

end / / DELIMITER;

-- Update staff info
DELIMITER / / create procedure SP_UpdateStaffInfo (
    in Staffid int,
    in JobType varchar(50),
    in salary decimal(10, 2),
    in Departmentid int
) begin start transaction;

update Staffs
set
    Job_Type = JobType,
    Salary = salary,
    Department_id = Departmentid
where
    Staff_id = Staffid;

-- Also save information to Staff_Job_History
insert into
    Staff_Job_History (
        Staff_id,
        Job_Type,
        Salary,
        Department_id,
        Start_Date
    )
values
    (
        Staffid,
        JobType,
        salary,
        Departmentid,
        current_date()
    );

commit;

end / / DELIMITER;

-- View staff's schedule
DELIMITER / / create procedure SP_ViewStaffSchedule (in Staffid int) begin
select
    *
from
    Appointments
where
    Staff_id = Staffid
order by
    Date_Time;

end / / DELIMITER;

-- Update staff's schedule
Delimiter / / create procedure SP_UpdateStaffSchedule (
    in Staffid int,
    in Appointmentid int,
    in NewDate_Time datetime
) begin declare Appointment_Count int;

start transaction;

select
    count(*) into Appointment_Count
from
    Appointments
where
    Staff_id = Staffid
    and Date_Time = NewDate_Time
    and Appointment_id != Appointmentid;

if Appointment_Count = 0 then
update Appointments
set
    Date_Time = NewDate_Time
where
    Appointment_id = Appointmentid;

commit;

else rollback;

end if;

end / / DELIMITER;

-- Appointment
-- Schedule an appointment
DELIMITER / / create procedure SP_BookAppointment (
    in Patientid int,
    in Staffid int,
    in DateTime datetime,
    in purpose text
) begin declare Apointment_Count int;

start transaction;

select
    count(*) into Appointment_Count
from
    Appointments
where
    Staff_id = Staffid
    and Date_Time = DateTime;

-- TODO: Handle not same time frame
if Appointment_Count = 0 then
insert into
    Appointments (Patient_id, Staff_id, Date_Time, Purpose)
values
    (Patientid, Staffid, DateTime, purpose);

commit;

else rollback;

end if;

end / / DELIMITER;

-- Cancel Appointment
DELIMITER / / create procedure SP_CancelAppoinment (in Appointmentid int) begin
delete from Appointments
where
    Appointment_id = Appointmentid;

end / / DELIMITER;
-- 4. Stored procedures & transaction management
-- Patient
-- Add new patient
CREATE PROCEDURE SP_RegisterNewPatient (
    IN First_Name varchar(50),
    IN Last_Name varchar(50),
    IN DOB date,
    IN Contact_Info varchar(255),
    IN Address varchar(255),
    IN Allergies text
) BEGIN
INSERT INTO patients (
        first_name,
        last_name,
        date_of_birth,
        contact_info,
        address,
        allergies
    )
VALUES (
        First_Name,
        Last_Name,
        DOB,
        Contact_Info,
        Address,
        Allergies
    );

END;

-- Find patient by name or ID -> split into 2 procedures
CREATE PROCEDURE SP_SearchPatientByName (IN Patient_Name varchar(50)) BEGIN
SELECT *
FROM patients
WHERE patients.first_name LIKE ('%', Patient_Name, '%')
    OR patients.last_name LIKE ('%', Patient_Name, '%');

END;

CREATE PROCEDURE SP_SearchPatientById (IN Patient_Id int) BEGIN
SELECT *
FROM patients
WHERE patients.id = Patient_Id;

END;

-- Add treatment -> ok
CREATE PROCEDURE SP_AddTreatment (
    IN Patient_Id int,
    IN Staff_Id int,
    IN Treatment_Date date,
    IN Treatment_Details text
) BEGIN
INSERT INTO treatments (
        patient_id,
        staff_id,
        treatment_date,
        treatment_details
    )
VALUES (
        Patient_Id,
        Staff_Id,
        Treatment_Date,
        Treatment_Details
    );

END;

-- Staff
-- Add staff
CREATE PROCEDURE SP_AddStaff (
    IN First_Name varchar(50),
    IN Last_Name varchar(50),
    IN Job_Type ENUM ('Doctor', 'Nurse', 'Admin'),
    IN Qualification text,
    IN Department_Id int,
    IN Salary decimal(10, 2)
) BEGIN START transaction;

INSERT INTO staffs (
        first_name,
        last_name,
        job_type,
        qualification,
        deparment_id,
        salary
    )
VALUES (
        First_Name,
        Last_Name,
        Job_Type,
        Qualification,
        Department_Id,
        Salary
    );

-- Also save information to Staff_Job_History 
INSERT INTO staff_job_history (staff_id, job_type, salary, department_id)
VALUES (InsertId (), Job_Type, Salary, Department_Id);

COMMIT;

END;

-- List the staff by department
CREATE PROCEDURE SP_ListStaffByDepartment (IN Department_Id int) BEGIN
SELECT *
FROM staffs
WHERE staffs.department_id = Department_Id;

END;

-- List staff by name
CREATE PROCEDURE SP_ListStaffByName (IN p_order varchar(4)) BEGIN IF p_order = 'ASC' THEN
SELECT *
FROM staffs
ORDER BY staffs.first_name,
    staffs.last_name ASC;

ELSE
SELECT *
FROM staffs
ORDER BY staffs.first_name,
    staffs.last_name DESC;

END IF;

END;

-- Update staff info
CREATE PROCEDURE SP_UpdateStaffInfo (
    IN Staff_Id int,
    IN Job_Type enum ('Doctor', 'Nurse', 'Admin'),
    IN Salary decimal(10, 2),
    IN Department_Id int
) BEGIN START transaction;

UPDATE staffs
SET staffs.job_type = Job_Type,
    staffs.salary = Salary,
    staffs.department_id = Department_Id
WHERE staffs.id = Staff_Id;

-- Also save information to Staff_Job_History
INSERT INTO Staff_Job_History (staff_id, job_type, salary, department_id)
VALUES (Staff_Id, Job_Type, Salary, Department_Id);

COMMIT;

END;

-- View staff's schedule
CREATE PROCEDURE SP_ViewStaffSchedule (IN Staff_Id int) BEGIN
SELECT *
FROM appointments
WHERE appointments.staff_id = Staff_Id
ORDER BY appointments.start_time;

END;

-- Update staff's schedule
CREATE PROCEDURE SP_UpdateStaffSchedule (
    IN Staff_Id int,
    IN Appointment_Id int,
    IN NewDate_Time datetime
) BEGIN
DECLARE Appointment_Count int;

START transaction;

SELECT COUNT(*) INTO Appointment_Count
FROM appointments
WHERE appointments.staff_id = Staff_Id
    AND appointments.start_time = NewDate_Time
    AND appointments.id != Appointment_Id;

IF Appointment_Count = 0 THEN
UPDATE appointments
SET appointments.start_time = NewDate_Time
WHERE appointments.id = Appointment_Id;

COMMIT;

ELSE ROLLBACK;

END IF;

END;

-- Appointment
-- Schedule an appointment
CREATE PROCEDURE SP_BookAppointment (
    IN Patient_Id int,
    IN Staff_Id int,
    IN DateTime datetime,
    IN purpose text
) BEGIN
DECLARE Apointment_Count int;

START transaction;

SELECT COUNT(*) INTO Appointment_Count
FROM appointments
WHERE appointments.staff_id = Staff_Id
    AND appointments.start_time = DateTime;

IF Appointment_Count = 0 THEN
INSERT INTO appointments (patient_id, staff_id, start_time, purpose)
VALUES (Patient_Id, Staff_Id, DateTime, Purpose);

COMMIT;

ELSE ROLLBACK;

END IF;

END;

-- Cancel Appointment
CREATE PROCEDURE SP_CancelAppoinment (IN Appointment_Id int) BEGIN
DELETE FROM appointments
WHERE appointments.id = Appointment_Id;

END;

-- MỚI ADD
-- View working schedule of all doctors for a given duration (with busy or available status)
CREATE PROCEDURE SP_ViewDoctorsSchedule (IN Start_Date datetime, IN End_Date datetime) BEGIN
SELECT staffs.id,
    staffs.first_name,
    staffs.last_name,
    appointments.start_time,
    appointments.end_time,
    CASE
        WHEN appointments.start_time IS NULL THEN 'available'
        ELSE 'busy'
    END AS STATUS
FROM staffs
    LEFT JOIN appointments ON staffs.id = appointments.staff_id
WHERE staffs.job_type = 'Doctor'
    AND appointments.start_time BETWEEN Start_Date AND End_Date
ORDER BY 3,
    2,
    4;

END;

-- Report
-- View a patient treatment history for a given duration
CREATE PROCEDURE SP_ViewPatientTreatmentHistoryInDuration (
    IN Patient_Id int,
    IN Start_Date date,
    IN End_Date date
) BEGIN
SELECT *
FROM treatments
WHERE treatments.patient_id = Patient_Id
    AND treatments.treatment_date BETWEEN Start_Date AND End_Date;

END;

-- View all patient treatment in a given duration\
CREATE PROCEDURE SP_ViewAllPatientTreatments (IN Start_Date date, IN End_Date date) BEGIN
SELECT *
FROM treatments
WHERE treatments.treatment_date BETWEEN Start_Date AND End_Date;

END;

-- View job change history of a staff
CREATE PROCEDURE SP_ViewStaffJobChangeHistory (IN Staff_Id int) BEGIN
SELECT *
FROM staff_job_history
WHERE staff_job_history.staff_id = Staff_Id
ORDER BY staff_job_history.created_at DESC;

END;

-- View the work of a doctor in a given duration
CREATE PROCEDURE SP_ViewDoctorWorkInDuration (
    IN Doctor_Id int,
    IN Start_Date date,
    IN End_Date date
) BEGIN
SELECT 'Appointments' AS WORK,
    appointments.start_time,
    appointments.end_time,
    appointments.purpose
FROM appointments
WHERE appointments.staff_id = Doctor_Id
    AND appointments.start_time BETWEEN Start_Date AND End_Date
UNION ALL
SELECT 'Treatments' AS WORK,
    treatments.treatment_date,
    treatmennts.treatment_details
FROM treatments
WHERE treatments.staff_id = Doctor_Id
    AND treatments.treatment_date BETWEEN Start_Dare AND End_Date;

END;

-- View the work of all doctors in a given duration
CREATE PROCEDURE SP_ViewAllDoctorsWorkInDuration (IN Start_Date date, IN End_Date date) BEGIN
SELECT 'Appointments' AS WORK,
    staffs.first_name,
    staffs.last_name,
    appointments.start_time,
    appointments.end_time,
    appointments.purpose
FROM appointments
    JOIN staffs ON appointments.staff_id = staffs.id
WHERE staffs.job_type = 'Doctor'
    AND appointments.start_time BETWEEN Start_Date AND End_Date
UNION ALL
SELECT 'Treatments' AS WORK,
    staffs.first_name,
    staffs.last_name,
    treatments.treatment_date,
    treatments.treatment_details
FROM treatments
    JOIN staffs ON treatments.staff_id = staffs.id
WHERE staffs.job_type = 'Doctor'
    AND treatments.treatment_date BETWEEN Start_Date AND End_Date;

END;
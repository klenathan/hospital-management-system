-- Use function for return the status of function (SUCCESS | FAIL)
-- Add new patient
CREATE PROCEDURE SP_RegisterNewPatient (
    IN First_Name varchar(50),
    IN Last_Name varchar(50),
    IN date_of_birth date,
    IN Contact_Info varchar(255),
    IN Address varchar(255),
    IN Allergies text
) BEGIN START transaction;

INSERT INTO Patients (
        First_Name,
        Last_Name,
        date_of_birth,
        Contact_Info,
        Address,
        Allergies
    )
VALUES (
        First_Name,
        Last_Name,
        date_of_birth,
        Contact_Info,
        Address,
        Allergies
    );

COMMIT;

END;

-- Add treatment -> (Only doctor can add, change to function using transaction)
CREATE PROCEDURE SP_AddTreatment (
    IN Patient_Id int,
    IN Staff_Id int,
    IN Treatment_Date date,
    IN Treatment_Details text
) BEGIN
DECLARE Staff_Job_Type enum ('Doctor', 'Nurse', 'Admin');

SELECT job_type INTO Staff_Job_Type
FROM staffs
WHERE staffs.id = Staff_Id;

IF Staff_Job_Type = 'Doctor' THEN START transaction;

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

COMMIT;

ELSE ROLLBACK;

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

-- Cancel Appointment (SOFT DELETE AND CHECK DOCTOR FOR SAVE)
CREATE PROCEDURE SP_CancelAppoinment (IN Appointment_Id int) BEGIN
DECLARE Staff_Job_Type enum ('Doctor', 'Nurse', 'Admin');

SELECT staffs.job_type INTO Staff_Job_Type
FROM appointments
    JOIN staffs ON appointments.staff_id = staffs.id
WHERE appointments.id = Appointment_Id;

IF Staff_Job_Type = 'Doctor' THEN
UPDATE appointments
SET appointments.deleted = 1
WHERE appointments.id = Appointment_Id;

SELECT 'success' AS STATUS;

ELSE
SELECT 'fail' AS STATUS;

END IF;

END;
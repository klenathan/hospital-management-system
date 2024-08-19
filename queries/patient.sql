DELIMITER $$

CREATE PROCEDURE P_RegisterNewPatient (
    IN First_Name VARCHAR(50),
    IN Last_Name VARCHAR(50),
    IN date_of_birth DATE,
    IN Contact_Info VARCHAR(255),
    IN Address VARCHAR(255),
    IN Allergies text
) BEGIN START TRANSACTION;

INSERT INTO patients (
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

END $$

CREATE PROCEDURE P_SearchPatientById (IN patient_id int) BEGIN
SELECT *
FROM patients
WHERE `id` = patient_id
    AND deleted = 0;

END $$

CREATE PROCEDURE P_SearchPatitentByName (IN Patient_Name varchar(100)) BEGIN
SELECT *
FROM patients p
WHERE MATCH (p.first_name, p.last_name) AGAINST (Patient_Name IN BOOLEAN MODE)
    AND p.deleted = 0;

END $$

CREATE PROCEDURE P_AddTreatment (
    IN Patient_Id INT,
    IN Staff_Id INT,
    IN Treatment_Date DATE,
    IN Treatment_Details text
) BEGIN
SET @is_doctor = (
        CASE
            WHEN (
                SELECT job_type
                FROM staffs
                WHERE id = Staff_Id
            ) = 'Doctor' THEN TRUE
            ELSE FALSE
        END
    );

IF @is_doctor THEN START TRANSACTION;

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

ELSE SIGNAL SQLSTATE '2201R'
SET MESSAGE_TEXT = 'INVALID STAFF',
    MYSQL_ERRNO = 01004;

ROLLBACK;

END IF;

END $$
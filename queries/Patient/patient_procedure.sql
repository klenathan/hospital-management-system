-- Search by ID
CREATE PROCEDURE P_SearchPatientById (IN patient_id int) BEGIN
SELECT *
FROM Patients
WHERE `id` = patient_id
    AND deleted = 0;

END;

-- Search by name (exactly name)
CREATE FULLTEXT INDEX fx_name ON Patients (first_name, last_name);

CREATE PROCEDURE P_SearchPatitentByName (IN Patient_Name varchar(100)) BEGIN
SELECT *
FROM Patients p
WHERE MATCH (p.first_name, p.last_name) AGAINST (Patient_Name IN BOOLEAN MODE)
    AND p.deleted = 0;

END;
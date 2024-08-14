-- Active: 1723462847068@@127.0.0.1@3306@hospital_management
-- Search by ID
create procedure P_SearchPatientById (in patient_id int) begin
select
    *
from
    Patients
where
    `id` = patient_id
    AND deleted = 0;

end;

-- Search by name (exactly name)
CREATE FULLTEXT INDEX fx_name ON Patients (first_name, last_name);

CREATE PROCEDURE P_SearchPatitentByName (in Patient_Name varchar(100)) BEGIN
SELECT
    *
FROM
    Patients p
WHERE
    MATCH (p.first_name, p.last_name) AGAINST (Patient_Name IN BOOLEAN MODE)
    AND p.deleted = 0;

END;

EXPLAIN ANALYZE
SELECT
    *
FROM
    Patients p
WHERE
    MATCH (p.first_name, p.last_name) AGAINST ('victor' IN BOOLEAN MODE)
    AND p.deleted = 0;
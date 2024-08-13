-- Active: 1723462847068@@127.0.0.1@3306@hospital_management
create procedure P_SearchPatientById (in patient_id int) begin
select
    *
from
    Patients
where
    `id` = patient_id;

end;

alter table Patients add index idx_patient_name (First_Name, Last_Name);

CREATE FULLTEXT INDEX fx_name ON Patients (first_name, last_name);

CREATE PROCEDURE P_SearchPatitentByName (in Patient_Name varchar(100)) BEGIN
SELECT
    *
FROM
    Patients p
WHERE
    MATCH (p.first_name, p.last_name) AGAINST (Patient_Name IN BOOLEAN MODE);

END;
-- Active: 1723462847068@@127.0.0.1@3306@hospital_management
create procedure P_SearchPatientById (in patient_id int) begin
select
    *
from
    Patients
where
    `id` = patient_id;

end;

CALL `P_SearchPatientById` (1);

alter table Patients add index idx_patient_name (First_Name, Last_Name);

CREATE FULLTEXT INDEX fx_name ON Patients (first_name, last_name);

-- -> Filter: (match p.first_name,p.last_name against ('Duong' in boolean mode))  (cost=0.35 rows=1) (actual time=0.0166..0.0168 rows=1 loops=1)
-- -> Full-text index search on p using fx_name (first_name='Duong')  (cost=0.35 rows=1) (actual time=0.0155..0.0157 rows=1 loops=1)
create procedure P_SearchPatitentByName (in Patient_Name varchar(100)) begin
SELECT
    *
FROM
    Patients p
WHERE
    MATCH (p.first_name, p.last_name) AGAINST (Patient_Name IN BOOLEAN MODE);

end;
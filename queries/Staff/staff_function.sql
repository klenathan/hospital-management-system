CREATE FUNCTION S_InsertStaffJobHistory (
    userID int,
    j_type ENUM('Doctor', 'Nurse', 'Admin'),
    salary BIGINT,
    department_id INT
) RETURNS BOOL DETERMINISTIC BEGIN
INSERT INTO staff_job_history (
        staff_id,
        job_type,
        salary,
        department_id
    )
VALUES (
        userID,
        j_type,
        salary,
        department_id
    );

RETURN TRUE;

END;
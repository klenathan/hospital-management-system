-- View a patient treatment history for a given duration
-- View all patient treatment in a given duration
CREATE PROCEDURE R_ViewOneOrManyTreatmentHistoryByDuration (
    IN patientID INT,
    IN fromDate DATETIME,
    IN toDate DATETIME
)
BEGIN
    SELECT
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        s.first_name AS staff_first_name,
        s.last_name AS staff_last_name,
        s.job_type AS staff_job_type,
        t.treatment_date,
        t.treatment_details
    FROM
        treatments t
        LEFT JOIN `Patients` p ON p.id = t.patient_id AND p.deleted = 0
        LEFT JOIN staffs s ON s.id = t.staff_id AND s.deleted = 0
    WHERE
        t.treatment_date BETWEEN fromDate AND toDate
        AND (patientID IS NULL OR t.patient_id = patientID)
        AND t.deleted = 0;
END;

-- View job change history of a staff
CREATE PROCEDURE R_ViewOneJobChangeHistoryByID(in staffID int) Begin
SELECT * FROM staff_job_history sj WHERE staff_id = staffID AND sj.deleted = 0;
END;

-- View the work of a doctor in a given duration
-- View the work of all doctors in a given duration
CREATE PROCEDURE R_ViewOneOrManyDoctorWorkByDuration(in staffID int, in fromDate DATETIME, in toDate DATETIME) Begin
SELECT s.first_name, s.last_name, s.job_type, COUNT(a.id) as appointment_nums, COUNT(t.id) as treatment_nums
FROM staffs s
LEFT JOIN appointments a ON a.staff_id = s.id AND a.start_time <= toDate AND a.end_time >= fromDate AND a.deleted = 0
LEFT JOIN treatments t on t.staff_id = s.id AND t.treatment_date BETWEEN fromDate AND toDate AND t.deleted = 0
WHERE s.job_type = 'Doctor' AND (staffID IS NULL OR s.id = staffID) AND s.deleted = 0
GROUP BY s.id;
END;


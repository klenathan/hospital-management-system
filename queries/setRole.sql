CREATE ROLE doctor, nurse, adminStaff;

GRANT
SELECT ON hospital_management.appointments TO doctor, nurse, adminStaff;

GRANT
SELECT ON hospital_management.departments TO doctor, nurse, adminStaff;

GRANT
SELECT ON hospital_management.patients TO doctor, nurse, adminStaff;

GRANT
SELECT ON hospital_management.staff_job_history TO doctor, nurse, adminStaff;

GRANT
SELECT ON hospital_management.staffs TO doctor, nurse, adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_RegisterNewPatient TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_SearchPatientById TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_SearchPatitentByName TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_AddTreatment TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_BookAppointmentWithDoctor TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_CancelAppoinment TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_UpdateStaffSchedule TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.R_ViewOneJobChangeHistoryByID TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.R_ViewOneOrManyTreatmentHistoryByDuration TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.R_ViewOneOrManyDoctorWorkByDuration TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetAllDepartment TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetStaffByUsername TO doctor;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_RegisterNewPatient TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_SearchPatientById TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_SearchPatitentByName TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.P_AddTreatment TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_ViewDoctorScheduleByDuration TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_BookAppointmentWithDoctor TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.A_CancelAppoinment TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_UpdateStaffSchedule TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_ViewStaffScheduleByID TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.R_ViewOneOrManyTreatmentHistoryByDuration TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.R_ViewOneOrManyDoctorWorkByDuration TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetStaffByUsername TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetAllDepartment TO nurse;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_AddNewStaff TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_ListStaffByDepartmentID TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_ListStaffByName TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_UpdateStaffInfo TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_ViewStaffScheduleByID TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_UpdateStaffSchedule TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetStaffByUsername TO adminStaff;

GRANT
EXECUTE ON PROCEDURE hospital_management.S_GetAllDepartment TO adminStaff;
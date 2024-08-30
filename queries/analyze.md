# Analyze report

## Appointment

### A_BookAppointmentWithDoctor

```sql
EXPLAIN ANALYZE
SELECT s.id,
    s.first_name,
    s.last_name,
    s.job_type,
    s.department_id,
    s.deleted,
    IF(
        COUNT(a.id) > 0,
        TRUE,
        FALSE
    ) AS busy
FROM staffs s
    LEFT JOIN (
        SELECT *
        FROM appointments a
        WHERE a.deleted = 0
            AND a.start_time <= '2024-08-22'
            AND a.end_time >= '2024-08-20'
    ) a ON s.id = a.staff_id
WHERE s.job_type = 'Doctor'
    AND s.deleted = 0
GROUP BY s.id;

```

```yaml
-> Group aggregate: count(a.id)  (cost=45.7 rows=87) (actual time=0.109..0.205 rows=58 loops=1)
    -> Nested loop left join  (cost=37 rows=87) (actual time=0.0994..0.172 rows=58 loops=1)
        -> Index lookup on s using staff_del_job_idx (deleted=0, job_type='Doctor'), with index condition: (s.job_type = 'Doctor')  (cost=6.55 rows=58) (actual time=0.0877..0.0984 rows=58 loops=1)
        -> Filter: ((a.deleted = 0) and (a.start_time <= '2024-08-22') and (a.end_time >= '2024-08-20'))  (cost=0.378 rows=1.5) (actual time=0.00107..0.00107 rows=0 loops=58)
            -> Index lookup on a using staff_id (staff_id=s.id)  (cost=0.378 rows=1.5) (actual time=866e-6..895e-6 rows=0.0517 loops=58)
```

### A_BookAppointmentWithDoctor

```sql
EXPLAIN ANALYZE
SELECT COUNT(*)
FROM appointments ap
    JOIN staffs s ON s.id = ap.staff_id
    AND s.deleted = 0
WHERE ap.staff_id = 4
    AND ap.start_time < '2024-08-10 09:40:00'
    AND ap.end_time > '2024-08-10 07:00:00'
    AND s.job_type = 'Doctor'
    AND ap.deleted = 0;
```

```yaml
-> Aggregate: count(0)  (cost=0.567 rows=1) (actual time=0.0186..0.0187 rows=1 loops=1)
    -> Filter: ((ap.deleted = 0) and (ap.start_time < TIMESTAMP'2024-08-10 09:40:00') and (ap.end_time > TIMESTAMP'2024-08-10 07:00:00'))  (cost=0.533 rows=0.333) (actual time=0.0155..0.0164 rows=1 loops=1)
        -> Index lookup on ap using staff_id (staff_id=4)  (cost=0.533 rows=2) (actual time=0.0119..0.0138 rows=2 loops=1)

```

### A_CancelAppoinment

```sql
  SELECT job_type
                FROM staffs s
                    JOIN appointments a ON a.staff_id = s.id
                WHERE a.id = appointment_Id
```

```yaml
-> Rows fetched before execution  (cost=0..0 rows=1) (actual time=0..100e-6 rows=1 loops=1)
```

## Patitents

### P_SearchPatientById

```sql
SELECT *
FROM patients
WHERE `id` = patient_id
    AND deleted = 0;
```

```yaml
-> Rows fetched before execution  (cost=0..0 rows=1) (actual time=0..0 rows=1 loops=1)
```

### P_SearchPatitentByName

```yaml
-> Filter:
  ((p.deleted = 0) and (match p.first_name,p.last_name against ('Victor' in boolean mode)))  (cost=1.1 rows=1) (actual time=0.686..0.687 rows=1 loops=1)
  -> Full-text index search on p using fx_name (first_name='Victor')  (cost=1.1 rows=1) (actual time=0.684..0.684 rows=1 loops=1)
```

## Reports

### R_ViewOneOrManyTreatmentHistoryByDuration

#### One

```sql
SELECT p.first_name AS patient_first_name,
    p.last_name AS patient_last_name,
    s.first_name AS staff_first_name,
    s.last_name AS staff_last_name,
    s.job_type AS staff_job_type,
    t.treatment_date,
    t.treatment_details
FROM treatments t
    JOIN `patients` p ON p.id = t.patient_id
    AND p.deleted = 0
    JOIN staffs s ON s.id = t.staff_id
    AND s.deleted = 0
WHERE t.treatment_date BETWEEN fromDate AND toDate
    AND (
     t.patient_id = patientID
    )
    AND t.deleted = 0;
```

```yaml
-> Nested loop inner join  (cost=0.7 rows=1) (actual time=0.0152..0.0152 rows=0 loops=1)
    -> Filter: ((t.deleted = 0) and (t.treatment_date between '2024-08-10 07:00:00' and '2024-08-10 09:40:00') and (t.staff_id is not null))  (cost=0.35 rows=1) (actual time=0.0147..0.0147 rows=0 loops=1)
        -> Index lookup on t using patient_id (patient_id=1)  (cost=0.35 rows=1) (actual time=0.0076..0.0105 rows=1 loops=1)
    -> Filter: (s.deleted = 0)  (cost=0.35 rows=1) (never executed)
        -> Single-row index lookup on s using PRIMARY (id=t.staff_id)  (cost=0.35 rows=1) (never executed)

```

#### Many

```sql
SELECT p.first_name AS patient_first_name,
    p.last_name AS patient_last_name,
    s.first_name AS staff_first_name,
    s.last_name AS staff_last_name,
    s.job_type AS staff_job_type,
    t.treatment_date,
    t.treatment_details
FROM treatments t
    JOIN `patients` p ON p.id = t.patient_id
    AND p.deleted = 0
    JOIN staffs s ON s.id = t.staff_id
    AND s.deleted = 0
WHERE t.treatment_date BETWEEN fromDate AND toDate
    AND t.deleted = 0;
```

```yaml
-> Nested loop inner join  (cost=6.3 rows=4) (actual time=0.0275..0.0275 rows=0 loops=1)
    -> Nested loop inner join  (cost=2.3 rows=4) (actual time=0.0271..0.0271 rows=0 loops=1)
        -> Filter: ((t.treatment_date between '2024-08-10 07:00:00' and '2024-08-10 09:40:00') and (t.staff_id is not null) and (t.patient_id is not null))  (cost=0.9 rows=4) (actual time=0.0265..0.0265 rows=0 loops=1)
            -> Index lookup on t using treatments_del_idx (deleted=0)  (cost=0.9 rows=4) (actual time=0.0128..0.02 rows=4 loops=1)
        -> Filter: (s.deleted = 0)  (cost=0.275 rows=1) (never executed)
            -> Single-row index lookup on s using PRIMARY (id=t.staff_id)  (cost=0.275 rows=1) (never executed)
    -> Filter: (p.deleted = 0)  (cost=0.925 rows=1) (never executed)
        -> Single-row index lookup on p using PRIMARY (id=t.patient_id)  (cost=0.925 rows=1) (never executed)
```

### R_ViewOneJobChangeHistoryByID

```sql
SELECT *
FROM staff_job_history sj
WHERE staff_id = staffID
    AND sj.deleted = 0;
```

```yaml
-> Filter:
  (sj.deleted = 0)  (cost=1.1 rows=1) (actual time=0.172..0.173 rows=1 loops=1)
  -> Index lookup on sj using staff_id (staff_id=1)  (cost=1.1 rows=1) (actual time=0.171..0.172 rows=1 loops=1)
```

### R_ViewOneOrManyDoctorWorkByDuration

```sql
SELECT s.first_name,
    s.last_name,
    s.job_type,
    COUNT(a.id) AS appointment_nums,
    COUNT(t.id) AS treatment_nums
FROM staffs s
    LEFT JOIN appointments a ON a.staff_id = s.id
    AND a.start_time <= '2024-08-10 09:40:00'
    AND a.end_time >= '2024-08-10 07:00:00'
    AND a.deleted = 0
    LEFT JOIN treatments t ON t.staff_id = s.id
    AND t.treatment_date BETWEEN '2024-08-10 07:00:00' AND '2024-08-10 09:40:00'
    AND t.deleted = 0
WHERE s.job_type = 'Doctor'
    AND s.id = 3
    AND s.deleted = 0
GROUP BY s.id;
```

```yaml
-> Group aggregate: count(a.id), count(t.id)  (cost=0.8 rows=1) (actual time=0.0242..0.0242 rows=1 loops=1)
    -> Nested loop left join  (cost=0.7 rows=1) (actual time=0.0222..0.0224 rows=1 loops=1)
        -> Nested loop left join  (cost=0.35 rows=1) (actual time=0.0153..0.0154 rows=1 loops=1)
            -> Rows fetched before execution  (cost=0..0 rows=1) (actual time=0..100e-6 rows=1 loops=1)
            -> Filter: ((a.deleted = 0) and (a.start_time <= '2024-08-10 09:40:00') and (a.end_time >= '2024-08-10 07:00:00'))  (cost=0.35 rows=1) (actual time=0.0144..0.0144 rows=0 loops=1)
                -> Index lookup on a using staff_id (staff_id=3)  (cost=0.35 rows=1) (actual time=0.0094..0.0107 rows=1 loops=1)
        -> Filter: ((t.deleted = 0) and (t.treatment_date between '2024-08-10 07:00:00' and '2024-08-10 09:40:00'))  (cost=0.35 rows=1) (actual time=0.0058..0.0058 rows=0 loops=1)
            -> Index lookup on t using staff_id (staff_id=3)  (cost=0.35 rows=1) (actual time=0.0035..0.0041 rows=1 loops=1)

```

## Staff

### S_ListStaffByDepartmentID

```sql
SELECT *
FROM staffs s
    JOIN departments d ON d.id = s.department_id
    AND d.deleted = 0
WHERE s.department_id = departmentID
    AND s.deleted = 0;
```

```yaml
-> Index lookup on s using staff_depIdx_del_idx (department_id=2, deleted=0)  (cost=4.05 rows=33) (actual time=0.0137..0.0947 rows=33 loops=1)
```

### S_ListStaffByName

```sql
SELECT *
FROM staffs s
WHERE s.deleted = 0
ORDER BY s.first_name ASC,
    s.last_name ASC;
```

```yaml
-> Sort: s.first_name, s.last_name  (cost=16.4 rows=161) (actual time=0.405..0.464 rows=167 loops=1)
    -> Filter: (s.deleted = 0)  (cost=16.4 rows=161) (actual time=0.0179..0.248 rows=167 loops=1)
        -> Table scan on s  (cost=16.4 rows=161) (actual time=0.0168..0.229 rows=167 loops=1)
```

### S_ViewStaffScheduleByID

```sql
SELECT s.*,
a.id as appoimentId,
    a.purpose,
    a.start_time,
    a.end_time,
FROM appointments a
    LEFT JOIN staffs s ON s.id = a.staff_id
    AND s.deleted = 0
WHERE s.id = staff_id
    AND a.deleted = 0;
```

```yaml
-> Filter:
  (a.deleted = 0)  (cost=0.35 rows=1) (actual time=0.008..0.0107 rows=1 loops=1)
  -> Index lookup on a using staff_id (staff_id=1)  (cost=0.35 rows=1) (actual time=0.0073..0.01 rows=1 loops=1)
```

```sql
SELECT COUNT(*)
FROM appointments
WHERE appointments.staff_id = Staff_Id
    AND appointments.start_time < '2024-08-10 09:43:00'
    AND appointments.end_time > '2024-08-10 09:40:00'
    AND appointments.id != 2;
```

```yaml
-> Aggregate: count(0)  (cost=1.6 rows=1) (actual time=0.0221..0.0222 rows=1 loops=1)
    -> Filter: ((appointments.staff_id = appointments.staff_id) and (appointments.start_time < TIMESTAMP'2024-08-10 09:43:00') and (appointments.end_time > TIMESTAMP'2024-08-10 09:40:00') and (appointments.id <> 2))  (cost=1.51 rows=0.833) (actual time=0.0213..0.0213 rows=0 loops=1)
        -> Index range scan on appointments using PRIMARY over (id < 2) OR (2 < id)  (cost=1.51 rows=5) (actual time=0.0109..0.0176 rows=5 loops=1)

```

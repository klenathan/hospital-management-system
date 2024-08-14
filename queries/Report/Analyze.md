# Report analyze report

## View all patient treatment in a given duration

```
-> Nested loop inner join  (cost=1.3 rows=1) (actual time=0.0331..0.041 rows=2 loops=1)
    -> Nested loop inner join  (cost=0.95 rows=1) (actual time=0.0284..0.0338 rows=2 loops=1)
        -> Filter: ((t.treatment_date between '2024-08-14' and '2024-09-12') and (t.staff_id is not null) and (t.patient_id is not null))  (cost=0.6 rows=1) (actual time=0.0216..0.0246 rows=2 loops=1)
            -> Index lookup on t using treatments_del_idx (deleted=0)  (cost=0.6 rows=4) (actual time=0.0117..0.0186 rows=4 loops=1)
        -> Filter: (s.deleted = 0)  (cost=0.35 rows=1) (actual time=0.00395..0.004 rows=1 loops=2)
            -> Single-row index lookup on s using PRIMARY (id=t.staff_id)  (cost=0.35 rows=1) (actual time=0.00335..0.0034 rows=1 loops=2)
    -> Filter: (p.deleted = 0)  (cost=0.35 rows=1) (actual time=0.00315..0.00325 rows=1 loops=2)
        -> Single-row index lookup on p using PRIMARY (id=t.patient_id)  (cost=0.35 rows=1) (actual time=0.003..0.0031 rows=1 loops=2)

```

## View a patient treatment history for a given duration and

```
-> Nested loop inner join  (cost=0.363 rows=0.25) (actual time=0.014..0.014 rows=0 loops=1)
    -> Filter: ((t.deleted = 0) and (t.treatment_date between '2024-08-14' and '2024-09-12') and (t.staff_id is not null))  (cost=0.275 rows=0.25) (actual time=0.0132..0.0132 rows=0 loops=1)
        -> Index lookup on t using patient_id (patient_id=1)  (cost=0.275 rows=1) (actual time=0.0068..0.0094 rows=1 loops=1)
    -> Filter: (s.deleted = 0)  (cost=0.65 rows=1) (never executed)
        -> Single-row index lookup on s using PRIMARY (id=t.staff_id)  (cost=0.65 rows=1) (never executed)

```

## View job change history of a staff

```
-> Filter: (sj.deleted = 0)  (cost=0.35 rows=1) (actual time=0.016..0.0173 rows=1 loops=1)
    -> Index lookup on sj using staff_id (staff_id=2)  (cost=0.35 rows=1) (actual time=0.0153..0.0166 rows=1 loops=1)
```

## View the work of all doctors in a given duration

```
-> Group aggregate: count(a.id), count(t.id)  (cost=1.7 rows=0.667) (actual time=0.0325..0.0325 rows=0 loops=1)
    -> Nested loop left join  (cost=1.63 rows=0.667) (actual time=0.0315..0.0315 rows=0 loops=1)
        -> Nested loop inner join  (cost=1.4 rows=0.5) (actual time=0.0309..0.0309 rows=0 loops=1)
            -> Index lookup on s using staff_del_job_idx (deleted=0, job_type='Doctor'), with index condition: (s.job_type = 'Doctor')  (cost=0.7 rows=2) (actual time=0.0169..0.0178 rows=2 loops=1)
            -> Filter: ((t.deleted = 0) and (t.treatment_date between '2024-08-11 12:03:00' and '2024-08-11 14:03:00'))  (cost=0.263 rows=0.25) (actual time=0.00615..0.00615 rows=0 loops=2)
                -> Index lookup on t using staff_id (staff_id=s.id)  (cost=0.263 rows=1) (actual time=0.00345..0.0042 rows=1 loops=2)
        -> Filter: ((a.deleted = 0) and (a.start_time <= '2024-08-11 14:03:00') and (a.end_time >= '2024-08-11 12:03:00'))  (cost=0.6 rows=1.33) (never executed)
            -> Index lookup on a using staff_id (staff_id=s.id)  (cost=0.6 rows=1.33) (never executed)

```

## View the work of a doctor in a given duration

```
-> Group aggregate: count(a.id), count(t.id)  (cost=0.5 rows=0.5) (actual time=0.0145..0.0145 rows=0 loops=1)
    -> Nested loop left join  (cost=0.45 rows=0.5) (actual time=0.0135..0.0135 rows=0 loops=1)
        -> Filter: ((t.deleted = 0) and (t.treatment_date between '2024-08-11 12:03:00' and '2024-08-11 14:03:00'))  (cost=0.275 rows=0.25) (actual time=0.0128..0.0128 rows=0 loops=1)
            -> Index lookup on t using staff_id (staff_id=2)  (cost=0.275 rows=1) (actual time=0.009..0.0103 rows=1 loops=1)
        -> Filter: ((a.deleted = 0) and (a.start_time <= '2024-08-11 14:03:00') and (a.end_time >= '2024-08-11 12:03:00'))  (cost=1.3 rows=2) (never executed)
            -> Index lookup on a using staff_id (staff_id=2)  (cost=1.3 rows=2) (never executed)


```

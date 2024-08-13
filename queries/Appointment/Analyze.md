# Appointment analysis report

## View working schedule of all doctors for a given duration (with busy or available status)

```
-> Nested loop inner join  (cost=1.63 rows=2.67) (actual time=0.0273..0.0355 rows=3 loops=1)
    -> Index lookup on s using staff_del_job_idx (deleted=0, job_type='Doctor'), with index condition: ((s.job_type = 'Doctor') and (s.id is not null))  (cost=0.7 rows=2) (actual time=0.0185..0.0196 rows=2 loops=1)
    -> Filter: (a.deleted = 0)  (cost=0.4 rows=1.33) (actual time=0.00495..0.007 rows=1.5 loops=2)
        -> Index lookup on a using staff_id (staff_id=s.id)  (cost=0.4 rows=1.33) (actual time=0.0046..0.0065 rows=1.5 loops=2)

```

# Staff analyze report

## List the staff by department

```
-> Nested loop inner join  (cost=2.3 rows=4) (actual time=0.0147..0.0266 rows=4 loops=1)
    -> Filter: (s.department_id is not null)  (cost=0.9 rows=4) (actual time=0.0092..0.0156 rows=4 loops=1)
        -> Index lookup on s using staff_del_idx (deleted=0)  (cost=0.9 rows=4) (actual time=0.0085..0.0146 rows=4 loops=1)
    -> Filter: (d.deleted = 0)  (cost=0.275 rows=1) (actual time=0.00228..0.00235 rows=1 loops=4)
        -> Single-row index lookup on d using PRIMARY (id=s.department_id)  (cost=0.275 rows=1) (actual time=0.00193..0.00195 rows=1 loops=4)
```

## List the staff by name (in ASC order)

```
-> Sort: s.first_name, s.last_name  (cost=0.9 rows=4) (actual time=0.0489..0.0505 rows=4 loops=1)
    -> Index lookup on s using staff_del_idx (deleted=0)  (cost=0.9 rows=4) (actual time=0.0198..0.0322 rows=4 loops=1)
```

## List the staff by name (in DESC order)

```
-> Sort: s.first_name, s.last_name DESC  (cost=0.9 rows=4) (actual time=0.0327..0.0338 rows=4 loops=1)
    -> Index lookup on s using staff_del_idx (deleted=0)  (cost=0.9 rows=4) (actual time=0.0128..0.021 rows=4 loops=1)
```

## View staff schedule by ID

```
-> Rows fetched before execution  (cost=0..0 rows=1) (actual time=100e-6..200e-6 rows=1 loops=1)
```

```
-> Aggregate: count(0)  (cost=1.19 rows=1) (actual time=0.0694..0.0694 rows=1 loops=1)
    -> Filter: ((ap.staff_id = 2) and (ap.start_time < TIMESTAMP'2024-08-18 10:01:00') and (ap.end_time > TIMESTAMP'2024-08-12 13:30:00') and (ap.id <> 2))  (cost=1.11 rows=0.75) (actual time=0.0366..0.0377 rows=1 loops=1)
        -> Index range scan on ap using PRIMARY over (id < 2) OR (2 < id)  (cost=1.11 rows=3) (actual time=0.0123..0.0185 rows=3 loops=1)


-> Aggregate: count(0)  (cost=1.19 rows=1) (actual time=0.0299..0.03 rows=1 loops=1)
    -> Filter: ((ap.deleted = 0) and (ap.staff_id = 2) and (ap.start_time < TIMESTAMP'2024-08-18 10:01:00') and (ap.end_time > TIMESTAMP'2024-08-12 13:30:00') and (ap.id <> 2))  (cost=1.11 rows=0.75) (actual time=0.0253..0.0272 rows=1 loops=1)
        -> Index range scan on ap using PRIMARY over (id < 2) OR (2 < id)  (cost=1.11 rows=3) (actual time=0.0146..0.0234 rows=3 loops=1)

```

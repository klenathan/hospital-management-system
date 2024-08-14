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

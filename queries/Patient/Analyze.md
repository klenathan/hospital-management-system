# Patients analyze report

## Search by ID

```
-> Rows fetched before execution (cost=0..0 rows=1) (actual time=100e-6..100e-6 rows=1 loops=1)
```

## Search by name (exactly name)

```
-> Filter: ((p.deleted = 0) and (match p.first_name,p.last_name against ('victor' in boolean mode)))  (cost=0.35 rows=1) (actual time=0.0187..0.0189 rows=1 loops=1)
    -> Full-text index search on p using fx_name (first_name='victor')  (cost=0.35 rows=1) (actual time=0.017..0.0172 rows=1 loops=1)

```

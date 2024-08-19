echo "" > ./migration/1-migration.sql
cat init_tables.sql >> ./migration/1-migration.sql
echo "\n\n" >> ./migration/1-migration.sql

echo "" > ./migration/2-migration-data.sql
cat seed_database.sql >> ./migration/2-migration-data.sql

cat staff.sql >> ./migration/1-migration.sql
echo "\n\n" >> ./migration/1-migration.sql

cat patient.sql >> ./migration/1-migration.sql
echo "\n\n" >> ./migration/1-migration.sql

cat appointment.sql >> ./migration/1-migration.sql
echo "\n\n" >> ./migration/1-migration.sql

cat report.sql >> ./migration/1-migration.sql
echo "\n\n" >> ./migration/1-migration.sql

cat setRole.sql >> ./migration/1-migration.sql
echo "\n\n" >> ./migration/1-migration.sql

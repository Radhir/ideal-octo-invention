docker exec eliteshine_db psql -U eliteshine_user -d eliteshine_erp -c "ALTER TABLE job_cards_jobcard ALTER COLUMN assigned_technician DROP NOT NULL;"
docker exec eliteshine_db psql -U eliteshine_user -d eliteshine_erp -c "ALTER TABLE job_cards_jobcard ALTER COLUMN service_advisor DROP NOT NULL;"
docker exec eliteshine_db psql -U eliteshine_user -d eliteshine_erp -c "UPDATE job_cards_jobcard SET assigned_technician = NULL, service_advisor = NULL;"

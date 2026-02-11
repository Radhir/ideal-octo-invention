docker exec eliteshine_db psql -U eliteshine_user -d eliteshine_erp -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'job_cards_jobcard';"

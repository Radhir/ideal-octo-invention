docker exec eliteshine_db psql -h localhost -U eliteshine_user -d eliteshine_erp -c "ALTER USER eliteshine_user WITH PASSWORD 'eliteshine_pass_2026';"
docker exec eliteshine_db sed -i 's/trust/scram-sha-256/g' /var/lib/postgresql/data/pg_hba.conf
docker restart eliteshine_db

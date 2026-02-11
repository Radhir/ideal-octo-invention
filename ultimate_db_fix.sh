docker exec eliteshine_db sh -c "echo 'local all all trust' > /var/lib/postgresql/data/pg_hba.conf"
docker exec eliteshine_db sh -c "echo 'host all all 0.0.0.0/0 trust' >> /var/lib/postgresql/data/pg_hba.conf"
docker restart eliteshine_db
sleep 15
docker exec eliteshine_db psql -U eliteshine_user -d eliteshine_erp -c "ALTER USER eliteshine_user WITH PASSWORD 'eliteshine_pass_2026';"

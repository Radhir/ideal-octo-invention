docker exec eliteshine_db psql -U eliteshine_user -d eliteshine_erp -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"

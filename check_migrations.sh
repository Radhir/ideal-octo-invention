docker exec eliteshine_db psql -U eliteshine_user -d eliteshine_erp -c "SELECT app, name, applied FROM django_migrations ORDER BY applied DESC LIMIT 10;"

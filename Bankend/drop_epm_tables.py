import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

tables = [
    'projects_projectforecast',
    'projects_projectbudget', 
    'projects_projectresource',
    'projects_projecttask',
    'projects_projectmilestone',
    'projects_project',
    'risk_management_incident',
    'risk_management_riskmitigationaction',
    'risk_management_risk'
]

for table in tables:
    try:
        cursor.execute(f'DROP TABLE IF EXISTS {table}')
        print(f'Dropped {table}')
    except Exception as e:
        print(f'Error dropping {table}: {e}')

conn.commit()
conn.close()
print('All old tables dropped successfully')

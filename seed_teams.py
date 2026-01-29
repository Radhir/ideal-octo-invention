import os
import django
import sys

# Setup Django environment
sys.path.append(r'r:\webplot\Bankend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from scheduling.models import WorkTeam

teams = [
    {'name': 'Team A', 'section': 'DETAILING', 'leader': 'JANSAID', 'capacity': 4},
    {'name': 'Team B', 'section': 'DETAILING', 'leader': 'DHIRAJ', 'capacity': 4},
    {'name': 'Team C', 'section': 'DETAILING', 'leader': 'SADDAM', 'capacity': 4},
    {'name': 'Team D', 'section': 'DETAILING', 'leader': 'MAMZUL', 'capacity': 4},
    {'name': 'Painting Team A', 'section': 'PAINTING', 'leader': 'Amir', 'capacity': 2},
    {'name': 'Painting Team B', 'section': 'PAINTING', 'leader': 'Imran', 'capacity': 2},
    {'name': 'PPF Team', 'section': 'PPF_WRAPPING', 'leader': 'Abid', 'capacity': 4},
]

for team_data in teams:
    WorkTeam.objects.get_or_create(**team_data)

print("Work teams seeded successfully!")

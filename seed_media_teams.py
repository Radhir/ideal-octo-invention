import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Team, Employee

def seed_new_teams():
    print("Seeding Creative and Media teams...")
    
    teams_to_create = [
        ('SOCIAL MEDIA TEAM', 'Managing brand presence and social engagement.'),
        ('SEO & DIGITAL MARKETING', 'Search engine optimization and digital ad campaigns.'),
        ('VIDEOGRAPHERS', 'Visual content creation, editing, and workshop coverage.')
    ]
    
    for name, desc in teams_to_create:
        team, created = Team.objects.get_or_create(
            name=name,
            defaults={'description': desc}
        )
        if created:
            print(f"Created team: {name}")
        else:
            print(f"Team already exists: {name}")

    # Optional: Assign existing members to appropriate teams if applicable
    # Ruchika -> Management (Wait, need to create Management team too)
    
    mgmt, _ = Team.objects.get_or_create(name='MANAGEMENT', defaults={'description': 'Executive group.'})
    try:
        ruchika = Employee.objects.get(user__username='ruchika')
        mgmt.leader = ruchika
        mgmt.members.add(ruchika)
        mgmt.save()
        print("Assigned Ruchika to Management.")
    except Employee.DoesNotExist:
        pass

    print("Team seeding complete.")

if __name__ == "__main__":
    seed_new_teams()

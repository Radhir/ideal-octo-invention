import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import HRRule

DEFAULT_RULES = [
    ('Normal Overtime Rate', 1.25, 'Multiplier for hours above 8 per day'),
    ('Holiday Overtime Rate', 1.50, 'Multiplier for public holidays'),
    ('Late Penalty (AED)', 50.00, 'Deduction for late arrival > 30 mins'),
    ('Grace Period (Mins)', 15.00, 'Allowed delay for morning clock-in'),
]

def seed_rules():
    print("Seeding HR rules...")
    for name, value, desc in DEFAULT_RULES:
        rule, created = HRRule.objects.get_or_create(
            rule_name=name,
            defaults={'rule_value': value, 'description': desc}
        )
        if created:
            print(f"Created rule: {name}")
        else:
            print(f"Rule already exists: {name}")

if __name__ == "__main__":
    seed_rules()

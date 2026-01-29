import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Department, Employee, Team

DEPARTMENTS_DATA = [
    ('MANAGEMENT', 'Executive leadership and strategic planning.', 500000, 50000),
    ('OPERATIONS', 'Main workshop operations and service delivery.', 1000000, 200000),
    ('DETAILING', 'Premium car detailing and aesthetic services.', 300000, 40000),
    ('PAINTING', 'Body work and customized painting services.', 200000, 30000),
    ('PPF & WRAPPING', 'Paint protection film and wrapping services.', 400000, 60000),
    ('MARKETING & MEDIA', 'Social media, SEO, and content creation.', 0, 80000),
    ('ACCOUNTING', 'Financial management and auditing.', 0, 15000),
    ('HR', 'Human resources and recruitment.', 0, 10000),
]

def seed_departments():
    print("Seeding updated Department model...")
    for name, desc, target, budget in DEPARTMENTS_DATA:
        dept, created = Department.objects.get_or_create(
            name=name,
            defaults={
                'description': desc,
                'monthly_sales_target': target,
                'monthly_expense_budget': budget
            }
        )
        if created:
            print(f"Created department: {name}")
        else:
            dept.monthly_sales_target = target
            dept.monthly_expense_budget = budget
            dept.save()
            print(f"Updated department targets: {name}")

    # Link Teams to Departments
    print("Linking existing teams to departments...")
    
    # 1. Social Media Team, SEO, Videographers -> MARKETING & MEDIA
    marketing_dept = Department.objects.get(name='MARKETING & MEDIA')
    Team.objects.filter(name__icontains='SOCIAL').update(department=marketing_dept)
    Team.objects.filter(name__icontains='SEO').update(department=marketing_dept)
    Team.objects.filter(name__icontains='VIDEO').update(department=marketing_dept)
    
    # 2. Management Team -> MANAGEMENT
    mgmt_dept = Department.objects.get(name='MANAGEMENT')
    Team.objects.filter(name='MANAGEMENT').update(department=mgmt_dept)

    print("Department seeding and linking complete.")

if __name__ == "__main__":
    seed_departments()

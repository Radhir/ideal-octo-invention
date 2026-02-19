"""
Elite Shine ERP — Employee Roster Seed Script
================================================
Creates all employees, departments, Django users, and HR profiles.
Default password for all users: EliteShine2025!
Each employee gets a unique 4-digit PIN and auto-generated employee ID.

Run:  python seed_employees.py
"""

import os
import sys
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department

# ─── Master Roster ────────────────────────────────────────────────────────────
ROSTER = [
    # ── Detailing / Ceramic Coating ───────────────────────────────────────────
    {'username': 'abdul.saboor',                 'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'ali.ahmed.laskar',             'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'ali.shan',                     'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'azan.idrees',                  'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'brijinder',                    'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'dhiraj.kumar',                 'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'emmanuel.botwe',               'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'ghulam.farid',                 'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'iftikhar.muhammad',            'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'jahan.uddin',                  'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'jalal.ahmed.laskar',           'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'jan.said.awranag.zaib',        'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'maznzul.ahmed.choudhury',      'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'masuk.ahmed.laskar',           'role': 'Quality Control',      'dept': 'Detailing/Ceramic Coating'},
    {'username': 'mohammed.imran',               'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'muhammad.ibrar',               'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'muhammad.latif',               'role': 'Head of Department',   'dept': 'Detailing/Ceramic Coating'},
    {'username': 'muhammad.rahim.malik',         'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'mursaleen',                    'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'nizam.uddin.laskar',           'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'nur.ahmed.choudhury',          'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'saddam.hussain',               'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'stephan.nii.boye',             'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'yahaya.salisu',                'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},
    {'username': 'zareen.mohd',                  'role': 'Team Member',          'dept': 'Detailing/Ceramic Coating'},

    # ── Driver / Cleaner ─────────────────────────────────────────────────────
    {'username': 'akhma.jan',                                'role': 'Driver',  'dept': 'Driver/Cleaner'},
    {'username': 'ashok.kumar',                              'role': 'Driver',  'dept': 'Driver/Cleaner'},
    {'username': 'bhola.singh',                              'role': 'Driver',  'dept': 'Driver/Cleaner'},
    {'username': 'mera.rao',                                 'role': 'Driver',  'dept': 'Driver/Cleaner'},
    {'username': 'mohammed.sahedul.haque.chowdhury',         'role': 'Driver',  'dept': 'Driver/Cleaner'},
    {'username': 'rajen.pradhan',                            'role': 'Driver',  'dept': 'Driver/Cleaner'},
    {'username': 'siddappa',                                 'role': 'Driver',  'dept': 'Driver/Cleaner'},
    {'username': 'sudhir.kumar.singh',                       'role': 'Driver',  'dept': 'Driver/Cleaner'},

    # ── Front Office ─────────────────────────────────────────────────────────
    {'username': 'anish',                    'role': 'Service Advisor',     'dept': 'Front Office'},
    {'username': 'ankit',                    'role': 'General Manager',     'dept': 'Front Office'},
    {'username': 'elmma.song.yoh',           'role': 'Floor Incharge',      'dept': 'Front Office'},
    {'username': 'farhan.ali',               'role': 'Operation Incharge',  'dept': 'Front Office'},
    {'username': 'mohammad.usman',           'role': 'Service Advisor',     'dept': 'Front Office'},
    {'username': 'nomaanuddin.mohammed',     'role': 'Accounts',            'dept': 'Front Office'},
    {'username': 'rashid.abdulrahman',       'role': 'Outdoor Sales',       'dept': 'Front Office'},
    {'username': 'suraj.upadhya',            'role': 'Service Advisor',     'dept': 'Front Office'},
    {'username': 'tamer',                    'role': 'Branch Manager',      'dept': 'Front Office'},
    {'username': 'tariq.abdullah',           'role': 'Accounts',            'dept': 'Front Office'},

    # ── Painting / Denting ───────────────────────────────────────────────────
    {'username': 'abid.hussain.tanveer.hussain',  'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'ahmed.allah.ditta',              'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'alex.osei',                      'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'amimuddin.shaikh',               'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'atif.ehsan',                     'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'fahad.azeem',                    'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'habibullah',                     'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'irfan.khan.ejaj',                'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'mohammad.iliash',                'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'mohammad.sohrab',                'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'mohammad.ushman',                'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'mohammed.asif',                  'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'mohd.imran.ansari',              'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'mohd.irfan.siraj.ahmed',         'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'muhammad.imran.akram',           'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'muhammad.iqbal',                 'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'muhammad.nadeem',                'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'muhammad.qasim',                 'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'muhammad.saleem',                'role': 'Head of Department',   'dept': 'Painting/Denting'},
    {'username': 'muhammad.shafiq',                'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'pervez',                         'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'rahul.prakash',                  'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'rey',                            'role': 'Team Member',          'dept': 'Painting/Denting'},
    {'username': 'shaikh.sharfuddin',              'role': 'Team Member',          'dept': 'Painting/Denting'},

    # ── Tinting / Wrapping / PPF ─────────────────────────────────────────────
    {'username': 'ajig.ahmed.laskar',              'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'aminul.islam',                   'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'amzadul.haque.laskar',           'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'azad.hussain.barbhuiya',         'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'ikbal.hussain.barbhuiya',        'role': 'Head of Department',   'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'jalal.uddin',                    'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'jayed.ahmed.laskar',             'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'kajal.ahmed',                    'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'mazumder.suhed.alom',            'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'moin.uddin',                     'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'musim.khan',                     'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'muzafar.hussain',                'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'rahul.phodder',                  'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'sahid.hussain.laskar',           'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'shamim',                         'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
    {'username': 'thuvan.asith.thuvanaheel',       'role': 'Team Member',          'dept': 'Tinting/Wrapping/PPF'},
]

DEFAULT_PASSWORD = 'EliteShine2025!'

def generate_pin(used_pins: set) -> str:
    """Generate a unique 4-digit PIN."""
    while True:
        pin = str(random.randint(1000, 9999))
        if pin not in used_pins:
            used_pins.add(pin)
            return pin

def username_to_names(username: str):
    """Convert 'first.last' username to (first_name, last_name)."""
    parts = username.replace('.', ' ').split()
    first = parts[0].capitalize() if parts else ''
    last = ' '.join(p.capitalize() for p in parts[1:]) if len(parts) > 1 else ''
    return first, last

def seed():
    print("=" * 60)
    print("  ELITE SHINE — EMPLOYEE ROSTER SEED")
    print("=" * 60)

    used_pins = set(Employee.objects.values_list('pin_code', flat=True))
    existing_ids = set(Employee.objects.values_list('employee_id', flat=True))

    # Get max numeric employee_id to continue sequence
    max_id = 0
    for eid in existing_ids:
        try:
            num = int(eid.replace('ES-', ''))
            if num > max_id:
                max_id = num
        except ValueError:
            pass
    next_id = max_id + 1

    dept_cache = {}
    stats = {'created': 0, 'skipped': 0, 'depts_created': 0}

    for entry in ROSTER:
        uname = entry['username']
        role = entry['role']
        dept_name = entry['dept']

        # Skip if user already exists
        if User.objects.filter(username=uname).exists():
            print(f"  ⏭  {uname} — already exists, skipping")
            stats['skipped'] += 1
            continue

        # Get or create department
        if dept_name not in dept_cache:
            dept, created = Department.objects.get_or_create(name=dept_name)
            dept_cache[dept_name] = dept
            if created:
                stats['depts_created'] += 1
                print(f"  📂 Created Department: {dept_name}")
        else:
            dept = dept_cache[dept_name]

        # Create Django user
        first, last = username_to_names(uname)
        user = User.objects.create_user(
            username=uname,
            password=DEFAULT_PASSWORD,
            first_name=first,
            last_name=last,
            is_active=True
        )

        # Create HR Employee profile
        emp_id = f'ES-{next_id:04d}'
        next_id += 1
        pin = generate_pin(used_pins)

        Employee.objects.create(
            user=user,
            employee_id=emp_id,
            department=dept,
            role=role,
            pin_code=pin,
            date_joined='2025-01-01',
            is_active=True,
            basic_salary=0.00,
        )

        print(f"  ✅ {uname:<40} | {emp_id} | PIN {pin} | {dept_name} | {role}")
        stats['created'] += 1

    print("\n" + "=" * 60)
    print(f"  COMPLETE: {stats['created']} created, {stats['skipped']} skipped, {stats['depts_created']} new departments")
    print(f"  Default Password: {DEFAULT_PASSWORD}")
    print("=" * 60)

if __name__ == "__main__":
    seed()

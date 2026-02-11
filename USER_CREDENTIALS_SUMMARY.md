# User Credentials Summary

## Overview
This document contains the user credentials found in the codebase for the Elite Shine management system.

---

## Admin/Superuser Accounts

### 1. **radhir** (Owner - Superuser)
- **Username:** `radhir`
- **Password:** `Elite123!`
- **Role:** Owner / System Architect | Admin
- **Email:** radhir@eliteshine.com
- **Employee ID:** ES-ADM-RADHIR
- **Status:** Active, Staff, Superuser
- **Department:** 04 ARCHITECTURE

### 2. **ruchika_adhir / ruchika** (Superuser)
- **Username:** `ruchika`
- **Password:** `Elite123!`
- **Role:** Owner & Managing Director / Administrator
- **Email:** ruchika@eliteshine.com
- **Employee ID:** ES-ADM-RUCHIKA
- **Status:** Active, Staff
- **Department:** 01 MANAGEMENT
- **Note:** Listed as superuser in multiple files

### 3. **afsar / AFSAR** (Administrator)
- **Username:** `afsar`
- **Password:** `Elite123!`
- **Role:** Service Advisor / Administrator
- **Email:** afsar@eliteshine.com
- **Employee ID:** ES-ADM-AFSAR
- **Status:** Active, Staff
- **Department:** 02 OPERATIONS
- **Note:** Listed in elite_usernames array with special permissions

---

## Manager Accounts

### 4. **ankit** (Manager)
- **Username:** `ankit`
- **Password:** `Elite123!`
- **Role:** General Manager / Group Manager
- **Email:** ankit@eliteshine.com
- **Employee ID:** ES-ANKIT
- **Status:** Active
- **Department:** Front Office / 03 LOGISTICS
- **Additional Info:** Has portfolio with accent color #f59e0b

---

## Alternative Password (from ensure_team.py)

**Note:** The file `Bankend/ensure_team.py` shows an alternative password setup:
- **Password:** `elite123` (lowercase, no special characters)
- This applies to: radhir, afsar, ruchika, ankit, noman
- **PIN Code:** 1234

---

## Standard Employee Password

All other employees in the system use:
- **Password:** `Elite123!`

---

## Important Notes

1. **Elite Usernames:** The following usernames have special permissions in the system:
   - radhir
   - ruchika
   - afsar

2. **Password Format:** Most accounts use `Elite123!` as the standard password

3. **Files Containing Credentials:**
   - `Bankend/seed_deployment.py` - Main deployment seeding
   - `Bankend/ensure_team.py` - Team profile setup
   - `Bankend/seed_employees.py` - Employee seeding
   - `Bankend/core/permissions.py` - Elite username permissions

4. **Security Recommendation:** These credentials should be changed immediately in production and stored securely using environment variables or a secrets management system.

---

## Hostinger Deployment Check

To check these credentials on Hostinger, you would need to:

1. SSH into the Hostinger server
2. Navigate to the Django project directory
3. Run the Django shell:
   ```bash
   python manage.py shell
   ```
4. Check users:
   ```python
   from django.contrib.auth.models import User
   
   # Check specific users
   for username in ['radhir', 'ruchika', 'afsar', 'ankit']:
       try:
           user = User.objects.get(username=username)
           print(f"Username: {user.username}")
           print(f"Email: {user.email}")
           print(f"Is Superuser: {user.is_superuser}")
           print(f"Is Staff: {user.is_staff}")
           print(f"Is Active: {user.is_active}")
           print("---")
       except User.DoesNotExist:
           print(f"User {username} not found")
   ```

---

**Generated:** Based on codebase analysis
**Last Updated:** Current session

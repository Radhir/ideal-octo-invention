import os
import django
import sys
from django.db.models import Q

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from hr.models import Employee

User = get_user_model()

def deactivate_user():
    print("Searching for user to deactivate...")
    # Search for user matching the screenshot details
    # Name: Mohammed Nomaanuddin
    # ID: 784199839634187 (This looks like a database ID or something, but our DB uses integers for ID. 
    # The screenshot shows 'ID' under the name. Maybe it's a custom field?)
    # Employee ID in our DB for 'nomaanuddin.mohammed' was 'ES-NOMAA'.
    # Email: mohammed.nomaanuddin@eliteshineuae.com
    
    try:
        # Try finding by exact username we found earlier
        user = User.objects.get(username='nomaanuddin.mohammed')
        print(f"Found user by username: {user.username} (ID: {user.id})")
        
        # Verify email matches (or is close)
        print(f"Email: {user.email}")
        
        if user.is_active:
            user.is_active = False
            user.save()
            print("SUCCESS: User 'nomaanuddin.mohammed' has been DEACTIVATED.")
            
            # Also check HR profile status
            try:
                emp = user.hr_profile
                emp.is_active = False
                emp.save()
                print("SUCCESS: Associated Employee profile set to INACTIVE.")
            except Employee.DoesNotExist:
                print("WARNING: No Employee profile found.")
        else:
            print("User is ALREADY deactivated.")
            
    except User.DoesNotExist:
        print("User 'nomaanuddin.mohammed' not found by username. Trying email search...")
        try:
            user = User.objects.get(email__icontains='mohammed.nomaanuddin')
            print(f"Found user by email: {user.username} (ID: {user.id})")
            
            user.is_active = False
            user.save()
            print("SUCCESS: User found by email has been DEACTIVATED.")
            
            try:
                emp = user.hr_profile
                emp.is_active = False
                emp.save()
                print("SUCCESS: Employee profile set to INACTIVE.")
            except:
                pass
                
        except User.DoesNotExist:
            print("ERROR: Could not find user by username or email. Please verify details.")
        except User.MultipleObjectsReturned:
            print("ERROR: Multiple users found with that email. Manual intervention required.")

if __name__ == "__main__":
    deactivate_user()

import os
import re

root_dir = r'r:\webplot\frontend\src'

replacements = [
    (r"'/hr/api/", r"'/api/hr/"),
    (r"\"/hr/api/", r"\"/api/hr/"),
    (r"`/hr/api/", r"`/api/hr/"),
    
    (r"'/forms/job-cards/api/", r"'/api/job-cards/api/"),
    (r"\"/forms/job-cards/api/", r"\"/api/job-cards/api/"),
    (r"`/forms/job-cards/api/", r"`/api/job-cards/api/"),
    
    (r"'/forms/attendance/api/", r"'/api/attendance/"),
    (r"\"/forms/attendance/api/", r"\"/api/attendance/"),
    (r"`/forms/attendance/api/", r"`/api/attendance/"),
    
    (r"'/customers/api/", r"'/api/customers/"),
    (r"\"/customers/api/", r"\"/api/customers/"),
    (r"`/customers/api/", r"`/api/customers/"),
    
    (r"'/invoices/api/", r"'/api/invoices/api/"),
    (r"\"/invoices/api/", r"\"/api/invoices/api/"),
    (r"`/invoices/api/", r"`/api/invoices/api/"),

    (r"'/stock/api/", r"'/api/stock/api/"),
    (r"\"/stock/api/", r"\"/api/stock/api/"),
    (r"`/stock/api/", r"`/api/stock/api/"),
    
    (r"'/notifications/api/", r"'/api/notifications/api/"),
    (r"\"/notifications/api/", r"\"/api/notifications/api/"),
    (r"`/notifications/api/", r"`/api/notifications/api/"),
]

for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.jsx', '.js', '.tsx', '.ts')):
            filepath = os.path.join(subdir, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements:
                new_content = new_content.replace(old, new)
            
            if new_content != content:
                print(f"Updating {filepath}")
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)

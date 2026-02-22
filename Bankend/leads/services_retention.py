from django.utils import timezone
from datetime import timedelta
from ceramic_warranty.models import CeramicWarrantyRegistration
from ppf_warranty.models import PPFWarrantyRegistration
from django.db.models import Q

class RetentionService:
    @staticmethod
    def get_retention_candidates():
        """
        Identify customers who are due for Ceramic/PPF inspections or maintenance.
        Criteria:
        1. Ceramic: 1 year after installation_date if m1_date is null, etc.
        2. PPF: 1 year after installation_date if checkup dates are null.
        """
        today = timezone.now().date()
        six_months_ago = today - timedelta(days=180) # Minimum threshold
        
        candidates = []

        # 1. Ceramic Candidates
        ceramic_registrations = CeramicWarrantyRegistration.objects.filter(
            installation_date__lte=today - timedelta(days=330) # ~11 months ago
        )

        for reg in ceramic_registrations:
            due_date = None
            service_type = "Ceramic Maintenance"
            
            if not reg.m1_date:
                due_date = reg.installation_date + timedelta(days=365)
            elif not reg.m2_date:
                due_date = reg.installation_date + timedelta(days=730)
            elif not reg.m3_date:
                due_date = reg.installation_date + timedelta(days=1095)
                
            if due_date and due_date <= today + timedelta(days=30):
                candidates.append({
                    'id': f"CER-{reg.id}",
                    'customer_name': reg.full_name,
                    'phone': reg.contact_number,
                    'vehicle': f"{reg.vehicle_brand} {reg.vehicle_model}",
                    'last_service': reg.installation_date,
                    'due_type': service_type,
                    'due_date': due_date,
                    'is_overdue': due_date < today
                })

        # 2. PPF Candidates
        ppf_registrations = PPFWarrantyRegistration.objects.filter(
            installation_date__lte=today - timedelta(days=330)
        )

        for reg in ppf_registrations:
            due_date = None
            service_type = "PPF Annual Inspection"

            if not reg.first_checkup_date:
                due_date = reg.installation_date + timedelta(days=365)
            elif not reg.second_checkup_date:
                due_date = reg.installation_date + timedelta(days=730)
            
            if due_date and due_date <= today + timedelta(days=30):
                candidates.append({
                    'id': f"PPF-{reg.id}",
                    'customer_name': reg.full_name,
                    'phone': reg.contact_number,
                    'vehicle': f"{reg.vehicle_brand} {reg.vehicle_model}",
                    'last_service': reg.installation_date,
                    'due_type': service_type,
                    'due_date': due_date,
                    'is_overdue': due_date < today
                })

        return sorted(candidates, key=lambda x: x['due_date'])

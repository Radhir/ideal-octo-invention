from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class NavigationTreeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        navigation_structure = [
            {
                "title": "OPERATIONS",
                "icon": "Wrench",
                "modules": [
                    {"name": "Job Cards", "path": "/operations/jobcards"},
                    {"name": "PPF & Tinting", "path": "/operations/ppf"},
                    {"name": "Ceramic Coating", "path": "/operations/ceramic"},
                    {"name": "Detailing", "path": "/operations/detailing"},
                    {"name": "Bodyshop", "path": "/operations/bodyshop"},
                    {"name": "Quality Control", "path": "/operations/qc"}
                ]
            },
            {
                "title": "CRM & SALES",
                "icon": "Users",
                "modules": [
                    {"name": "Leads Pipeline", "path": "/crm/leads"},
                    {"name": "Customers", "path": "/crm/customers"},
                    {"name": "Bookings", "path": "/crm/bookings"},
                    {"name": "Reception", "path": "/crm/reception"}
                ]
            },
            {
                "title": "STRATEGIC HUB",
                "icon": "ShieldCheck",
                "modules": [
                    {"name": "CEO Command Center", "path": "/ceo/command"},
                    {"name": "Financial Reports", "path": "/finance/reports"},
                    {"name": "Asset Management", "path": "/finance/assets"},
                    {"name": "Payroll Console", "path": "/hr/payroll"}
                ]
            }
        ]
        return Response(navigation_structure)

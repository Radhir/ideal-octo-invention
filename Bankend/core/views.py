from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
import os

from .maintenance import perform_cache_maintenance
from .permissions import IsAdminOrOwner

class MaintenanceView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    def post(self, request):
        result = perform_cache_maintenance()
        return Response({"status": result})

def generate_pdf(request, doc_type, pk):
    """
    Generic PDF generation view for Job Cards and Invoices.
    """
    from job_cards.models import JobCard
    from invoices.models import Invoice
    
    context = {}
    template_name = ""
    filename = ""
    
    if doc_type == 'jobcard':
        obj = get_object_or_404(JobCard, pk=pk)
        context = {'job_card': obj}
        template_name = 'forms/pdf/job_card_pdf.html'
        filename = f"job_card_{obj.job_card_number}.pdf"
    elif doc_type == 'invoice':
        obj = get_object_or_404(Invoice, pk=pk)
        context = {'invoice': obj}
        template_name = 'forms/pdf/invoice_pdf.html'
        filename = f"invoice_{obj.invoice_number}.pdf"
    else:
        return HttpResponse("Invalid document type", status=400)

    # Check if specific templates exist, otherwise use their detail templates or a generic one
    # For now, let's assume we use the detail templates if PDF specific ones aren't found
    # Actually, we should probably just use the ones we found or generic ones.
    
    try:
        html_string = render_to_string(template_name, context)
        
        from weasyprint import HTML
        html = HTML(string=html_string, base_url=request.build_absolute_uri('/'))
        pdf = html.write_pdf()
        
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{filename}"'
        return response
    except Exception as e:
        return HttpResponse(f"Error generating PDF: {str(e)}", status=500)

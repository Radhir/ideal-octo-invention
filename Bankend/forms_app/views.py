from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone
from xhtml2pdf import pisa
from io import BytesIO
import tempfile

# Modular Imports
from ppf_warranty.models import PPFWarrantyRegistration
from ceramic_warranty.models import CeramicWarrantyRegistration
from job_cards.models import JobCard
from bookings.models import Booking
from leads.models import Lead
from invoices.models import Invoice
from operations.models import Operation
from checklists.models import Checklist
from service_requests.models import RequestForm
from stock.models import StockForm
from leaves.models import LeaveApplication

from dashboard.views_reports import get_dashboard_stats, workshop_diary_view

def home(request):
    stats = get_dashboard_stats(request)
    return render(request, 'forms/home.html', {'stats': stats})

def generate_pdf(request, model_name, pk):
    # Normalize model name to lowercase for consistent lookup
    model_name_lower = model_name.lower()

    templates = {
        'ppfwarrantyregistration': 'forms/pdf/ppf_warranty_pdf.html',
        'jobcard': 'forms/pdf/job_card_pdf.html',
        'requestform': 'forms/pdf/request_form_pdf.html',
        'stockform': 'forms/pdf/stock_form_pdf.html',
        'leaveapplication': 'forms/pdf/leave_application_pdf.html',
        'checklist': 'forms/pdf/checklist_pdf.html',
        'ceramicwarrantyregistration': 'forms/pdf/ceramic_warranty_pdf.html',
        'booking': 'forms/pdf/booking_pdf.html',
        'lead': 'forms/pdf/lead_pdf.html',
        'invoice': 'forms/pdf/invoice_pdf.html',
        'operation': 'forms/pdf/operation_pdf.html',
        'workshopdiary': 'forms/pdf/workshop_diary_pdf.html',
    }
    
    if model_name_lower not in templates:
        return HttpResponse("Invalid model type")

    # Get the object
    model_classes = {
        'ppfwarrantyregistration': PPFWarrantyRegistration,
        'jobcard': JobCard,
        'requestform': RequestForm,
        'stockform': StockForm,
        'leaveapplication': LeaveApplication,
        'checklist': Checklist,
        'ceramicwarrantyregistration': CeramicWarrantyRegistration,
        'booking': Booking,
        'lead': Lead,
        'invoice': Invoice,
        'operation': Operation,
        'workshopdiary': None,  # Handled specially
    }

    if pk == 0:
        # Exporting a List instead of a single object
        if model_name_lower == 'workshopdiary':
            from dashboard.views_reports import workshop_diary_view_context
            ctx = workshop_diary_view_context(request)
            html_string = render_to_string(templates['workshopdiary'], ctx)
        else:
            objects = model_classes[model_name_lower].objects.all().order_by('-created_at')
            # Use list template if it exists, otherwise fallback to generic
            template_name = templates.get(f'{model_name_lower}_list', 'forms/pdf/generic_list_pdf.html')
            context = {
                'objects': objects,
                'title': f"{model_name.replace('_', ' ').capitalize()} Report",
                'date': timezone.now()
            }
            html_string = render_to_string(template_name, context)
    else:
        obj = get_object_or_404(model_classes[model_name_lower], pk=pk)
        html_string = render_to_string(templates[model_name_lower], {'object': obj})
    
    # Generate PDF using xhtml2pdf
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html_string.encode("UTF-8")), result)
    
    if not pdf.err:
        response = HttpResponse(result.getvalue(), content_type='application/pdf')
        filename = f"{model_name}_list" if pk == 0 else f"{model_name}_{pk}"
        response['Content-Disposition'] = f'attachment; filename="{filename}.pdf"'
        return response
    
    return HttpResponse(f'Error rendering PDF: <pre>{html_string}</pre>', status=400)

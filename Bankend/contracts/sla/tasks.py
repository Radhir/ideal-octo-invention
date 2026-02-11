from celery import shared_task
from django.utils import timezone
from contracts.sla.models import ServiceLevelAgreement, SLAViolation
from job_cards.models import JobCard
from decimal import Decimal

@shared_task
def detect_sla_violations():
    """Hourly task to detect resolution time violations."""
    active_slas = ServiceLevelAgreement.objects.filter(
        is_active=True,
        end_date__gte=timezone.now().date()
    )
    violations_created = 0
    for sla in active_slas:
        # Jobs for this customer that are active and have started SLA clock
        # Statuses where SLA applies (usually before Closed/Delivery)
        jobs = JobCard.objects.filter(
            customer_profile=sla.customer,
            status__in=['ESTIMATION_ASSIGNMENT', 'WIP_QC', 'INVOICING_DELIVERY'],
            sla_clock_start__isnull=False
        )
        for job in jobs:
            elapsed = (timezone.now() - job.sla_clock_start).total_seconds() / 3600  # hours
            if elapsed > sla.resolution_time:
                # Check if already reported for this specific violation type
                if not SLAViolation.objects.filter(
                    job_card=job,
                    sla=sla,
                    violation_type='RESOLUTION_TIME'
                ).exists():
                    service_credit = job.net_amount * (sla.service_credit_percentage / 100)
                    if service_credit < sla.min_service_credit:
                        service_credit = sla.min_service_credit
                        
                    SLAViolation.objects.create(
                        sla=sla,
                        job_card=job,
                        violation_type='RESOLUTION_TIME',
                        violation_date=timezone.now(),
                        expected_time=sla.resolution_time,
                        actual_time=elapsed,
                        time_exceeded=elapsed - sla.resolution_time,
                        description=f"Job {job.job_card_number} exceeded resolution SLA by {elapsed - sla.resolution_time:.1f}h",
                        service_credit_amount=service_credit,
                    )
                    violations_created += 1
    return f"Created {violations_created} new SLA violations"

@shared_task
def calculate_sla_metrics(customer_id=None):
    """Stub for SLA metrics calculation."""
    return "Calculated SLA metrics"

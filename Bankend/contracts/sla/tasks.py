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
        # Statuses where SLA applies
        jobs = JobCard.objects.filter(
            customer_profile=sla.customer,
            status__in=['ESTIMATION_ASSIGNMENT', 'WIP_QC', 'INVOICING_DELIVERY'],
            sla_clock_start__isnull=False
        )
        for job in jobs:
            elapsed = (timezone.now() - job.sla_clock_start).total_seconds() / 3600  # hours
            if elapsed > sla.resolution_time:
                # Check if already reported
                if not SLAViolation.objects.filter(
                    job_card=job,
                    sla=sla,
                    violation_type='RESOLUTION_TIME'
                ).exists():
                    # Calculate service credit
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
def calculate_sla_metrics(agreement_id=None):
    """Calculate and aggregate SLA compliance metrics for a month."""
    from django.db.models import Avg, Count
    from contracts.sla.models import SLAMetric
    from datetime import date
    
    first_day = date.today().replace(day=1)
    
    query = ServiceLevelAgreement.objects.filter(is_active=True)
    if agreement_id:
        query = query.filter(id=agreement_id)
        
    metrics_processed = 0
    for sla in query:
        # Get jobs for this SLA completed this month
        month_jobs = JobCard.objects.filter(
            customer_profile=sla.customer,
            status='CLOSED',
            updated_at__year=first_day.year,
            updated_at__month=first_day.month,
            sla_clock_start__isnull=False
        )
        
        total_jobs = month_jobs.count()
        if total_jobs == 0:
            continue
            
        # On-time completions
        on_time_completions = 0
        total_resolution_time = 0
        
        for job in month_jobs:
            elapsed = (job.updated_at - job.sla_clock_start).total_seconds() / 3600
            total_resolution_time += elapsed
            if elapsed <= sla.resolution_time:
                on_time_completions += 1
                
        avg_resolution = total_resolution_time / total_jobs if total_jobs > 0 else 0
        
        # Calculate Service Credits Issued this month
        credits = SLAViolation.objects.filter(
            sla=sla,
            violation_date__year=first_day.year,
            violation_date__month=first_day.month
        ).aggregate(models.Sum('service_credit_amount'))['service_credit_amount__sum'] or 0
        
        SLAMetric.objects.update_or_create(
            sla=sla,
            month=first_day,
            defaults={
                'total_jobs': total_jobs,
                'on_time_completions': on_time_completions,
                'average_completion_time': avg_resolution,
                'service_credits_issued': credits,
                'calculated_at': timezone.now()
            }
        )
        metrics_processed += 1
        
    return f"Processed {metrics_processed} SLA metric records for {first_day.strftime('%B %Y')}"

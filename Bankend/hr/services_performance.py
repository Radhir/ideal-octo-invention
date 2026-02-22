from django.utils import timezone
from django.db.models import Sum, Avg, F
from decimal import Decimal
from job_cards.models import JobCard
from .models import Employee, Bonus

class PerformanceService:
    @staticmethod
    def calculate_technician_efficiency(employee_id, month=None):
        """
        Calculates efficiency score and potential bonus for a technician.
        Efficiency = (Estimated Days / Actual Days) * 100
        """
        if not month:
            # Default to current month
            month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0)
        else:
            # month expected as YYYY-MM
            year, m = map(int, month.split('-'))
            month_start = timezone.now().replace(year=year, month=m, day=1)

        jobs = JobCard.objects.filter(
            assigned_technician_id=employee_id,
            status='CLOSED',
            delivery_date__gte=month_start
        )

        total_jobs = jobs.count()
        if total_jobs == 0:
            return {
                'efficiency': 0,
                'total_jobs': 0,
                'bonus_accrued': 0
            }

        avg_efficiency = jobs.aggregate(
            avg_eff=Avg('efficiency_score')
        )['avg_eff'] or 0

        # Bonus Logic:
        # > 100% Efficiency: 100 AED per point above 100
        # > 120% Efficiency: Extra 500 AED multiplier
        bonus_amt = Decimal('0')
        if avg_efficiency > 100:
            excess = Decimal(str(avg_efficiency)) - Decimal('100')
            bonus_amt = excess * Decimal('50') # 50 AED per efficiency point
            if avg_efficiency > 120:
                bonus_amt += Decimal('500')

        return {
            'efficiency': round(float(avg_efficiency), 2),
            'total_jobs': total_jobs,
            'bonus_accrued': float(bonus_amt)
        }

    @staticmethod
    def accrue_monthly_bonuses(month=None):
        """
        Scans all technicians and creates Bonus records for the month.
        """
        technicians = Employee.objects.filter(role__icontains='Technician', is_active=True)
        results = []

        for tech in technicians:
            stats = PerformanceService.calculate_technician_efficiency(tech.id, month)
            if stats['bonus_accrued'] > 0:
                # Create Bonus record
                bonus_date = timezone.now().date()
                Bonus.objects.create(
                    employee=tech,
                    amount=Decimal(str(stats['bonus_accrued'])),
                    date=bonus_date,
                    reason=f"Monthly Performance Bonus ({month or 'Current Month'}) - Efficiency: {stats['efficiency']}%"
                )
                results.append({
                    'tech': tech.full_name,
                    'bonus': stats['bonus_accrued'],
                    'efficiency': stats['efficiency']
                })
        
        return results

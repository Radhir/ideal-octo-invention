"""
Cache Collector Command - Runs 4 times per month
Schedule: 1st, 8th, 15th, and 22nd of each month

Usage:
    python manage.py clear_expired_cache
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import CacheEntry, CacheCollectorLog
import time


class Command(BaseCommand):
    help = 'Clear expired cache entries (runs 4x monthly)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force run even if not scheduled day',
        )

    def handle(self, *args, **options):
        start_time = time.time()
        
        # Check if today is a scheduled day (1, 8, 15, 22)
        today = timezone.now().day
        scheduled_days = [1, 8, 15, 22]
        
        if not options['force'] and today not in scheduled_days:
            self.stdout.write(
                self.style.WARNING(
                    f'Today ({today}) is not a scheduled cache cleanup day. '
                    f'Scheduled days: {scheduled_days}. Use --force to run anyway.'
                )
            )
            return
        
        self.stdout.write('Starting cache cleanup...')
        
        # Get all expired entries
        now = timezone.now()
        expired_entries = CacheEntry.objects.filter(expires_at__lt=now)
        expired_count = expired_entries.count()
        
        # Delete expired entries
        expired_entries.delete()
        
        # Count remaining entries
        remaining_count = CacheEntry.objects.count()
        
        # Calculate execution time
        execution_time = int((time.time() - start_time) * 1000)  # milliseconds
        
        # Log the cleanup
        log = CacheCollectorLog.objects.create(
            entries_deleted=expired_count,
            entries_kept=remaining_count,
            execution_time_ms=execution_time,
            notes=f"Scheduled cleanup for day {today} of month"
        )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Cache cleanup complete!\n'
                f'   Deleted: {expired_count} expired entries\n'
                f'   Kept: {remaining_count} active entries\n'
                f'   Execution time: {execution_time}ms\n'
                f'   Log ID: {log.id}'
            )
        )

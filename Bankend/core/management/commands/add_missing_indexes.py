from django.core.management.base import BaseCommand
from django.db import connection
from django.apps import apps

class Command(BaseCommand):
    help = 'Adds missing indexes to foreign keys and frequently filtered date fields to optimize production performance.'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            self.stdout.write("🔍 Scanning models for missing indexes...")
            
            # List of fields to prioritize for indexing across all apps
            target_fields = ['created_at', 'updated_at', 'date', 'status', 'is_active']
            
            for model in apps.get_models():
                table_name = model._meta.db_table
                
                for field in model._meta.fields:
                    # Index foreign keys and specific performance-critical fields
                    if field.is_relation or field.name in target_fields:
                        if not field.db_index and not field.unique:
                            index_name = f"{table_name}_{field.name}_audit_idx"
                            
                            # Check if index already exists (basic check)
                            try:
                                self.stdout.write(f"  Adding index to {table_name}.{field.name}...")
                                # Note: SQLite and Postgres have different syntax for concurrent indexing, 
                                # using standard CREATE INDEX for safety here.
                                cursor.execute(f"CREATE INDEX IF NOT EXISTS {index_name} ON {table_name} ({field.name});")
                            except Exception as e:
                                self.stdout.write(self.style.WARNING(f"    Failed to index {table_name}.{field.name}: {e}"))

            self.stdout.write(self.style.SUCCESS("✅ Database index optimization complete."))

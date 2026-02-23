import os
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from job_cards.models import JobCard
from invoices.models import Invoice
from stock.models import StockItem, StockTransfer, StockTransferItem
from locations.models import Branch
from notifications.models import NotificationLog

def verify_notifications():
    print("\n--- Verifying Notifications ---")
    # 1. Test JobCard Signal
    job = JobCard.objects.all().first()
    if job:
        print(f"Triggering status change for JobCard: {job.job_card_number}")
        job.status = 'READY'
        job.save()
        
        log = NotificationLog.objects.filter(object_id=job.id, notification_type='WHATSAPP').order_by('-sent_at').first()
        if log:
            print(f"SUCCESS: WhatsApp Log created: {log.message[:50]}...")
        else:
            print("FAILED: No notification log created for JobCard.")

def verify_ict():
    print("\n--- Verifying ICT Logic ---")
    branch1 = Branch.objects.first()
    branch2 = Branch.objects.last()
    
    if branch1 == branch2:
        print("Need at least 2 branches to test ICT properly.")
        return

    # Create test item
    item = StockItem.objects.create(
        branch=branch1,
        name="ICT Test Paint",
        sku="ICT-TEST-001",
        current_stock=100,
        unit="liters"
    )
    
    # Create transfer
    transfer = StockTransfer.objects.create(
        transfer_number="TRF-VERIFY-001",
        from_branch=branch1,
        to_branch=branch2,
        status='DRAFT'
    )
    StockTransferItem.objects.create(transfer=transfer, item=item, quantity=10)
    
    print("Moving transfer to TRANSIT...")
    transfer.status = 'TRANSIT'
    transfer.save()
    
    item.refresh_from_db()
    print(f"Source Stock after TRANSIT: {item.current_stock} (Expected: 90.0)")
    
    print("Moving transfer to COMPLETED...")
    transfer.status = 'COMPLETED'
    transfer.save()
    
    dest_item = StockItem.objects.filter(branch=branch2, sku="ICT-TEST-001").first()
    if dest_item:
        print(f"Destination Stock after COMPLETED: {dest_item.current_stock} (Expected: 10.0)")
    else:
        print("FAILED: Destination item not created/found.")

if __name__ == "__main__":
    verify_notifications()
    verify_ict()

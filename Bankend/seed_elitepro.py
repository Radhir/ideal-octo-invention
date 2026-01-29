import os
import django
import sys
from datetime import date, timedelta

# Setup Django
sys.path.append(r'R:\webplot\Bankend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from logistics.models import Customer, Product, Shipment, ShipmentItem, DriverLicense, Pickup
from hr.models import Company, Employee

print("🚀 Seeding ElitePro Trading sample data...")

# Get ElitePro Trading company
try:
    elitepro = Company.objects.get(name__icontains='ElitePro')
except:
    print("❌ ElitePro Trading company not found. Please create it first.")
    sys.exit(1)

# Get some employees to act as drivers
drivers = Employee.objects.all()[:3]
if not drivers.exists():
    print("❌ No employees found to act as drivers. Please seed employees first.")
    # But let's look for any employee
    drivers = Employee.objects.all()

# Create Customers
customers_data = [
    {'name': 'Dubai Electronics LLC', 'type': 'B2B', 'credit_limit': 100000, 'terms': 30},
    {'name': 'Al Fakher Trading', 'type': 'B2B', 'credit_limit': 75000, 'terms': 45},
    {'name': 'Elite Shine (Internal)', 'type': 'INTERNAL', 'credit_limit': 50000, 'terms': 0},
    {'name': 'Abu Dhabi Retailers', 'type': 'B2C', 'credit_limit': 25000, 'terms': 15},
]

print("\n📋 Creating customers...")
for cust_data in customers_data:
    customer, created = Customer.objects.get_or_create(
        company=elitepro,
        name=cust_data['name'],
        defaults={
            'customer_type': cust_data['type'],
            'credit_limit': cust_data['credit_limit'],
            'payment_terms_days': cust_data['terms'],
            'email': f"{cust_data['name'].lower().replace(' ', '.')}@example.com",
            'phone': '+971-50-123-4567'
        }
    )
    print(f"  {'✅ Created' if created else '⏭️  Exists'}: {customer.name} ({customer.customer_type})")

# Create Driver Licenses
print("\n🪪 Creating driver licenses...")
license_count = 0
for i, driver in enumerate(drivers):
    license, created = DriverLicense.objects.get_or_create(
        employee=driver,
        defaults={
            'license_number': f"UAE-{10000 + i}",
            'license_type': 'Heavy Vehicle' if i == 0 else 'Light Vehicle',
            'expiry_date': date.today() + timedelta(days=365),
            'status': 'ACTIVE'
        }
    )
    if created: license_count += 1
print(f"  ✅ {license_count} licenses created.")

# Create Products
products_data = [
    {'sku': 'ELEC-001', 'name': 'Samsung Smart TV 55"', 'category': 'ELECTRONICS', 'stock': 45, 'reorder': 20, 'cost': 2500, 'price': 3500},
    {'sku': 'ELEC-002', 'name': 'iPhone 15 Pro Max', 'category': 'ELECTRONICS', 'stock': 15, 'reorder': 25, 'cost': 4500, 'price': 5800},
    {'sku': 'TEXT-001', 'name': 'Premium Cotton Fabric (per roll)', 'category': 'TEXTILES', 'stock': 120, 'reorder': 50, 'cost': 450, 'price': 650},
    {'sku': 'AUTO-001', 'name': 'Car Engine Oil (5L)', 'category': 'AUTOMOTIVE', 'stock': 8, 'reorder': 30, 'cost': 85, 'price': 120},
    {'sku': 'MACH-001', 'name': 'Industrial Drill Machine', 'category': 'MACHINERY', 'stock': 12, 'reorder': 10, 'cost': 1200, 'price': 1800},
]

print("\n📦 Creating products...")
for prod_data in products_data:
    product, created = Product.objects.get_or_create(
        company=elitepro,
        sku=prod_data['sku'],
        defaults={
            'name': prod_data['name'],
            'category': prod_data['category'],
            'current_stock': prod_data['stock'],
            'reorder_level': prod_data['reorder'],
            'cost_price': prod_data['cost'],
            'selling_price': prod_data['price'],
            'unit_of_measure': 'pcs'
        }
    )
    status = '⚠️ LOW STOCK' if product.needs_reorder else '✅'
    print(f"  {status} {product.sku}: {product.name} ({product.current_stock} {product.unit_of_measure})")

# Create Shipments
shipments_data = [
    {
        'number': 'SH-2026-001',
        'type': 'IMPORT',
        'origin': 'Shanghai, China',
        'dest': 'Dubai, UAE',
        'method': 'SEA',
        'container': 'MSCU1234567',
        'shipped': date.today() - timedelta(days=15),
        'eta': date.today() + timedelta(days=5),
        'freight': 8500,
        'customs': 2300,
        'port': 1200,
        'insurance': 500,
        'status': 'IN_TRANSIT'
    },
    {
        'number': 'SH-2026-002',
        'type': 'IMPORT',
        'origin': 'Mumbai, India',
        'dest': 'Abu Dhabi, UAE',
        'method': 'SEA',
        'container': 'TCLU9876543',
        'shipped': date.today() - timedelta(days=8),
        'eta': date.today() + timedelta(days=2),
        'freight': 5200,
        'customs': 1800,
        'port': 950,
        'insurance': 320,
        'status': 'IN_TRANSIT'
    },
]

print("\n🚢 Creating shipments...")
for ship_data in shipments_data:
    shipment, created = Shipment.objects.get_or_create(
        company=elitepro,
        shipment_number=ship_data['number'],
        defaults={
            'shipment_type': ship_data['type'],
            'origin': ship_data['origin'],
            'destination': ship_data['dest'],
            'shipping_method': ship_data['method'],
            'container_number': ship_data['container'],
            'shipped_date': ship_data['shipped'],
            'expected_arrival': ship_data['eta'],
            'freight_cost': ship_data['freight'],
            'customs_duty': ship_data['customs'],
            'port_charges': ship_data['port'],
            'insurance': ship_data['insurance'],
            'status': ship_data['status']
        }
    )
    
    # Create Pickups for these shipments
    if created and drivers.exists():
        Pickup.objects.get_or_create(
            pickup_number=f"PK-{shipment.shipment_number}",
            defaults={
                'shipment': shipment,
                'customer': Customer.objects.filter(company=elitepro).first(),
                'pickup_date': timezone.now() + timedelta(days=5),
                'pickup_location': shipment.destination,
                'driver': drivers.first(),
                'status': 'PENDING',
                'items_summary': 'Full Container Load'
            }
        )
    
    cost = shipment.total_logistics_cost
    print(f"  {'✅ Created' if created else '⏭️  Exists'}: {shipment.shipment_number} - {shipment.origin} → {shipment.destination} (AED {cost:,})")

print("\n✨ Sample data seeding complete!")
print(f"   - {Customer.objects.filter(company=elitepro).count()} customers")
print(f"   - {Product.objects.filter(company=elitepro).count()} products")
print(f"   - {Shipment.objects.filter(company=elitepro).count()} shipments")
print(f"   - {Pickup.objects.count()} pickups")

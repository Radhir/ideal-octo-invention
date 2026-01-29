from django.db import models
from hr.models import Company, Employee

class Customer(models.Model):
    CUSTOMER_TYPE_CHOICES = [
        ('EXTERNAL', 'External Customer'),
        ('INTERNAL', 'Internal (Elite Shine Group)'),
        ('B2B', 'Business (B2B)'),
        ('B2C', 'Consumer (B2C)'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='customers')
    name = models.CharField(max_length=255)
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPE_CHOICES, default='EXTERNAL')
    contact_person = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    payment_terms_days = models.IntegerField(default=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.get_customer_type_display()})"

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('ELECTRONICS', 'Electronics'),
        ('TEXTILES', 'Textiles'),
        ('FOOD', 'Food & Beverages'),
        ('AUTOMOTIVE', 'Automotive Parts'),
        ('MACHINERY', 'Machinery'),
        ('CHEMICALS', 'Chemicals'),
        ('OTHER', 'Other'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='products')
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OTHER')
    description = models.TextField(blank=True)
    
    unit_of_measure = models.CharField(max_length=20, default='pcs')  # pcs, kg, liters, etc
    current_stock = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    reorder_level = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    cost_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    selling_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def needs_reorder(self):
        return self.current_stock <= self.reorder_level
    
    @property
    def margin_percentage(self):
        if self.selling_price > 0:
            return round(((self.selling_price - self.cost_price) / self.selling_price) * 100, 2)
        return 0
    
    def __str__(self):
        return f"{self.sku} - {self.name}"

class Shipment(models.Model):
    SHIPPING_METHOD_CHOICES = [
        ('SEA', 'Sea Freight'),
        ('AIR', 'Air Freight'),
        ('LAND', 'Land Transport'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_TRANSIT', 'In Transit'),
        ('ARRIVED', 'Arrived at Port'),
        ('CUSTOMS', 'Customs Clearance'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    SHIPMENT_TYPE_CHOICES = [
        ('IMPORT', 'Import'),
        ('EXPORT', 'Export'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='shipments')
    shipment_number = models.CharField(max_length=50, unique=True)
    shipment_type = models.CharField(max_length=10, choices=SHIPMENT_TYPE_CHOICES, default='IMPORT')
    
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    shipping_method = models.CharField(max_length=10, choices=SHIPPING_METHOD_CHOICES, default='SEA')
    container_number = models.CharField(max_length=50, blank=True)
    
    shipped_date = models.DateField()
    expected_arrival = models.DateField()
    actual_arrival = models.DateField(null=True, blank=True)
    
    freight_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    customs_duty = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    port_charges = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    insurance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    other_charges = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def total_logistics_cost(self):
        return (self.freight_cost + self.customs_duty + self.port_charges + 
                self.insurance + self.other_charges)
    
    @property
    def is_delayed(self):
        if self.actual_arrival:
            return self.actual_arrival > self.expected_arrival
        from datetime import date
        return date.today() > self.expected_arrival and self.status != 'DELIVERED'
    
    def __str__(self):
        return f"{self.shipment_number} - {self.origin} to {self.destination}"

class ShipmentItem(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='shipment_items')
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2)
    
    @property
    def total_cost(self):
        return self.quantity * self.unit_cost
    
    def __str__(self):
        return f"{self.product.sku} x {self.quantity}"

class SalesOrder(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('CONFIRMED', 'Confirmed'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='sales_orders')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=50, unique=True)
    
    order_date = models.DateField()
    delivery_date = models.DateField(null=True, blank=True)
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    payment_received = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='created_orders')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def balance_due(self):
        return self.total_amount - self.payment_received
    
    @property
    def is_paid(self):
        return self.payment_received >= self.total_amount
    
    def __str__(self):
        return f"{self.order_number} - {self.customer.name}"

class SalesOrderItem(models.Model):
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    @property
    def line_total(self):
        return (self.quantity * self.unit_price) - self.discount
    
    def __str__(self):
        return f"{self.product.sku} x {self.quantity}"

class CostOfSales(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='cost_of_sales')
    date = models.DateField()
    
    # Direct Costs
    raw_materials_used = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    freight_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    customs_duty = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Indirect Costs
    warehouse_rent = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    utilities = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    staff_wages = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    other_costs = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def total_cost_of_sales(self):
        return (self.raw_materials_used + self.freight_cost + self.customs_duty +
                self.warehouse_rent + self.utilities + self.staff_wages + self.other_costs)
    
    def __str__(self):
        return f"COS - {self.date} - {self.company.name}"

class SellingExpense(models.Model):
    EXPENSE_TYPE_CHOICES = [
        ('MARKETING', 'Marketing'),
        ('COMMISSION', 'Sales Commission'),
        ('DELIVERY', 'Delivery Costs'),
        ('ADMIN', 'Administrative'),
        ('OTHER', 'Other'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='selling_expenses')
    expense_type = models.CharField(max_length=20, choices=EXPENSE_TYPE_CHOICES, default='OTHER')
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
class DriverLicense(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='driver_license')
    license_number = models.CharField(max_length=50, unique=True, db_index=True)
    license_type = models.CharField(max_length=50) # Heavy, Light, etc
    expiry_date = models.DateField()
    status = models.CharField(max_length=20, default='ACTIVE')
    
    def __str__(self):
        return f"{self.employee.full_name} - {self.license_number}"

class Pickup(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Pickup'),
        ('COLLECTED', 'Collected'),
        ('IN_TRANSIT', 'In Transit to Warehouse'),
        ('RECEIVED', 'Received at Warehouse'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    pickup_number = models.CharField(max_length=50, unique=True)
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='pickups', null=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='pickups')
    
    pickup_date = models.DateTimeField(db_index=True)
    pickup_location = models.TextField()
    
    driver = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='pickups')
    vehicle_registration = models.CharField(max_length=50, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    items_summary = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Pickup {self.pickup_number} - {self.status}"

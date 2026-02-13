import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from job_cards.models import Service, ServiceCategory
from decimal import Decimal

def seed_services():
    full_catalog = [
        # ========== DETAILING ==========
        { "cat": "Detailing", "name": "Sedan - Full Car Detailing (Interior Cleaning + Exterior Polishing) - Silver Package", "price": 300 },
        { "cat": "Detailing", "name": "SUV - Full Car Detailing (Interior Cleaning + Exterior Polishing) - Silver Package", "price": 350 },
        { "cat": "Detailing", "name": "4*4 - Full Car Detailing (Interior Cleaning + Exterior Polishing) - Silver Package", "price": 400 },
        { "cat": "Detailing", "name": "Sedan - Full Car Premium Detailing (Interior Cleaning + Exterior Polishing) - Gold Package", "price": 500 },
        { "cat": "Detailing", "name": "SUV - Full Car Premium Detailing (Interior Cleaning + Exterior Polishing) - Gold Package", "price": 600 },
        { "cat": "Detailing", "name": "4*4 - Full Car Premium Detailing (Interior Cleaning + Exterior Polishing) - Gold Package", "price": 700 },
        { "cat": "Detailing", "name": "Cobone (Sedan) - Full Car Detailing (Interior + Exterior)", "price": 299 },
        { "cat": "Detailing", "name": "Cobone (SUV) - Full Car Detailing (Interior + Exterior)", "price": 349 },
        { "cat": "Detailing", "name": "Groupon (Sedan) - Full Car Detailing", "price": 399 },
        { "cat": "Detailing", "name": "Groupon (SUV) - Full Car Detailing", "price": 429 },
        { "cat": "Detailing", "name": "Sedan - Full Car Interior Cleaning", "price": 200 },
        { "cat": "Detailing", "name": "SUV - Full Car Interior Cleaning", "price": 250 },
        { "cat": "Detailing", "name": "4*4 - Full Car Interior Cleaning", "price": 300 },
        { "cat": "Detailing", "name": "Sedan - Full Car Exterior Polish", "price": 200 },
        { "cat": "Detailing", "name": "SUV - Full Car Exterior Polish", "price": 250 },
        { "cat": "Detailing", "name": "4*4 - Full Car Exterior Polish", "price": 300 },
        { "cat": "Detailing", "name": "Sedan - Full Car Premium Interior Cleaning", "price": 300 },
        { "cat": "Detailing", "name": "SUV - Full Car Premium Interior Cleaning", "price": 400 },
        { "cat": "Detailing", "name": "4*4 - Full Car Premium Interior Cleaning", "price": 500 },
        { "cat": "Detailing", "name": "Sedan - Full Car Premium Exterior Polish", "price": 300 },
        { "cat": "Detailing", "name": "SUV - Full Car Premium Exterior Polish", "price": 400 },
        { "cat": "Detailing", "name": "4*4 - Full Car Premium Exterior Polish", "price": 500 },
        { "cat": "Detailing", "name": "Sedan - Interior Cleaning For Fabric Seats", "price": 100 },
        { "cat": "Detailing", "name": "SUV - Interior Cleaning For Fabric Seats", "price": 150 },
        { "cat": "Detailing", "name": "Sedan - Interior Cleaning For Leather Seats", "price": 100 },
        { "cat": "Detailing", "name": "SUV - Interior Cleaning For Leather Seats", "price": 150 },
        { "cat": "Detailing", "name": "Roof Cleaning", "price": 100 },
        { "cat": "Detailing", "name": "HeadLight Polish", "price": 100 },
        { "cat": "Detailing", "name": "Normal Wash", "price": 80 },
        { "cat": "Detailing", "name": "Ceramic Wash", "price": 100 },
        { "cat": "Detailing", "name": "1 Panel Polish", "price": 50 },
        { "cat": "Detailing", "name": "Interior Vacuum", "price": 50 },
        { "cat": "Detailing", "name": "Seat Removal", "price": 50 },
        { "cat": "Detailing", "name": "Seat Removal + Matt Removal", "price": 100 },
        { "cat": "Detailing", "name": "Sedan - Full Car Sanding & Exterior Polish", "price": 500 },
        { "cat": "Detailing", "name": "SUV - Full Car Sanding & Exterior Polish", "price": 600 },
        { "cat": "Detailing", "name": "Sedan - Full Car Exterior Body Cement & Tar Removal", "price": 500 },
        { "cat": "Detailing", "name": "SUV - Full Car Exterior Body Cement & Tar Removal", "price": 600 },
        { "cat": "Detailing", "name": "Sedan - Full Car Exterior Body Waxing", "price": 200 },
        { "cat": "Detailing", "name": "SUV - Full Car Exterior Body Waxing", "price": 250 },
        { "cat": "Detailing", "name": "Sedan - Full Car Exterior Body Overspray Removal", "price": 500 },
        { "cat": "Detailing", "name": "SUV - Full Car Exterior Body Overspray Removal", "price": 600 },
        # ========== CERAMIC COATING ==========
        { "cat": "Ceramic Coating", "name": "Sedan - Full Car Ceramic Coating (2 Years Warranty)", "price": 1000 },
        { "cat": "Ceramic Coating", "name": "SUV - Full Car Ceramic Coating (2 Years Warranty)", "price": 1200 },
        { "cat": "Ceramic Coating", "name": "Sedan - Full Car Ceramic Coating (3 Years Warranty)", "price": 1300 },
        { "cat": "Ceramic Coating", "name": "SUV - Full Car Ceramic Coating (3 Years Warranty)", "price": 1500 },
        { "cat": "Ceramic Coating", "name": "Sedan - Full Car Ceramic Coating (5 Years Warranty)", "price": 2000 },
        { "cat": "Ceramic Coating", "name": "SUV - Full Car Ceramic Coating (5 Years Warranty)", "price": 2500 },
        { "cat": "Ceramic Coating", "name": "Sedan - Full Car Exterior Ceramic Coating (2 Years Warranty)", "price": 800 },
        { "cat": "Ceramic Coating", "name": "SUV - Full Car Exterior Ceramic Coating (2 Years Warranty)", "price": 1000 },
        { "cat": "Ceramic Coating", "name": "Sedan - Full Car Exterior Ceramic Coating (3 Years Warranty)", "price": 1000 },
        { "cat": "Ceramic Coating", "name": "SUV - Full Car Exterior Ceramic Coating (3 Years Warranty)", "price": 1300 },
        { "cat": "Ceramic Coating", "name": "Sedan - Full Car Exterior Ceramic Coating (5 Years Warranty)", "price": 1600 },
        { "cat": "Ceramic Coating", "name": "SUV - Full Car Exterior Ceramic Coating (5 Years Warranty)", "price": 2000 },
        { "cat": "Ceramic Coating", "name": "Sedan - Full Car Interior Ceramic Coating (2 Years Warranty)", "price": 600 },
        { "cat": "Ceramic Coating", "name": "SUV - Full Car Interior Ceramic Coating (2 Years Warranty)", "price": 800 },
        { "cat": "Ceramic Coating", "name": "Ceramic Coating for 1 Panel (No Warranty)", "price": 300 },
        # ========== PAINT & BODY ==========
        { "cat": "Paint & Body", "name": "U Pol Raptor - 1 Rim Painting", "price": 150 },
        { "cat": "Paint & Body", "name": "U Pol Raptor - 2 Rim Painting", "price": 300 },
        { "cat": "Paint & Body", "name": "U Pol Raptor - 3 Rim Painting", "price": 450 },
        { "cat": "Paint & Body", "name": "U Pol Raptor - 4 Rim Painting", "price": 600 },
        { "cat": "Paint & Body", "name": "Calliper Paint (Standard)", "price": 400 },
        { "cat": "Paint & Body", "name": "Bonnet Paint", "price": 500 },
        { "cat": "Paint & Body", "name": "Front Bumper Paint", "price": 350 },
        { "cat": "Paint & Body", "name": "Roof Paint", "price": 700 },
        { "cat": "Paint & Body", "name": "Full Sedan Car Paint (Exterior Only)", "price": 4000 },
        { "cat": "Paint & Body", "name": "Full SUV Car Paint (Exterior Only)", "price": 5000 },
        { "cat": "Paint & Body", "name": "1 Chrome Rim Restoration", "price": 300 },
        { "cat": "Paint & Body", "name": "Black Edition", "price": 1500 },
        # ========== WINDOW TINT ==========
        { "cat": "Window Tint", "name": "Front Full Windshield Ceramic Clear 0%", "price": 300 },
        { "cat": "Window Tint", "name": "Sides & Rear 30% Ceramic - Sedan", "price": 400 },
        { "cat": "Window Tint", "name": "Sides & Rear 30% Ceramic - SUV", "price": 500 },
        { "cat": "Window Tint", "name": "3M Crystalline Full Front 0%", "price": 800 },
        # ========== PPF ==========
        { "cat": "PPF", "name": "Front Package PPF Sedan (5y)", "price": 3200 },
        { "cat": "PPF", "name": "Full Car PPF Elite Pro 6.5mil Gloss Sedan 5y", "price": 5000 },
        { "cat": "PPF", "name": "1 Panel PPF (5y)", "price": 800 },
        { "cat": "PPF", "name": "Door Edge PPF", "price": 200 },
        # ========== WRAPPING ==========
        { "cat": "Wrapping", "name": "Full Car Wrapping Exterior Sedan (2y)", "price": 4000 },
        { "cat": "Wrapping", "name": "1 Panel Wrapping (2y)", "price": 600 },
        # ========== UPHOLSTERY ==========
        { "cat": "Upholstery", "name": "1 Seat Leather Replacement", "price": 800 },
        { "cat": "Upholstery", "name": "Full Car Seat Cover PVC Sedan", "price": 1800 },
        { "cat": "Upholstery", "name": "Full Car Seat Cover Original Leather Sedan", "price": 5000 },
        # ========== OTHER ==========
        { "cat": "Other", "name": "Installation of Alloygators", "price": 800 },
    ]

    for item in full_catalog:
        category, _ = ServiceCategory.objects.get_or_create(name=item['cat'])
        Service.objects.get_or_create(
            category=category,
            name=item['name'],
            defaults={'price': Decimal(str(item['price']))}
        )
    
    print(f"Successfully seeded {len(full_catalog)} services.")

if __name__ == "__main__":
    seed_services()

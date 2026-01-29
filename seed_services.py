import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from job_cards.models import Service, ServiceCategory

SERVICES_CATALOG = {
    'DETAILING': [
        { 'name': 'Sedan - Full Car Detailing (Interior + Exterior) - Silver Package', 'price': 300 },
        { 'name': 'SUV - Full Car Detailing (Interior + Exterior) - Silver Package', 'price': 350 },
        { 'name': '4x4 - Full Car Detailing (Interior + Exterior) - Silver Package', 'price': 400 },
        { 'name': 'Sedan - Full Car Premium Detailing - Gold Package', 'price': 500 },
        { 'name': 'SUV - Full Car Premium Detailing - Gold Package', 'price': 600 },
        { 'name': '4x4 - Full Car Premium Detailing - Gold Package', 'price': 700 },
        { 'name': 'Cobone (Sedan) - Full Car Detailing', 'price': 299 },
        { 'name': 'Cobone (SUV) - Full Car Detailing', 'price': 349 },
        { 'name': 'Groupon (Sedan) - Full Car Detailing', 'price': 399 },
        { 'name': 'Groupon (SUV) - Full Car Detailing', 'price': 429 },
        { 'name': 'Sedan - Full Car Interior Cleaning', 'price': 200 },
        { 'name': 'SUV - Full Car Interior Cleaning', 'price': 250 },
        { 'name': '4x4 - Full Car Interior Cleaning', 'price': 300 },
        { 'name': 'Sedan - Full Car Exterior Polish', 'price': 200 },
        { 'name': 'SUV - Full Car Exterior Polish', 'price': 250 },
        { 'name': '4x4 - Full Car Exterior Polish', 'price': 300 },
        { 'name': 'Sedan - Full Car Premium Interior Cleaning', 'price': 300 },
        { 'name': 'SUV - Full Car Premium Interior Cleaning', 'price': 400 },
        { 'name': '4x4 - Full Car Premium Interior Cleaning', 'price': 500 },
        { 'name': 'Sedan - Full Car Premium Exterior Polish', 'price': 300 },
        { 'name': 'SUV - Full Car Premium Exterior Polish', 'price': 400 },
        { 'name': '4x4 - Full Car Premium Exterior Polish', 'price': 500 },
        { 'name': 'Sedan - Interior Cleaning For Fabric Seats', 'price': 100 },
        { 'name': 'SUV - Interior Cleaning For Fabric Seats', 'price': 150 },
        { 'name': 'Sedan - Interior Cleaning For Leather Seats', 'price': 100 },
        { 'name': 'SUV - Interior Cleaning For Leather Seats', 'price': 150 },
        { 'name': 'Roof Cleaning', 'price': 100 },
        { 'name': 'HeadLight Polish', 'price': 100 },
        { 'name': 'Normal Wash', 'price': 80 },
        { 'name': 'Ceramic Wash', 'price': 100 },
        { 'name': '1 Panel Polish', 'price': 50 },
        { 'name': 'Interior Vacuum', 'price': 50 },
        { 'name': 'Seat Removal', 'price': 50 },
        { 'name': 'Seat Removal + Matt Removal', 'price': 100 },
        { 'name': 'Sedan - Full Car Sanding & Exterior Polish', 'price': 500 },
        { 'name': 'SUV - Full Car Sanding & Exterior Polish', 'price': 600 },
        { 'name': 'Sedan - Full Car Exterior Body Cement & Tar Removal', 'price': 500 },
        { 'name': 'SUV - Full Car Exterior Body Cement & Tar Removal', 'price': 600 },
        { 'name': 'Sedan - Full Car Exterior Body Waxing', 'price': 200 },
        { 'name': 'SUV - Full Car Exterior Body Waxing', 'price': 250 },
        { 'name': 'Sedan - Full Car Exterior Body Overspray Removal', 'price': 500 },
        { 'name': 'SUV - Full Car Exterior Body Overspray Removal', 'price': 600 }
    ],
    'CERAMIC COATING': [
        { 'name': 'Sedan - Full Car Ceramic Coating (2 Years Warranty)', 'price': 1000 },
        { 'name': 'SUV - Full Car Ceramic Coating (2 Years Warranty)', 'price': 1200 },
        { 'name': 'Sedan - Full Car Ceramic Coating (3 Years Warranty)', 'price': 1300 },
        { 'name': 'SUV - Full Car Ceramic Coating (3 Years Warranty)', 'price': 1500 },
        { 'name': 'Sedan - Full Car Ceramic Coating (5 Years Warranty)', 'price': 2000 },
        { 'name': 'SUV - Full Car Ceramic Coating (5 Years Warranty)', 'price': 2500 },
        { 'name': 'Sedan - Full Car Exterior Ceramic Coating (2 Years)', 'price': 800 },
        { 'name': 'SUV - Full Car Exterior Ceramic Coating (2 Years)', 'price': 1000 },
        { 'name': 'Sedan - Full Car Exterior Ceramic Coating (3 Years)', 'price': 1000 },
        { 'name': 'SUV - Full Car Exterior Ceramic Coating (3 Years)', 'price': 1300 },
        { 'name': 'Sedan - Full Car Exterior Ceramic Coating (5 Years)', 'price': 1600 },
        { 'name': 'SUV - Full Car Exterior Ceramic Coating (5 Years)', 'price': 2000 },
        { 'name': 'Sedan - Full Car Interior Ceramic Coating (2 Years)', 'price': 600 },
        { 'name': 'SUV - Full Car Interior Ceramic Coating (2 Years)', 'price': 800 },
        { 'name': 'Ceramic Coating for 1 Panel (No Warranty)', 'price': 300 },
        { 'name': 'Exterior Ceramic Maintenance + Interior Sedan - 1st Service', 'price': 200 },
        { 'name': 'Exterior Ceramic Maintenance + Interior Sedan - 2nd Service', 'price': 200 },
        { 'name': 'Exterior Ceramic Maintenance + Interior Sedan - 3rd Service', 'price': 200 },
        { 'name': 'Exterior Ceramic Maintenance + Interior Sedan - 4th Service', 'price': 200 },
        { 'name': 'Exterior Ceramic Maintenance + Interior SUV - 2nd Service', 'price': 250 },
        { 'name': 'Exterior Ceramic Maintenance + Interior SUV - 3rd Service', 'price': 250 },
        { 'name': 'Exterior Ceramic Maintenance + Interior SUV - 4th Service', 'price': 250 }
    ],
    'U POL RAPTOR PAINT': [
        { 'name': '1 Rim Painting', 'price': 150 },
        { 'name': '2 Rim Painting', 'price': 300 },
        { 'name': '3 Rim Painting', 'price': 450 },
        { 'name': '4 Rim Painting', 'price': 600 },
        { 'name': '1 Rim Painting (Double Color)', 'price': 300 },
        { 'name': '2 Rim Painting (Double Color)', 'price': 600 },
        { 'name': '3 Rim Painting (Double Color)', 'price': 900 },
        { 'name': '4 Rim Painting (Double Color)', 'price': 1200 },
        { 'name': 'Calliper Paint', 'price': 400 },
        { 'name': 'Reflective Calliper Paint', 'price': 800 },
        { 'name': 'Calliper Paint With Sticker', 'price': 500 },
        { 'name': 'Reflective Calliper Paint With Sticker', 'price': 900 },
        { 'name': 'Bonnet Paint', 'price': 500 },
        { 'name': 'Front Bumper Paint', 'price': 350 },
        { 'name': 'Front RHS Fender Paint', 'price': 350 },
        { 'name': 'Front LHS Fender Paint', 'price': 350 },
        { 'name': 'Front RHS Door Paint', 'price': 350 },
        { 'name': 'Front LHS Door Paint', 'price': 350 },
        { 'name': 'LHS Skirt Paint', 'price': 250 },
        { 'name': 'RHS Skirt Paint', 'price': 250 },
        { 'name': 'Roof Paint', 'price': 700 },
        { 'name': 'Rear RHS Door Paint', 'price': 350 },
        { 'name': 'Rear LHS Door Paint', 'price': 350 },
        { 'name': 'Trunk Paint', 'price': 500 },
        { 'name': 'Rear Bumper Paint', 'price': 350 },
        { 'name': 'Interior Part Paint (ANY)', 'price': 200 },
        { 'name': 'Full Sedan Car Paint (Exterior Only)', 'price': 4000 },
        { 'name': 'Full Sedan Car Paint (Exterior + Interior)', 'price': 5000 },
        { 'name': 'Full Sedan Car Paint (Accidental Car)', 'price': 6000 },
        { 'name': 'Full SUV Car Paint (Exterior Only)', 'price': 5000 },
        { 'name': 'Full SUV Car Paint (Exterior + Interior)', 'price': 6000 },
        { 'name': 'Black Edition', 'price': 1500 },
        { 'name': 'Black Edition With Rims', 'price': 2200 },
        { 'name': 'Black Edition With Rims & Callipers', 'price': 2500 },
        { 'name': 'Rust Proofing', 'price': 1000 }
    ],
    'PAINT PROTECTION FILM (PPF)': [
        { 'name': 'Sedan - Front Package PPF (Bumper, Bonnet, Fenders, Mirror, Headlight)', 'price': 2500 },
        { 'name': 'SUV - Front Package PPF (Bumper, Bonnet, Fenders, Mirror, Headlight)', 'price': 3000 },
        { 'name': 'Sedan - Full Car PPF Elite Pro 6.5mil Gloss (5 Years)', 'price': 5000 },
        { 'name': 'SUV - Full Car PPF Elite Pro 6.5mil Gloss (5 Years)', 'price': 6000 },
        { 'name': 'Sedan - Full Car PPF Elite Pro 8.5mil Gloss (10 Years)', 'price': 8000 },
        { 'name': 'SUV - Full Car PPF Elite Pro 8.5mil Gloss (10 Years)', 'price': 9000 },
        { 'name': 'Door Edge PPF', 'price': 200 },
        { 'name': 'Headlight PPF', 'price': 300 },
        { 'name': 'Both Side Mirror PPF', 'price': 400 }
    ]
}

def seed():
    for cat_name, services in SERVICES_CATALOG.items():
        cat, _ = ServiceCategory.objects.get_or_create(name=cat_name)
        for s in services:
            Service.objects.get_or_create(category=cat, name=s['name'], price=s['price'])
    print("Seeding Complete!")

if __name__ == '__main__':
    seed()

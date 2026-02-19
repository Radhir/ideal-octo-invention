import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from job_cards.models import Service, ServiceCategory
from decimal import Decimal

def seed_services():
    full_catalog = [
        # ========== DETAILING & CLEANING ==========
        { "cat": "Detailing & Cleaning", "name": "Fabric Interior Deep Cleaning (Seats, Floor Mat, Roof, Carpet)", "price": 450 },
        { "cat": "Detailing & Cleaning", "name": "Leather Interior Deep Cleaning (Seats, Floor Mat, Dash, Door, Carpet)", "price": 450 },
        { "cat": "Detailing & Cleaning", "name": "Interior Odor Removal", "price": 250 },
        { "cat": "Detailing & Cleaning", "name": "Paint Restoration / Clay Bar Treatment", "price": 350 },
        { "cat": "Detailing & Cleaning", "name": "Engine Bay Deep Cleaning & Dressing", "price": 250 },
        { "cat": "Detailing & Cleaning", "name": "Rim Deep Cleaning & Brake Dust Removal", "price": 150 },
        { "cat": "Detailing & Cleaning", "name": "Ceramic Wash & Infusion", "price": 150 },
        { "cat": "Detailing & Cleaning", "name": "Full Detailing (Interior + Exterior + Engine)", "price": 1200 },
        { "cat": "Detailing & Cleaning", "name": "Express Detailing (Basic Interior + Body Wax)", "price": 600 },

        # ========== DEEP CLEANING & POLISH ==========
        { "cat": "Deep Cleaning & Polish", "name": "Body Deep Wash", "price": 150 },
        { "cat": "Deep Cleaning & Polish", "name": "Stage 01 - Body Polish (Minor Scratches Removal)", "price": 600 },
        { "cat": "Deep Cleaning & Polish", "name": "Stage 02 - Body Polish (Minor & Major Scratches Removal)", "price": 800 },
        { "cat": "Deep Cleaning & Polish", "name": "Stage 03 - Body Polish (Mirror Finish)", "price": 1200 },

        # ========== PAINT PROTECTION FILM (PPF) ==========
        { "cat": "Paint Protection Film (PPF)", "name": "Full Body Satin PPF (High Gloss/Matte)", "price": 9500 },
        { "cat": "Paint Protection Film (PPF)", "name": "Full Body Clear PPF", "price": 8500 },
        { "cat": "Paint Protection Film (PPF)", "name": "Front Body PPF (Bumper & Hood)", "price": 2500 },
        { "cat": "Paint Protection Film (PPF)", "name": "Interior Wood & Screen PPF", "price": 600 },
        { "cat": "Paint Protection Film (PPF)", "name": "Rim Edge PPF (Per Wheel)", "price": 150 },
        { "cat": "Paint Protection Film (PPF)", "name": "Door Edge PPF (Set of 4)", "price": 200 },
        { "cat": "Paint Protection Film (PPF)", "name": "Door Handle PPF (Set of 4)", "price": 200 },
        { "cat": "Paint Protection Film (PPF)", "name": "Side Mirror PPF (Set of 2)", "price": 200 },
        { "cat": "Paint Protection Film (PPF)", "name": "Headlight & Fog Light PPF", "price": 300 },

        # ========== CERAMIC COATING ==========
        { "cat": "Ceramic Coating", "name": "Platinum Packages (Body + Rims + Glass + Leather + Engine)", "price": 3500 },
        { "cat": "Ceramic Coating", "name": "Gold Packages (Body + Glass + Leather)", "price": 2500 },
        { "cat": "Ceramic Coating", "name": "Silver Packages (Body Only)", "price": 1500 },
        { "cat": "Ceramic Coating", "name": "Rim Ceramic Coating (Per Wheel)", "price": 150 },
        { "cat": "Ceramic Coating", "name": "Leather & Interior Ceramic Coating", "price": 600 },
        { "cat": "Ceramic Coating", "name": "Glass Ceramic Coating (Full Car)", "price": 400 },
        { "cat": "Ceramic Coating", "name": "Matte Ceramic Coating", "price": 2500 },

        # ========== WINDSHIELD PROTECTION ==========
        { "cat": "Windshield Protection", "name": "Front Body Windshield (Inside)", "price": 400 },
        { "cat": "Windshield Protection", "name": "Front Body Windshield (Outside)", "price": 600 },
        { "cat": "Windshield Protection", "name": "Window Tints (Basic)", "price": 800 },
        { "cat": "Windshield Protection", "name": "Window Tints (Premium/Heat Rejection)", "price": 1500 },

        # ========== LEATHER PROTECTION ==========
        { "cat": "Leather Protection", "name": "Deep Leather Cleaning & Restoration", "price": 450 },
        { "cat": "Leather Protection", "name": "Leather Dyeing & Repair", "price": 600 },

        # ========== RESTORATION & MODIFICATION ==========
        { "cat": "Restoration & Modification", "name": "Caliper Painting", "price": 600 },
        { "cat": "Restoration & Modification", "name": "Rim Painting (Per Wheel)", "price": 150 },
        { "cat": "Restoration & Modification", "name": "Full Body Wrap (Color Change)", "price": 7500 },
        { "cat": "Restoration & Modification", "name": "De-Chrome Package", "price": 1200 },
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

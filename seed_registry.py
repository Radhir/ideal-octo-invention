import os
import django
import sys

# Setup Django
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from masters.models import VehicleBrand, VehicleModel

VEHICLE_DATA = {
    "Toyota": ["Camry", "Corolla", "Land Cruiser", "Prado", "Hilux", "Yaris", "RAV4", "Fortuner", "Supra", "Highlander", "C-HR", "Innova", "Avalon", "FJ Cruiser", "Sequoia", "Tundra", "Tacoma", "Sienna", "Prius", "Mirai", "86", "GR Yaris"],
    "Nissan": ["Patrol", "Altima", "Sunny", "Sentra", "X-Trail", "Pathfinder", "Kicks", "Maxima", "Juke", "Murano", "Armada", "Titan", "Frontier", "Navara", "GT-R", "370Z", "Z", "Leaf", "Urvan", "Civilian"],
    "Lexus": ["LX", "ES", "IS", "RX", "GX", "LS", "NX", "UX", "RC", "LC", "LFA", "LM"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "G-Class", "GLE", "GLC", "GLA", "GLS", "A-Class", "CLA", "CLS", "SL", "AMG GT", "EQS", "EQE", "EQC", "EQA", "EQB", "V-Class", "Sprinter"],
    "BMW": ["3 Series", "5 Series", "7 Series", "X5", "X3", "X7", "X6", "X1", "X2", "X4", "4 Series", "8 Series", "Z4", "M3", "M4", "M5", "iX", "i4", "i7", "XM"],
    "Audi": ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "RS Q8", "RS 6", "RS 7", "R8", "TT", "A5", "A7", "S8", "SQ8", "SQ5"],
    "Land Rover": ["Range Rover", "Range Rover Sport", "Defender", "Discovery", "Discovery Sport", "Range Rover Velar", "Range Rover Evoque", "Freelander"],
    "Porsche": ["Cayenne", "Macan", "911", "Panamera", "Taycan", "718 Boxster", "718 Cayman", "918 Spyder"],
    "Ford": ["F-150", "Mustang", "Explorer", "Edge", "Expedition", "Ranger", "Bronco", "Territory", "Taurus", "Escape", "Focus", "Fiesta", "GT", "Transit"],
    "Chevrolet": ["Tahoe", "Suburban", "Silverado", "Camaro", "Corvette", "Malibu", "Traverse", "Blazer", "Equinox", "Groove", "Captiva", "Spark", "Bolt"],
    "Honda": ["Accord", "Civic", "CR-V", "Pilot", "City", "HR-V", "Odyssey", "Jazz", "Ridgeline", "Passport"],
    "Hyundai": ["Tucson", "Santa Fe", "Elantra", "Sonata", "Accent", "Creta", "Palisade", "Kona", "Veloster", "Azera", "Staria", "Ioniq 5"],
    "Kia": ["Sportage", "Sorento", "Telluride", "K5", "Cerato", "Rio", "Picanto", "Carnival", "Seltos", "Sonet", "Stinger", "EV6"],
    "Volkswagen": ["Golf", "Touareg", "Tiguan", "Teramont", "Passat", "Jetta", "Arteon", "T-Roc", "ID.4", "Beetle", "Scirocco"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Gladiator", "Cherokee", "Compass", "Renegade", "Wagoneer"],
    "GMC": ["Yukon", "Sierra", "Terrain", "Acadia", "Hummer EV"],
    "Dodge": ["Charger", "Challenger", "Durango", "Ram", "Viper", "Neon"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
    "Rolls-Royce": ["Cullinan", "Phantom", "Ghost", "Wraith", "Dawn", "Spectre"],
    "Bentley": ["Bentayga", "Continental GT", "Flying Spur", "Mulsanne"],
    "Lamborghini": ["Urus", "Huracan", "Aventador", "Revuelto", "Countach"],
    "Ferrari": ["SF90", "F8 Tributo", "Roma", "Portofino", "812 Superfast", "296 GTB", "Purosangue", "Daytona SP3"],
    "Maserati": ["Levante", "Ghibli", "Quattroporte", "MC20", "Grecale", "GranTurismo"],
    "Aston Martin": ["DBX", "Vantage", "DB11", "DBS", "Valhalla", "Valkyrie"],
    "Bugatti": ["Chiron", "Veyron", "Bolide", "Mistral"],
    "McLaren": ["720S", "765LT", "GT", "Artura", "Senna", "P1", "Speedtail"],
    "Infiniti": ["QX80", "QX60", "QX50", "Q50", "Q60", "QX55"],
    "Cadillac": ["Escalade", "CT5", "CT4", "XT6", "XT5", "XT4", "Lyriq", "Celestiq"],
    "Lincoln": ["Navigator", "Aviator", "Nautilus", "Corsair", "Zephyr"],
    "Volvo": ["XC90", "XC60", "XC40", "S90", "S60", "V90", "V60", "C40"],
    "Jaguar": ["F-Pace", "E-Pace", "I-Pace", "F-Type", "XF", "XE", "XJ"],
    "Mini": ["Cooper", "Countryman", "Clubman"],
    "Subaru": ["Outback", "Forester", "Crosstrek", "WRX", "BRZ", "Impreza"],
    "Mazda": ["CX-5", "CX-9", "CX-30", "Mazda3", "Mazda6", "MX-5"],
    "Mitsubishi": ["Pajero", "Outlander", "Montero Sport", "ASX", "Eclipse Cross", "L200", "Attrage", "Mirage"],
    "Suzuki": ["Jimny", "Swift", "Vitara", "Grand Vitara", "Baleno", "Ciaz", "Ertiga"],
    "Peugeot": ["3008", "5008", "208", "2008", "508", "Traveller"],
    "Renault": ["Duster", "Koleos", "Megane", "Symbol", "Zoe"],
    "Citroen": ["C3", "C4", "C5 Aircross", "Berlingo"],
    "Fiat": ["500", "500X", "Abarth 595"],
    "Alfa Romeo": ["Stelvio", "Giulia", "Tonale"],
    "Genesis": ["GV80", "GV70", "G80", "G90", "G70"],
    "Hongqi": ["H9", "E-HS9", "H5", "HS5"],
    "Jetour": ["X70", "X90", "Dashing", "T2"],
    "Geely": ["Coolray", "Tugella", "Monjaro", "Emgrand", "Azkarra"],
    "Haval": ["H6", "Jolion", "Dargo", "H9"],
    "Changan": ["UNI-K", "UNI-T", "CS95", "CS85", "CS75", "Alsvin"],
    "BYD": ["Han", "Tang", "Atto 3", "Seal", "Song"],
    "Other": ["Other"]
}

def seed():
    print("Starting seeding...")
    for brand_name, models in VEHICLE_DATA.items():
        brand, created = VehicleBrand.objects.get_or_create(name=brand_name)
        if created:
            print(f"Created Brand: {brand_name}")
        for model_name in models:
            model, m_created = VehicleModel.objects.get_or_create(brand=brand, name=model_name)
            if m_created:
                print(f"  Created Model: {model_name}")
    print("Seeding complete.")

if __name__ == "__main__":
    seed()

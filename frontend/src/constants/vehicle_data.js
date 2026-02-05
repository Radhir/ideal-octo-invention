export const CAR_BRANDS = [
    'Audi', 'BMW', 'Bentley', 'Chevrolet', 'Dodge', 'Ferrari', 'Ford', 'GMC', 'Honda',
    'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus',
    'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan',
    'Porsche', 'RAM', 'Rolls-Royce', 'Tesla', 'Toyota', 'Volkswagen', 'Other'
];

export const CAR_MODELS = {
    'Audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'RS6', 'RS7', 'R8', 'e-tron'],
    'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', '8 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'M3', 'M4', 'M5', 'iX', 'XM'],
    'Bentley': ['Bentayga', 'Continental GT', 'Flying Spur'],
    'Chevrolet': ['Camaro', 'Corvette', 'Tahoe', 'Suburban', 'Silverado', 'Captiva'],
    'Dodge': ['Challenger', 'Charger', 'Durango', 'RAM'],
    'Ferrari': ['488', '812', 'F8', 'Portofino', 'SF90', 'Roma', 'Purosangue'],
    'Ford': ['Mustang', 'Explorer', 'Expedition', 'F-150', 'Edge', 'Ranger', 'Focus'],
    'GMC': ['Sierra', 'Yukon', 'Acadia', 'Terrain'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'],
    'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Creta'],
    'Infiniti': ['Q50', 'QX50', 'QX60', 'QX80'],
    'Jaguar': ['F-Type', 'F-Pace', 'E-Pace', 'XF'],
    'Jeep': ['Wrangler', 'Grand Cherokee', 'Gladiator', 'Compass'],
    'Kia': ['Sportage', 'Sorento', 'Telluride', 'K5', 'Stinger'],
    'Lamborghini': ['Aventador', 'Huracan', 'Urus', 'Revuelto'],
    'Land Rover': ['Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Evoque', 'Defender', 'Discovery'],
    'Lexus': ['IS', 'ES', 'LS', 'NX', 'RX', 'GX', 'LX'],
    'Maserati': ['Ghibli', 'Levante', 'Quattroporte', 'Grecale'],
    'Mazda': ['CX-3', 'CX-30', 'CX-5', 'CX-9', 'Mazda3', 'Mazda6'],
    'McLaren': ['720S', '765LT', 'Artura', 'GT'],
    'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'G-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'EQS', 'EQE', 'AMG GT'],
    'Mini': ['Cooper', 'Countryman', 'Clubman'],
    'Mitsubishi': ['Pajero', 'ASX', 'Eclipse Cross', 'Outlander', 'L200', 'Montero Sport'],
    'Nissan': ['Patrol', 'Altima', 'Maxima', 'Sunny', 'X-Trail', 'Pathfinder', 'Z'],
    'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster', 'Cayman'],
    'RAM': ['1500', '2500', 'TRX'],
    'Rolls-Royce': ['Ghost', 'Phantom', 'Cullinan', 'Wraith', 'Dawn', 'Spectre'],
    'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
    'Toyota': ['Land Cruiser', 'Camry', 'Corolla', 'Hilux', 'Prado', 'RAV4', 'Fortuner', 'Supra', 'Hiace', 'Coaster'],
    'Volkswagen': ['Golf', 'Tiguan', 'Teramont', 'Touareg', 'Passat'],
    'Other': []
};

export const CAR_COLORS = [
    'Arctic White', 'Deep Black', 'Gunmetal Grey', 'Silver Metallic', 'Navy Blue',
    'Racing Red', 'Emerald Green', 'Golden Bronze', 'Champagne Gold', 'Matte Black',
    'Nardo Grey', 'Chalk', 'Miami Blue', 'Lava Orange', 'British Racing Green',
    'Sepang Blue', 'Frozen White', 'Satin Black', 'Pearl White', 'Ruby Red'
];

export const YEAR_CHOICES = Array.from({ length: 2026 - 1950 + 1 }, (_, i) => (2026 - i).toString());

export const PLATE_EMIRATES = [
    'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah', 'Saudi Arabia', 'Oman'
];

// UAE Plate Codes (A to ZZ)
const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const codes = [];
alpha.forEach(a => {
    codes.push(a);
    alpha.forEach(b => {
        codes.push(a + b);
    });
});
// Sharjah Numeric (1-99)
for (let i = 1; i <= 99; i++) {
    codes.push(i.toString());
}
export const PLATE_CODES = codes;

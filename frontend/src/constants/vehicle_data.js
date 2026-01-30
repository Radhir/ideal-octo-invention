export const CAR_BRANDS = [
    'Abarth', 'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti',
    'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroën', 'Dacia', 'Daewoo', 'Daihatsu',
    'Dodge', 'Ferrari', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hummer',
    'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Koenigsegg', 'Lamborghini',
    'Lancia', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati', 'Maybach', 'Mazda',
    'McLaren', 'Mercedes-Benz', 'MG', 'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Pagani',
    'Peugeot', 'Pontiac', 'Porsche', 'RAM', 'Renault', 'Rolls-Royce', 'Saab', 'Saturn',
    'Scion', 'SEAT', 'Skoda', 'Smart', 'SsangYong', 'Subaru', 'Suzuki', 'Tesla',
    'Toyota', 'Volkswagen', 'Volvo', 'Other'
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

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const generateRooms = (loc) => {
    const list = [];
    let idCounter = loc === 'bandung' ? 100 : 200;

    const addRoom = (floor, type, name, price, facilities) => {
        const prefix = loc === 'bandung' ? 'BDG' : 'SLO';
        const typeLetter = type === 'standar' ? 'S' : (type === 'deluxe' ? 'D' : 'V');
        
        // Simple counter for room number logic to match the frontend
        const count = list.filter(r => r.type === type).length + 1;
        const number = `${prefix}-${typeLetter}${String(count).padStart(2, '0')}`;
        
        // Default facilities
        let facs = ["AC", "Meja", "Kasur", "WiFi Pribadi"];
        if (type === 'deluxe') facs.push("Lemari", "Kamar Mandi Dalam");
        if (type === 'vip') facs.push("Lemari", "Kamar Mandi Dalam", "Kulkas", "TV");

        list.push({
            name: `Kamar ${type.charAt(0).toUpperCase() + type.slice(1)} ${loc.charAt(0).toUpperCase() + loc.slice(1)}`,
            room_number: number,
            type: type,
            price: price,
            floor: floor,
            location: loc,
            status: "Tersedia",
            size: type === 'vip' ? "5x5 meter" : (type === 'deluxe' ? "4x4 meter" : "3x3 meter"),
            facilities: JSON.stringify(facs),
            rating: type === 'vip' ? 5.0 : (type === 'deluxe' ? 4.8 : 4.5),
            image: `images/room-${type}.jpg`
        });
    };

    // Lantai 1: 4 standard, 3 deluxe
    for (let i = 1; i <= 4; i++) addRoom(1, 'standar', '', 13500000, []);
    for (let i = 1; i <= 3; i++) addRoom(1, 'deluxe', '', 14500000, []);
    // Lantai 2: 6 standard, 4 vip
    for (let i = 1; i <= 6; i++) addRoom(2, 'standar', '', 13500000, []);
    for (let i = 1; i <= 4; i++) addRoom(2, 'vip', '', 15500000, []);
    // Lantai 3: 6 standard, 4 vip
    for (let i = 1; i <= 6; i++) addRoom(3, 'standar', '', 13500000, []);
    for (let i = 1; i <= 4; i++) addRoom(3, 'vip', '', 15500000, []);
    // Lantai 4: 5 standard
    for (let i = 1; i <= 5; i++) addRoom(4, 'standar', '', 13500000, []);

    return list;
};

const runSeed = async () => {
    try {
        const bandungRooms = generateRooms('bandung');
        const soloRooms = generateRooms('solo');
        const allRooms = [...bandungRooms, ...soloRooms];
        
        console.log(`Seeding ${allRooms.length} rooms to Supabase...`);
        
        const { data, error } = await supabase
            .from('rooms')
            .insert(allRooms)
            .select();
            
        if (error) throw error;
        
        console.log('Successfully seeded database!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to seed:', err);
        process.exit(1);
    }
};

runSeed();

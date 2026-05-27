document.addEventListener('DOMContentLoaded', () => {

    // Helper to match data from user.html
    const generateRooms = (loc) => {
        const list = [];
        let idCounter = loc === 'bandung' ? 100 : 200;

        const addRoom = (floor, type, name, price, facilities) => {
            const status = idCounter % 5 === 0 ? "Sedang Perbaikan" : (idCounter % 3 === 0 ? "Tidak Tersedia" : "Tersedia");
            list.push({
                id: idCounter++,
                type: type,
                price: price,
                location: loc,
                status: status
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

    let roomsData = JSON.parse(localStorage.getItem('pt_rooms_data'));
    if (!roomsData) {
        roomsData = {
            bandung: generateRooms('bandung'),
            solo: generateRooms('solo')
        };
        localStorage.setItem('pt_rooms_data', JSON.stringify(roomsData));
    }

    const bandungRooms = roomsData.bandung;
    const soloRooms = roomsData.solo;

    // Aggregate Function
    const aggregateData = (roomsArray) => {
        let total = roomsArray.length;
        let occupied = 0;
        let empty = 0;
        let revenue = 0;

        let typeOccupancy = {
            standar: 0,
            deluxe: 0,
            vip: 0
        };

        roomsArray.forEach(room => {
            // "Tidak Tersedia" implies occupied/booked in user flow. 
            // "Sedang Perbaikan" can be counted as unoccupied but unavailable, but let's count only "Tersedia" as Empty, others as Occupied for revenue.
            // Let's assume "Tidak Tersedia" = Occupied (generating revenue)
            if (room.status === "Tidak Tersedia" || room.status === "Terisi") {
                occupied++;
                revenue += room.price;
                typeOccupancy[room.type]++;
            } else if (room.status === "Tersedia") {
                empty++;
            }
            // If Sedang Perbaikan, it's neither empty (available) nor occupied (generating revenue). We'll keep total = occupied + empty + maintenance, but the UI only asks for Terisi vs Kosong. 
        });

        return { total, occupied, empty, revenue, typeOccupancy };
    };

    const dataBdg = aggregateData(bandungRooms);
    const dataSolo = aggregateData(soloRooms);

    // Update DOM for Summary Cards
    document.getElementById('valTotalRoomsBdg').innerText = dataBdg.total;
    document.getElementById('valTotalRoomsSolo').innerText = dataSolo.total;

    document.getElementById('valOccupiedRoomsBdg').innerText = dataBdg.occupied;
    document.getElementById('valOccupiedRoomsSolo').innerText = dataSolo.occupied;

    document.getElementById('valEmptyRoomsBdg').innerText = dataBdg.empty;
    document.getElementById('valEmptyRoomsSolo').innerText = dataSolo.empty;

    document.getElementById('valRevenueBdg').innerText = 'Rp ' + dataBdg.revenue.toLocaleString('id-ID');
    document.getElementById('valRevenueSolo').innerText = 'Rp ' + dataSolo.revenue.toLocaleString('id-ID');

    const grandTotalRevenue = dataBdg.revenue + dataSolo.revenue;
    document.getElementById('valTotalRevenue').innerText = 'Rp ' + grandTotalRevenue.toLocaleString('id-ID');

    // Render Charts (Bar Charts for Bandung and Solo)
    const ctxBdg = document.getElementById('roomChartBdg').getContext('2d');
    const ctxSolo = document.getElementById('roomChartSolo').getContext('2d');

    const chartOptions = {
        type: 'bar',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    };

    new Chart(ctxBdg, {
        ...chartOptions,
        data: {
            labels: ['Standar', 'Deluxe', 'VIP'],
            datasets: [{
                label: 'Penghuni',
                data: [dataBdg.typeOccupancy.standar, dataBdg.typeOccupancy.deluxe, dataBdg.typeOccupancy.vip],
                backgroundColor: ['#667eea', '#db2777', '#f59e0b'],
                borderRadius: 4,
                barThickness: 25
            }]
        }
    });

    new Chart(ctxSolo, {
        ...chartOptions,
        data: {
            labels: ['Standar', 'Deluxe', 'VIP'],
            datasets: [{
                label: 'Penghuni',
                data: [dataSolo.typeOccupancy.standar, dataSolo.typeOccupancy.deluxe, dataSolo.typeOccupancy.vip],
                backgroundColor: ['#667eea', '#db2777', '#f59e0b'],
                borderRadius: 4,
                barThickness: 25
            }]
        }
    });

    // Update Date Display
    const dateDisplay = document.getElementById('currentDate');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.innerText = new Date().toLocaleDateString('id-ID', options);
    }
});

// Logout logic
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('pt_isAdmin');
        window.location.href = 'user.html';
    });
});


document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'https://web-pondok-titis.onrender.com/api';

    const initDashboard = async () => {
        try {
            const res = await fetch(`${API_URL}/rooms`);
            if (!res.ok) throw new Error('Failed to fetch rooms');
            const data = await res.json();
            
            const bandungRooms = data.filter(r => r.location === 'bandung');
            const soloRooms = data.filter(r => r.location !== 'bandung'); // assume solo

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
                    if (room.status === "Tidak Tersedia" || room.status === "Terisi") {
                        occupied++;
                        revenue += room.price || 0;
                        typeOccupancy[room.type || 'standar'] = (typeOccupancy[room.type || 'standar'] || 0) + 1;
                    } else if (room.status === "Tersedia") {
                        empty++;
                    }
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
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                    plugins: { legend: { display: false } }
                }
            };

            new Chart(ctxBdg, {
                ...chartOptions,
                data: {
                    labels: ['Standar', 'Deluxe', 'VIP'],
                    datasets: [{
                        label: 'Kamar Terisi',
                        data: [dataBdg.typeOccupancy.standar, dataBdg.typeOccupancy.deluxe, dataBdg.typeOccupancy.vip],
                        backgroundColor: ['#6366f1', '#a855f7', '#ec4899'],
                        borderRadius: 4
                    }]
                }
            });

            new Chart(ctxSolo, {
                ...chartOptions,
                data: {
                    labels: ['Standar', 'Deluxe', 'VIP'],
                    datasets: [{
                        label: 'Kamar Terisi',
                        data: [dataSolo.typeOccupancy.standar, dataSolo.typeOccupancy.deluxe, dataSolo.typeOccupancy.vip],
                        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                        borderRadius: 4
                    }]
                }
            });

            // Update current date
            const currentDate = document.getElementById('currentDate');
            if (currentDate) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                currentDate.innerText = new Date().toLocaleDateString('id-ID', options);
            }
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        }
    };

    initDashboard();
});

// Logout logic
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = '/';
    });
});


document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // INITIAL DATA LOADING & CALCULATIONS
    // ==========================================
    const getRoomsData = () => {
        let data = localStorage.getItem('pt_rooms_data');
        if (!data) {
            // Default rooms generator fallback (same logic)
            const generateDefaultRooms = (loc) => {
                const list = [];
                let idCounter = loc === 'bandung' ? 100 : 200;
                let countStandar = 1; let countDeluxe = 1; let countVip = 1;
                
                const addRoom = (floor, type, price) => {
                    const prefix = loc === 'bandung' ? 'BDG' : 'SLO';
                    let code = "";
                    if (type === 'standar') code = `${prefix}-S${String(countStandar++).padStart(2, '0')}`;
                    else if (type === 'deluxe') code = `${prefix}-D${String(countDeluxe++).padStart(2, '0')}`;
                    else code = `${prefix}-V${String(countVip++).padStart(2, '0')}`;
                    
                    const status = idCounter % 5 === 0 ? "Sedang Perbaikan" : (idCounter % 3 === 0 ? "Terisi" : (idCounter % 7 === 0 ? "Tidak Tersedia" : "Tersedia"));
                    list.push({ id: idCounter++, number: code, type: type, price: price, floor: floor, location: loc, status: status });
                };

                for (let i = 1; i <= 4; i++) addRoom(1, 'standar', 13500000);
                for (let i = 1; i <= 3; i++) addRoom(1, 'deluxe', 14500000);
                for (let i = 1; i <= 6; i++) addRoom(2, 'standar', 13500000);
                for (let i = 1; i <= 4; i++) addRoom(2, 'vip', 15500000);
                for (let i = 1; i <= 6; i++) addRoom(3, 'standar', 13500000);
                for (let i = 1; i <= 4; i++) addRoom(3, 'vip', 15500000);
                for (let i = 1; i <= 5; i++) addRoom(4, 'standar', 13500000);
                return list;
            };

            const initialRooms = { bandung: generateDefaultRooms('bandung'), solo: generateDefaultRooms('solo') };
            localStorage.setItem('pt_rooms_data', JSON.stringify(initialRooms));
            return initialRooms;
        }
        return JSON.parse(data);
    };

    const roomsDatabase = getRoomsData();

    // ==========================================
    // METRICS COMPUTATION
    // ==========================================
    const computeMetrics = () => {
        const bdgList = roomsDatabase.bandung;
        const soloList = roomsDatabase.solo;

        // Bandung calculations
        const totalBdg = bdgList.length;
        const occupiedBdg = bdgList.filter(r => r.status === "Terisi").length;
        const revenueBdg = bdgList.filter(r => r.status === "Terisi").reduce((sum, r) => sum + r.price, 0);

        // Solo calculations
        const totalSolo = soloList.length;
        const occupiedSolo = soloList.filter(r => r.status === "Terisi").length;
        const revenueSolo = soloList.filter(r => r.status === "Terisi").reduce((sum, r) => sum + r.price, 0);

        // Combined calculations
        const grandTotal = totalBdg + totalSolo;
        const grandOccupied = occupiedBdg + occupiedSolo;
        const grandRevenue = revenueBdg + revenueSolo;
        
        const overallRate = grandTotal > 0 ? ((grandOccupied / grandTotal) * 100).toFixed(1) : "0.0";

        return {
            totalBdg, occupiedBdg, revenueBdg,
            totalSolo, occupiedSolo, revenueSolo,
            grandTotal, grandOccupied, grandRevenue, overallRate
        };
    };

    const metrics = computeMetrics();

    // Update DOM texts
    document.getElementById('repRevenueBdg').innerText = `Rp ${metrics.revenueBdg.toLocaleString('id-ID')}`;
    document.getElementById('repRevenueSolo').innerText = `Rp ${metrics.revenueSolo.toLocaleString('id-ID')}`;
    document.getElementById('repTotalRevenue').innerText = `Rp ${metrics.grandRevenue.toLocaleString('id-ID')}`;
    document.getElementById('repOverallRate').innerText = `${metrics.overallRate}%`;
    document.getElementById('repOccupiedFraction').innerText = `${metrics.grandOccupied} dari ${metrics.grandTotal} kamar terisi`;
    document.getElementById('txtFractionBdg').innerText = `${metrics.occupiedBdg} / ${metrics.totalBdg} Kamar Terisi`;
    document.getElementById('txtFractionSolo').innerText = `${metrics.occupiedSolo} / ${metrics.totalSolo} Kamar Terisi`;

    // Update print page date
    const printDate = document.getElementById('printDate');
    if (printDate) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        printDate.innerText = `Tanggal Laporan: ${new Date().toLocaleDateString('id-ID', options)}`;
    }

    // ==========================================
    // RENDER MONTHLY BREAKDOWN
    // ==========================================
    const renderMonthlyBreakdown = () => {
        const tbody = document.getElementById('monthlyRevenueBody');
        tbody.innerHTML = "";

        // Deterministic monthly split proportions
        const months = [
            { name: "Januari", bdgProp: 0.22, soloProp: 0.20 },
            { name: "Februari", bdgProp: 0.18, soloProp: 0.22 },
            { name: "Maret", bdgProp: 0.20, soloProp: 0.16 },
            { name: "April", bdgProp: 0.20, soloProp: 0.22 },
            { name: "Mei 2026", bdgProp: 0.20, soloProp: 0.20 } // current month
        ];

        months.forEach(m => {
            const mBdg = Math.round(metrics.revenueBdg * m.bdgProp);
            const mSolo = Math.round(metrics.revenueSolo * m.soloProp);
            const mTotal = mBdg + mSolo;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600; color: var(--text);">${m.name}</td>
                <td>Rp ${mBdg.toLocaleString('id-ID')}</td>
                <td>Rp ${mSolo.toLocaleString('id-ID')}</td>
                <td style="text-align: right; font-weight: 700; color: var(--primary);">Rp ${mTotal.toLocaleString('id-ID')}</td>
            `;
            tbody.appendChild(tr);
        });
    };

    renderMonthlyBreakdown();

    // ==========================================
    // CHART.JS PIE CHARTS CREATION (BULAT PIPIH)
    // ==========================================
    const renderCharts = () => {
        const ctxBdg = document.getElementById('occupancyChartBdg').getContext('2d');
        const ctxSolo = document.getElementById('occupancyChartSolo').getContext('2d');

        const chartConfig = (occupied, empty) => ({
            type: 'doughnut',
            data: {
                labels: ['Terisi', 'Kosong / Maint.'],
                datasets: [{
                    data: [occupied, empty],
                    backgroundColor: ['#1e40af', '#e2e8f0'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const val = context.raw;
                                const total = occupied + empty;
                                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                return ` ${context.label}: ${val} Kamar (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });

        // Bandung Chart
        new Chart(ctxBdg, chartConfig(metrics.occupiedBdg, metrics.totalBdg - metrics.occupiedBdg));

        // Solo Chart
        new Chart(ctxSolo, chartConfig(metrics.occupiedSolo, metrics.totalSolo - metrics.occupiedSolo));
    };

    renderCharts();

    // ==========================================
    // ACTION: PRINT REPORT
    // ==========================================
    document.getElementById('btnPrintReport').addEventListener('click', () => {
        window.print();
    });

    // ==========================================
    // ACTION: EXPORT CONSOLIDATED EXCEL CSV
    // ==========================================
    const exportAnalytics = () => {
        let csvContent = "\uFEFF"; // BOM UTF-8 for Excel

        // Report Title block
        csvContent += "LAPORAN ANALIS KEUANGAN & OKUPANSI PONDOK TITIS\n";
        csvContent += `Tanggal Cetak,${new Date().toLocaleDateString('id-ID')}\n\n`;

        // Section 1: Occupancy Stats
        csvContent += "1. RINGKASAN KAPASITAS OKUPANSI KAMAR\n";
        csvContent += "Cabang,Kamar Terisi,Total Kamar,Persentase Okupansi\n";
        csvContent += `Bandung,${metrics.occupiedBdg},${metrics.totalBdg},${((metrics.occupiedBdg/metrics.totalBdg)*100).toFixed(1)}%\n`;
        csvContent += `Solo,${metrics.occupiedSolo},${metrics.totalSolo},${((metrics.occupiedSolo/metrics.totalSolo)*100).toFixed(1)}%\n`;
        csvContent += `Total Gabungan,${metrics.grandOccupied},${metrics.grandTotal},${metrics.overallRate}%\n\n`;

        // Section 2: Revenue Stats
        csvContent += "2. RINGKASAN PENDAPATAN TAHUNAN\n";
        csvContent += "Kategori,Bandung,Solo,Total Akumulasi\n";
        csvContent += `Total Revenue,${metrics.revenueBdg},${metrics.revenueSolo},${metrics.grandRevenue}\n\n`;

        // Section 3: Monthly Breakdown
        csvContent += "3. RINCIAN BULANAN TAHUN INI\n";
        csvContent += "Bulan,Cabang Bandung,Cabang Solo,Total Bulanan\n";

        const months = [
            { name: "Januari", bdgProp: 0.22, soloProp: 0.20 },
            { name: "Februari", bdgProp: 0.18, soloProp: 0.22 },
            { name: "Maret", bdgProp: 0.20, soloProp: 0.16 },
            { name: "April", bdgProp: 0.20, soloProp: 0.22 },
            { name: "Mei 2026", bdgProp: 0.20, soloProp: 0.20 }
        ];

        months.forEach(m => {
            const mBdg = Math.round(metrics.revenueBdg * m.bdgProp);
            const mSolo = Math.round(metrics.revenueSolo * m.soloProp);
            const mTotal = mBdg + mSolo;
            csvContent += `"${m.name}",${mBdg},${mSolo},${mTotal}\n`;
        });

        // Trigger file download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `rekap_laporan_analitik_kos_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    document.getElementById('btnExportAnalytics').addEventListener('click', exportAnalytics);

    // Current date header update
    const currentDate = document.getElementById('currentDate');
    if (currentDate) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDate.innerText = new Date().toLocaleDateString('id-ID', options);
    }
});

// Logout logic
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('pt_isAdmin');
        window.location.href = 'user.html';
    });
});


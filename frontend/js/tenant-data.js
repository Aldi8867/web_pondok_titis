document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // INITIAL DATA LOADING & SYNCHRONIZATION
    // ==========================================
    const getRoomsData = () => {
        let data = localStorage.getItem('pt_rooms_data');
        return data ? JSON.parse(data) : null;
    };

    const saveRoomsData = (data) => {
        localStorage.setItem('pt_rooms_data', JSON.stringify(data));
    };

    // Female names pool for Pondok Titis (female-only kosan!)
    const femaleNames = [
        "Siti Aminah", "Ayu Lestari", "Dian Sastrowardoyo", "Ririn Indriani",
        "Amanda Manopo", "Sri Wahyuni", "Indah Permatasari", "Fitri Handayani",
        "Mega Utami", "Dewi Sartika", "Putri Rahayu", "Siti Rahma",
        "Novianti Eka", "Dwi Lestari", "Endang Sulastri", "Kartika Sari",
        "Niken Wijayanti", "Citra Kirana", "Lia Novita", "Ratih Purwasih",
        "Wulan Guritno", "Gisella Anastasia", "Bunga Citra Lestari", "Maudy Ayunda",
        "Chelsea Islan", "Pevita Pearce", "Tatjana Saphira", "Prilly Latuconsina"
    ];

    const originCities = ["Jakarta", "Surabaya", "Semarang", "Yogyakarta", "Medan", "Malang", "Makassar", "Palembang"];
    const jobs = ["Mahasiswi ITB", "Karyawati BUMN", "Mahasiswi UNPAD", "Karyawati Startup", "Mahasiswi UPI", "Karyawati Bank BCA", "Karyawati Unilever"];

    // Deterministic Generator of Tenants from occupied rooms
    const generateDefaultTenants = (rooms) => {
        if (!rooms) return [];
        const tenants = [];
        const allRooms = [...rooms.bandung, ...rooms.solo];
        
        // Scan rooms with "Tidak Tersedia" (occupied/booked) status
        allRooms.forEach(room => {
            if (room.status === "Terisi") {
                const nameIndex = room.id % femaleNames.length;
                const fullname = femaleNames[nameIndex];
                const email = `${fullname.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
                
                // Deterministic numbers
                const phone = `0812-${(1000 + (room.id * 17) % 9000)}-${(1000 + (room.id * 31) % 9000)}`;
                const emergencyPhone = `0813-${(1000 + (room.id * 23) % 9000)}-${(1000 + (room.id * 47) % 9000)}`;
                
                const origin = originCities[room.id % originCities.length];
                const job = jobs[room.id % jobs.length];
                
                // Deterministic Check-in / Check-out dates (Annual Rental format)
                const startMonth = 1 + (room.id % 5); // Jan to May
                const checkInDate = `10-${String(startMonth).padStart(2, '0')}-2025`;
                const checkOutDate = `10-${String(startMonth).padStart(2, '0')}-2026`;

                tenants.push({
                    id: room.id, // match with room ID
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    emergencyPhone: emergencyPhone,
                    origin: origin,
                    job: job,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    status: "Aktif",
                    room: {
                        id: room.id,
                        number: room.number,
                        type: room.type,
                        location: room.location,
                        floor: room.floor
                    }
                });
            }
        });
        
        return tenants;
    };

    const getTenantsData = () => {
        let data = localStorage.getItem('pt_tenants_data');
        if (!data) {
            const rooms = getRoomsData();
            const initialTenants = generateDefaultTenants(rooms);
            localStorage.setItem('pt_tenants_data', JSON.stringify(initialTenants));
            return initialTenants;
        }
        return JSON.parse(data);
    };

    const saveTenantsData = (data) => {
        localStorage.setItem('pt_tenants_data', JSON.stringify(data));
    };

    // Load states
    let roomsDatabase = getRoomsData();
    let tenantsDatabase = getTenantsData();

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const tenantTableBody = document.getElementById('tenantTableBody');
    const searchTenant = document.getElementById('searchTenant');
    const btnExportCSV = document.getElementById('btnExportCSV');

    // ==========================================
    // RENDER TENANTS TABLE
    // ==========================================
    const renderTenants = () => {
        tenantTableBody.innerHTML = "";
        const searchVal = searchTenant.value.toLowerCase().trim();

        // Apply filters
        let displayList = tenantsDatabase.filter(t => {
            const phoneStr = t.phone || '';
            const roomNumberStr = t.room.number || t.room.name || '';
            const matchSearch = t.fullname.toLowerCase().includes(searchVal) ||
                                t.email.toLowerCase().includes(searchVal) ||
                                phoneStr.includes(searchVal) ||
                                roomNumberStr.toLowerCase().includes(searchVal) ||
                                (t.room.location && t.room.location.toLowerCase().includes(searchVal)) ||
                                (t.room.type && t.room.type.toLowerCase().includes(searchVal));
            return matchSearch;
        });

        if (displayList.length === 0) {
            tenantTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">Penyewa tidak ditemukan.</td>
                </tr>
            `;
            return;
        }

        // Sort alphabetically by name
        displayList.sort((a, b) => a.fullname.localeCompare(b.fullname));

        displayList.forEach(t => {
            const tr = document.createElement('tr');
            
            // Format dynamic Room Label
            const typeLabel = t.room.type.charAt(0).toUpperCase() + t.room.type.slice(1);
            const locLabel = t.room.location === 'bandung' ? 'Bandung' : 'Solo';
            const roomInfo = `
                <div class="admin-tenant-info" style="display: flex; flex-direction: column;">
                    <span class="admin-tenant-name" style="font-weight:600; color: var(--text);">${t.room.number}</span>
                    <span class="admin-tenant-sub" style="font-size: 11px; color: var(--text-muted);">${typeLabel} • ${locLabel} (Lt. ${t.room.floor})</span>
                </div>
            `;

            tr.innerHTML = `
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600; color: var(--text);">${t.fullname}</span>
                        <span style="font-size: 11px; color: var(--text-muted);">${t.email}</span>
                    </div>
                </td>
                <td>${roomInfo}</td>
                <td><span style="font-family: monospace; font-size: 13px;">${t.phone}</span></td>
                <td><span style="font-family: monospace; font-size: 13px;">${t.emergencyPhone}</span></td>
                <td>${t.checkIn}</td>
                <td>${t.checkOut}</td>
                <td><span class="room-card-badge badge-tersedia" style="position: static; font-size: 9px; padding: 2px 6px;">${t.status}</span></td>
                <td style="text-align: center;">
                    <button class="btn-card-action btn-card-edit btn-view-tenant" data-id="${t.id}" style="position: static; display: inline-flex; width: auto; padding: 4px 8px; font-size: 11px; align-items: center; gap: 4px; margin-right: 4px;" title="Lihat Detail Penyewa">
                        Detail
                    </button>
                    <button class="btn-card-action btn-card-delete btn-evict-tenant" data-id="${t.id}" style="position: static; display: inline-flex; width: auto; padding: 4px 8px; font-size: 11px; align-items: center; gap: 4px;" title="Keluarkan / Hapus Penyewa">
                        Hapus
                    </button>
                </td>
            `;
            tenantTableBody.appendChild(tr);
        });

        // Attach action click events
        attachTableListeners();
    };

    const attachTableListeners = () => {
        // Evict/Delete listener
        document.querySelectorAll('.btn-evict-tenant').forEach(btn => {
            btn.addEventListener('click', () => {
                const tenantId = parseInt(btn.getAttribute('data-id'), 10);
                evictTenant(tenantId);
            });
        });

        // View detail listener
        document.querySelectorAll('.btn-view-tenant').forEach(btn => {
            btn.addEventListener('click', () => {
                const tenantId = parseInt(btn.getAttribute('data-id'), 10);
                openDetailModal(tenantId);
            });
        });
    };

    // ==========================================
    // ACTION: VIEW DETAIL MODAL
    // ==========================================
    const tenantDetailModal = document.getElementById('tenantDetailModal');
    const btnCloseDetailModal = document.getElementById('btnCloseDetailModal');
    const btnCancelDetailModal = document.getElementById('btnCancelDetailModal');

    const openDetailModal = (id) => {
        const tenant = tenantsDatabase.find(t => t.id === id);
        if (!tenant) return;

        // Populate modal data
        document.getElementById('lblDetailFullname').innerText = tenant.fullname;
        document.getElementById('lblDetailEmail').innerText = tenant.email;
        document.getElementById('lblDetailPhone').innerText = tenant.phone;
        document.getElementById('lblDetailEmergency').innerText = tenant.emergencyPhone;
        document.getElementById('lblDetailOrigin').innerText = tenant.origin;
        document.getElementById('lblDetailJob').innerText = tenant.job;
        
        const typeLabel = tenant.room.type.charAt(0).toUpperCase() + tenant.room.type.slice(1);
        document.getElementById('lblDetailRoom').innerText = `${tenant.room.number} (${typeLabel})`;
        
        const locLabel = tenant.room.location === 'bandung' ? 'Bandung' : 'Solo';
        document.getElementById('lblDetailLocation').innerText = `${locLabel} - Lantai ${tenant.room.floor}`;
        
        document.getElementById('lblDetailCheckIn').innerText = tenant.checkIn;
        document.getElementById('lblDetailCheckOut').innerText = tenant.checkOut;
        document.getElementById('lblDetailStatus').innerText = tenant.status;

        // Show modal
        tenantDetailModal.classList.add('active');
    };

    const closeDetailModal = () => {
        tenantDetailModal.classList.remove('active');
    };

    btnCloseDetailModal.addEventListener('click', closeDetailModal);
    btnCancelDetailModal.addEventListener('click', closeDetailModal);

    // ==========================================
    // ACTION: DELETE / EVICT RENTER
    // ==========================================
    const evictTenant = (id) => {
        const tenant = tenantsDatabase.find(t => t.id === id);
        if (!tenant) return;

        const confirmation = confirm(`Apakah Anda yakin ingin menghapus penyewa "${tenant.fullname}" dari kamar "${tenant.room.number}"? Kamar ini akan dikosongkan kembali di sistem.`);
        
        if (confirmation) {
            // 1. Remove from Tenants list
            tenantsDatabase = tenantsDatabase.filter(t => t.id !== id);
            saveTenantsData(tenantsDatabase);

            // 2. Open up the room again in Rooms database (status -> Tersedia)
            if (roomsDatabase) {
                let found = false;
                roomsDatabase.bandung = roomsDatabase.bandung.map(r => {
                    if (r.id === id) {
                        r.status = "Tersedia";
                        found = true;
                    }
                    return r;
                });
                
                if (!found) {
                    roomsDatabase.solo = roomsDatabase.solo.map(r => {
                        if (r.id === id) {
                            r.status = "Tersedia";
                        }
                        return r;
                    });
                }
                saveRoomsData(roomsDatabase);
            }

            // 3. Refresh display
            alert(`Penyewa "${tenant.fullname}" berhasil dikeluarkan. Kamar "${tenant.room.number}" sekarang statusnya menjadi "Tersedia".`);
            renderTenants();
        }
    };

    // ==========================================
    // EXPORT DATA TO CSV / EXCEL
    // ==========================================
    const exportToCSV = () => {
        const searchVal = searchTenant.value.toLowerCase().trim();
        
        // Filter active list same as view
        let listToExport = tenantsDatabase.filter(t => {
            const phoneStr = t.phone || '';
        const roomNumberStr = t.room.number || t.room.name || '';
        return t.fullname.toLowerCase().includes(searchVal) ||
                   t.email.toLowerCase().includes(searchVal) ||
                   phoneStr.includes(searchVal) ||
                   roomNumberStr.toLowerCase().includes(searchVal) ||
                   (t.room.location && t.room.location.toLowerCase().includes(searchVal));
        });

        if (listToExport.length === 0) {
            alert('Tidak ada data penyewa untuk diekspor!');
            return;
        }

        // Generate CSV content
        let csvContent = "\uFEFF"; // BOM UTF-8 for Excel compatibility
        
        // Headers
        csvContent += "Nama Penyewa,Email,No. HP,No. Darurat,Asal Kota,Pekerjaan,Nomor Kamar,Tipe Kamar,Lokasi,Lantai,Tanggal Masuk,Tanggal Keluar,Status\n";

        // Rows
        listToExport.forEach(t => {
            const typeLabel = t.room.type.charAt(0).toUpperCase() + t.room.type.slice(1);
            const locLabel = t.room.location === 'bandung' ? 'Bandung' : 'Solo';
            
            // Escape values in case of commas
            const row = [
                `"${t.fullname.replace(/"/g, '""')}"`,
                `"${t.email.replace(/"/g, '""')}"`,
                `"${t.phone}"`,
                `"${t.emergencyPhone}"`,
                `"${t.origin.replace(/"/g, '""')}"`,
                `"${t.job.replace(/"/g, '""')}"`,
                `"${t.room.number}"`,
                `"${typeLabel}"`,
                `"${locLabel}"`,
                `"Lantai ${t.room.floor}"`,
                `"${t.checkIn}"`,
                `"${t.checkOut}"`,
                `"${t.status}"`
            ];
            csvContent += row.join(",") + "\n";
        });

        // Trigger browser file download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `daftar_penyewa_pondok_titis_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    btnExportCSV.addEventListener('click', exportToCSV);
    searchTenant.addEventListener('input', renderTenants);

    // Update current date
    const currentDate = document.getElementById('currentDate');
    if (currentDate) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDate.innerText = new Date().toLocaleDateString('id-ID', options);
    }

    // ==========================================
    // INITIAL LOAD
    // ==========================================
    renderTenants();
});

// Logout logic
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('pt_isAdmin');
        window.location.href = 'user.html';
    });
});


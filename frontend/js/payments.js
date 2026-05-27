document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // INITIAL DATABASE STATE SETUP
    // ==========================================
    const getRoomsData = () => {
        let data = localStorage.getItem('pt_rooms_data');
        return data ? JSON.parse(data) : null;
    };

    const saveRoomsData = (data) => {
        localStorage.setItem('pt_rooms_data', JSON.stringify(data));
    };

    const getTenantsData = () => {
        let data = localStorage.getItem('pt_tenants_data');
        return data ? JSON.parse(data) : [];
    };

    const saveTenantsData = (data) => {
        localStorage.setItem('pt_tenants_data', JSON.stringify(data));
    };

    // Deterministic Payment History Generator based on occupied rooms + some mock entries
    const generateDefaultPayments = (rooms, tenants) => {
        const list = [];

        // 1. Generate PENDING (Waiting) bookings to let Admin test setujui/tolak
        list.push({
            id: 901,
            date: "24-05-2026",
            invoice: "INV-20260524-03",
            fullname: "Amanda Kirana",
            phone: "0812-5555-8888",
            email: "amanda.kirana@gmail.com",
            amount: 13500000,
            type: "Lunas",
            status: "Waiting",
            room: {
                id: 103, // BDG-S04 standard
                number: "BDG-S04",
                type: "standar",
                location: "bandung",
                floor: 1
            }
        });

        list.push({
            id: 902,
            date: "25-05-2026",
            invoice: "INV-20260525-09",
            fullname: "Riri Indriani",
            phone: "0857-4444-9999",
            email: "riri.indriani@gmail.com",
            amount: 5000000,
            type: "DP",
            status: "Waiting",
            room: {
                id: 210, // Solo VIP
                number: "SLO-V01",
                type: "vip",
                location: "solo",
                floor: 2
            }
        });

        // 2. Generate CONFIRMED payments from all occupied (Terisi) rooms
        if (rooms && tenants) {
            tenants.forEach(t => {
                const startMonth = 1 + (t.room.id % 5);
                const paymentDate = `08-${String(startMonth).padStart(2, '0')}-2025`;
                const amount = t.room.type === 'standar' ? 13500000 : (t.room.type === 'deluxe' ? 14500000 : 15500000);
                
                list.push({
                    id: t.id,
                    date: paymentDate,
                    invoice: `INV-2025${String(startMonth).padStart(2, '0')}10-${t.id}`,
                    fullname: t.fullname,
                    phone: t.phone,
                    email: t.email,
                    amount: amount,
                    type: "Lunas",
                    status: "Confirmed",
                    room: t.room
                });
            });
        }

        // 3. Generate some REJECTED transactions
        list.push({
            id: 903,
            date: "12-04-2026",
            invoice: "INV-20260412-07",
            fullname: "Fitri Eka",
            phone: "0899-7777-6666",
            email: "fitri.eka@gmail.com",
            amount: 14500000,
            type: "Lunas",
            status: "Rejected",
            room: {
                id: 104, // Bandung Deluxe
                number: "BDG-D01",
                type: "deluxe",
                location: "bandung",
                floor: 1
            }
        });

        return list;
    };

    const getPaymentsData = () => {
        let data = localStorage.getItem('pt_payments_data');
        if (!data) {
            const rooms = getRoomsData();
            const tenants = getTenantsData();
            const initialPayments = generateDefaultPayments(rooms, tenants);
            localStorage.setItem('pt_payments_data', JSON.stringify(initialPayments));
            return initialPayments;
        }
        return JSON.parse(data);
    };

    const savePaymentsData = (data) => {
        localStorage.setItem('pt_payments_data', JSON.stringify(data));
    };

    // Load active states from local storage
    let roomsDatabase = getRoomsData();
    let tenantsDatabase = getTenantsData();
    let paymentsDatabase = getPaymentsData();

    window.addEventListener('storage', (e) => {
        if (e.key === 'pt_payments_data') {
            paymentsDatabase = getPaymentsData();
            renderPayments();
        }
    });

    let activeTab = "waiting"; // waiting, confirmed, rejected

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const paymentsTableBody = document.getElementById('paymentsTableBody');
    const searchPayment = document.getElementById('searchPayment');
    const btnExportPayments = document.getElementById('btnExportPayments');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // ==========================================
    // TAB SELECTION EVENT LISTENERS
    // ==========================================
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTab = btn.getAttribute('data-tab');
            renderPayments();
        });
    });

    // ==========================================
    // RENDER TRANSACTIONS TABLE
    // ==========================================
    const renderPayments = () => {
        paymentsTableBody.innerHTML = "";
        const searchVal = searchPayment.value.toLowerCase().trim();

        // 1. Filter by Active Tab (status mapping)
        let displayList = paymentsDatabase.filter(p => {
            if (activeTab === "waiting") return p.status === "Waiting";
            if (activeTab === "confirmed") return p.status === "Confirmed";
            return p.status === "Rejected";
        });

        // 2. Filter by search bar query
        displayList = displayList.filter(p => {
            const phoneStr = p.phone || '';
            const roomNumberStr = p.room.number || p.room.name || '';
            const match = (p.fullname && p.fullname.toLowerCase().includes(searchVal)) ||
                          (p.invoice && p.invoice.toLowerCase().includes(searchVal)) ||
                          phoneStr.includes(searchVal) ||
                          roomNumberStr.toLowerCase().includes(searchVal) ||
                          (p.room.location && p.room.location.toLowerCase().includes(searchVal));
            return match;
        });

        if (displayList.length === 0) {
            paymentsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">No data / Tidak ada transaksi sewa.</td>
                </tr>
            `;
            return;
        }

        // Sort descending by date / ID (latest transaction first)
        displayList.sort((a, b) => b.id - a.id);

        displayList.forEach(p => {
            const tr = document.createElement('tr');
            
            const typeLabel = p.room.type.charAt(0).toUpperCase() + p.room.type.slice(1);
            const locLabel = p.room.location === 'bandung' ? 'Bandung' : 'Solo';
            const roomNumberStr = p.room.number || p.room.name || '';
            const phoneStr = p.phone || p.email || '-';
            const roomDetails = `
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 600; color: var(--text);">${roomNumberStr}</span>
                    <span style="font-size: 11px; color: var(--text-muted);">${typeLabel} • ${locLabel} (Lt. ${p.room.floor})</span>
                </div>
            `;

            // Action column content depending on active tab
            let actionCol = "";
            if (activeTab === "waiting") {
                actionCol = `
                    <div style="display: flex; justify-content: center; gap: 8px;">
                        <button class="btn-card-action btn-approve" data-id="${p.id}" data-action="approve" style="width: auto; padding: 4px 10px; font-size: 11px; align-items: center; border-radius: 4px;">
                            Setujui
                        </button>
                        <button class="btn-card-action btn-reject" data-id="${p.id}" data-action="reject" style="width: auto; padding: 4px 10px; font-size: 11px; align-items: center; border-radius: 4px;">
                            Tolak
                        </button>
                    </div>
                `;
            } else if (activeTab === "confirmed") {
                actionCol = `
                    <div style="text-align: center;">
                        <span class="room-card-badge badge-tersedia" style="position: static; font-size: 9px; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 4px;">Disetujui</span><br>
                        <button class="btn-card-action" onclick="printReceipt(${p.id})" style="width: auto; padding: 4px 10px; font-size: 9px; align-items: center; border-radius: 4px; background: var(--primary); color: white; border: none; cursor: pointer;">Cetak Kuitansi</button>
                    </div>
                `;
            } else {
                actionCol = `
                    <div style="text-align: center;">
                        <span class="room-card-badge badge-maintenance" style="position: static; font-size: 9px; padding: 2px 8px; border-radius: 4px;">Ditolak</span>
                    </div>
                `;
            }

            tr.innerHTML = `
                <td>${p.date}</td>
                <td><span style="font-family: monospace; font-weight: 600; font-size: 12px; color: var(--text);">${p.invoice}</span></td>
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600; color: var(--text);">${p.fullname}</span>
                        <span style="font-size: 11px; color: var(--text-muted);">${phoneStr}</span>
                    </div>
                </td>
                <td>${roomDetails}</td>
                <td><span style="font-weight: 700; color: var(--primary);">Rp ${p.amount.toLocaleString('id-ID')}</span></td>
                <td><span class="facility-pill" style="font-weight: 600;">${p.type}</span></td>
                <td>${actionCol}</td>
            `;
            paymentsTableBody.appendChild(tr);
        });

        attachActionListeners();
    };

    const attachActionListeners = () => {
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                const action = btn.getAttribute('data-action');
                
                if (action === "approve") {
                    approvePayment(id);
                } else if (action === "reject") {
                    rejectPayment(id);
                }
            });
        });
    };

    // ==========================================
    // ACTION: APPROVE PAYMENT (SETUJUI)
    // ==========================================
    const approvePayment = (id) => {
        const tx = paymentsDatabase.find(p => p.id === id);
        if (!tx) return;

        const roomNameStr = tx.room.number || tx.room.name || 'Kamar';
        const confirmation = confirm(`Apakah Anda yakin ingin menyetujui pembayaran sewa atas nama "${tx.fullname}" untuk kamar "${roomNameStr}"?`);
        
        if (confirmation) {
            // 1. Update transaction status
            tx.status = "Confirmed";
            savePaymentsData(paymentsDatabase);

            // 2. Lock room status in pt_rooms_data (status -> Terisi)
            if (roomsDatabase) {
                let found = false;
                roomsDatabase.bandung = roomsDatabase.bandung.map(r => {
                    if (r.id === tx.room.id) {
                        r.status = "Terisi";
                        found = true;
                    }
                    return r;
                });
                
                if (!found) {
                    roomsDatabase.solo = roomsDatabase.solo.map(r => {
                        if (r.id === tx.room.id) {
                            r.status = "Terisi";
                        }
                        return r;
                    });
                }
                saveRoomsData(roomsDatabase);
            }

            // 3. Add to Active Tenants list (pt_tenants_data)
            tenantsDatabase = getTenantsData();
            
            const startMonth = 1 + (tx.room.id % 5);
            const checkOutYear = 2027; // 1 year after sewa
            
            const fallbackOrigins = ["Jakarta", "Surabaya", "Semarang", "Yogyakarta", "Medan", "Malang", "Makassar", "Palembang"];
            const fallbackJobs = ["Mahasiswi ITB", "Karyawati BUMN", "Mahasiswi UNPAD", "Karyawati Startup", "Mahasiswi UPI", "Karyawati Bank BCA", "Karyawati Unilever"];
            const originVal = tx.origin || fallbackOrigins[tx.room.id % fallbackOrigins.length];
            const jobVal = tx.job || fallbackJobs[tx.room.id % fallbackJobs.length];

            const newTenant = {
                id: tx.room.id,
                fullname: tx.fullname,
                email: tx.email,
                phone: tx.phone,
                emergencyPhone: tx.emergencyPhone || `0813-${(1000 + (tx.room.id * 23) % 9000)}-${(1000 + (tx.room.id * 47) % 9000)}`,
                origin: originVal,
                job: jobVal,
                checkIn: tx.date,
                checkOut: tx.date.replace("-2026", `-${checkOutYear}`).replace("-2025", `-${checkOutYear}`),
                status: "Aktif",
                room: tx.room
            };
            
            // Prevent duplicates in tenants list
            tenantsDatabase = tenantsDatabase.filter(t => t.id !== tx.room.id);
            tenantsDatabase.push(newTenant);
            saveTenantsData(tenantsDatabase);

            // 4. AUTOMATIC USER 'KAMAR SAYA' SYNCHRONIZATION
            // Update myRoom in localStorage for the buyer's email account!
            // When user logs in using this email on user.html, it will read myRoom and load it instantly!
            // Format checkin and checkout dates
            let checkinFormatted = tx.date;
            let checkoutFormatted = tx.date.replace("-2026", `-${checkOutYear}`).replace("-2025", `-${checkOutYear}`);
            
            // Try to parse if it is in DD-MM-YYYY format
            const parts = tx.date.split('-');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                const monthsId = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 0 && month < 12) {
                    checkinFormatted = `${day} ${monthsId[month]} ${year}`;
                    checkoutFormatted = `${day} ${monthsId[month]} ${checkOutYear}`;
                }
            }

            // Find full room details in database if possible to get properties like type, floor, location, image, name
            let roomDetails = null;
            if (roomsDatabase) {
                roomDetails = roomsDatabase.bandung.find(r => r.id === tx.room.id) || 
                              roomsDatabase.solo.find(r => r.id === tx.room.id);
            }
            const roomObj = roomDetails || tx.room || {};

            const myRoomData = {
                id: roomObj.id,
                name: roomObj.name || `Kamar ${roomObj.type === 'standar' ? 'Standard' : (roomObj.type === 'deluxe' ? 'Deluxe' : 'VIP')} #${roomObj.number || roomObj.id}`,
                type: roomObj.type,
                floor: roomObj.floor,
                location: roomObj.location,
                checkin: checkinFormatted,
                checkout: checkoutFormatted,
                image: roomObj.image || `images/room-${roomObj.type || 'standar'}.jpg`,
                status: "Aktif",
                tenantEmail: tx.email,
                fullname: tx.fullname,
                paymentStatus: tx.type === 'DP' ? 'dp' : 'lunas'
            };
            
            // Save user specific room booking locally
            localStorage.setItem('myRoom', JSON.stringify(myRoomData));
            
            // Remove any potential rejection notifications for this user
            let rejections = JSON.parse(localStorage.getItem('pt_rejection_notifications')) || {};
            delete rejections[tx.email];
            localStorage.setItem('pt_rejection_notifications', JSON.stringify(rejections));

            // 5. Refresh table
            alert(`Pembayaran sewa "${tx.fullname}" sukses disetujui!\nKamar "${tx.room.number}" sekarang berstatus "Terisi" dan detail penyewa telah terdaftar.`);
            renderPayments();
        }
    };

    // ==========================================
    // ACTION: REJECT PAYMENT (TOLAK)
    // ==========================================
    const rejectPayment = (id) => {
        const tx = paymentsDatabase.find(p => p.id === id);
        if (!tx) return;

        const roomNameStr = tx.room.number || tx.room.name || 'Kamar';
        const confirmation = confirm(`Apakah Anda yakin ingin MENOLAK pembayaran sewa atas nama "${tx.fullname}" untuk kamar "${roomNameStr}"?`);
        
        if (confirmation) {
            // 1. Update status to Rejected
            tx.status = "Rejected";
            savePaymentsData(paymentsDatabase);

            // 2. Open room again (ensure it remains Tersedia/Available)
            if (roomsDatabase) {
                let found = false;
                roomsDatabase.bandung = roomsDatabase.bandung.map(r => {
                    if (r.id === tx.room.id) {
                        r.status = "Tersedia";
                        found = true;
                    }
                    return r;
                });
                
                if (!found) {
                    roomsDatabase.solo = roomsDatabase.solo.map(r => {
                        if (r.id === tx.room.id) {
                            r.status = "Tersedia";
                        }
                        return r;
                    });
                }
                saveRoomsData(roomsDatabase);
            }

            // 3. Save a rejection notification record in localStorage linked to this email!
            // When they open user.html, it will read this rejection and display the red notification
            let rejections = JSON.parse(localStorage.getItem('pt_rejection_notifications')) || {};
            rejections[tx.email] = {
                invoice: tx.invoice,
                roomNumber: tx.room.number,
                amount: tx.amount,
                date: tx.date,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('pt_rejection_notifications', JSON.stringify(rejections));
            
            // Clear any potential myRoom bookings
            const myRoom = JSON.parse(localStorage.getItem('myRoom'));
            if (myRoom && myRoom.tenantEmail === tx.email) {
                localStorage.removeItem('myRoom');
            }

            // 4. Refresh display
            alert(`Transaksi sewa "${tx.fullname}" ditolak.\nPengguna akan melihat notifikasi di dasbor user untuk segera menghubungi admin kos via WhatsApp.`);
            renderPayments();
        }
    };

    // ==========================================
    // EXPORT REKAP PAYMENTS TO EXCEL
    // ==========================================
    const exportPaymentsToCSV = () => {
        const searchVal = searchPayment.value.toLowerCase().trim();

        // Filter list same as active view tab
        let listToExport = paymentsDatabase.filter(p => {
            if (activeTab === "waiting") return p.status === "Waiting";
            if (activeTab === "confirmed") return p.status === "Confirmed";
            return p.status === "Rejected";
        });

        listToExport = listToExport.filter(p => {
            return p.fullname.toLowerCase().includes(searchVal) ||
                   p.invoice.toLowerCase().includes(searchVal) ||
                   p.room.number.toLowerCase().includes(searchVal);
        });

        if (listToExport.length === 0) {
            alert('Tidak ada transaksi sewa untuk diekspor pada tab ini!');
            return;
        }

        // CSV compiler content
        let csvContent = "\uFEFF"; // Excel BOM
        csvContent += "Tanggal,No. Invoice,Nama Penyewa,No. HP,Email,Nomor Kamar,Tipe Kamar,Lokasi,Jumlah Pembayaran,Metode Bayar,Status\n";

        listToExport.forEach(p => {
            const typeLabel = p.room.type.charAt(0).toUpperCase() + p.room.type.slice(1);
            const locLabel = p.room.location === 'bandung' ? 'Bandung' : 'Solo';
            
            const row = [
                `"${p.date}"`,
                `"${p.invoice}"`,
                `"${p.fullname.replace(/"/g, '""')}"`,
                `"${p.phone}"`,
                `"${p.email}"`,
                `"${p.room.number}"`,
                `"${typeLabel}"`,
                `"${locLabel}"`,
                `"${p.amount}"`,
                `"${p.type}"`,
                `"${p.status}"`
            ];
            csvContent += row.join(",") + "\n";
        });

        // Download trigger
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `rekap_pembayaran_kos_${activeTab}_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    btnExportPayments.addEventListener('click', exportPaymentsToCSV);
    searchPayment.addEventListener('input', renderPayments);

    // Current date
    const currentDate = document.getElementById('currentDate');
    if (currentDate) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDate.innerText = new Date().toLocaleDateString('id-ID', options);
    }

    // ==========================================
    // INITIAL LOAD
    // ==========================================
    renderPayments();
});

// ==========================================
// RECEIPT PRINT FUNCTION (ADMIN PANEL)
// ==========================================
window.printReceipt = function(invoiceId) {
    const history = JSON.parse(localStorage.getItem('pt_payments_data')) || [];
    const item = history.find(h => h.id === invoiceId);
    if (!item) return;

    const roomTypeLabel = item.room.type === 'standar' ? 'Standard' : (item.room.type === 'deluxe' ? 'Deluxe' : 'VIP');
    const locLabel = item.room.location === 'bandung' ? 'Bandung' : 'Solo';
    const costTypeLabel = item.type === 'DP' ? 'DP (Uang Muka)' : 
                         (item.type === 'SISA_QRIS' ? 'Pelunasan Sisa (QRIS)' : 
                         (item.type === 'SISA_CASH' ? 'Pelunasan Sisa (Cash)' : 
                         'Lunas (Cash)'));
    const formattedTotal = item.amount.toLocaleString('id-ID');

    const paymentMethodVal = (item.paymentType === 'sisa_cash' || item.paymentType === 'cash') ? "Tunai (Cash / Manual)" : "QRIS Transfer Elektronik";

    const container = document.getElementById('receiptSheetContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="receipt-sheet" style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); position: relative; overflow: hidden; font-family: 'Inter', sans-serif;">
            <div class="receipt-header" style="display: flex; justify-content: space-between; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
                <div>
                    <div class="receipt-logo" style="font-size: 1.4rem; font-weight: 900; color: #db2777; letter-spacing: 1px; margin-bottom: 4px;">PONDOK TITIS</div>
                    <div class="receipt-logo-sub" style="font-size: 0.75rem; color: #64748b; font-weight: 500; line-height: 1.4;">
                        Hunian Nyaman, Strategis, & Ekonomis<br>
                        WhatsApp: +62 822-8439-4776<br>
                        Bojongsoang, Bandung & Jebres, Solo
                    </div>
                </div>
                <div class="receipt-title" style="text-align: right;">
                    <h1 style="font-size: 1.5rem; font-weight: 850; color: #0f172a; margin-bottom: 4px;">Kuitansi Resmi</h1>
                    <div class="receipt-inv-num" style="font-size: 0.8rem; font-weight: 700; color: #db2777; background: rgba(219,39,119,0.05); padding: 4px 10px; border-radius: 6px; display: inline-block;">${item.invoice || item.invNumber}</div>
                </div>
            </div>

            <div class="receipt-details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                <div class="receipt-col">
                    <h3 style="font-size: 0.75rem; color: #94a3b8; font-weight: 750; margin-bottom: 6px; text-transform: uppercase;">DITERIMA DARI:</h3>
                    <p style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">${item.fullname}</p>
                    <p style="font-size: 0.8rem; color: #64748b; font-weight: 500; margin-top: 4px; line-height: 1.4;">
                        Telp: ${item.phone}<br>
                        Email: ${item.email}
                    </p>
                </div>
                <div class="receipt-col">
                    <h3 style="font-size: 0.75rem; color: #94a3b8; font-weight: 750; margin-bottom: 6px; text-transform: uppercase;">TANGGAL PEMBAYARAN:</h3>
                    <p style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">${item.date}</p>
                    <h3 style="font-size: 0.75rem; color: #94a3b8; font-weight: 750; margin-top: 14px; margin-bottom: 4px; text-transform: uppercase;">METODE BAYAR:</h3>
                    <p style="font-size: 0.9rem; font-weight: 600; color: #475569;">${paymentMethodVal}</p>
                </div>
            </div>

            <div class="receipt-table-wrapper" style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <table class="receipt-table" style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                            <th style="padding: 12px; text-align: left; font-weight: 750; color: #475569;">Deskripsi Hunian</th>
                            <th style="padding: 12px; text-align: left; font-weight: 750; color: #475569;">Cabang</th>
                            <th style="padding: 12px; text-align: right; font-weight: 750; color: #475569;">Jenis Tagihan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
                                <div style="font-weight: 800; color: #0f172a;">Kamar ${roomTypeLabel} #${item.room.number || item.room.id}</div>
                                <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">Ukuran ${item.room.type === 'standar' ? '3x3m' : '3x4m'} • Furnished Lengkap • Lantai ${item.room.floor}</div>
                            </td>
                            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155;">Pondok Titis ${locLabel}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #db2777;">${costTypeLabel}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="receipt-total-row" style="display: flex; justify-content: space-between; align-items: center; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 14px 20px; margin-bottom: 24px; position: relative; z-index: 2;">
                <div class="receipt-total-label" style="font-size: 0.85rem; font-weight: 800; color: #be123c;">JUMLAH DIBAYAR:</div>
                <div class="receipt-total-val" style="font-size: 1.4rem; font-weight: 900; color: #be123c;">Rp ${formattedTotal}</div>
            </div>

            <!-- Seal Stamp LUNAS -->
            <div class="stamp-lunas-custom" style="position: absolute; right: 40px; bottom: 120px; border: 3px dashed #22c55e; color: #22c55e; font-size: 1.15rem; font-weight: 900; text-transform: uppercase; padding: 6px 16px; border-radius: 8px; transform: rotate(-12deg); letter-spacing: 1px; background: rgba(34, 197, 94, 0.05); pointer-events: none; z-index: 10;">LUNAS</div>

            <div class="receipt-signature-area" style="display: flex; justify-content: space-between; margin-top: 40px; border-top: 1px dashed #e2e8f0; padding-top: 20px;">
                <div class="receipt-sig-col">
                    <div class="receipt-sig-label" style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 45px;">Penyewa / Tenant</div>
                    <div class="receipt-sig-name" style="font-size: 0.85rem; font-weight: 800; color: #0f172a; border-top: 1px solid #94a3b8; padding-top: 4px; width: 140px;">${item.fullname}</div>
                </div>
                <div class="receipt-sig-col" style="position: relative;">
                    <!-- Tiny signature seal aesthetic -->
                    <div style="position: absolute; bottom: 30px; opacity: 0.15; transform: rotate(-5deg); pointer-events: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><path fill="#db2777" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    </div>
                    <div class="receipt-sig-label" style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 45px;">Manajemen Pondok Titis</div>
                    <div class="receipt-sig-name" style="font-size: 0.85rem; font-weight: 800; color: #0f172a; border-top: 1px solid #94a3b8; padding-top: 4px; width: 140px;">Admin Pondok Titis</div>
                </div>
            </div>
        </div>
    `;

    // Open Receipt Modal
    const modal = document.getElementById('receiptModal');
    if (modal) {
        modal.classList.add('active');
    }

    // Trigger window print in a tiny timeout to allow DOM parsing
    setTimeout(() => {
        window.print();
    }, 350);
};

// Logout logic
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('pt_isAdmin');
        window.location.href = 'user.html';
    });
});


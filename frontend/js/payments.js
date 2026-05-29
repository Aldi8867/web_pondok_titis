let paymentsDatabase = [];

const init = () => {
    const API_URL = 'https://web-pondok-titis.onrender.com/api';

    const fetchPayments = async () => {
        try {
            const res = await fetch(`${API_URL}/payments`);
            if (!res.ok) throw new Error('Failed to fetch payments');
            const data = await res.json();
            
            // Map data dari API ke format UI paymentsDatabase
            paymentsDatabase = data.map(p => {
                let mappedStatus = "Waiting";
                if (p.status === 'approved') mappedStatus = "Confirmed";
                else if (p.status === 'rejected') mappedStatus = "Rejected";
                else mappedStatus = "Waiting"; // 'pending'
                
                return {
                    id: p.id,
                    date: new Date(p.created_at).toLocaleDateString('id-ID'),
                    createdAt: p.created_at,
                    invoice: `INV-${p.id}`,
                    fullname: p.users ? p.users.name : 'Unknown',
                    email: p.users ? p.users.email : '-',
                    phone: '-', // Backend payments tak simpan phone, atau ambil dari users.phone jika ada
                    amount: p.amount,
                    type: "Lunas", // Asumsi
                    status: mappedStatus,
                    proofImage: p.proof_image || '',
                    room: p.rooms ? {
                        id: p.rooms.id,
                        number: p.rooms.room_number,
                        type: p.rooms.type || 'Kamar',
                        location: p.rooms.location || 'bandung',
                        floor: p.rooms.floor || 1
                    } : null
                };
            });
            renderPayments();
        } catch (err) {
            console.error(err);
            paymentsTableBody.innerHTML = `<tr><td colspan="7" class="empty-state">No data / Tidak ada transaksi sewa.</td></tr>`;
        }
    };

    fetchPayments();

    window.addEventListener('storage', (e) => {
        if (e.key === 'pt_payments_data') {
            fetchPayments();
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

        // Sort descending by date (latest transaction first)
        displayList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

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
                        <button class="btn-card-action" onclick="printReceipt('${p.id}')" style="width: auto; padding: 4px 10px; font-size: 9px; align-items: center; border-radius: 4px; background: var(--primary); color: white; border: none; cursor: pointer;">Cetak Kuitansi</button>
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
                const id = btn.getAttribute('data-id');
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
    const approvePayment = async (id) => {
        const tx = paymentsDatabase.find(p => p.id === id);
        if (!tx) return;

        const roomNameStr = tx.room ? (tx.room.number || tx.room.type) : 'Kamar';
        const confirmation = confirm(`Apakah Anda yakin ingin menyetujui pembayaran sewa atas nama "${tx.fullname}" untuk kamar "${roomNameStr}"?`);
        
        if (confirmation) {
            try {
                const res = await fetch(`${API_URL}/payments/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'approved' })
                });
                if (!res.ok) throw new Error('Gagal menyetujui pembayaran');
                
                // Backward compatibility untuk Sinkronisasi User UI
                const myRoomData = {
                    id: tx.room ? tx.room.id : 0,
                    name: `Kamar ${tx.room ? tx.room.type : ''} #${tx.room ? tx.room.number : ''}`,
                    type: tx.room ? tx.room.type : '',
                    floor: tx.room ? tx.room.floor : 1,
                    location: tx.room ? tx.room.location : 'bandung',
                    checkin: tx.date,
                    checkout: "Tahun Depan",
                    status: "Aktif",
                    tenantEmail: tx.email,
                    fullname: tx.fullname,
                    paymentStatus: 'lunas'
                };
                localStorage.setItem('myRoom', JSON.stringify(myRoomData));
                
                let rejections = JSON.parse(localStorage.getItem('pt_rejection_notifications')) || {};
                delete rejections[tx.email];
                localStorage.setItem('pt_rejection_notifications', JSON.stringify(rejections));

                alert(`Pembayaran sewa "${tx.fullname}" sukses disetujui!\nKamar "${roomNameStr}" sekarang berstatus "Terisi".`);
                fetchPayments(); // Refresh dari server
            } catch (err) {
                console.error(err);
                alert('Terjadi kesalahan saat menyetujui pembayaran.');
            }
        }
    };

    // ==========================================
    // ACTION: REJECT PAYMENT (TOLAK)
    // ==========================================
    const rejectPayment = async (id) => {
        const tx = paymentsDatabase.find(p => p.id === id);
        if (!tx) return;

        const roomNameStr = tx.room ? (tx.room.number || tx.room.type) : 'Kamar';
        const confirmation = confirm(`Apakah Anda yakin ingin MENOLAK pembayaran sewa atas nama "${tx.fullname}" untuk kamar "${roomNameStr}"?`);
        
        if (confirmation) {
            try {
                const res = await fetch(`${API_URL}/payments/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'rejected' })
                });
                if (!res.ok) throw new Error('Gagal menolak pembayaran');

                // Sinkronisasi lokal untuk notifikasi User UI
                let rejections = JSON.parse(localStorage.getItem('pt_rejection_notifications')) || {};
                rejections[tx.email] = {
                    invoice: tx.invoice,
                    roomNumber: tx.room ? tx.room.number : '-',
                    amount: tx.amount,
                    date: tx.date,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('pt_rejection_notifications', JSON.stringify(rejections));
                
                const myRoom = JSON.parse(localStorage.getItem('myRoom'));
                if (myRoom && myRoom.tenantEmail === tx.email) {
                    localStorage.removeItem('myRoom');
                }

                alert(`Transaksi sewa "${tx.fullname}" ditolak.\nPengguna akan melihat notifikasi di dasbor user.`);
                fetchPayments(); // Refresh dari server
            } catch(err) {
                console.error(err);
                alert('Terjadi kesalahan saat menolak pembayaran.');
            }
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

    // INITIAL LOAD
    // ==========================================
    renderPayments();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==========================================
// RECEIPT PRINT FUNCTION (ADMIN PANEL)
// ==========================================
window.printReceipt = function(invoiceId) {
    const item = paymentsDatabase.find(h => h.id === invoiceId);
    if (!item) {
        alert("Data pembayaran tidak ditemukan!");
        return;
    }

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
        window.location.href = '/';
    });
});


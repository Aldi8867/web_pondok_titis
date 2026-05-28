// ========== CONTINUATION OF SCRIPT.JS ==========
document.addEventListener('DOMContentLoaded', () => {

// Dark Mode Toggle
const btnTheme = document.getElementById('btnThemeToggle');

const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#db2777" stroke-linecap="round" stroke-linejoin="round"><path stroke-dasharray="56" stroke-width="2" d="M7 6c0 6.08 4.92 11 11 11c0.53 0 1.05 -0.04 1.56 -0.11c-1.61 2.47 -4.39 4.11 -7.56 4.11c-4.97 0 -9 -4.03 -9 -9c0 -3.17 1.64 -5.95 4.11 -7.56c-0.07 0.51 -0.11 1.03 -0.11 1.56Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="56;0"/></path><g stroke-dasharray="4" stroke-dashoffset="4"><path d="M12 5h1.5M12 5h-1.5M12 5v1.5M12 5v-1.5"><animate attributeName="stroke-dashoffset" begin="0.7s" dur="6s" keyTimes="0;0.08;0.22;0.3;1" repeatCount="indefinite" values="4;0;0;4;4"/></path><path d="M17 11h1.5M17 11h-1.5M17 11v1.5M17 11v-1.5"><animate attributeName="stroke-dashoffset" begin="1.37s" dur="6s" keyTimes="0;0.08;0.22;0.3;1" repeatCount="indefinite" values="4;0;0;4;4"/></path><path d="M20 5h1.5M20 5h-1.5M20 5v1.5M20 5v-1.5"><animate attributeName="stroke-dashoffset" begin="2.04s" dur="6s" keyTimes="0;0.08;0.22;0.3;1" repeatCount="indefinite" values="4;0;0;4;4"/></path><path d="M12 4h1.5M12 4h-1.5M12 4v1.5M12 4v-1.5"><animate attributeName="stroke-dashoffset" begin="2.71s" dur="6s" keyTimes="0;0.08;0.22;0.3;1" repeatCount="indefinite" values="4;0;0;4;4"/></path><path d="M18 12h1.5M18 12h-1.5M18 12v1.5M18 12v-1.5"><animate attributeName="stroke-dashoffset" begin="3.38s" dur="6s" keyTimes="0;0.08;0.22;0.3;1" repeatCount="indefinite" values="4;0;0;4;4"/></path><path d="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5"><animate attributeName="stroke-dashoffset" begin="4.05s" dur="6s" keyTimes="0;0.08;0.22;0.3;1" repeatCount="indefinite" values="4;0;0;4;4"/></path><path d="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5"><animate attributeName="stroke-dashoffset" begin="4.72s" dur="6s" keyTimes="0;0.08;0.22;0.3;1" repeatCount="indefinite" values="4;0;0;4;4"/></path><path d="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5"><animate attributeName="stroke-dashoffset" begin="5.39s" dur="6s" keyTimes="0;0.08;0.22;0.3;1" repeatCount="indefinite" values="4;0;0;4;4"/></path><path d="M20 5h1.5M20 5h-1.5M20 5v1.5M20 5v-1.5"><animate attributeName="stroke-dashoffset" begin="6.06s" dur="6s" keyTimes="0;0.08;0.22;0.3;1" repeatCount="indefinite" values="4;0;0;4;4"/></path></g></g></svg>`;

const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g stroke="#db2777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="#db2777" fill-opacity=".3" d="M12 6c3.31 0 6 2.69 6 6c0 3.31 -2.69 6 -6 6c-3.31 0 -6 -2.69 -6 -6c0 -3.31 2.69 -6 6 -6Z"><animate fill="freeze" attributeName="d" dur="0.6s" values="M12 26c3.31 0 6 2.69 6 6c0 3.31 -2.69 6 -6 6c-3.31 0 -6 -2.69 -6 -6c0 -3.31 2.69 -6 6 -6Z;M12 6c3.31 0 6 2.69 6 6c0 3.31 -2.69 6 -6 6c-3.31 0 -6 -2.69 -6 -6c0 -3.31 2.69 -6 6 -6Z"/></path><g fill="none"><path d="M12 21v1M21 12h1M12 3v-1M3 12h-1" opacity="0"><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/><set fill="freeze" attributeName="opacity" begin="0.7s" to="1"/><animate fill="freeze" attributeName="d" begin="0.7s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"/></path><path d="M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5" opacity="0"><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/><set fill="freeze" attributeName="opacity" begin="0.9s" to="1"/><animate fill="freeze" attributeName="d" begin="0.9s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"/></path></g></g></svg>`;

function setTheme(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('pt_dark_mode', 'enabled');
        if (btnTheme) btnTheme.innerHTML = moonSvg;
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('pt_dark_mode', 'disabled');
        if (btnTheme) btnTheme.innerHTML = sunSvg;
    }
}

const savedTheme = localStorage.getItem('pt_dark_mode');
if (savedTheme === 'enabled') setTheme(true);

btnTheme?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Language Toggle (ID/EN - Full Page Localisation)
window.currentLang = localStorage.getItem('pt_lang') || 'id';
let currentLang = window.currentLang;

window.translations = {
    id: {
        // Hero
        heroTitle_bandung: "Lokasi STRATEGIS, Pilihan EKONOMIS",
        heroTitle_solo: "Lokasi STRATEGIS, Pilihan EKONOMIS",
        heroSubtitle: "Temukan kenyamanan hunian kos khusus putri terbaik dengan akses mudah dan fasilitas lengkap untuk produktivitas maksimal Anda.",
        // Search capsule
        searchCapsuleTitle: "Cari Kamar Kos",
        searchCapsuleSub: "Pilih tipe & tanggal...",
        // Filter bar
        filterAllFloors: "Semua Lantai",
        filterFloor: "Lantai",
        filterAllTypes: "Semua Tipe",
        filterAllPrices: "Semua Harga",
        filterPriceLow: "< Rp 14 Juta",
        filterPriceMid: "Rp 14 - 15 Juta",
        filterPriceHigh: "> Rp 15 Juta",
        // Room card
        roomFloor: "Lantai",
        roomPriceYear: "/tahun",
        roomDetailBtn: "Detail",
        emptyState: "🔍 Kamar tidak ditemukan",
        // Hamburger menu
        txtMyRoom: "Kamar Saya",
        txtHistory: "Riwayat Pembayaran",

        txtWatchlist: "Watchlist Tersimpan",
        txtProfile: "Profil Saya",
        txtChangePassword: "Ganti Password",
        txtReplayTour: "Mulai Tur Website",
        txtHelp: "Pusat Bantuan",
        txtTerms: "Syarat & Ketentuan",
        txtPrivacy: "Kebijakan Privasi",
        txtLogin: "Daftar / Login",
        txtLogout: "Keluar",
        // About section
        aboutTitle: "Tentang Kami",
        aboutDesc: "Pondok Titis berdiri sejak 2010, menyediakan hunian khusus putri/wanita yang nyaman dengan fasilitas lengkap untuk mahasiswi dan karyawati. Kami berkomitmen memberikan pelayanan terbaik untuk kenyamanan Anda.",
        statLabelExperience: "Tahun Pengalaman",
        statLabelRooms: "Kamar Tersedia",
        statLabelTenants: "Penghuni Bahagia",
        // Locations
        locationsTitle: "Kunjungi Lokasi Kami",
        bukaMapsBtn: "Buka di Maps",
        // Detail modal
        detailModalKeunggulanTitle: "Keunggulan Kamar & Lantai Ini",
        detailModalSpecTitle: "Spesifikasi Tipe Kamar",
        detailSpecInclude: "Listrik, Air, & WiFi Include",
        detailModalFurnishedTitle: "Fasilitas Kamar (Furnished)",
        detailModalBathroomTitle: "Fasilitas Kamar Mandi",
        detailModalRulesTitle: "Peraturan Khusus Kosan",
        detailModalPriceLabel: "Biaya Sewa",
        detailModalSewaBtn: "Ajukan Sewa",
        // Detail modal dynamic content
        detailLocStrategic: "Lokasi strategis",
        detailRating: "Rating",
        // Floor details (search modal)
        floorDetail_1: "Lantai 1: Tersedia 4 Kamar Standar, 3 Kamar Deluxe",
        floorDetail_2: "Lantai 2: Tersedia 6 Kamar Standar, 4 Kamar VIP",
        floorDetail_3: "Lantai 3: Tersedia 6 Kamar Standar, 4 Kamar VIP",
        floorDetail_4: "Lantai 4: Tersedia 5 Kamar Standar",
        // Room type labels
        typeStandar: "Standar",
        typeDeluxe: "Deluxe",
        typeVIP: "VIP",
        // Room detail content
        keunggulan_lt1_title: "Fasilitas Dasar Lantai 1 Lengkap",
        keunggulan_lt1_desc: "Dilengkapi mushola, pos jaga keamanan, dapur bersama beserta kulkas bersama.",
        keunggulan_lt1_akses_title: "Akses Keluar & Parkir Mudah",
        keunggulan_lt1_akses_desc: "Kamar berada di lantai dasar sehingga dekat dengan parkiran utama dan akses keluar sangat praktis.",
        keunggulan_lt4_title: "Area Praktis Lantai 4",
        keunggulan_lt4_desc: "Dekat dengan area penjemuran pakaian dan space area serbaguna lantai atas.",
        keunggulan_lt2_title: "Fasilitas Bersama Lantai 2",
        keunggulan_lt2_desc: "Dilengkapi dengan akses balkon bersama, meja belajar bersama, dan kulkas bersama.",
        keunggulan_lt3_title: "Fasilitas Bersama Lantai 3",
        keunggulan_lt3_desc: "Dilengkapi dengan akses balkon bersama, meja belajar bersama, dan kulkas bersama.",
        keunggulan_standar_title: "Ukuran Kamar Minimalis Ekonomis",
        keunggulan_standar_desc: "Dimensi kamar 3x3 meter yang praktis, rapi, dan mudah dibersihkan.",
        keunggulan_deluxe_title: "Ukuran Kamar Lebih Luas (3x4)",
        keunggulan_deluxe_desc: "Semua tipe Deluxe memiliki ukuran kamar 3x4 meter yang lapang di setiap lantai.",
        keunggulan_vip_title: "Ukuran Kamar Premium (3x4)",
        keunggulan_vip_desc: "Dimensi kamar 3x4 meter yang mewah, lapang, dan maksimal untuk produktivitas.",
        keunggulan_vip_balkon_title: "Balkon Pribadi (Private)",
        keunggulan_vip_balkon_desc: "Memiliki akses balkon privat tersendiri di dalam kamar untuk privasi eksklusif Anda.",
        // Room facilities
        fac_kasur: "Kasur",
        fac_dipan: "Dipan (Bed Frame)",
        fac_lemari: "Lemari Pakaian",
        fac_meja: "Meja Belajar",
        fac_wifi: "Router WiFi per Lantai",
        fac_wc: "Kamar Mandi Dalam (WC)",
        fac_toilet: "Toilet Jongkok",
        fac_gayung: "Gayung Air",
        fac_ember: "Ember Mandi",
        // Rules
        rule_1: "Maksimal 1 orang per kamar",
        rule_2: "Dilarang membawa hewan peliharaan",
        rule_3: "Dilarang keras membawa lawan jenis",
        rule_4: "Tamu menginap wajib lapor Pos Jaga / Admin",
        // Search modal
        searchModalTitle: "Cari Kamar Impian Anda",
        searchModalStep1: "1. Pilih Tipe Kamar",
        searchModalStep2: "2. Pilih Lokasi",
        searchModalStep3: "3. Pilih Lantai",
        searchModalStep4: "4. Durasi Sewa",
        searchModalStep5: "5. Tanggal Sewa",
        searchModalDuration: "Tahunan",
        searchModalDurationNote: "*Saat ini Pondok Titis hanya menyediakan opsi tahunan.",
        searchModalCheckin: "CHECK-IN",
        searchModalCheckout: "CHECK-OUT (OTOMATIS)",
        searchModalBtn: "Cari Kamar",
        // Status badges
        statusTersedia: "Tersedia",
        statusTidakTersedia: "Tidak Tersedia",
        statusPerbaikan: "Sedang Perbaikan",
        // Detail modal type labels
        detailTypeStandar: "Kamar Standard",
        detailTypeDeluxe: "Kamar Deluxe",
        detailTypeVIP: "Kamar VIP",
        // Login Modal
        loginTitle: "Selamat Datang Kembali",
        loginDesc: "Silakan masukkan detail Anda untuk masuk.",
        loginEmailPlaceholder: "Email",
        loginPasswordPlaceholder: "Kata Sandi",
        loginBtn: "Masuk",
        loginFootText: "Belum punya akun?",
        loginFootLink: "Daftar",
        // Register Modal
        regTitle: "Buat Akun Baru",
        regDesc: "Bergabung dengan Pondok Titis sekarang.",
        regFullNamePlaceholder: "Nama Lengkap",
        regEmailPlaceholder: "Email",
        regPasswordPlaceholder: "Kata Sandi (min 8 karakter)",
        regConfirmPassPlaceholder: "Konfirmasi Kata Sandi",
        regPhonePlaceholder: "Nomor Telepon",
        regBtn: "Daftar",
        regFootText: "Sudah punya akun?",
        regFootLink: "Masuk",
        // Profile Modal
        profileTitle: "Profil Saya",
        profileFullNamePlaceholder: "Nama Lengkap",
        profilePhonePlaceholder: "No. HP",
        profileGenderPlaceholder: "Jenis Kelamin",
        profileGenderMale: "Laki-laki",
        profileGenderFemale: "Perempuan",
        profileJobPlaceholder: "Pekerjaan",
        profileCityPlaceholder: "Asal Kota",
        profileSaveBtn: "Simpan Profil",
        // Watchlist Modal
        watchlistTitle: "Watchlist Saya",
        watchlistEmpty: "Watchlist Anda kosong. Cari kamar dan tambahkan ke favorit!",
        // Terms & Privacy Modals
        termsTitle: "Syarat & Ketentuan",
        termsContent: "1. Pembayaran dilakukan via QRIS atau cash.<br>2. Check-in sesuai tanggal yang dipilih.<br>3. Dilarang membawa hewan peliharaan.<br>4. Hubungi admin untuk keluhan.",
        privacyTitle: "Kebijakan Privasi",
        privacyContent: "Data Anda aman dan tidak akan dibagikan ke pihak ketiga. Data disimpan secara lokal di browser Anda.",
        // Booking Modal
        bookingTitle: "Form Pengajuan Sewa",
        bookingDescText: "Lengkapi data diri Anda untuk pengajuan sewa ",
        bookingRoomSpanText: "Kamar",
        bookingFullnameLabel: "Nama Lengkap",
        bookingFullnamePlaceholder: "Nama Lengkap sesuai KTP",
        bookingEmailLabel: "Email",
        bookingEmailPlaceholder: "Email aktif",
        bookingPhoneLabel: "Nomor HP / WhatsApp",
        bookingPhonePlaceholder: "Contoh: 0812XXXXXXXX",
        bookingEmergencyPhoneLabel: "Nomor HP Darurat (Keluarga)",
        bookingEmergencyPhonePlaceholder: "Contoh: 0812XXXXXXXX",
        bookingOriginLabel: "Asal Daerah (Kota/Kabupaten)",
        bookingOriginPlaceholder: "Asal daerah asal Anda",
        bookingJobLabel: "Pekerjaan",
        bookingJobPlaceholder: "Mahasiswa / Pekerja",
        bookingCheckinLabel: "Tanggal Check-in Mulai Sewa",
        bookingPaymentTitle: "Pilih Nominal Pembayaran",
        bookingOptDPTitle: "Uang Muka (DP)",
        bookingOptDPDesc: "Bayar tanda jadi untuk mengamankan kamar Anda sementara waktu.",
        bookingOptCashTitle: "Bayar Lunas (Cash)",
        bookingOptCashDesc: "Bayar penuh biaya sewa seharga 1 tahun untuk langsung lunas.",
        bookingContinueBtn: "Lanjutkan Pembayaran",
        // Payment Modal
        payTitle: "Pembayaran QRIS",
        payDesc: "Silakan scan QRIS di bawah ini untuk menyelesaikan pembayaran sewa kos.",
        payTotalLabel: "Total Tagihan Pembayaran",
        payConfirmBtn: "Telah Bayar, Konfirmasi ke Admin",
        // Admin Panel Modal
        adminTitle: "Dasbor Admin Simulasi",
        adminDesc: "Gunakan panel ini untuk mensimulasikan persetujuan sewa oleh pengelola kos Pondok Titis.",
        adminThTenant: "Penyewa",
        adminThRoom: "Kamar",
        adminThPayment: "Pembayaran",
        adminThStatus: "Status",
        adminThAction: "Aksi",
        adminNoBookings: "🔍 Tidak ada pengajuan sewa pending saat ini.",
        adminBtnApprove: "Setujui",
        adminBtnReject: "Tolak",
        adminPaymentDP: "DP (Uang Muka)",
        adminPaymentCash: "Lunas (Cash)",
        // My Room Modal
        myRoomTitle: "Kamar Saya",
        myRoomEmpty: "Anda belum memiliki kamar sewa aktif. Silakan cari kamar kosan andalan Anda dan ajukan sewa!",
        myRoomContract: "Kontrak Aktif",
        myRoomDetailTitle: "Rincian Kontak Sewa",
        myRoomTenant: "Nama Penyewa:",
        myRoomBranch: "Lokasi Cabang:",
        myRoomFloor: "Lantai Kamar:",
        myRoomCheckin: "Check-in:",
        myRoomCheckout: "Akhir Sewa (Check-out):",
        myRoomNoteTitle: "Catatan Pengambilan Kunci:",
        myRoomNoteDesc: "Silakan bawa KTP asli Anda beserta bukti kuitansi digital ke Pos Jaga / Security Pondok Titis untuk mengambil kunci kamar fisik Anda.",
        // Payment History Modal
        historyTitle: "Riwayat Pembayaran Anda",
        historyDesc: "Berikut adalah daftar kuitansi dan riwayat transaksi pengajuan sewa Anda.",
        historyThInv: "Nomor Invoice",
        historyThDate: "Tanggal",
        historyThRoom: "Kamar",
        historyThAmount: "Nominal",
        historyThPrint: "Cetak",
        historyBtnPrint: "Cetak Kuitansi",
        historyEmpty: "🔍 Belum ada riwayat transaksi pembayaran.",
        // Receipt Modal
        receiptPreview: "Pratinjau Kuitansi Cetak",
        receiptBtnPrint: "Cetak Kuitansi",
        receiptBtnClose: "Tutup",
        receiptResmi: "Kuitansi Resmi",
        receiptReceivedFrom: "DITERIMA DARI:",
        receiptPaymentDate: "TANGGAL PEMBAYARAN:",
        receiptPaymentMethod: "METODE BAYAR:",
        receiptQrisElectronic: "QRIS Transfer Elektronik",
        receiptThDesc: "Deskripsi Hunian",
        receiptThBranch: "Cabang",
        receiptThBillType: "Jenis Tagihan",
        receiptThAmountPaid: "JUMLAH DIBAYAR:",
        receiptLunas: "LUNAS",
        receiptSigTenant: "Penyewa / Tenant",
        receiptSigManagement: "Manajemen Pondok Titis",
        receiptSigAdmin: "Admin Pondok Titis",
        myRoomSisaTitle: "Sisa Pembayaran",
        myRoomSisaInfo: "Anda telah membayar DP sebesar Rp 2.000.000. Sisa tagihan pelunasan yang harus dibayarkan:",
        myRoomSisaStatusPending: "Pelunasan Sedang Ditinjau",
        myRoomSisaStatusPendingDesc: "Pembayaran pelunasan QRIS Anda sedang menunggu persetujuan Admin.",
        myRoomBtnSisa: "Lunasi Sisa Pembayaran",
        remTitle: "Pelunasan Sisa Pembayaran",
        remDesc: "Silakan pilih metode pembayaran untuk melunasi sisa tagihan sewa kamar Anda.",
        remOptCashTitle: "Sisa Tunai (Cash)",
        remOptCashDesc: "Pembayaran tunai langsung ke Admin di lokasi. Klik tombol untuk menghubungi WhatsApp Admin.",
        remOptQrisTitle: "Transfer QRIS",
        remOptQrisDesc: "Pindai kode QRIS Pondok Titis secara virtual dan kirim bukti bayar untuk ditinjau Admin.",
        remTotalLabel: "Sisa Tagihan Pelunasan",
        remBtnCash: "Hubungi Admin via WhatsApp",
        remBtnQris: "Konfirmasi Pembayaran Pelunasan",
        adminPaymentRemainingQRIS: "Pelunasan Sisa (QRIS)",
        adminPaymentRemainingCash: "Pelunasan Sisa (Cash)",
        myRoomSisaStatusPendingCash: "Pelunasan Sedang Ditinjau (Cash)",
        myRoomSisaStatusPendingCashDesc: "Pembayaran pelunasan Cash Anda sedang menunggu persetujuan Admin.",
        toastRemainingSent: "✓ Konfirmasi pelunasan dikirim! Menunggu persetujuan admin.",
        toastRemainingApproved: "✓ Pelunasan sewa berhasil disetujui!",
        loginTab: "Login",
        registerTab: "Daftar",
        forgotPasswordText: "Lupa Password?",
        strengthLabel: "Kekuatan",
        highlightsTitle: "Pondok Titis Highlights",
        highlightsSub: "Galeri fasilitas terbaik dan kenyamanan hunian kos putri Pondok Titis.",
        hlTitle_1: "Lokasi Strategis, Dekat Kampus",
        hlDesc_1: "Terletak di area strategis dekat kampus-kampus ternama, akses mudah ke pusat kota & transportasi umum.",
        hlTitle_2: "Halaman Luas & Asri",
        hlDesc_2: "Halaman depan yang luas, rapi, dan teduh — cocok untuk bersantai setelah aktivitas padat.",
        hlTitle_3: "Toko Pribadi di Area Kosan",
        hlDesc_3: "Tersedia toko pribadi di dalam area kosan untuk kebutuhan sehari-hari tanpa perlu keluar jauh.",
        hlTitle_4: "Ruangan Luas & Bersih",
        hlDesc_4: "Interior bangunan yang luas, terawat, dan bersih — memberikan kenyamanan maksimal bagi penghuni.",
        hlTitle_5: "Dapur Bersama Lengkap",
        hlDesc_5: "Dapur bersama yang bersih dan lengkap dengan peralatan masak, kulkas, serta dispenser air minum.",
        hlTitle_6: "Mushola Bersama",
        hlDesc_6: "Fasilitas mushola bersama yang nyaman dan bersih untuk ibadah penghuni setiap waktu.",
        hlTitle_7: "Balkon Bersama",
        hlDesc_7: "Area balkon bersama yang luas untuk bersantai, menjemur pakaian, dan menikmati udara segar.",
        hlTitle_8: "Kamar Mandi Modern & Bersih",
        hlDesc_8: "Kamar mandi dengan desain modern, bersih, dan terawat untuk kenyamanan sehari-hari Anda.",
    },
    en: {
        // Hero
        heroTitle_bandung: "STRATEGIC Location, ECONOMIC Choice",
        heroTitle_solo: "STRATEGIC Location, ECONOMIC Choice",
        heroSubtitle: "Discover the comfort of the finest female-only boarding rooms with easy access and complete facilities for your maximum productivity.",
        // Search capsule
        searchCapsuleTitle: "Search Boarding Room",
        searchCapsuleSub: "Select type & date...",
        // Filter bar
        filterAllFloors: "All Floors",
        filterFloor: "Floor",
        filterAllTypes: "All Types",
        filterAllPrices: "All Prices",
        filterPriceLow: "< Rp 14 Million",
        filterPriceMid: "Rp 14 - 15 Million",
        filterPriceHigh: "> Rp 15 Million",
        // Room card
        roomFloor: "Floor",
        roomPriceYear: "/year",
        roomDetailBtn: "Details",
        emptyState: "🔍 No rooms found",
        // Hamburger menu
        txtMyRoom: "My Room",
        txtHistory: "Payment History",

        txtWatchlist: "Saved Watchlist",
        txtProfile: "My Profile",
        txtChangePassword: "Change Password",
        txtReplayTour: "Start Web Tour",
        txtHelp: "Help Center",
        txtTerms: "Terms & Conditions",
        txtPrivacy: "Privacy Policy",
        txtLogin: "Register / Login",
        txtLogout: "Logout",
        // About section
        aboutTitle: "About Us",
        aboutDesc: "Pondok Titis was established in 2010, providing comfortable female-only accommodation with complete facilities for female students and workers. We are committed to delivering the best service for your comfort.",
        statLabelExperience: "Years of Experience",
        statLabelRooms: "Rooms Available",
        statLabelTenants: "Happy Tenants",
        // Locations
        locationsTitle: "Visit Our Locations",
        bukaMapsBtn: "Open in Maps",
        // Detail modal
        detailModalKeunggulanTitle: "Room & Floor Highlights",
        detailModalSpecTitle: "Room Type Specifications",
        detailSpecInclude: "Electricity, Water & WiFi Included",
        detailModalFurnishedTitle: "Room Facilities (Furnished)",
        detailModalBathroomTitle: "Bathroom Facilities",
        detailModalRulesTitle: "House Rules",
        detailModalPriceLabel: "Rental Cost",
        detailModalSewaBtn: "Apply for Rental",
        // Detail modal dynamic content
        detailLocStrategic: "Strategic location",
        detailRating: "Rating",
        // Floor details (search modal)
        floorDetail_1: "Floor 1: 4 Standard Rooms, 3 Deluxe Rooms available",
        floorDetail_2: "Floor 2: 6 Standard Rooms, 4 VIP Rooms available",
        floorDetail_3: "Floor 3: 6 Standard Rooms, 4 VIP Rooms available",
        floorDetail_4: "Floor 4: 5 Standard Rooms available",
        // Room type labels
        typeStandar: "Standard",
        typeDeluxe: "Deluxe",
        typeVIP: "VIP",
        // Room detail content
        keunggulan_lt1_title: "Complete Floor 1 Basic Facilities",
        keunggulan_lt1_desc: "Equipped with a prayer room, security post, shared kitchen, and shared refrigerator.",
        keunggulan_lt1_akses_title: "Easy Exit & Parking Access",
        keunggulan_lt1_akses_desc: "Ground floor rooms are close to the main parking area with very convenient exit access.",
        keunggulan_lt4_title: "Practical Floor 4 Area",
        keunggulan_lt4_desc: "Close to the clothes drying area and multipurpose space on the top floor.",
        keunggulan_lt2_title: "Floor 2 Shared Facilities",
        keunggulan_lt2_desc: "Equipped with shared balcony access, shared study tables, and shared refrigerator.",
        keunggulan_lt3_title: "Floor 3 Shared Facilities",
        keunggulan_lt3_desc: "Equipped with shared balcony access, shared study tables, and shared refrigerator.",
        keunggulan_standar_title: "Minimalist & Economical Room Size",
        keunggulan_standar_desc: "Practical 3x3 meter room dimensions, neat and easy to clean.",
        keunggulan_deluxe_title: "Larger Room Size (3x4)",
        keunggulan_deluxe_desc: "All Deluxe types have spacious 3x4 meter rooms on every floor.",
        keunggulan_vip_title: "Premium Room Size (3x4)",
        keunggulan_vip_desc: "Luxurious 3x4 meter room dimensions, spacious and maximised for productivity.",
        keunggulan_vip_balkon_title: "Private Balcony",
        keunggulan_vip_balkon_desc: "Features a private balcony access within the room for your exclusive privacy.",
        // Room facilities
        fac_kasur: "Mattress",
        fac_dipan: "Bed Frame",
        fac_lemari: "Wardrobe",
        fac_meja: "Study Desk",
        fac_wifi: "WiFi Router per Floor",
        fac_wc: "Attached Bathroom (WC)",
        fac_toilet: "Squat Toilet",
        fac_gayung: "Water Dipper",
        fac_ember: "Bath Bucket",
        // Rules
        rule_1: "Maximum 1 person per room",
        rule_2: "No pets allowed",
        rule_3: "Strictly no bringing opposite gender",
        rule_4: "Overnight guests must report to Security / Admin",
        // Search modal
        searchModalTitle: "Find Your Dream Room",
        searchModalStep1: "1. Choose Room Type",
        searchModalStep2: "2. Choose Location",
        searchModalStep3: "3. Choose Floor",
        searchModalStep4: "4. Rental Duration",
        searchModalStep5: "5. Rental Date",
        searchModalDuration: "Annual",
        searchModalDurationNote: "*Currently Pondok Titis only provides an annual rental option.",
        searchModalCheckin: "CHECK-IN",
        searchModalCheckout: "CHECK-OUT (AUTO)",
        searchModalBtn: "Search Rooms",
        // Status badges
        statusTersedia: "Available",
        statusTidakTersedia: "Not Available",
        statusPerbaikan: "Under Maintenance",
        // Detail modal type labels
        detailTypeStandar: "Standard Room",
        detailTypeDeluxe: "Deluxe Room",
        detailTypeVIP: "VIP Room",
        // Login Modal
        loginTitle: "Welcome Back",
        loginDesc: "Please enter your details to login.",
        loginEmailPlaceholder: "Email",
        loginPasswordPlaceholder: "Password",
        loginBtn: "Login",
        loginFootText: "Don't have an account?",
        loginFootLink: "Register",
        // Register Modal
        regTitle: "Create an Account",
        regDesc: "Join Pondok Titis today.",
        regFullNamePlaceholder: "Full Name",
        regEmailPlaceholder: "Email",
        regPasswordPlaceholder: "Password (min 8 chars)",
        regConfirmPassPlaceholder: "Confirm Password",
        regPhonePlaceholder: "Phone Number",
        regBtn: "Register",
        regFootText: "Already have an account?",
        regFootLink: "Login",
        // Profile Modal
        profileTitle: "My Profile",
        profileFullNamePlaceholder: "Full Name",
        profilePhonePlaceholder: "Phone Number",
        profileGenderPlaceholder: "Gender",
        profileGenderMale: "Male",
        profileGenderFemale: "Female",
        profileJobPlaceholder: "Occupation",
        profileCityPlaceholder: "Origin City",
        profileSaveBtn: "Save Profile",
        // Watchlist Modal
        watchlistTitle: "My Watchlist",
        watchlistEmpty: "Your watchlist is empty. Find rooms and add them to favorites!",
        // Terms & Privacy Modals
        termsTitle: "Terms & Conditions",
        termsContent: "1. Payments are made via QRIS or cash.<br>2. Check-in is according to the selected date.<br>3. Pets are strictly prohibited.<br>4. Contact admin for any complaints.",
        privacyTitle: "Privacy Policy",
        privacyContent: "Your data is secure and will not be shared with third parties. Data is stored locally in your browser.",
        // Booking Modal
        bookingTitle: "Rental Application Form",
        bookingDescText: "Complete your personal details to apply for rental ",
        bookingRoomSpanText: "Room",
        bookingFullnameLabel: "Full Name",
        bookingFullnamePlaceholder: "Full Name according to ID Card",
        bookingEmailLabel: "Email",
        bookingEmailPlaceholder: "Active email address",
        bookingPhoneLabel: "Phone / WhatsApp Number",
        bookingPhonePlaceholder: "Example: 0812XXXXXXXX",
        bookingEmergencyPhoneLabel: "Emergency Phone Number (Family)",
        bookingEmergencyPhonePlaceholder: "Example: 0812XXXXXXXX",
        bookingOriginLabel: "Origin Area (City/Regency)",
        bookingOriginPlaceholder: "Your city of origin",
        bookingJobLabel: "Occupation",
        bookingJobPlaceholder: "Student / Worker",
        bookingCheckinLabel: "Check-in Date to Start Rental",
        bookingPaymentTitle: "Select Payment Amount",
        bookingOptDPTitle: "Down Payment (DP)",
        bookingOptDPDesc: "Pay a booking fee to temporarily secure your room.",
        bookingOptCashTitle: "Pay in Full (Cash)",
        bookingOptCashDesc: "Pay the full rental cost for 1 year to clear your balance immediately.",
        bookingContinueBtn: "Continue to Payment",
        // Payment Modal
        payTitle: "QRIS Payment",
        payDesc: "Please scan the QRIS code below to complete your boarding room payment.",
        payTotalLabel: "Total Payment Bill",
        payConfirmBtn: "I Have Paid, Confirm to Admin",
        // Admin Panel Modal
        adminTitle: "Simulated Admin Dashboard",
        adminDesc: "Use this panel to simulate rental approvals by the Pondok Titis boarding house management.",
        adminThTenant: "Tenant",
        adminThRoom: "Room",
        adminThPayment: "Payment",
        adminThStatus: "Status",
        adminThAction: "Action",
        adminNoBookings: "🔍 There are no pending rental applications at this time.",
        adminBtnApprove: "Approve",
        adminBtnReject: "Reject",
        adminPaymentDP: "DP (Down Payment)",
        adminPaymentCash: "Full (Cash)",
        // My Room Modal
        myRoomTitle: "My Room",
        myRoomEmpty: "You do not have any active boarding room rentals yet. Please find your preferred room and apply for a lease!",
        myRoomContract: "Active Contract",
        myRoomDetailTitle: "Rental Contract Details",
        myRoomTenant: "Tenant Name:",
        myRoomBranch: "Branch Location:",
        myRoomFloor: "Room Floor:",
        myRoomCheckin: "Check-in:",
        myRoomCheckout: "End of Lease (Check-out):",
        myRoomNoteTitle: "Key Collection Note:",
        myRoomNoteDesc: "Please bring your original ID Card (KTP) along with this digital receipt to the Pondok Titis Security Post to collect your physical room keys.",
        // Payment History Modal
        historyTitle: "Your Payment History",
        historyDesc: "Here is the list of your receipts and lease application transaction history.",
        historyThInv: "Invoice Number",
        historyThDate: "Date",
        historyThRoom: "Room",
        historyThAmount: "Amount",
        historyThPrint: "Print",
        historyBtnPrint: "Print Receipt",
        historyEmpty: "🔍 No payment transaction history yet.",
        // Receipt Modal
        receiptPreview: "Printable Receipt Preview",
        receiptBtnPrint: "Print Receipt",
        receiptBtnClose: "Close",
        receiptResmi: "Official Receipt",
        receiptReceivedFrom: "RECEIVED FROM:",
        receiptPaymentDate: "PAYMENT DATE:",
        receiptPaymentMethod: "PAYMENT METHOD:",
        receiptQrisElectronic: "QRIS Electronic Transfer",
        receiptThDesc: "Accommodation Description",
        receiptThBranch: "Branch",
        receiptThBillType: "Bill Type",
        receiptThAmountPaid: "AMOUNT PAID:",
        receiptLunas: "PAID IN FULL",
        receiptSigTenant: "Penyewa / Tenant",
        receiptSigManagement: "Pondok Titis Management",
        receiptSigAdmin: "Pondok Titis Admin",
        myRoomSisaTitle: "Remaining Balance",
        myRoomSisaInfo: "You have paid a DP of Rp 2,000,000. The remaining balance to be cleared is:",
        myRoomSisaStatusPending: "Payment Under Review",
        myRoomSisaStatusPendingDesc: "Your QRIS balance payment is currently pending Admin approval.",
        myRoomBtnSisa: "Pay Remaining Balance",
        remTitle: "Remaining Balance Payment",
        remDesc: "Please select a payment method to settle the remaining balance of your lease.",
        remOptCashTitle: "Cash (Pay in Person)",
        remOptCashDesc: "Pay cash directly to the admin on site. Click below to contact the Admin via WhatsApp.",
        remOptQrisTitle: "QRIS Transfer",
        remOptQrisDesc: "Scan the Pondok Titis QRIS code and submit payment confirmation for admin review.",
        remTotalLabel: "Remaining Amount to Pay",
        remBtnCash: "Contact Admin via WhatsApp",
        remBtnQris: "Confirm Remaining Payment",
        adminPaymentRemainingQRIS: "Remaining Payment (QRIS)",
        adminPaymentRemainingCash: "Remaining Payment (Cash)",
        myRoomSisaStatusPendingCash: "Remaining Payment Pending (Cash)",
        myRoomSisaStatusPendingCashDesc: "Your Cash balance payment is currently pending Admin approval.",
        toastRemainingSent: "✓ Balance payment confirmation sent! Waiting for admin approval.",
        toastRemainingApproved: "✓ Remaining lease payment has been approved successfully!",
        loginTab: "Login",
        registerTab: "Register",
        forgotPasswordText: "Forgot Password?",
        strengthLabel: "Strength",
        highlightsTitle: "Pondok Titis Highlights",
        highlightsSub: "Gallery of premium facilities and female-only boarding house comfort.",
        hlTitle_1: "Strategic Location, Near Campus",
        hlDesc_1: "Located in a strategic area close to renowned universities, with easy access to downtown & public transport.",
        hlTitle_2: "Spacious & Green Yard",
        hlDesc_2: "A wide, well-maintained, and shaded front yard — perfect for relaxing after a busy day.",
        hlTitle_3: "On-Site Personal Shop",
        hlDesc_3: "A private shop available within the boarding area for daily necessities without going far.",
        hlTitle_4: "Spacious & Clean Interior",
        hlDesc_4: "A wide, well-maintained, and clean building interior — providing maximum comfort for residents.",
        hlTitle_5: "Fully Equipped Shared Kitchen",
        hlDesc_5: "A clean and fully equipped shared kitchen with cooking utensils, refrigerator, and water dispenser.",
        hlTitle_6: "Shared Prayer Room",
        hlDesc_6: "A comfortable and clean shared prayer room (mushola) for residents' worship at any time.",
        hlTitle_7: "Shared Balcony",
        hlDesc_7: "A spacious shared balcony area for relaxing, drying clothes, and enjoying fresh air.",
        hlTitle_8: "Modern & Clean Bathroom",
        hlDesc_8: "Bathrooms with modern design, clean and well-maintained for your daily comfort.",
    }
};
const translations = window.translations;

const langSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#db2777" stroke-linecap="round" stroke-width="2"><path stroke-linejoin="round" d="M14 19c3.771 0 5.657 0 6.828-1.172S22 14.771 22 11s0-5.657-1.172-6.828S17.771 3 14 3h-4C6.229 3 4.343 3 3.172 4.172S2 7.229 2 11s0 5.657 1.172 6.828c.653.654 1.528.943 2.828 1.07"/><path d="M14 19c-1.236 0-2.598.5-3.841 1.145c-1.998 1.037-2.997 1.556-3.489 1.225s-.399-1.355-.212-3.404L6.5 17.5"/><path stroke-linejoin="round" d="m5.5 13.5l1-2m0 0l1.106-2.211a1 1 0 0 1 1.788 0L10.5 11.5m-4 0h4m0 0l1 2m1-6h1.982V9c0 .5-.496 1.5-1.487 1.5m3.964-3v2m0 0v4m0-4H18.5"/></g></svg>`;

// Helper: safely set innerText on an element by id
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function updateLanguage() {
    const t = translations[currentLang];
    if (!t) return;

    // Update html lang attribute
    document.documentElement.lang = currentLang;

    // --- Language toggle button label ---
    const btnLang = document.getElementById('btnLanguageToggle');
    if (btnLang) btnLang.innerHTML = `${langSvg} ${currentLang.toUpperCase()}`;

    // --- Hero ---
    setText('heroTitleVisible', currentLocation === 'bandung' ? t.heroTitle_bandung : t.heroTitle_solo);
    setText('heroTitle', currentLocation === 'bandung' ? t.heroTitle_bandung : t.heroTitle_solo); // hidden compat span
    setText('heroSubtitle', t.heroSubtitle);

    // --- Search Capsule ---
    setText('txtSearchCapsuleTitle', t.searchCapsuleTitle);
    setText('txtSearchCapsuleSub', t.searchCapsuleSub);

    // --- Filter bar dropdowns ---
    const filterLantai = document.getElementById('filterLantai');
    if (filterLantai) {
        filterLantai.options[0].text = t.filterAllFloors;
        filterLantai.options[1].text = `${t.filterFloor} 1`;
        filterLantai.options[2].text = `${t.filterFloor} 2`;
        filterLantai.options[3].text = `${t.filterFloor} 3`;
        filterLantai.options[4].text = `${t.filterFloor} 4`;
    }
    const filterTipe = document.getElementById('filterTipe');
    if (filterTipe) {
        filterTipe.options[0].text = t.filterAllTypes;
        filterTipe.options[1].text = t.typeStandar;
        filterTipe.options[2].text = t.typeDeluxe;
        filterTipe.options[3].text = t.typeVIP;
    }
    const filterHarga = document.getElementById('filterHarga');
    if (filterHarga) {
        filterHarga.options[0].text = t.filterAllPrices;
        filterHarga.options[1].text = t.filterPriceLow;
        filterHarga.options[2].text = t.filterPriceMid;
        filterHarga.options[3].text = t.filterPriceHigh;
    }

    // --- Empty state ---
    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.innerText = t.emptyState;

    // --- Hamburger menu item spans ---
    setText('txtMyRoom', t.txtMyRoom);
    setText('txtHistory', t.txtHistory);

    setText('txtWatchlist', t.txtWatchlist);
    setText('txtProfile', t.txtProfile);
    setText('txtChangePassword', t.txtChangePassword);
    setText('txtReplayTour', t.txtReplayTour || 'Mulai Tur Website');
    setText('txtHelp', t.txtHelp);
    setText('txtTerms', t.txtTerms);
    setText('txtPrivacy', t.txtPrivacy);
    setText('txtLogin', t.txtLogin);
    setText('txtLogout', t.txtLogout);

    // --- About Us section ---
    setText('aboutTitle', t.aboutTitle);
    setText('aboutDesc', t.aboutDesc);
    setText('statLabelExperience', t.statLabelExperience);
    setText('statLabelRooms', t.statLabelRooms);
    setText('statLabelTenants', t.statLabelTenants);

    // --- Locations ---
    setText('locationsTitle', t.locationsTitle);
    document.querySelectorAll('.buka-maps-btn span').forEach(span => {
        span.innerText = t.bukaMapsBtn;
    });

    // --- Room Detail Modal static headers (if currently open) ---
    setText('detailModalKeunggulanTitle', t.detailModalKeunggulanTitle);
    setText('detailModalSpecTitle', t.detailModalSpecTitle);
    setText('detailSpecInclude', t.detailSpecInclude);
    setText('detailModalFurnishedTitle', t.detailModalFurnishedTitle);
    setText('detailModalBathroomTitle', t.detailModalBathroomTitle);
    setText('detailModalRulesTitle', t.detailModalRulesTitle);
    setText('detailModalPriceLabel', t.detailModalPriceLabel);
    const sewaBtn = document.getElementById('btnDetailExecuteSewa');
    if (sewaBtn) sewaBtn.innerText = t.detailModalSewaBtn;

    // --- Re-render dynamic modals if they are currently open ---
    // Room Detail Modal: re-render if open
    const roomDetailModal = document.getElementById('roomDetailModal');
    if (roomDetailModal && roomDetailModal.classList.contains('active')) {
        // Find current room ID from the title or stored data
        const detailTitle = document.getElementById('detailTitle');
        if (detailTitle && window._lastDetailRoomId) {
            showRoomDetail(window._lastDetailRoomId);
        }
    }
    // My Room Modal: re-render if open
    const myRoomModal = document.getElementById('myRoomModal');
    if (myRoomModal && myRoomModal.classList.contains('active') && window.openMyRoomModal) {
        window.openMyRoomModal();
    }
    // Payment History Modal: re-render if open
    const payHistModal = document.getElementById('paymentHistoryModal');
    if (payHistModal && payHistModal.classList.contains('active') && window.openHistoryModal) {
        window.openHistoryModal();
    }

    // Watchlist Modal: re-render if open
    const watchlistModal = document.getElementById('watchlistModal');
    if (watchlistModal && watchlistModal.classList.contains('active') && window.renderWatchlistModalContent) {
        window.renderWatchlistModalContent();
    }

    // Remaining Payment Modal: update action button translation if open
    const remainingModal = document.getElementById('remainingPaymentModal');
    if (remainingModal && remainingModal.classList.contains('active')) {
        const btnRemainingAction = document.getElementById('btnRemainingAction');
        if (btnRemainingAction && typeof selectedRemainingPaymentType !== 'undefined') {
            btnRemainingAction.innerText = (selectedRemainingPaymentType === 'cash') ? t.remBtnCash : t.remBtnQris;
        }
    }

    // --- Search Modal headings ---
    const searchModalTitle = document.querySelector('.search-modal-title');
    if (searchModalTitle) searchModalTitle.innerText = t.searchModalTitle;

    // Floor detail buttons text
    const floorBtns = document.querySelectorAll('.floor-btn');
    if (floorBtns.length) {
        floorBtns.forEach(btn => {
            const floor = btn.getAttribute('data-floor');
            btn.innerText = `${t.filterFloor} ${floor}`;
        });
    }
    // Floor description text
    const floorDetailsEl = document.getElementById('floorDetailsText');
    if (floorDetailsEl && searchFloor) {
        floorDetailsEl.innerText = t[`floorDetail_${searchFloor}`] || '';
    }

    // --- Systematic Translation via data-translate-key ---
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.getAttribute('data-translate-key');
        if (t[key] !== undefined) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else if (el.hasAttribute('data-translate-html')) {
                el.innerHTML = t[key];
            } else {
                el.innerText = t[key];
            }
        }
    });

    // Refresh password strength text if function exists
    const regPassInput = document.getElementById('regPassword');
    if (regPassInput && window.checkPasswordStrength) {
        window.checkPasswordStrength(regPassInput.value);
    }

    // --- Dynamic Settings & Contact Synchronization ---
    const savedSettings = localStorage.getItem('pt_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const fallbackPhone = currentLocation === 'bandung' ? '6285128067691' : '628987654321';
        const currentLocSettings = settings[currentLocation] || { phone: fallbackPhone };
        
        // 1. Update Location Cards on the page (always display both dynamically)
        const cards = document.querySelectorAll('.location-card');
        if (cards.length >= 2) {
            // Bandung Card (index 0)
            const bdgCard = cards[0];
            const bdgTitle = bdgCard.querySelector('.location-card-title');
            const bdgAddr = bdgCard.querySelector('.location-card-address');
            const bdgIframe = bdgCard.querySelector('iframe');
            const bdgBtn = bdgCard.querySelector('.buka-maps-btn');
            if (bdgTitle && settings.bandung.name) bdgTitle.innerText = settings.bandung.name;
            if (bdgAddr && settings.bandung.address) bdgAddr.innerText = settings.bandung.address;
            if (bdgIframe && settings.bandung.mapsIframe) bdgIframe.src = settings.bandung.mapsIframe;
            if (bdgBtn && settings.bandung.mapsLink) bdgBtn.href = settings.bandung.mapsLink;

            // Solo Card (index 1)
            const soloCard = cards[1];
            const soloTitle = soloCard.querySelector('.location-card-title');
            const soloAddr = soloCard.querySelector('.location-card-address');
            const soloIframe = soloCard.querySelector('iframe');
            const soloBtn = soloCard.querySelector('.buka-maps-btn');
            if (soloTitle && settings.solo.name) soloTitle.innerText = settings.solo.name;
            if (soloAddr && settings.solo.address) soloAddr.innerText = settings.solo.address;
            if (soloIframe && settings.solo.mapsIframe) soloIframe.src = settings.solo.mapsIframe;
            if (soloBtn && settings.solo.mapsLink) soloBtn.href = settings.solo.mapsLink;
        }

        // 2. Update all WhatsApp links
        const phone = currentLocSettings.phone || fallbackPhone;
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            try {
                // If this is a rejection warning, parse the rejection model dynamically
                if (link.href.includes('Invoice')) {
                    const match = link.href.match(/No\.\s*Invoice\s*([A-Z0-9-]+)/i);
                    const inv = match ? match[1] : '';
                    link.href = `https://wa.me/${phone}?text=${encodeURIComponent('Halo Admin, saya ingin menanyakan status pemesanan kamar saya dengan No. Invoice ' + inv)}`;
                } else {
                    const url = new URL(link.href);
                    const textParam = url.searchParams.get('text');
                    if (textParam) {
                        link.href = `https://wa.me/${phone}?text=${encodeURIComponent(textParam)}`;
                    } else {
                        link.href = `https://wa.me/${phone}`;
                    }
                }
            } catch (err) {
                link.href = `https://wa.me/${phone}`;
            }
        });
    }
}

document.getElementById('btnLanguageToggle')?.addEventListener('click', () => {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    window.currentLang = currentLang;
    localStorage.setItem('pt_lang', currentLang);
    updateLanguage();
    renderRooms(); // re-render room cards with new language
});


// Location tabs
function updateTabSlider() {
    const activeTab = document.querySelector('.nav-tab-btn.active');
    const slider = document.querySelector('.nav-tab-slider');
    if (activeTab && slider) {
        slider.style.width = `${activeTab.offsetWidth}px`;
        slider.style.transform = `translateX(${activeTab.offsetLeft - 4}px)`;
    }
}

document.querySelectorAll('.nav-tab-btn[data-location]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab-btn[data-location]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLocation = btn.getAttribute('data-location');

        const highlights = document.getElementById('highlightsSection');
        if (highlights) highlights.style.display = 'block';

        renderRooms();
        updateTabSlider();
        updateLanguage(); // refresh hero title for new location in current language
    });
});

window.addEventListener('resize', updateTabSlider);

// Filter listeners
document.getElementById('filterLantai')?.addEventListener('change', () => { if (window.renderRooms) window.renderRooms(); });
document.getElementById('filterTipe')?.addEventListener('change', () => { if (window.renderRooms) window.renderRooms(); });
document.getElementById('filterHarga')?.addEventListener('change', () => { if (window.renderRooms) window.renderRooms(); });
document.getElementById('searchRoomInput')?.addEventListener('input', () => { if (window.renderRooms) window.renderRooms(); });

// Logo click to home (refresh to bandung and reset all filters)
document.getElementById('logoHome')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    const highlights = document.getElementById('highlightsSection');
    if (highlights) highlights.style.display = 'block';
    
    // 1. Reset all dropdown filters to 'all'
    const filterLantai = document.getElementById('filterLantai');
    const filterTipe = document.getElementById('filterTipe');
    const filterHarga = document.getElementById('filterHarga');
    const searchInput = document.getElementById('searchRoomInput');
    
    if (filterLantai) filterLantai.value = 'all';
    if (filterTipe) filterTipe.value = 'all';
    if (filterHarga) filterHarga.value = 'all';
    if (searchInput) searchInput.value = '';
    
    // 2. Close any active modals
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // 3. Switch back to Bandung by triggering the click event
    const bandungTab = document.querySelector('.nav-tab-btn[data-location="bandung"]');
    if (bandungTab) {
        bandungTab.click(); // switches tab, slider, hero and runs renderRooms()
    } else {
        currentLocation = 'bandung';
        if (window.renderRooms) window.renderRooms();
    }
    
    // 4. Show success toast message
    showToast('✓ Halaman utama telah diatur ulang ke tampilan awal');
});

// Hamburger dropdown toggle
const userMenuBtn = document.getElementById('btnUserMenu');
const userDropdown = document.getElementById('userDropdown');

userMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!userMenuBtn?.contains(e.target) && !userDropdown?.contains(e.target)) {
        userDropdown?.classList.remove('open');
    }
});

// Terms & Privacy modals
document.getElementById('btnTerms')?.addEventListener('click', (e) => {
    e.preventDefault();
    userDropdown.classList.remove('open');
    if (window.openModal) window.openModal('termsModal');
});

document.getElementById('btnPrivacy')?.addEventListener('click', (e) => {
    e.preventDefault();
    userDropdown.classList.remove('open');
    if (window.openModal) window.openModal('privacyModal');
});

// Watchlist functionality
document.getElementById('btnWatchlist')?.addEventListener('click', () => {
    userDropdown.classList.remove('open');
    if (window.renderWatchlistModalContent) {
        window.renderWatchlistModalContent();
    }
    if (window.openModal) window.openModal('watchlistModal');
});

// Change Password Modal (simple implementation)
document.getElementById('btnChangePasswordMenu')?.addEventListener('click', () => {
    userDropdown.classList.remove('open');
    if (!window.currentUser) {
        if (window.openModal) window.openModal('loginModal');
        return;
    }
    const newPass = prompt('Masukkan password baru (min 8 karakter):');
    if (newPass && newPass.length >= 8) {
        window.currentUser.password = newPass;
        localStorage.setItem('currentUser', JSON.stringify(window.currentUser));
        const idx = (window.users || []).findIndex(u => u.email === window.currentUser.email);
        if (idx !== -1) window.users[idx] = window.currentUser;
        localStorage.setItem('users', JSON.stringify(window.users));
        alert('Password berhasil diubah!');
    } else if (newPass) {
        alert('Password minimal 8 karakter');
    }
});

// Replay onboarding tour
document.getElementById('btnReplayTour')?.addEventListener('click', () => {
    userDropdown.classList.remove('open');
    if (window.startWebTour) window.startWebTour();
});

// Toast notification helper
function showToast(message, duration = 3000) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}
window.showToast = showToast;

// Add to watchlist function (can be called from room cards)
window.addToWatchlist = function (roomId) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.includes(roomId)) {
        watchlist.push(roomId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        showToast('✓ Ditambahkan ke watchlist');
    } else {
        showToast('Kamar sudah ada di watchlist');
    }
};

// My Room menu - show assigned room if any
document.getElementById('btnMyRoomMenu')?.addEventListener('click', () => {
    userDropdown.classList.remove('open');
    if (window.openMyRoomModal) {
        window.openMyRoomModal();
    }
});

// Close modals when clicking overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
});

// ========== SEARCH MODAL INTERACTIVE LOGIC ==========
let searchType = 'standar';
let searchLoc = 'bandung';
let searchFloor = '1';

// Open Modal Trigger
document.getElementById('btnSearchCapsule')?.addEventListener('click', () => {
    if (window.openModal) window.openModal('searchModal');
    setTimeout(updateModalLocSlider, 150); // slight timeout for CSS layout parsing
});

// Auto Check-out Date Calculation (Monthly)
const checkinInput = document.getElementById('checkinDate');
const checkoutInput = document.getElementById('checkoutDate');

function updateCheckoutDate() {
    if (!checkinInput || !checkinInput.value) return;
    const checkinDate = new Date(checkinInput.value);
    
    // Add exactly 1 year (Tahunan)
    const checkoutDate = new Date(checkinDate);
    checkoutDate.setFullYear(checkinDate.getFullYear() + 1);
    
    // Format to dd/mm/yyyy
    const day = String(checkoutDate.getDate()).padStart(2, '0');
    const month = String(checkoutDate.getMonth() + 1).padStart(2, '0');
    const year = checkoutDate.getFullYear();
    
    if (checkoutInput) {
        checkoutInput.value = `${day}/${month}/${year}`;
    }
}

// Initialise dates on DOM load
if (checkinInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    checkinInput.value = `${yyyy}-${mm}-${dd}`;
    updateCheckoutDate();
    
    checkinInput.addEventListener('change', updateCheckoutDate);
}

// Room Type Selector Glow & Switch
document.querySelectorAll('.room-type-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.room-type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        searchType = card.getAttribute('data-type');
    });
});

// Location Tab Sliding Control
function updateModalLocSlider() {
    const activeModalTab = document.querySelector('.modal-loc-btn.active');
    const modalSlider = document.getElementById('modalLocSlider');
    if (activeModalTab && modalSlider) {
        modalSlider.style.width = `${activeModalTab.offsetWidth}px`;
        modalSlider.style.transform = `translateX(${activeModalTab.offsetLeft - 4}px)`;
    }
}

document.querySelectorAll('.modal-loc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-loc-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        searchLoc = btn.getAttribute('data-loc');
        updateModalLocSlider();
    });
});

window.addEventListener('resize', updateModalLocSlider);

// Floor Selection & Dynamic Description
document.querySelectorAll('.floor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.floor-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        searchFloor = btn.getAttribute('data-floor');
        
        const t = translations[currentLang];
        const detailText = t ? (t[`floorDetail_${searchFloor}`] || '') : '';
        const floorDetailsEl = document.getElementById('floorDetailsText');
        if (floorDetailsEl) {
            floorDetailsEl.innerText = detailText;
        }
    });
});

// Execute Search Button Trigger
document.getElementById('btnExecuteSearch')?.addEventListener('click', () => {
    // 1. Sync location with navbar main tabs
    const navTab = document.querySelector(`.nav-tab-btn[data-location="${searchLoc}"]`);
    if (navTab) {
        navTab.click(); // switches active location, updates hero UI, triggers render
    }
    
    const highlights = document.getElementById('highlightsSection');
    if (highlights) highlights.style.display = 'none';

    // 2. Set main filter dropdowns
    const filterLantai = document.getElementById('filterLantai');
    const filterTipe = document.getElementById('filterTipe');
    
    if (filterLantai) filterLantai.value = searchFloor;
    if (filterTipe) filterTipe.value = searchType;
    
    // 3. Close the modal
    if (window.closeModal) window.closeModal('searchModal');
    
    // 4. Force run render to filter
    if (window.renderRooms) window.renderRooms();

    // Scroll automatically to results
    const filterBar = document.querySelector('.filter-bar-location');
    if (filterBar) {
        filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 5. Display successful search toast
    const locLabel = searchLoc === 'bandung' ? 'Bandung' : 'Solo';
    showToast(`✓ Menampilkan hasil pencarian di ${locLabel} (Lantai ${searchFloor}, Tipe ${searchType.toUpperCase()})`);
});

// Initialize
function init() {
    if (window.renderRooms) window.renderRooms();
    updateUI();
    updateLanguage();
    updateTabSlider();
    setTimeout(updateTabSlider, 100);

    // Pre-populate demo users if empty
    if ((window.users || []).length === 0) {
        window.users = window.users || [];
        window.users.push({ email: 'demo@pondoktitis.com', password: 'demo123', fullname: 'Demo User', phone: '08123456789' });
        localStorage.setItem('users', JSON.stringify(window.users));
    }

    // Auto trigger onboarding tour for first-time logged-in users who haven't completed it yet
    if (window.currentUser && !localStorage.getItem('hasSeenWebTour')) {
        setTimeout(() => {
            if (window.startWebTour) window.startWebTour();
        }, 1200);
    }
}

init();

// ========== PAYMENT MODAL STRUCTURE (if needed) ==========
// Add payment modal HTML dynamically or it's already there from main HTML
// For completeness, ensure payment variables work
if (typeof bookRoom !== 'undefined') window.bookRoom = bookRoom;

// Export for debugging
console.log('Pondok Titis v2.0 - Liquid Crystal iOS 2026 Style 🚀');
});
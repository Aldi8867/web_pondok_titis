const API_URL = 'https://web-pondok-titis.onrender.com/api';
let roomsDatabase = { bandung: [], solo: [] };
let tempImageBase64 = "";

const API_URL = 'https://web-pondok-titis.onrender.com/api';
let roomsDatabase = { bandung: [], solo: [] };
let tempImageBase64 = "";

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const roomsGrid = document.getElementById('roomsGrid');
    const searchRoom = document.getElementById('searchRoom');
    const filterLocation = document.getElementById('filterLocation');
    const filterStatus = document.getElementById('filterStatus');

    const statTotalRooms = document.getElementById('statTotalRooms');
    const statAvailableRooms = document.getElementById('statAvailableRooms');
    const statOccupiedRooms = document.getElementById('statOccupiedRooms');
    const statMaintenanceRooms = document.getElementById('statMaintenanceRooms');
    const statComingRooms = document.getElementById('statComingRooms');

    const roomModal = document.getElementById('roomModal');
    const modalTitle = document.getElementById('modalTitle');
    const roomForm = document.getElementById('roomForm');
    const editRoomId = document.getElementById('editRoomId');
    const roomType = document.getElementById('roomType');
    const roomNumber = document.getElementById('roomNumber');
    const roomTitle = document.getElementById('roomTitle');
    const roomPrice = document.getElementById('roomPrice');
    const pricePreview = document.getElementById('pricePreview');
    const roomSize = document.getElementById('roomSize');
    const roomFloor = document.getElementById('roomFloor');
    const roomDescription = document.getElementById('roomDescription');
    const facilitiesGrid = document.getElementById('facilitiesGrid');
    const txtCustomFacility = document.getElementById('txtCustomFacility');
    const btnAddCustomFacility = document.getElementById('btnAddCustomFacility');
    const roomPhotoInput = document.getElementById('roomPhotoInput');
    const imgUploadDropzone = document.getElementById('imgUploadDropzone');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const previewWrapper = document.getElementById('previewWrapper');
    const uploadPreview = document.getElementById('uploadPreview');
    const btnRemoveImage = document.getElementById('btnRemoveImage');
    const btnOpenAddModal = document.getElementById('btnOpenAddModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelForm = document.getElementById('btnCancelForm');

    // ==========================================
    // FETCH ROOMS FROM API
    // ==========================================
    const fetchRooms = async () => {
        try {
            const res = await fetch(`${API_URL}/rooms`);
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();

            roomsDatabase = { bandung: [], solo: [] };
            data.forEach(r => {
                const room = {
                    id: r.id,
                    name: r.name || 'Kamar',
                    number: r.room_number || '',
                    type: r.type || 'standar',
                    price: r.price,
                    floor: r.floor,
                    image: r.image || "images/room_standard.png",
                    location: r.location || 'bandung',
                    facilities: typeof r.facilities === 'string' ? JSON.parse(r.facilities || "[]") : (r.facilities || []),
                    rating: r.rating || 4.8,
                    status: r.status || 'Tersedia',
                    size: r.size || '3x3 meter',
                    description: r.description || ''
                };
                if (room.location === 'bandung') {
                    roomsDatabase.bandung.push(room);
                } else {
                    roomsDatabase.solo.push(room);
                }
            });
            renderRooms();
        } catch (error) {
            console.error('Error fetching rooms:', error);
            roomsGrid.innerHTML = `<div class="rooms-empty-state">Gagal mengambil data kamar dari server.</div>`;
        }
    };

    // ==========================================
    // AUTO ROOM NUMBER GENERATOR
    // ==========================================
    const autoGenerateRoomNumber = () => {
        const selectedLoc = document.querySelector('input[name="roomLocation"]:checked').value;
        const selectedType = roomType.value;
        const allRooms = [...roomsDatabase.bandung, ...roomsDatabase.solo];
        const matches = allRooms.filter(r => r.location === selectedLoc && r.type === selectedType);

        let maxIndex = 0;
        const prefix = selectedLoc === 'bandung' ? 'BDG' : 'SLO';
        const typeLetter = selectedType === 'standar' ? 'S' : (selectedType === 'deluxe' ? 'D' : 'V');
        const pattern = new RegExp(`^${prefix}-${typeLetter}(\\d+)$`);

        matches.forEach(r => {
            const numStr = r.number || "";
            const match = numStr.match(pattern);
            if (match) {
                const index = parseInt(match[1], 10);
                if (index > maxIndex) maxIndex = index;
            }
        });

        const nextIndex = maxIndex + 1;
        roomNumber.value = `${prefix}-${typeLetter}${String(nextIndex).padStart(2, '0')}`;
    };

    document.querySelectorAll('input[name="roomLocation"]').forEach(radio => {
        radio.addEventListener('change', () => { autoGenerateRoomNumber(); updateDefaultValues(); });
    });
    roomType.addEventListener('change', () => { autoGenerateRoomNumber(); updateDefaultValues(); });

    const updateDefaultValues = () => {
        const selectedType = roomType.value;
        if (!editRoomId.value) {
            if (selectedType === 'standar') { roomSize.value = "3x3 meter"; roomTitle.value = "Kamar Standar Cozy"; }
            else if (selectedType === 'deluxe') { roomSize.value = "3x4 meter"; roomTitle.value = "Kamar Deluxe Executive"; }
            else if (selectedType === 'vip') { roomSize.value = "3x4 meter"; roomTitle.value = "Kamar VIP Royal"; }
        }
    };

    // ==========================================
    // PRICE PREVIEW
    // ==========================================
    roomPrice.addEventListener('input', () => {
        const val = parseFloat(roomPrice.value);
        if (isNaN(val) || val <= 0) { pricePreview.innerText = "Pratinjau: Rp 0 / tahun"; return; }
        pricePreview.innerText = `Pratinjau: Rp ${(val * 1000000).toLocaleString('id-ID')} / tahun`;
    });

    // ==========================================
    // IMAGE UPLOAD
    // ==========================================
    imgUploadDropzone.addEventListener('click', (e) => {
        if (e.target.id === 'btnRemoveImage') return;
        roomPhotoInput.click();
    });
    imgUploadDropzone.addEventListener('dragover', (e) => { e.preventDefault(); imgUploadDropzone.style.borderColor = 'var(--primary)'; });
    imgUploadDropzone.addEventListener('dragleave', () => { imgUploadDropzone.style.borderColor = 'var(--border)'; });
    imgUploadDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        imgUploadDropzone.style.borderColor = 'var(--border)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
    });
    roomPhotoInput.addEventListener('change', () => {
        if (roomPhotoInput.files && roomPhotoInput.files[0]) handleImageFile(roomPhotoInput.files[0]);
    });
    const handleImageFile = (file) => {
        if (!file.type.match('image.*')) { alert('File yang diunggah harus berupa gambar!'); return; }
        const reader = new FileReader();
        reader.onload = (e) => {
            tempImageBase64 = e.target.result;
            uploadPreview.src = tempImageBase64;
            uploadPlaceholder.style.display = 'none';
            previewWrapper.style.display = 'block';
        };
        reader.readAsDataURL(file);
    };
    btnRemoveImage.addEventListener('click', (e) => {
        e.stopPropagation();
        roomPhotoInput.value = "";
        tempImageBase64 = "";
        uploadPreview.src = "";
        previewWrapper.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
    });

    // ==========================================
    // CUSTOM FACILITY ADDITION
    // ==========================================
    btnAddCustomFacility.addEventListener('click', () => {
        const facName = txtCustomFacility.value.trim();
        if (!facName) return;
        const exists = Array.from(facilitiesGrid.querySelectorAll('input[type="checkbox"]')).some(cb => cb.value.toLowerCase() === facName.toLowerCase());
        if (exists) { alert('Fasilitas sudah ada di dalam daftar!'); return; }
        const newLabel = document.createElement('label');
        newLabel.className = 'facility-checkbox-label';
        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.value = facName;
        newCheckbox.checked = true;
        newLabel.appendChild(newCheckbox);
        newLabel.appendChild(document.createTextNode(` ${facName}`));
        facilitiesGrid.appendChild(newLabel);
        txtCustomFacility.value = "";
    });
    txtCustomFacility.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); btnAddCustomFacility.click(); } });

    // ==========================================
    // RENDER ROOM CARDS
    // ==========================================
    const renderRooms = () => {
        roomsGrid.innerHTML = "";
        const searchVal = searchRoom.value.toLowerCase().trim();
        const locVal = filterLocation.value;
        const statusVal = filterStatus.value;

        let displayList = [];
        if (locVal === 'all') displayList = [...roomsDatabase.bandung, ...roomsDatabase.solo];
        else if (locVal === 'bandung') displayList = [...roomsDatabase.bandung];
        else if (locVal === 'solo') displayList = [...roomsDatabase.solo];

        displayList = displayList.filter(room => {
            const matchesSearch = (room.type || "").toLowerCase().includes(searchVal) ||
                (room.number || "").toLowerCase().includes(searchVal) ||
                (room.name || "").toLowerCase().includes(searchVal);
            let matchesStatus = true;
            if (statusVal !== 'all') matchesStatus = room.status === statusVal;
            return matchesSearch && matchesStatus;
        });

        updateStats();

        if (displayList.length === 0) {
            roomsGrid.innerHTML = `<div class="rooms-empty-state">Kamar tidak ditemukan.</div>`;
            return;
        }

        displayList.sort((a, b) => a.id - b.id);

        displayList.forEach(room => {
            const card = document.createElement('div');
            card.className = 'room-card';

            let badgeClass = "badge-tersedia", statusText = "EMPTY";
            if (room.status === "Terisi") { badgeClass = "badge-terisi"; statusText = "OCCUPIED"; }
            else if (room.status === "Sedang Perbaikan") { badgeClass = "badge-maintenance"; statusText = "MAINTENANCE"; }
            else if (room.status === "Tidak Tersedia") { badgeClass = "badge-coming"; statusText = "COMING SOON"; }

            const formattedPrice = `Rp ${(room.price / 1000000).toFixed(1).replace('.0', '')} Jt`;
            const facHTML = (room.facilities || []).map(fac => `<span class="facility-pill">${fac}</span>`).join('');

            card.innerHTML = `
                <div class="room-card-img-wrapper">
                    <img src="${room.image}" alt="${room.name}" class="room-card-img" onerror="this.src='images/room_standard.png'">
                    <span class="room-card-badge ${badgeClass}">${statusText}</span>
                </div>
                <div class="room-card-body">
                    <div class="room-card-title">
                        <span>${room.name || ''}</span>
                        <span class="room-card-number">${room.number || ''}</span>
                    </div>
                    <div class="room-card-meta">
                        <span style="font-weight: 600; color: var(--primary);">${room.location === 'bandung' ? 'Bandung' : 'Solo'}</span>
                        <span>Lantai ${room.floor}</span>
                        <span>Ukuran ${room.size || '3x3'} m</span>
                    </div>
                    <div class="room-card-price">${formattedPrice} <span>/ tahun</span></div>
                    <div class="room-card-facilities">
                        ${facHTML || '<span class="facility-pill">Tanpa Fasilitas</span>'}
                    </div>
                    <div class="room-card-footer">
                        <button class="btn-card-action btn-card-maint" onclick="toggleRoomMaint(${room.id})">
                            ${room.status === 'Sedang Perbaikan' ? 'Tersedia' : 'Set Maint.'}
                        </button>
                        <button class="btn-card-action btn-card-edit" onclick="openEditRoomModal(${room.id})">
                            Ubah
                        </button>
                        <button class="btn-card-action btn-card-delete" onclick="deleteRoom(${room.id})" title="Hapus Kamar" style="display: inline-flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                    </div>
                </div>
            `;
            roomsGrid.appendChild(card);
        });

    };

    // ==========================================
    // STATS
    // ==========================================
    const updateStats = () => {
        const locVal = filterLocation.value;
        let all = [];
        if (locVal === 'all') all = [...roomsDatabase.bandung, ...roomsDatabase.solo];
        else if (locVal === 'bandung') all = [...roomsDatabase.bandung];
        else if (locVal === 'solo') all = [...roomsDatabase.solo];

        statTotalRooms.innerText = all.length;
        statAvailableRooms.innerText = all.filter(r => r.status === 'Tersedia').length;
        statOccupiedRooms.innerText = all.filter(r => r.status === 'Terisi').length;
        statMaintenanceRooms.innerText = all.filter(r => r.status === 'Sedang Perbaikan').length;
        statComingRooms.innerText = all.filter(r => r.status === 'Tidak Tersedia').length;
    };

    // Listeners handled via inline onclick on card buttons (window.openEditRoomModal, window.toggleRoomMaint, window.deleteRoom)

    // ==========================================
    // MODAL OPEN / CLOSE
    // ==========================================
    const setupFacilityCheckboxes = (selectedFacilities) => {
        const defaults = ["AC", "Kipas Angin", "Kasur", "Lemari", "Meja", "Kursi", "Jendela", "Kamar Mandi Dalam", "Kamar Mandi Luar", "Heater", "Shower", "WiFi Pribadi", "Kulkas", "Balkon", "CCTV"];
        Array.from(facilitiesGrid.querySelectorAll('.facility-checkbox-label')).forEach(lbl => {
            const cb = lbl.querySelector('input');
            if (cb && !defaults.includes(cb.value)) lbl.remove();
        });
        facilitiesGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        (selectedFacilities || []).forEach(fac => {
            let cb = Array.from(facilitiesGrid.querySelectorAll('input[type="checkbox"]')).find(c => c.value === fac);
            if (cb) { cb.checked = true; }
            else {
                const lbl = document.createElement('label'); lbl.className = 'facility-checkbox-label';
                const chk = document.createElement('input'); chk.type = 'checkbox'; chk.value = fac; chk.checked = true;
                lbl.appendChild(chk); lbl.appendChild(document.createTextNode(` ${fac}`));
                facilitiesGrid.appendChild(lbl);
            }
        });
    };

    const resetFacilityCheckboxes = () => {
        const defaults = ["AC", "Kipas Angin", "Kasur", "Lemari", "Meja", "Kursi", "Jendela", "Kamar Mandi Dalam", "Kamar Mandi Luar", "Heater", "Shower", "WiFi Pribadi", "Kulkas", "Balkon", "CCTV"];
        Array.from(facilitiesGrid.querySelectorAll('.facility-checkbox-label')).forEach(lbl => {
            const cb = lbl.querySelector('input');
            if (cb && !defaults.includes(cb.value)) lbl.remove();
        });
        facilitiesGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = ["AC", "Meja", "Kasur", "WiFi Pribadi"].includes(cb.value);
        });
    };

    const openAddModal = () => {
        modalTitle.innerText = "Tambah Kamar Baru";
        editRoomId.value = "";
        roomForm.reset();
        tempImageBase64 = "";
        uploadPreview.src = "";
        previewWrapper.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
        pricePreview.innerText = "Pratinjau: Rp 0 / tahun";
        resetFacilityCheckboxes();
        document.querySelector('input[name="roomLocation"][value="bandung"]').checked = true;
        roomType.value = "standar";
        roomFloor.value = "1";
        document.querySelector('input[name="roomStatus"][value="Tersedia"]').checked = true;
        autoGenerateRoomNumber();
        updateDefaultValues();
        roomModal.classList.add('active');
    };

    const openEditModal = (id) => {
        const room = [...roomsDatabase.bandung, ...roomsDatabase.solo].find(r => r.id === id);
        if (!room) return;
        modalTitle.innerText = `Edit Kamar - ${room.number}`;
        editRoomId.value = room.id;
        roomTitle.value = room.name;
        roomNumber.value = room.number;
        roomSize.value = room.size || '3x3 meter';
        roomFloor.value = room.floor.toString();
        roomDescription.value = room.description || '';
        roomPrice.value = room.price / 1000000;
        pricePreview.innerText = `Pratinjau: Rp ${room.price.toLocaleString('id-ID')} / tahun`;
        document.querySelector(`input[name="roomLocation"][value="${room.location}"]`).checked = true;
        roomType.value = room.type;
        document.querySelector(`input[name="roomStatus"][value="${room.status}"]`).checked = true;
        if (room.image) {
            tempImageBase64 = room.image;
            uploadPreview.src = room.image;
            uploadPlaceholder.style.display = 'none';
            previewWrapper.style.display = 'block';
        } else {
            tempImageBase64 = ""; uploadPreview.src = "";
            previewWrapper.style.display = 'none'; uploadPlaceholder.style.display = 'flex';
        }
        setupFacilityCheckboxes(room.facilities);
        roomModal.classList.add('active');
    };

    const closeModalWindow = () => roomModal.classList.remove('active');

    // ==========================================
    // SAVE ROOM (ADD / EDIT)
    // ==========================================
    roomForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loc = document.querySelector('input[name="roomLocation"]:checked').value;
        const type = roomType.value;
        const num = roomNumber.value;
        const title = roomTitle.value.trim();
        const priceMillions = parseFloat(roomPrice.value);
        const size = roomSize.value.trim();
        const floor = parseInt(roomFloor.value, 10);
        const status = document.querySelector('input[name="roomStatus"]:checked').value;
        const desc = roomDescription.value.trim();

        if (isNaN(priceMillions) || priceMillions <= 0) { alert('Harga harus diisi dengan angka yang valid!'); return; }

        const price = Math.round(priceMillions * 1000000);
        const checkedFacilities = Array.from(facilitiesGrid.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

        let roomImage = tempImageBase64;
        if (!roomImage) {
            const defaultImages = { standar: "images/room_standard.png", deluxe: "images/room_deluxe.png", vip: "images/room_vip.png" };
            roomImage = defaultImages[type] || "images/room_standard.png";
        }

        const isEdit = editRoomId.value !== "";
        const payload = {
            room_number: num, type, floor, price,
            description: desc || `Kamar tipe ${type} di lantai ${floor} Pondok Titis ${loc === 'bandung' ? 'Bandung' : 'Solo'}.`,
            status, name: title, location: loc, image: roomImage,
            facilities: checkedFacilities, size, rating: isEdit ? undefined : 4.8
        };

        const btnSave = document.getElementById('btnSaveRoom');
        const oldText = btnSave.innerText;
        btnSave.innerText = "Menyimpan...";
        btnSave.disabled = true;

        try {
            let res;
            if (isEdit) {
                res = await fetch(`${API_URL}/rooms/${parseInt(editRoomId.value, 10)}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(`${API_URL}/rooms`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
            }
            if (!res.ok) throw new Error('Gagal menyimpan');
            alert(isEdit ? 'Kamar berhasil diperbarui!' : 'Kamar baru berhasil ditambahkan!');
            closeModalWindow();
            fetchRooms();
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat menyimpan data ke server.');
        } finally {
            btnSave.innerText = oldText;
            btnSave.disabled = false;
        }
    });

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    btnOpenAddModal.addEventListener('click', openAddModal);
    btnCloseModal.addEventListener('click', closeModalWindow);
    btnCancelForm.addEventListener('click', closeModalWindow);
    searchRoom.addEventListener('input', renderRooms);
    filterLocation.addEventListener('change', renderRooms);
    filterStatus.addEventListener('change', renderRooms);

    const currentDate = document.getElementById('currentDate');
    if (currentDate) {
        currentDate.innerText = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Expose functions to window object for inline HTML onclick handlers
    window.openEditRoomModal = function(id) {
        openEditModal(id);
    };

    window.toggleRoomMaint = async function(id) {
        const room = [...roomsDatabase.bandung, ...roomsDatabase.solo].find(r => r.id === id);
        if (!room) return;
        const newStatus = room.status === 'Sedang Perbaikan' ? 'Tersedia' : 'Sedang Perbaikan';
        try {
            const res = await fetch(`${API_URL}/rooms/${id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error();
            fetchRooms();
        } catch { alert('Gagal mengubah status kamar.'); }
    };

    window.deleteRoom = async function(id) {
        const room = [...roomsDatabase.bandung, ...roomsDatabase.solo].find(r => r.id === id);
        if (!room) return;
        if (confirm(`Hapus kamar "${room.number}"? Tindakan ini tidak bisa dibatalkan.`)) {
            try {
                const res = await fetch(`${API_URL}/rooms/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error();
                fetchRooms();
            } catch { alert('Gagal menghapus kamar.'); }
        }
    };

    // Initial load
    fetchRooms();
});

// Logout logic
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('pt_isAdmin');
        window.location.href = '/';
    });
});

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // DATA GENERATOR & INITIALIZER
    // ==========================================
    const generateRooms = (loc) => {
        const list = [];
        let idCounter = loc === 'bandung' ? 100 : 200;
        
        let countStandar = 1;
        let countDeluxe = 1;
        let countVip = 1;

        const addRoom = (floor, type, name, price, facilities) => {
            const images = {
                standar: "images/room_standard.png",
                deluxe: "images/room_deluxe.png",
                vip: "images/room_vip.png"
            };
            const rating = (4.5 + ((idCounter * 7) % 5) / 10).toFixed(1);
            const status = idCounter % 5 === 0 ? "Sedang Perbaikan" : (idCounter % 3 === 0 ? "Terisi" : (idCounter % 7 === 0 ? "Tidak Tersedia" : "Tersedia"));
            
            // Format dynamic Room Number Code
            let roomCode = "";
            const prefix = loc === 'bandung' ? 'BDG' : 'SLO';
            if (type === 'standar') {
                roomCode = `${prefix}-S${String(countStandar++).padStart(2, '0')}`;
            } else if (type === 'deluxe') {
                roomCode = `${prefix}-D${String(countDeluxe++).padStart(2, '0')}`;
            } else {
                roomCode = `${prefix}-V${String(countVip++).padStart(2, '0')}`;
            }

            list.push({
                id: idCounter++,
                name: name,
                number: roomCode,
                type: type,
                price: price,
                floor: floor,
                image: images[type] || "images/room_standard.png",
                location: loc,
                facilities: facilities,
                rating: rating,
                status: status,
                size: type === 'standar' ? '3x3 meter' : '3x4 meter',
                description: `Kamar tipe ${type} yang nyaman di lantai ${floor} Pondok Titis ${loc === 'bandung' ? 'Bandung' : 'Solo'}. Dilengkapi dengan berbagai fasilitas penunjang kenyamanan produktivitas Anda.`
            });
        };

        // Lantai 1: 4 standard, 3 deluxe
        for (let i = 1; i <= 4; i++) addRoom(1, 'standar', 'Kamar Standar Cozy', 13500000, ["AC", "Meja", "Kasur"]);
        for (let i = 1; i <= 3; i++) addRoom(1, 'deluxe', 'Kamar Deluxe Executive', 14500000, ["AC", "Lemari", "Kamar Mandi Dalam"]);

        // Lantai 2: 6 standard, 4 vip
        for (let i = 1; i <= 6; i++) addRoom(2, 'standar', 'Kamar Standar Cozy', 13500000, ["AC", "Meja", "Kasur"]);
        for (let i = 1; i <= 4; i++) addRoom(2, 'vip', 'Kamar VIP Royal', 15500000, ["AC", "Lemari", "WiFi Pribadi", "Kulkas", "Balkon", "Kamar Mandi Dalam"]);

        // Lantai 3: 6 standard, 4 vip
        for (let i = 1; i <= 6; i++) addRoom(3, 'standar', 'Kamar Standar Cozy', 13500000, ["AC", "Meja", "Kasur"]);
        for (let i = 1; i <= 4; i++) addRoom(3, 'vip', 'Kamar VIP Royal', 15500000, ["AC", "Lemari", "WiFi Pribadi", "Kulkas", "Balkon", "Kamar Mandi Dalam"]);

        // Lantai 4: 5 standard
        for (let i = 1; i <= 5; i++) addRoom(4, 'standar', 'Kamar Standar Cozy Skyline', 13500000, ["AC", "Meja", "Kasur", "Balkon"]);

        return list;
    };

    // Load or initialize data in localStorage
    const getRoomsData = () => {
        let data = localStorage.getItem('pt_rooms_data');
        
        const initData = () => {
            const initialData = {
                bandung: generateRooms('bandung'),
                solo: generateRooms('solo')
            };
            localStorage.setItem('pt_rooms_data', JSON.stringify(initialData));
            return initialData;
        };

        if (!data || data === 'undefined' || data === 'null') {
            return initData();
        }
        try {
            const parsed = JSON.parse(data);
            if (!parsed || !parsed.bandung || !parsed.solo) {
                return initData();
            }
            return parsed;
        } catch(e) {
            return initData();
        }
    };

    const saveRoomsData = (data) => {
        localStorage.setItem('pt_rooms_data', JSON.stringify(data));
    };

    // Global memory state for active rooms database
    let roomsDatabase = getRoomsData();
    let tempImageBase64 = ""; // hold upload image base64 temporarily

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const roomsGrid = document.getElementById('roomsGrid');
    const searchRoom = document.getElementById('searchRoom');
    const filterLocation = document.getElementById('filterLocation');
    const filterStatus = document.getElementById('filterStatus');

    // Stats element
    const statTotalRooms = document.getElementById('statTotalRooms');
    const statAvailableRooms = document.getElementById('statAvailableRooms');
    const statOccupiedRooms = document.getElementById('statOccupiedRooms');
    const statMaintenanceRooms = document.getElementById('statMaintenanceRooms');
    const statComingRooms = document.getElementById('statComingRooms');

    // Modal elements
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
    // AUTO ROOM NUMBER GENERATOR
    // ==========================================
    const autoGenerateRoomNumber = () => {
        const selectedLoc = document.querySelector('input[name="roomLocation"]:checked').value;
        const selectedType = roomType.value;
        
        const allRooms = [...roomsDatabase.bandung, ...roomsDatabase.solo];
        
        // Filter room list of exact selected location and type
        const matches = allRooms.filter(r => r.location === selectedLoc && r.type === selectedType);
        
        // Find existing index suffix
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
        
        // Increment and create unique code
        const nextIndex = maxIndex + 1;
        const generatedCode = `${prefix}-${typeLetter}${String(nextIndex).padStart(2, '0')}`;
        roomNumber.value = generatedCode;
    };

    // Watch for Location / Type change to update Room Number in Modal
    document.querySelectorAll('input[name="roomLocation"]').forEach(radio => {
        radio.addEventListener('change', () => {
            autoGenerateRoomNumber();
            updateDefaultValues();
        });
    });
    roomType.addEventListener('change', () => {
        autoGenerateRoomNumber();
        updateDefaultValues();
    });

    const updateDefaultValues = () => {
        // Automatically suggest size and default description based on type
        const selectedType = roomType.value;
        if (!editRoomId.value) { // only on adding a new room
            if (selectedType === 'standar') {
                roomSize.value = "3x3 meter";
                roomTitle.value = "Kamar Standar Cozy";
            } else if (selectedType === 'deluxe') {
                roomSize.value = "3x4 meter";
                roomTitle.value = "Kamar Deluxe Executive";
            } else if (selectedType === 'vip') {
                roomSize.value = "3x4 meter";
                roomTitle.value = "Kamar VIP Royal";
            }
        }
    };

    // ==========================================
    // DYNAMIC PRICE PREVIEW (MILLIONS FORMAT)
    // ==========================================
    roomPrice.addEventListener('input', () => {
        const val = parseFloat(roomPrice.value);
        if (isNaN(val) || val <= 0) {
            pricePreview.innerText = "Pratinjau: Rp 0 / tahun";
            return;
        }
        const realPrice = val * 1000000;
        pricePreview.innerText = `Pratinjau: Rp ${realPrice.toLocaleString('id-ID')} / tahun`;
    });

    // ==========================================
    // IMAGE UPLOAD & PREVIEW (FileReader)
    // ==========================================
    imgUploadDropzone.addEventListener('click', (e) => {
        // Prevent click trigger if delete button is clicked
        if (e.target.id === 'btnRemoveImage') return;
        roomPhotoInput.click();
    });

    // Drag over effects
    imgUploadDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imgUploadDropzone.style.borderColor = 'var(--primary)';
    });

    imgUploadDropzone.addEventListener('dragleave', () => {
        imgUploadDropzone.style.borderColor = 'var(--border)';
    });

    imgUploadDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        imgUploadDropzone.style.borderColor = 'var(--border)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageFile(e.dataTransfer.files[0]);
        }
    });

    roomPhotoInput.addEventListener('change', () => {
        if (roomPhotoInput.files && roomPhotoInput.files[0]) {
            handleImageFile(roomPhotoInput.files[0]);
        }
    });

    const handleImageFile = (file) => {
        if (!file.type.match('image.*')) {
            alert('File yang diunggah harus berupa gambar!');
            return;
        }
        
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

        // Check if facility checkbox already exists
        const existingCheckboxes = Array.from(facilitiesGrid.querySelectorAll('input[type="checkbox"]'));
        const exists = existingCheckboxes.some(cb => cb.value.toLowerCase() === facName.toLowerCase());
        
        if (exists) {
            alert('Fasilitas sudah ada di dalam daftar!');
            return;
        }

        // Add checkbox programmatically and check it
        const newLabel = document.createElement('label');
        newLabel.className = 'facility-checkbox-label';
        
        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.value = facName;
        newCheckbox.checked = true;

        newLabel.appendChild(newCheckbox);
        newLabel.appendChild(document.createTextNode(` ${facName}`));
        
        // Append to facilities list
        facilitiesGrid.appendChild(newLabel);
        
        // Clear input
        txtCustomFacility.value = "";
    });

    // Handle enter key in custom facility input
    txtCustomFacility.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            btnAddCustomFacility.click();
        }
    });

    // ==========================================
    // RENDER ROOM CARDS GRID
    // ==========================================
    const renderRooms = () => {
        roomsGrid.innerHTML = "";
        
        const searchVal = searchRoom.value.toLowerCase().trim();
        const locVal = filterLocation.value;
        const statusVal = filterStatus.value;
        
        // Merge Bandung and Solo rooms into single array
        let displayList = [];
        if (locVal === 'all') {
            displayList = [...roomsDatabase.bandung, ...roomsDatabase.solo];
        } else if (locVal === 'bandung') {
            displayList = [...roomsDatabase.bandung];
        } else if (locVal === 'solo') {
            displayList = [...roomsDatabase.solo];
        }

        // Apply filters
        displayList = displayList.filter(room => {
            // Search filter
            const typeStr = room.type || "";
            const numStr = room.number || "";
            const nameStr = room.name || "";
            const matchesSearch = typeStr.toLowerCase().includes(searchVal) ||
                                  numStr.toLowerCase().includes(searchVal) ||
                                  nameStr.toLowerCase().includes(searchVal);
                                  
            // Status filter
            let matchesStatus = true;
            if (statusVal !== 'all') {
                if (statusVal === 'Tersedia') {
                    matchesStatus = room.status === 'Tersedia';
                } else if (statusVal === 'Terisi') {
                    matchesStatus = room.status === 'Terisi';
                } else if (statusVal === 'Sedang Perbaikan') {
                    matchesStatus = room.status === 'Sedang Perbaikan';
                } else {
                    matchesStatus = room.status === 'Tidak Tersedia';
                }
            }
            
            return matchesSearch && matchesStatus;
        });

        // Compute and render Stats
        updateStats();

        if (displayList.length === 0) {
            roomsGrid.innerHTML = `<div class="rooms-empty-state">Kamar tidak ditemukan dengan kriteria pencarian Anda.</div>`;
            return;
        }

        // Sort: newer rooms first (or by ID)
        displayList.sort((a, b) => b.id - a.id);

        displayList.forEach(room => {
            const card = document.createElement('div');
            card.className = 'room-card';

            // Define Badge classes
            let badgeClass = "badge-tersedia";
            let statusText = "EMPTY";
            if (room.status === "Terisi") {
                badgeClass = "badge-terisi";
                statusText = "OCCUPIED";
            } else if (room.status === "Sedang Perbaikan") {
                badgeClass = "badge-maintenance";
                statusText = "MAINTENANCE";
            } else if (room.status === "Tidak Tersedia") {
                badgeClass = "badge-coming";
                statusText = "COMING SOON";
            }

            // Price formulation
            const formattedPrice = `Rp ${(room.price / 1000000).toFixed(1).replace('.0', '')} Jt`;

            // Facilities list
            const facHTML = room.facilities.map(fac => `<span class="facility-pill">${fac}</span>`).join('');

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
                        <button class="btn-card-action btn-card-maint" data-id="${room.id}" data-action="toggle-maint">
                            ${room.status === 'Sedang Perbaikan' ? 'Tersedia' : 'Set Maint.'}
                        </button>
                        <button class="btn-card-action btn-card-edit" data-id="${room.id}" data-action="edit">
                            Ubah
                        </button>
                        <button class="btn-card-action btn-card-delete" data-id="${room.id}" data-action="delete" title="Hapus Kamar" style="display: inline-flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                    </div>
                </div>
            `;
            roomsGrid.appendChild(card);
        });

        // Add listeners for action buttons
        attachCardListeners();
    };

    const updateStats = () => {
        const locVal = filterLocation.value;
        let filteredRooms = [];
        
        if (locVal === 'all') {
            filteredRooms = [...roomsDatabase.bandung, ...roomsDatabase.solo];
        } else if (locVal === 'bandung') {
            filteredRooms = [...roomsDatabase.bandung];
        } else if (locVal === 'solo') {
            filteredRooms = [...roomsDatabase.solo];
        }
        
        statTotalRooms.innerText = filteredRooms.length;
        statAvailableRooms.innerText = filteredRooms.filter(r => r.status === 'Tersedia').length;
        statOccupiedRooms.innerText = filteredRooms.filter(r => r.status === 'Terisi').length;
        statMaintenanceRooms.innerText = filteredRooms.filter(r => r.status === 'Sedang Perbaikan').length;
        statComingRooms.innerText = filteredRooms.filter(r => r.status === 'Tidak Tersedia').length;
    };

    // Attach Action Buttons click events
    const attachCardListeners = () => {
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                const action = btn.getAttribute('data-action');
                
                if (action === 'toggle-maint') {
                    toggleMaintenance(id);
                } else if (action === 'edit') {
                    openEditModal(id);
                } else if (action === 'delete') {
                    deleteRoom(id);
                }
            });
        });
    };

    // Toggle Maintenance Status quickly
    const toggleMaintenance = (id) => {
        let found = false;
        // Check Bandung
        roomsDatabase.bandung = roomsDatabase.bandung.map(r => {
            if (r.id === id) {
                found = true;
                r.status = r.status === 'Sedang Perbaikan' ? 'Tersedia' : 'Sedang Perbaikan';
            }
            return r;
        });

        // Check Solo if not found in Bandung
        if (!found) {
            roomsDatabase.solo = roomsDatabase.solo.map(r => {
                if (r.id === id) {
                    r.status = r.status === 'Sedang Perbaikan' ? 'Tersedia' : 'Sedang Perbaikan';
                }
                return r;
            });
        }

        saveRoomsData(roomsDatabase);
        renderRooms();
    };

    // Delete Room
    const deleteRoom = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kamar ini secara permanen dari sistem?')) {
            const prevLen = roomsDatabase.bandung.length + roomsDatabase.solo.length;
            
            roomsDatabase.bandung = roomsDatabase.bandung.filter(r => r.id !== id);
            roomsDatabase.solo = roomsDatabase.solo.filter(r => r.id !== id);
            
            const postLen = roomsDatabase.bandung.length + roomsDatabase.solo.length;
            
            if (prevLen > postLen) {
                saveRoomsData(roomsDatabase);
                renderRooms();
            }
        }
    };

    // ==========================================
    // MODAL OPEN / CLOSE & SAVE
    // ==========================================
    const openAddModal = () => {
        modalTitle.innerText = "Tambah Kamar Baru";
        editRoomId.value = "";
        roomForm.reset();
        
        // Reset dynamic fields
        tempImageBase64 = "";
        uploadPreview.src = "";
        previewWrapper.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
        pricePreview.innerText = "Pratinjau: Rp 0 / tahun";
        
        // Default checkboxes check standard
        resetFacilityCheckboxes();
        
        // Select standard location Bandung
        document.querySelector('input[name="roomLocation"][value="bandung"]').checked = true;
        roomType.value = "standar";
        roomFloor.value = "1";
        document.querySelector('input[name="roomStatus"][value="Tersedia"]').checked = true;

        autoGenerateRoomNumber();
        updateDefaultValues();

        roomModal.classList.add('active');
    };

    const openEditModal = (id) => {
        const allRooms = [...roomsDatabase.bandung, ...roomsDatabase.solo];
        const room = allRooms.find(r => r.id === id);
        if (!room) return;

        modalTitle.innerText = `Edit Kamar - ${room.number}`;
        editRoomId.value = room.id;

        // Populate basic text inputs
        roomTitle.value = room.name;
        roomNumber.value = room.number;
        roomSize.value = room.size || '3x3 meter';
        roomFloor.value = room.floor.toString();
        roomDescription.value = room.description || '';
        
        // Price in millions
        const priceInMillions = room.price / 1000000;
        roomPrice.value = priceInMillions;
        pricePreview.innerText = `Pratinjau: Rp ${room.price.toLocaleString('id-ID')} / tahun`;

        // Radio Lokasi
        document.querySelector(`input[name="roomLocation"][value="${room.location}"]`).checked = true;
        
        // Select Tipe
        roomType.value = room.type;

        // Radio Status
        document.querySelector(`input[name="roomStatus"][value="${room.status}"]`).checked = true;

        // Photo Preview Setup
        if (room.image && room.image.startsWith('data:image')) {
            tempImageBase64 = room.image;
            uploadPreview.src = room.image;
            uploadPlaceholder.style.display = 'none';
            previewWrapper.style.display = 'block';
        } else if (room.image) {
            tempImageBase64 = room.image; // hold relative path
            uploadPreview.src = room.image;
            uploadPlaceholder.style.display = 'none';
            previewWrapper.style.display = 'block';
        } else {
            tempImageBase64 = "";
            uploadPreview.src = "";
            previewWrapper.style.display = 'none';
            uploadPlaceholder.style.display = 'flex';
        }

        // Set facility checkboxes
        setupFacilityCheckboxes(room.facilities);

        roomModal.classList.add('active');
    };

    const closeModalWindow = () => {
        roomModal.classList.remove('active');
    };

    // Helper to setup checkboxes for edit mode
    const setupFacilityCheckboxes = (selectedFacilities) => {
        // Remove custom dynamic checkboxes first
        const allLabels = Array.from(facilitiesGrid.querySelectorAll('.facility-checkbox-label'));
        const defaults = ["AC", "Kipas Angin", "Kasur", "Lemari", "Meja", "Kursi", "Jendela", "Kamar Mandi Dalam", "Kamar Mandi Luar", "Heater", "Shower", "WiFi Pribadi", "Kulkas", "Balkon", "CCTV"];
        
        // Delete all elements not in defaults
        allLabels.forEach(lbl => {
            const cb = lbl.querySelector('input');
            if (cb && !defaults.includes(cb.value)) {
                lbl.remove();
            }
        });

        // Uncheck all standard
        const checkBoxes = facilitiesGrid.querySelectorAll('input[type="checkbox"]');
        checkBoxes.forEach(cb => cb.checked = false);

        // Check standard & append custom facilities
        selectedFacilities.forEach(fac => {
            let cb = Array.from(facilitiesGrid.querySelectorAll('input[type="checkbox"]')).find(c => c.value === fac);
            if (cb) {
                cb.checked = true;
            } else {
                // Facility is custom, let's create a dynamic checked checkbox
                const newLabel = document.createElement('label');
                newLabel.className = 'facility-checkbox-label';
                
                const newCheckbox = document.createElement('input');
                newCheckbox.type = 'checkbox';
                newCheckbox.value = fac;
                newCheckbox.checked = true;

                newLabel.appendChild(newCheckbox);
                newLabel.appendChild(document.createTextNode(` ${fac}`));
                facilitiesGrid.appendChild(newLabel);
            }
        });
    };

    const resetFacilityCheckboxes = () => {
        // Remove custom checkboxes
        const allLabels = Array.from(facilitiesGrid.querySelectorAll('.facility-checkbox-label'));
        const defaults = ["AC", "Kipas Angin", "Kasur", "Lemari", "Meja", "Kursi", "Jendela", "Kamar Mandi Dalam", "Kamar Mandi Luar", "Heater", "Shower", "WiFi Pribadi", "Kulkas", "Balkon", "CCTV"];
        
        allLabels.forEach(lbl => {
            const cb = lbl.querySelector('input');
            if (cb && !defaults.includes(cb.value)) {
                lbl.remove();
            }
        });

        // Reset check defaults: AC, Meja, Kasur, WiFi
        const checkBoxes = facilitiesGrid.querySelectorAll('input[type="checkbox"]');
        checkBoxes.forEach(cb => {
            if (["AC", "Meja", "Kasur", "WiFi Pribadi"].includes(cb.value)) {
                cb.checked = true;
            } else {
                cb.checked = false;
            }
        });
    };

    // Save Room form submit
    roomForm.addEventListener('submit', (e) => {
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

        if (isNaN(priceMillions) || priceMillions <= 0) {
            alert('Harga harus diisi dengan angka yang valid!');
            return;
        }

        // Price stored in normal integer
        const price = Math.round(priceMillions * 1000000);

        // Gather facilities
        const checkedFacilities = Array.from(facilitiesGrid.querySelectorAll('input[type="checkbox"]:checked'))
                                       .map(cb => cb.value);

        // Photo fallback if not uploaded
        let roomImage = tempImageBase64;
        if (!roomImage) {
            const defaultImages = {
                standar: "images/room_standard.png",
                deluxe: "images/room_deluxe.png",
                vip: "images/room_vip.png"
            };
            roomImage = defaultImages[type] || "images/room_standard.png";
        }

        const isEdit = editRoomId.value !== "";

        if (isEdit) {
            // Edit existing room
            const editId = parseInt(editRoomId.value, 10);
            
            // Delete from both locations first (to handle location changes safely!)
            let prevRoom = null;
            
            roomsDatabase.bandung = roomsDatabase.bandung.filter(r => {
                if (r.id === editId) {
                    prevRoom = r;
                    return false;
                }
                return true;
            });
            roomsDatabase.solo = roomsDatabase.solo.filter(r => {
                if (r.id === editId) {
                    prevRoom = r;
                    return false;
                }
                return true;
            });

            // Re-insert with updated parameters into correct location
            const updatedRoom = {
                id: editId,
                name: title,
                number: num,
                type: type,
                price: price,
                floor: floor,
                image: roomImage,
                location: loc,
                facilities: checkedFacilities,
                rating: prevRoom ? prevRoom.rating : "4.8",
                status: status,
                size: size,
                description: desc || `Kamar tipe ${type} yang nyaman di lantai ${floor} Pondok Titis ${loc === 'bandung' ? 'Bandung' : 'Solo'}.`
            };

            if (loc === 'bandung') {
                roomsDatabase.bandung.push(updatedRoom);
            } else {
                roomsDatabase.solo.push(updatedRoom);
            }

            alert('Kamar berhasil diperbarui!');
        } else {
            // Add new room
            const allRooms = [...roomsDatabase.bandung, ...roomsDatabase.solo];
            
            // ID counters
            let nextId = 100;
            if (loc === 'bandung') {
                const bdgIds = roomsDatabase.bandung.map(r => r.id);
                nextId = bdgIds.length > 0 ? Math.max(...bdgIds) + 1 : 100;
            } else {
                const soloIds = roomsDatabase.solo.map(r => r.id);
                nextId = soloIds.length > 0 ? Math.max(...soloIds) + 1 : 200;
            }

            const newRoom = {
                id: nextId,
                name: title,
                number: num,
                type: type,
                price: price,
                floor: floor,
                image: roomImage,
                location: loc,
                facilities: checkedFacilities,
                rating: "4.8",
                status: status,
                size: size,
                description: desc || `Kamar tipe ${type} yang nyaman di lantai ${floor} Pondok Titis ${loc === 'bandung' ? 'Bandung' : 'Solo'}.`
            };

            if (loc === 'bandung') {
                roomsDatabase.bandung.push(newRoom);
            } else {
                roomsDatabase.solo.push(newRoom);
            }

            alert('Kamar baru berhasil ditambahkan!');
        }

        saveRoomsData(roomsDatabase);
        closeModalWindow();
        renderRooms();
    });

    // Modal listeners
    btnOpenAddModal.addEventListener('click', openAddModal);
    btnCloseModal.addEventListener('click', closeModalWindow);
    btnCancelForm.addEventListener('click', closeModalWindow);

    // Filter and search listeners
    searchRoom.addEventListener('input', renderRooms);
    filterLocation.addEventListener('change', renderRooms);
    filterStatus.addEventListener('change', renderRooms);

    // Update current date display
    const currentDate = document.getElementById('currentDate');
    if (currentDate) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDate.innerText = new Date().toLocaleDateString('id-ID', options);
    }

    // ==========================================
    // INITIAL LOAD
    // ==========================================
    renderRooms();
});

// Logout logic
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('pt_isAdmin');
        window.location.href = '/';
    });
});


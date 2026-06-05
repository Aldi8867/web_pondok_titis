# SISTEM MANAJEMEN INDEKOS "PONDOK TITIS"
> **BERBASIS WEB MENGGUNAKAN ARSITEKTUR CLOUD**

**Kelompok:** Kelompok 1  
**Mata Kuliah:** Komputasi Awan  
**Universitas:** Telkom University  

---

## 👥 KREDIT PENGEMBANG
- **Frontend & UI/UX:** Aldi
- **Backend API & Database:** Razan

---

## 📌 DESKRIPSI APLIKASI

**Web Kosan "Pondok Titis"** adalah aplikasi manajemen indekos berbasis web yang dirancang untuk memudahkan interaksi antara admin (pengelola) dan user (penghuni/calon penghuni). Sistem ini mengimplementasikan arsitektur komputasi awan (*Distributed System*) dengan 3 Virtual Machine: **Database**, **Backend API**, dan **Frontend Web** yang saling terintegrasi.

### ✨ Fitur Utama:
- Manajemen data kamar kos (Tersedia/Terisi)
- Pencatatan pengguna dan penyewa kamar
- Pengelolaan tagihan dan bukti pembayaran (Upload & Approve)
- Fitur *Watchlist* (Simpan kamar favorit)
- Dashboard web admin dan user yang responsif
- API REST untuk komunikasi data
- Otomatisasi *provisioning* menggunakan Vagrant & Ansible

---

## 🏗️ ARSITEKTUR SISTEM (3 VIRTUAL MACHINE)

### Diagram Alur:
```text
     [Browser User]
           |
           | HTTP GET/POST
           v
  +-------------------+
  | VM Frontend       |  Port: 80
  | Nginx + HTML      |  IP: 192.168.56.12
  | UI/UX Web Kosan   |
  +-------------------+
           |
           | Fetch API (AJAX)
           v
  +-------------------+
  | VM Backend        |  Port: 3000
  | Node.js + Express |  IP: 192.168.56.10
  | /api/*            |
  | Ansible Controller|
  +--------+-----------
           |
           | DB Query
           v
  +-------------------+
  | VM Database       |  Port: 3306
  | MySQL Server      |  IP: 192.168.56.11
  | Supabase (Cloud)  |
  +-------------------+
```

### Fungsi Tiap VM:

1. **VM Database (`192.168.56.11`)**
   - Bertindak sebagai Database Server.
   - Menyimpan seluruh data operasional aplikasi secara terpusat (`users`, `rooms`, `payments`).
   - Dikonfigurasi untuk menjalankan **MySQL Server** (Sistem juga *support* Supabase Cloud Database).

2. **VM Backend (`192.168.56.10`)**
   - Bertindak sebagai API Server (Node.js & Express.js) di port **3000**.
   - Menyediakan Endpoint `/api/*` untuk autentikasi, manajemen kamar, pembayaran, dan user.
   - Berperan sebagai **Ansible Controller** yang mendistribusikan konfigurasi ke VM lain.

3. **VM Frontend (`192.168.56.12`)**
   - Bertindak sebagai Web Server (Nginx).
   - Menyajikan antarmuka (*User Interface*) aplikasi.
   - Melayani file statis HTML, CSS, dan Vanilla JavaScript.
   - Akses melalui `http://192.168.56.12/` di browser host.

---

## 🛠️ TOOLS & TEKNOLOGI YANG DIGUNAKAN

**Infrastructure & Provisioning:**
- **VirtualBox:** Container virtual machine
- **Vagrant:** Infrastructure as Code (IaC) & provisioning VM
- **Ansible:** Configuration management & otomatisasi instalasi

**Backend API:**
- **Node.js:** Runtime environment
- **Express.js:** Web framework untuk REST API
- **Cors & Dotenv:** Middleware & environment management

**Database:**
- **MySQL:** Relational database (Default VM provisioning)
- **Supabase (PostgreSQL):** Cloud database alternative

**Frontend:**
- **Nginx:** Web server
- **HTML5 & CSS3:** Markup language & styling web (Responsive design)
- **JavaScript (Vanilla):** Client-side scripting & API fetch

**Operating System:**
- **Ubuntu 22.04 (Jammy):** VM OS untuk Database, Backend, Frontend
- **Windows / Linux / macOS:** Host machine OS

---

## 🚀 INSTALASI & MENJALANKAN SISTEM

### Prerequisite:
- VirtualBox
- Vagrant
- Terminal / PowerShell / Command Prompt

### Langkah Instalasi:

1. **Buka terminal di folder web_kosan**
   ```bash
   cd E:\web_kosan
   ```

2. **Jalankan Vagrant untuk spin-up 3 VM**
   ```bash
   vagrant up
   ```
   > *Proses ini akan memakan waktu beberapa menit tergantung koneksi internet (download OS & packages).*
   
   Setup otomatis yang dilakukan:
   - MySQL di VM Database (melalui Ansible)
   - Node.js & dependencies di VM Backend
   - Nginx di VM Frontend

3. **Menjalankan Backend Server (Node.js)**
   Setelah VM menyala, masuk ke VM Backend untuk menjalankan server API:
   ```bash
   vagrant ssh backend
   cd /vagrant/backend
   npm install      # (Hanya dilakukan untuk pertama kali)
   npm start
   ```
   *Output: `Server is running on port 3000`*

4. **Akses Aplikasi di Browser**
   Dari host machine, buka browser dan akses alamat:  
   👉 **http://192.168.56.12**

5. **Mematikan Sistem**
   Buka terminal baru di folder `web_kosan` dan jalankan:
   ```bash
   vagrant halt
   ```

---

## 📁 STRUKTUR FOLDER PROYEK

```text
web_kosan/
│
├── README.md                 # Dokumentasi proyek (File ini)
├── Vagrantfile               # Konfigurasi 3 VM & jaringan
├── ansible/                  # Konfigurasi Ansible
│   ├── inventory             # Daftar IP dan target hosts
│   ├── playbook.yml          # Script provisioning Nginx, MySQL, dll
│   └── insecure_private_key  # Kunci SSH komunikasi antar VM (Dikecualikan dari Repositori)
│
├── backend/                  # Source code API
│   ├── package.json          # Dependensi Node.js
│   ├── server.js             # File utama API (Routes & Logic)
│   ├── seed-rooms.js         # Script isi data kamar (Seeding)
│   └── delete_rooms.js       # Script hapus data kamar
│
└── frontend/                 # Source code Antarmuka Web (UI)
    ├── css/                  # Styling web
    ├── js/                   # Logika frontend & API fetch
    ├── images/               # Aset gambar aplikasi
    ├── index.html            # Halaman Landing Page
    ├── admin.html            # Dashboard Admin
    └── user.html             # Dashboard User/Penyewa
```
*(Catatan: File konfigurasi rahasia seperti `.env` sengaja tidak di-upload untuk alasan keamanan).*

---

## ⚙️ CARA KERJA SISTEM

1. **Interaksi Pengguna:** User membuka `http://192.168.56.12` dan berinteraksi dengan UI (Nginx Frontend).
2. **Permintaan Data (Fetch API):** Ketika user login atau melihat daftar kamar, Vanilla JavaScript pada frontend mengirimkan request HTTP (AJAX) ke `http://192.168.56.10:3000/api/*`.
3. **Pemrosesan Backend:** Node.js (Express.js) di VM Backend menerima request, memproses logika bisnis, dan melakukan query data ke Database (Supabase / VM Database).
4. **Respons & Update UI:** Backend mengirimkan balasan berformat JSON ke Frontend. Frontend merender data tersebut ke layar secara dinamis tanpa perlu reload halaman penuh.

---

## 🗄️ DATABASE SCHEMA (GAMBARAN UMUM)

**Tabel Utama:**
1. `users`: Data akun (`id`, `email`, `password`, `name`, `role`, `phone`, `origin`, dll)
2. `rooms`: Data kamar kos (`id`, `room_number`, `type`, `price`, `status`, `location`, dll)
3. `payments`: Data transaksi/pembayaran (`id`, `user_id`, `room_id`, `amount`, `status`, `proof_image`)
4. `watchlist`: Kamar favorit user (`id`, `user_id`, `room_id`)
5. `settings`: Konfigurasi aplikasi (info kosan, kontak, alamat)

- **Status Kamar:** `"Tersedia"` atau `"Terisi"`
- **Role User:** `"admin"` atau `"user"`

---

## 💡 KETERANGAN TAMBAHAN
- Untuk *troubleshooting* backend, cek console terminal tempat `npm start` dijalankan.
- Konfigurasi alamat database/Supabase biasanya diatur melalui file `backend/.env` (File ini tidak disertakan di repositori untuk keamanan).

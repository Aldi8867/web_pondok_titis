# Web Kosan Pondok Titis

## Deskripsi Singkat Aplikasi
Web Kosan "Pondok Titis" adalah aplikasi manajemen kos berbasis web yang dirancang untuk memudahkan interaksi antara admin (pengelola) dan user (penghuni/calon penghuni). Aplikasi ini menyediakan fitur komprehensif mulai dari manajemen data kamar, pencatatan pengguna dan penyewa, pengelolaan tagihan dan pembayaran, hingga pembuatan laporan keuangan. Penghuni dapat dengan mudah melihat ketersediaan kamar, melakukan pemesanan, mengunggah bukti pembayaran, serta memantau riwayat transaksi mereka secara langsung melalui antarmuka yang ramah pengguna.

## Arsitektur Sistem Berbasis 3 VM
Sistem ini mengimplementasikan arsitektur *Distributed System* berbasis 3 Virtual Machine (VM) yang dikelola dan diprovisioning secara otomatis menggunakan **Vagrant** dan **VirtualBox**.

### Pembagian Fungsi VM:
1. **VM Database (IP: `192.168.56.11`)**
   - **Fungsi:** Bertindak sebagai *Database Server*.
   - **Deskripsi:** Menyimpan seluruh data operasional aplikasi secara terpusat, seperti data pengguna, informasi kamar, riwayat pembayaran, dan konfigurasi aplikasi. VM ini dikonfigurasi untuk menjalankan **MySQL Server**.

2. **VM Backend (IP: `192.168.56.10`)**
   - **Fungsi:** Bertindak sebagai *Application Programming Interface (API) Server* dan *Ansible Controller*.
   - **Deskripsi:** Menangani seluruh logika bisnis (Business Logic), proses autentikasi, serta menjembatani komunikasi data antara Frontend dan Database. VM ini menjalankan environment **Node.js** dengan framework **Express.js** untuk menyediakan RESTful API. Selain itu, VM ini juga berperan sebagai master controller Ansible untuk mendistribusikan konfigurasi ke VM lain.

3. **VM Frontend (IP: `192.168.56.12`)**
   - **Fungsi:** Bertindak sebagai *Web Server* untuk UI/UX.
   - **Deskripsi:** Bertugas untuk menyajikan antarmuka pengguna (User Interface) aplikasi. VM ini dikonfigurasi menggunakan **Nginx** yang melayani file-file statis seperti HTML, CSS, dan JavaScript kepada klien/browser.

## Tools & Teknologi yang Digunakan
- **Infrastruktur & Provisioning:** Vagrant, Oracle VirtualBox, Ansible.
- **Frontend:** HTML5, CSS3, Vanilla JavaScript.
- **Backend API:** Node.js, Express.js, Cors, Dotenv.
- **Database / BaaS:** MySQL (Provisioning default), Supabase (PostgreSQL untuk Cloud Database).
- **Web Server:** Nginx.

## Dokumentasi Source Code dan Konfigurasi Sistem (Struktur Folder)
Proyek ini dikumpulkan melalui repositori GitHub dengan struktur direktori sebagai berikut:

```text
web_kosan/
├── ansible/                  # Konfigurasi Ansible untuk otomatisasi instalasi & provisioning
│   ├── inventory             # Daftar IP dan target hosts VM
│   ├── playbook.yml          # Script utama Ansible untuk setup MySQL, Nginx, PHP/Composer
│   └── insecure_private_key  # Kunci SSH untuk komunikasi antar VM
├── backend/                  # Source code API (Node.js)
│   ├── .env                  # File environment variable (Kredensial Supabase/Database)
│   ├── package.json          # Konfigurasi project Node.js dan daftar dependensi
│   ├── server.js             # File utama backend server (Routes, Middleware, Logic)
│   ├── seed-rooms.js         # Script utilitas untuk inisialisasi/seeding data kamar
│   └── delete_rooms.js       # Script utilitas untuk mengosongkan data kamar
├── frontend/                 # Source code Antarmuka Web (UI)
│   ├── css/                  # File styling (Cascading Style Sheets)
│   ├── js/                   # Script frontend (logika interaksi UI & Fetch API)
│   ├── images/               # Aset gambar aplikasi (logo, foto kamar, dsb)
│   ├── index.html            # Halaman Landing Page
│   ├── admin.html            # Halaman Dashboard khusus Admin (Manajemen)
│   └── user.html             # Halaman Dashboard khusus User (Penyewa)
├── Vagrantfile               # Konfigurasi topologi jaringan dan spesifikasi hardware ke-3 VM
└── README.md                 # Dokumentasi proyek (File ini)
```

## Cara Instalasi dan Menjalankan Aplikasi pada VM

Berikut adalah langkah-langkah untuk mendeploy aplikasi ini menggunakan Vagrant:

1. **Persiapan Sistem**
   - Pastikan Anda telah menginstal **Oracle VirtualBox** dan **Vagrant** di komputer Anda.
   - Buka Terminal / Command Prompt / PowerShell.

2. **Clone Repositori**
   Unduh source code proyek ini dari GitHub:
   ```bash
   git clone <URL_REPOSITORI_GITHUB_ANDA>
   cd web_kosan
   ```

3. **Jalankan Vagrant**
   Lakukan provisioning dan nyalakan ketiga mesin virtual sekaligus dengan perintah berikut (proses ini akan memakan waktu beberapa menit tergantung koneksi internet karena akan mengunduh Box OS Ubuntu dan menginstal berbagai paket):
   ```bash
   vagrant up
   ```

4. **Menjalankan Backend Server (Node.js)**
   Secara default, Vagrant akan mengonfigurasi web server Nginx di VM Frontend. Untuk mengaktifkan API backend, Anda perlu masuk ke VM Backend dan menjalankan servernya:
   ```bash
   # Masuk ke dalam VM Backend
   vagrant ssh backend
   
   # Berpindah ke folder sinkronisasi backend
   cd /vagrant/backend
   
   # Instalasi dependensi Node.js (hanya dilakukan pertama kali)
   npm install
   
   # Jalankan server
   npm start
   ```
   *Catatan: Server API akan berjalan pada port 3000 (dapat dilihat di console).*

5. **Akses Aplikasi melalui Browser**
   Setelah semua layanan berjalan, buka browser web Anda dan ketikkan alamat IP dari VM Frontend:
   - **Frontend URL:** `http://192.168.56.12/`
   
   Anda akan diarahkan ke halaman utama aplikasi Pondok Titis dan dapat mulai menggunakannya.

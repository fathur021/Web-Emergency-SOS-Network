# Emergency SOS Network

Platform respons darurat komunitas berbasis real-time yang memungkinkan warga mengirim sinyal SOS dengan lokasi GPS, dan relawan terdekat dapat merespons secara langsung.

## Fitur Utama

### Warga
- Tombol SOS satu kali dengan deteksi lokasi GPS otomatis
- Lampiran foto insiden (maks 5MB)
- Pelacakan status real-time (menunggu -> ditangani -> selesai)
- Pembatalan sinyal SOS

### Relawan
- Pemberitahuan masuk (popup modal) saat ada SOS baru
- Peta interaktif dengan marker SOS dan posisi relawan
- Navigasi rute mengemudi dari lokasi relawan ke lokasi insiden (OSRM)
- Toggle mode siaga (online/offline)
- Pengaturan radius respons (500m - 50km)
- Riwayat bantuan

### Admin
- Dasbor komando langsung dengan peta dan feed insiden real-time
- Manajemen pengguna (CRUD) dengan pencarian dan filter
- Riwayat laporan lengkap dengan badge status
- Statistik relawan (peringkat, ringkasan, grafik tren 7 hari)
- Penolakan sinyal SOS

## Stack Teknologi

### Backend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Express | ^5.2.1 | Framework HTTP |
| TypeScript | ^7.0.2 | Type safety |
| Mongoose | ^9.9.2 | MongoDB ODM |
| Socket.IO | ^4.8.3 | WebSocket real-time |
| JSON Web Token | ^9.0.3 | Autentikasi |
| bcryptjs | ^3.0.3 | Hashing password |
| Joi | ^18.2.3 | Validasi request |
| Multer | ^2.2.0 | Upload file |
| Helmet | ^8.3.0 | Header keamanan |

### Frontend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| React | ^19.2.8 | UI library |
| Vite | ^8.2.0 | Build tool |
| Tailwind CSS | ^4.3.3 | Styling |
| Redux Toolkit | ^2.12.0 | State management |
| RTK Query | (bundled) | Data fetching |
| React Router DOM | ^7.18.2 | Routing |
| Leaflet / React-Leaflet | ^1.9.4 / ^5.0.0 | Peta interaktif |
| Socket.IO Client | ^4.8.3 | WebSocket |
| Recharts | ^3.10.1 | Visualisasi data |
| SweetAlert2 | ^11.26.25 | Dialog alert |

### Database
- **MongoDB** via Mongoose (database: `emergency_sos`)

## Struktur Proyek

```
Emergency SOS Network/
├── backend/
│   ├── src/
│   │   ├── api/            # Route handlers
│   │   ├── config/         # Database connection
│   │   ├── controller/     # Controller layer
│   │   ├── services/       # Business logic
│   │   ├── model/          # Mongoose schemas
│   │   ├── interface/      # TypeScript interfaces
│   │   ├── middleware/     # Auth & error middleware
│   │   ├── validation/     # Joi validation schemas
│   │   ├── error/          # Custom error classes
│   │   ├── utils/          # JWT, upload, date utilities
│   │   └── types/          # Type declarations
│   ├── uploads/            # Uploaded files
│   ├── dist/               # Compiled output
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── config/         # API configuration
│   │   ├── redux/          # Store, slices, RTK Query APIs
│   │   ├── services/       # Socket.IO client
│   │   ├── utils/          # Alert dialogs
│   │   ├── layouts/        # Admin & Volunteer shell layouts
│   │   ├── pages/          # All page components
│   │   └── components/     # Reusable UI components
│   ├── .env                # Vite environment variables
│   └── package.json
│
└── README.md
```

## Role-Based Access Control

| Role | Keterangan | Kemampuan |
|------|------------|-----------|
| **user** (Warga) | Pengguna umum | Kirim SOS, lihat riwayat, edit profil, batalkan SOS |
| **volunteer** (Relawan) | Relawan lapangan | Semua hak user + lihat semua SOS, klaim/selesaikan SOS, toggle status, atur radius/lokasi |
| **admin** | Pengelola sistem | Semua hak relawan + dasbor langsung, kelola pengguna, tolak SOS, lihat statistik |

## Alur Status SOS

```
pending ──────────> in_progress ──────────> resolved (terkunci)
   │                    │
   │                    └──────────────> pending (batal klaim)
   └──────────────────> rejected (admin only, terkunci)
```

## Endpoint API

### Autentikasi
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrasi pengguna baru |
| POST | `/api/auth/login` | Login, mengembalikan JWT |

### Pengguna (Membutuhkan autentikasi)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/user/profile` | Ambil profil sendiri |
| PATCH | `/api/user/profile` | Update nama |
| PATCH | `/api/user/photo` | Upload foto profil |
| PATCH | `/api/user/password` | Ganti password |
| GET | `/api/user/volunteers` | Ambil semua relawan aktif |
| PATCH | `/api/user/location` | Update koordinat GPS + radius |
| GET | `/api/user/all` | Ambil semua pengguna (admin) |
| PATCH | `/api/user/status` | Toggle status aktif relawan |
| DELETE | `/api/user/:id` | Hapus pengguna (admin) |
| POST | `/api/user` | Buat pengguna baru (admin) |
| PATCH | `/api/user/:id` | Update data pengguna (admin) |

### SOS (Membutuhkan autentikasi)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/sos` | Buat sinyal SOS baru |
| GET | `/api/sos` | Ambil semua sinyal SOS |
| GET | `/api/sos/user` | Ambil riwayat SOS sendiri |
| GET | `/api/sos/statistics` | Statistik & grafik tren (admin) |
| GET | `/api/sos/:id` | Ambil detail SOS |
| PATCH | `/api/sos/:id/status` | Update status SOS |
| PATCH | `/api/sos/:id/data` | Update data SOS |
| DELETE | `/api/sos/:id` | Hapus/batalkan SOS |

## Socket.IO Events

| Event | Arah | Deskripsi |
|-------|------|-----------|
| `sos:new` | Server -> Client | Sinyal SOS baru dibuat |
| `sos:update` | Server -> Client | Status SOS berubah |
| `sos:delete` | Server -> Client | SOS dihapus/dibatalkan |

## Halaman & Rute

| Path | Komponen | Akses | Deskripsi |
|------|----------|-------|-----------|
| `/` | Home | Publik | Peta penuh dengan tombol SOS |
| `/login` | Login | Publik | Form login |
| `/register` | Register | Publik | Form registrasi |
| `/profil` | Profile | Semua user | Pengaturan profil |
| `/volunteer` | Volunteer | Relawan | Peta interaktif + navigasi rute |
| `/volunteer/riwayat` | Riwayat Bantuan | Relawan | Riwayat bantuan relawan |
| `/volunteer/pengaturan-radius` | Pengaturan Radius | Relawan | Pengaturan GPS & radius |
| `/admin` | Admin Dashboard | Admin | Dasbor komando langsung |
| `/admin/pengguna` | Kelola Pengguna | Admin | Manajemen pengguna |
| `/admin/riwayat-laporan` | Riwayat Laporan | Admin | Semua laporan SOS |
| `/admin/statistik-relawan` | Statistik Relawan | Admin | Grafik & peringkat relawan |

## Instalasi & Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (lokal atau Atlas)
- [npm](https://www.npmjs.com/)

### Backend

```bash
cd backend

# Install dependencies
npm install

# Buat file .env (lihat bawah)
cp .env.example .env

# Jalankan development server
npm run dev
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Buat file .env (lihat bawah)
cp .env.example .env

# Jalankan development server
npm run dev
```

### Environment Variables

#### Backend (`.env`)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/emergency_sos
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d
NODE_ENV=development
TZ=Asia/Jakarta
```

#### Frontend (`.env`)
```env
VITE_API_ORIGIN=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```

### Build untuk Produksi

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Skema Database

### users
| Field | Tipe | Keterangan |
|-------|------|------------|
| `nama` | String | Nama lengkap |
| `email` | String | Email unik |
| `password` | String | Password (bcrypt) |
| `role` | String | `user` / `volunteer` / `admin` |
| `latitude` | Number | Lokasi GPS (relawan) |
| `longitude` | Number | Lokasi GPS (relawan) |
| `locationName` | String | Nama lokasi |
| `radius` | Number | Radius respons (meter, default 5000) |
| `isVolunteerActive` | Boolean | Status aktif relawan |
| `photo` | String | Path foto profil |

### sos
| Field | Tipe | Keterangan |
|-------|------|------------|
| `userId` | ObjectId | Pengirim SOS |
| `latitude` | Number | Lokasi insiden |
| `longitude` | Number | Lokasi insiden |
| `description` | String | Deskripsi (opsional, max 500) |
| `image` | String | Path foto insiden |
| `status` | String | `pending` / `in_progress` / `resolved` / `rejected` |
| `volunteerId` | ObjectId | Relawan yang menangani |

## Lokasi Default

Aplikasi menggunakan koordinat **Padang, Sumatera Barat, Indonesia** (`-0.947, 100.354`) sebagai fallback lokasi default.

## Lisensi

Proyek ini dibuat untuk keperluan pengembangan.

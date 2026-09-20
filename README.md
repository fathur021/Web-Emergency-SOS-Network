# Emergency SOS Network

Emergency SOS Network adalah platform respons darurat komunitas berbasis web. Warga dapat mengirim sinyal SOS beserta lokasi GPS dan foto kejadian, sementara relawan serta admin menerima pembaruan real-time untuk memantau, mengklaim, dan menyelesaikan laporan.

## Fitur Utama

### Warga
- Kirim SOS dengan lokasi GPS otomatis.
- Tambahkan deskripsi dan foto insiden sampai 5 MB.
- Lihat riwayat laporan pribadi.
- Batalkan SOS selama status masih `pending`.
- Kelola profil, foto profil, dan kata sandi.

### Relawan
- Terima notifikasi SOS baru secara real-time melalui Socket.IO.
- Pantau semua laporan pada peta interaktif.
- Klaim laporan, batalkan klaim, dan tandai selesai.
- Lihat rute menuju lokasi kejadian menggunakan OSRM.
- Atur lokasi, radius respons, dan status siaga online/offline.
- Lihat riwayat bantuan.

### Admin
- Pantau seluruh laporan dari dashboard komando.
- Kelola pengguna: buat, ubah, hapus, dan aktif/nonaktifkan relawan.
- Lihat riwayat laporan dan statistik relawan.
- Lihat ranking relawan, ringkasan 30 hari, dan tren laporan 7 hari.

## Stack Teknologi

### Backend
| Teknologi | Kegunaan |
|-----------|----------|
| Express 5 | HTTP API |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database dan ODM |
| Socket.IO | Komunikasi real-time |
| JWT + HttpOnly cookie | Autentikasi |
| bcryptjs | Hash password |
| Joi | Validasi request |
| Multer + file-type | Upload dan validasi gambar |
| Helmet, CORS, express-rate-limit | Keamanan API |

### Frontend
| Teknologi | Kegunaan |
|-----------|----------|
| React 19 + Vite | UI dan dev server |
| Tailwind CSS 4 | Styling |
| Redux Toolkit + RTK Query | State dan data fetching |
| React Router DOM | Routing |
| Leaflet + React-Leaflet | Peta interaktif |
| Socket.IO Client | Listener real-time |
| Recharts | Grafik statistik |
| SweetAlert2 | Dialog dan alert |
| lucide-react | Ikon UI |

## Struktur Proyek

```text
Emergency SOS Network/
├── backend/
│   ├── src/
│   │   ├── api/            # Definisi route Express
│   │   ├── config/         # Koneksi database
│   │   ├── controller/     # HTTP controller
│   │   ├── error/          # Custom AppError
│   │   ├── interface/      # Interface TypeScript
│   │   ├── middleware/     # Auth, role, rate limit, error handler
│   │   ├── model/          # Schema Mongoose
│   │   ├── services/       # Business logic
│   │   ├── types/          # Deklarasi tipe Express
│   │   ├── utils/          # JWT, upload, signed URL, date helper
│   │   ├── validation/     # Schema Joi
│   │   ├── app.ts          # Express app
│   │   └── index.ts        # HTTP + Socket.IO server
│   ├── private_uploads/    # File gambar privat, disajikan via signed URL
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Komponen reusable
│   │   ├── config/         # Konfigurasi API
│   │   ├── layouts/        # Layout admin dan relawan
│   │   ├── pages/          # Halaman aplikasi
│   │   ├── redux/          # Store, slice, RTK Query API
│   │   ├── services/       # Socket.IO client
│   │   └── utils/          # Helper alert
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Role-Based Access Control

| Role | Keterangan | Kemampuan |
|------|------------|-----------|
| `user` | Warga/pengguna umum | Kirim SOS, lihat riwayat sendiri, batal SOS `pending`, kelola profil |
| `volunteer` | Relawan lapangan | Semua akses user, lihat semua SOS, klaim/selesaikan laporan, atur radius dan status aktif |
| `admin` | Pengelola sistem | Dashboard, kelola pengguna, lihat semua laporan, statistik relawan, hapus laporan |

## Alur Status SOS

```text
pending -> in_progress -> resolved
              |
              -> pending
```

Keterangan:
- `pending`: laporan baru dan belum diklaim.
- `in_progress`: laporan sedang ditangani relawan.
- `resolved`: laporan selesai dan terkunci.
- `rejected`: tersedia di skema dan tampilan riwayat, tetapi transisi aktif di service saat ini berfokus pada `pending`, `in_progress`, dan `resolved`.

## Autentikasi dan Real-Time

- Login dan register menyimpan token JWT ke HttpOnly cookie bernama `token`.
- API juga mendukung fallback `Authorization: Bearer <token>`.
- Logout menaikkan `tokenVersion`, sehingga token lama otomatis tidak valid.
- Socket.IO tidak membaca cookie langsung dari JavaScript. Frontend mengambil token handshake dari `GET /api/auth/token`, lalu menggunakannya saat koneksi socket.
- Event real-time yang dipakai:

| Event | Arah | Deskripsi |
|-------|------|-----------|
| `sos:new` | Server -> Client | SOS baru dibuat |
| `sos:update` | Server -> Client | Status SOS berubah |
| `sos:delete` | Server -> Client | SOS dihapus atau dibatalkan |

## Endpoint API

Base URL default: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/auth/register` | Publik | Registrasi user baru |
| POST | `/auth/login` | Publik | Login dan set HttpOnly cookie |
| POST | `/auth/logout` | Login | Logout dan invalidasi token lama |
| GET | `/auth/token` | Login | Ambil token sementara untuk Socket.IO |

### User
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/user/profile` | Login | Ambil profil sendiri |
| PATCH | `/user/profile` | Login | Update nama profil |
| PATCH | `/user/photo` | Login | Upload foto profil |
| PATCH | `/user/password` | Login | Ganti kata sandi |
| GET | `/user/volunteers` | Login | Ambil relawan aktif yang punya lokasi |
| PATCH | `/user/location` | Login | Update koordinat, nama lokasi, dan radius |
| PATCH | `/user/status` | Volunteer | Toggle status aktif relawan sendiri |
| GET | `/user/all` | Admin | Ambil semua pengguna |
| PATCH | `/user/:id/status` | Admin | Aktif/nonaktifkan relawan tertentu |
| POST | `/user` | Admin | Buat pengguna baru |
| PATCH | `/user/:id` | Admin | Update data pengguna |
| DELETE | `/user/:id` | Admin | Hapus pengguna non-admin |

### SOS
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/sos` | Login | Kirim SOS baru, mendukung `multipart/form-data` field `image` |
| GET | `/sos/user` | Login | Ambil riwayat SOS milik user login |
| GET | `/sos` | Admin, volunteer | Ambil semua SOS |
| GET | `/sos/statistics` | Admin | Ambil ranking, ringkasan, dan tren statistik |
| GET | `/sos/:id` | Owner, admin, volunteer | Ambil detail SOS |
| PATCH | `/sos/:id/status` | Admin, volunteer | Ubah status SOS |
| PATCH | `/sos/:id/data` | Admin | Koreksi lokasi, deskripsi, atau data SOS |
| DELETE | `/sos/:id` | Owner, admin | Batalkan SOS `pending` milik sendiri atau hapus sebagai admin |

## Halaman Frontend

| Path | Akses | Deskripsi |
|------|-------|-----------|
| `/` | Publik | Home dengan peta dan tombol SOS |
| `/login` | Publik | Login |
| `/register` | Publik | Registrasi |
| `/profil` | Login | Profil user umum |
| `/volunteer` | Volunteer | Dashboard peta relawan |
| `/volunteer/riwayat` | Volunteer | Riwayat bantuan |
| `/volunteer/pengaturan-radius` | Volunteer | Pengaturan lokasi dan radius |
| `/volunteer/profil` | Volunteer | Profil relawan |
| `/admin` | Admin | Dashboard admin |
| `/admin/pengguna` | Admin | Kelola pengguna |
| `/admin/riwayat-laporan` | Admin | Riwayat semua laporan |
| `/admin/statistik-relawan` | Admin | Statistik dan ranking relawan |
| `/admin/profil` | Admin | Profil admin |

## Menjalankan dengan Docker

Prasyarat:
- Docker Desktop
- File environment backend dan frontend sudah dibuat

1. Buat `backend/.env`:

```env
JWT_SECRET=isi_minimal_32_karakter_untuk_jwt
JWT_EXPIRES_IN=7d
SIGNED_URL_SECRET=isi_minimal_32_karakter_untuk_signed_url
NODE_ENV=development
```

`docker-compose.yml` sudah mengatur `MONGO_URI`, `CLIENT_URL`, dan `TZ` untuk container backend.

2. Buat `frontend/.env` dari contoh:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

3. Jalankan semua service:

```bash
docker compose up --build
```

Service default:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

Perintah Docker yang sering dipakai:

```bash
docker compose up -d
docker compose logs backend
docker compose down
docker compose down -v
```

Catatan: `docker compose down -v` menghapus volume MongoDB, sehingga data database ikut hilang.

## Menjalankan Secara Lokal

Prasyarat:
- Node.js 22 direkomendasikan, atau minimal Node.js 20.19+
- npm
- MongoDB lokal atau MongoDB Atlas

### Backend

```bash
cd backend
npm install
npm run dev
```

Buat `backend/.env` sebelum menjalankan server:

```env
MONGO_URI=mongodb://127.0.0.1:27017/emergency_sos
CLIENT_URL=http://localhost:5173
PORT=5000
JWT_SECRET=isi_minimal_32_karakter_untuk_jwt
JWT_EXPIRES_IN=7d
SIGNED_URL_SECRET=isi_minimal_32_karakter_untuk_signed_url
NODE_ENV=development
TZ=Asia/Jakarta
```

`CLIENT_URL` dapat berisi beberapa origin, dipisahkan koma, misalnya:

```env
CLIENT_URL=http://localhost:5173,https://contoh-domain.com
```

### Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Isi `frontend/.env`:

```env
VITE_API_ORIGIN=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```

## Build Produksi

Backend:

```bash
cd backend
npm run build
npm start
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

Untuk production, pastikan:
- `NODE_ENV=production`.
- `JWT_SECRET` dan `SIGNED_URL_SECRET` kuat dan stabil.
- `CLIENT_URL` berisi origin frontend production.
- Cookie `secure` membutuhkan HTTPS.

## Upload dan Penyajian Gambar

- File disimpan di `backend/private_uploads/`.
- URL yang disimpan di database berbentuk `/uploads/<filename>`.
- Backend hanya menyajikan gambar lewat signed URL: `/uploads/<filename>?e=<expires>&sig=<signature>`.
- Signed URL berlaku 24 jam.
- `SIGNED_URL_SECRET` wajib stabil. Jika berubah, link gambar lama tidak bisa diverifikasi.
- Upload SOS menerima JPG, PNG, WEBP, dan GIF sampai 5 MB, serta dicek dari isi file.
- Upload foto profil menerima JPG, PNG, dan WEBP sampai 2 MB.

## Skema Database

### `users`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `nama` | String | Nama lengkap |
| `email` | String | Email unik, lowercase |
| `password` | String | Hash password bcrypt |
| `role` | String | `user`, `volunteer`, atau `admin` |
| `latitude` | Number | Latitude lokasi user/relawan |
| `longitude` | Number | Longitude lokasi user/relawan |
| `locationName` | String | Nama lokasi |
| `tokenVersion` | Number | Versi token untuk invalidasi sesi |
| `radius` | Number | Radius respons dalam meter, default 5000 |
| `isVolunteerActive` | Boolean | Status siaga relawan |
| `photo` | String | Path foto profil |
| `createdAt` / `updatedAt` | Date | Timestamp otomatis |

### `sos`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `userId` | ObjectId | Pengirim SOS |
| `latitude` | Number | Latitude lokasi kejadian |
| `longitude` | Number | Longitude lokasi kejadian |
| `description` | String | Deskripsi kejadian |
| `image` | String/null | Path foto insiden |
| `status` | String | `pending`, `in_progress`, `resolved`, atau `rejected` |
| `volunteerId` | ObjectId/null | Relawan yang menangani |
| `createdAt` / `updatedAt` | Date | Timestamp otomatis, diformat WIB saat JSON response |

## Rate Limit

Rate limit aktif saat `NODE_ENV=production`:
- Auth: 20 request per 15 menit per IP.
- SOS: 5 request per 15 menit per IP.
- API umum: 100 request per 15 menit per IP.

Saat development, limiter dilewati agar pengujian tidak terganggu.

## Lisensi

Proyek ini dibuat untuk keperluan pengembangan.

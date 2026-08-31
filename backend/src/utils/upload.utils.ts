import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../error/app.error.js";

// ==================================================================
// UPLOAD UNTUK SOS (gambar laporan darurat)
// ==================================================================
// konfigurasi tempat dan nama file yang di simpan
const storage = multer.diskStorage({
  // simpan di folder uploads/ (di root backend)
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  // beri nama unik agar tidak tertimpa: sos-<timestamp>-<angka-acak>.<ekstensi>
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `sos-${unique}${ext}`);
  },
});

// Hanya izinkan file bertipe gambar
function fileFilter(_req: any, file: Express.Multer.File, cb: any) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "File harus berupa gambar"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ==================================================================
// UPLOAD KHUSUS FOTO PROFIL (lebih ketat: 2MB + ekstensi terbatas)
// ==================================================================
// folder & penamaan khusus agar mudah dibedakan dari file SOS
const profileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    // prefix "profile-..." membedakan dari "sos-..." milik laporan darurat
    cb(null, `profile-${unique}${ext}`);
  },
});

// Hanya izinkan ekstensi gambar yang umum untuk foto profil
const allowedProfileExt = [".jpg", ".jpeg", ".png", ".webp"];
function profileFileFilter(_req: any, file: Express.Multer.File, cb: any) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedProfileExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Format foto harus JPG, PNG, atau WEBP"), false);
  }
}

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: profileFileFilter,
  // Batas 2MB — sesuai keterangan "Maksimal 2MB" di halaman profile
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ==================================================================
// HELPER: hapus file upload lama (mencegah penumpukan di folder uploads/)
// ==================================================================
// - urlPath   : path relatif yang tersimpan di DB, contoh "/uploads/profile-123.jpg"
// - fileName  : nama file aktual di disk, contoh "profile-123.jpg"
// Dipanggil saat user mengganti foto, supaya file foto lama ikut terhapus.
export function deleteUploadedFile(urlPath?: string) {
  if (!urlPath) return;

  // Ambil nama file dari path "/uploads/<nama>"
  const fileName = path.basename(urlPath);
  // Gabungkan dengan folder uploads relatif ke direktori backend
  const filePath = path.join("uploads", fileName);

  // Hapus file kalau memang ada (abaikan error: file mungkin sudah tidak ada)
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // file tidak ditemukan / gagal dihapus -> biarkan saja
  }
}

export { upload, uploadProfile };

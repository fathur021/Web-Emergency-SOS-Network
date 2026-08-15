import multer from "multer";
import path from "path";
import { AppError } from "../error/app.error.js";

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

export { upload };

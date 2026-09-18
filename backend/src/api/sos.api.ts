import express from "express";
import {
  createSosController,
  getAllSosController,
  getSosByIdController,
  getSosByUserController,
  updateSosStatusController,
  updateSosDataController,
  deleteSosController,
  getStatisticsController,
} from "../controller/sos.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import { sosLimiter } from "../middleware/rateLimit.middleware.js";
import { upload } from "../utils/upload.utils.js";


const router = express.Router();

// Semua route SOS wajib login (token valid) dulu
router.use(authenticate);

// ---- POST /api/sos ----
// User mengirim sinyal SOS baru.
// `sosLimiter` (5x/15 mnt/IP) — anti-spam tombol SOS; ketat karena SOS = aksi darurat.
router.post("/", sosLimiter, upload.single("image"), createSosController);

// PENTING: route "/user" HARUS ditaruh SEBELUM "/:id".
// Kalau tidak, "user" akan dianggap sebagai id oleh Express.
router.get("/user", getSosByUserController);

// ---- GET /api/sos ----
// Lihat semua sinyal (monitor) — hanya admin & relawan
router.get("/", requireRole("admin", "volunteer"), getAllSosController);

// ---- GET /api/sos/statistics ----
// Statistik & ranking relawan terbaik — hanya admin.
// PENTING: ditaruh SEBELUM "/:id" agar "statistics" tidak ditangkap
// sebagai parameter id oleh Express.
router.get("/statistics", requireRole("admin"), getStatisticsController);

// ---- GET /api/sos/:id ----
// Detail satu sinyal
router.get("/:id", getSosByIdController);

// ---- PATCH /api/sos/:id/status ----
// Relawan mengubah status (klaim / selesai / tolak)
router.patch("/:id/status", requireRole("volunteer", "admin"), updateSosStatusController);

// ---- PATCH /api/sos/:id/data ----
// Mengoreksi data sinyal (lokasi / deskripsi / foto)
router.patch("/:id/data", requireRole("admin"), updateSosDataController);

// ---- DELETE /api/sos/:id ----
// Membatalkan/menghapus sinyal SOS.
// Bisa dipakai user pemilik (SOS pending) ATAU admin.
// Keamanan (owner-check + status pending) dipegang oleh deleteSosServices,
// bukan di route ini → user biasa bisa batal, admin bisa hapus apa saja.
router.delete("/:id", deleteSosController);



export default router;

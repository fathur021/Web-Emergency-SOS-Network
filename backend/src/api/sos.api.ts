import express from "express";
import {
  createSosController,
  getAllSosController,
  getSosByIdController,
  getSosByUserController,
  updateSosStatusController,
  updateSosDataController,
  deleteSosController,
} from "../controller/sos.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Semua route SOS wajib login (token valid) dulu
router.use(authenticate);

// ---- POST /api/sos ----
// User mengirim sinyal SOS baru
router.post("/", createSosController);

// PENTING: route "/user" HARUS ditaruh SEBELUM "/:id".
// Kalau tidak, "user" akan dianggap sebagai id oleh Express.
router.get("/user", getSosByUserController);

// ---- GET /api/sos ----
// Lihat semua sinyal (monitor) — hanya admin & relawan
router.get("/", requireRole("admin", "volunteer"), getAllSosController);

// ---- GET /api/sos/:id ----
// Detail satu sinyal
router.get("/:id", getSosByIdController);

// ---- PATCH /api/sos/:id/status ----
// Relawan mengubah status (klaim / selesai / tolak)
router.patch("/:id/status", requireRole("volunteer", "admin"), updateSosStatusController);

// ---- PATCH /api/sos/:id/data ----
// Mengoreksi data sinyal (lokasi / deskripsi / foto)
router.patch("/:id/data", updateSosDataController);

// ---- DELETE /api/sos/:id ----
// Menghapus sinyal — hanya admin
router.delete("/:id", requireRole("admin"), deleteSosController);

export default router;

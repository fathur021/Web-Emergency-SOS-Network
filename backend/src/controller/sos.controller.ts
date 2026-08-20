import type { Request, Response, NextFunction } from "express";
import {
  createSosSchema,
  updateSosStatusSchema,
  updateSosDataSchema,
  validateWith,
} from "../validation/sos.validation.js";
import {
  createSosServices,
  getAllSosServices,
  getSosByIdServices,
  getSosByUserServices,
  updateSosStatusServices,
  updateSosDataServices,
  deleteSosServices,
} from "../services/sos.services.js";
import { AppError } from "../error/app.error.js";
import type {
  ICreateSosInput,
  IUpdateSosStatusInput,
  IUpdateSosDataInput,
} from "../interface/sos.interface.js";

// ==================================================================
// POST /api/sos  --  Membuat sinyal SOS baru
// ==================================================================
// Contoh validasi MANUAL (tanpa validateWith) pakai try/catch,
// supaya terlihat apa yang sebenarnya dilakukan validateWith.
async function createSosController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // (1) Validasi manual: validate() TIDAK melempar error,
    //     hasilnya ada di { error, value }
    const { error, value } = createSosSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // (2) Kalau ada error, ubah jadi AppError 400 lalu lempar
    if (error) {
      throw new AppError(400, error.message);
    }

    // (3) value sudah bersih → pakai sebagai input
    const input = value as ICreateSosInput;

    if (req.file) {
      input.image = `/uploads/${req.file.filename}`;
    }
    // (4) userId diambil dari token JWT, bukan dari body
    const sos = await createSosServices(req.user!._id, input);

    await sos.populate("userId", "nama email");

    const io = req.app.get("io");
    io.emit("sos:new", sos);
    // (5) Respons sukses 201 (Created)
    res.status(201).json({
      status: "success",
      message: "Sinyal SOS berhasil dikirim",
      data: sos,
    });
  } catch (error) {
    // (6) Semua error diteruskan ke errorHandler
    next(error);
  }
}

// ==================================================================
// GET /api/sos  --  Mendapatkan SEMUA sinyal SOS (monitor)
// ==================================================================
async function getAllSosController(req: Request, res: Response) {
  const sosList = await getAllSosServices();

  res.status(200).json({
    status: "success",
    message: "Berhasil mendapatkan semua sinyal SOS",
    data: sosList,
  });
}

// ==================================================================
// GET /api/sos/:id  --  Mendapatkan detail satu sinyal SOS
// ==================================================================
async function getSosByIdController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const sos = await getSosByIdServices(id);

  res.status(200).json({
    status: "success",
    message: "Berhasil mendapatkan detail sinyal SOS",
    data: sos,
  });
}

// ==================================================================
// GET /api/sos/user  --  Riwayat sinyal SOS milik pengguna sendiri
// ==================================================================
async function getSosByUserController(req: Request, res: Response) {
  const userId = req.user!._id;
  const sosList = await getSosByUserServices(userId);

  res.status(200).json({
    status: "success",
    message: "Berhasil mendapatkan riwayat sinyal SOS",
    data: sosList,
  });
}

// ==================================================================
// PATCH /api/sos/:id/status  --  Mengubah status penanganan
// ==================================================================
async function updateSosStatusController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const input = await validateWith<IUpdateSosStatusInput>(
    updateSosStatusSchema,
    req.body,
  );
  const volunteerId = req.user!._id;
  const isAdmin = req.user!.role === "admin";
  const sos = await updateSosStatusServices(id, input, volunteerId, isAdmin);
  const io = req.app.get("io");
  io.emit("sos:update", sos);
  res.status(200).json({
    status: "success",
    message: "Status sinyal SOS berhasil diperbarui",
    data: sos,
  });
}

// ==================================================================
// PATCH /api/sos/:id/data  --  Mengoreksi data (lokasi/deskripsi/foto)
// ==================================================================
async function updateSosDataController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const input = await validateWith<IUpdateSosDataInput>(
    updateSosDataSchema,
    req.body,
  );
  const sos = await updateSosDataServices(id, input);

  res.status(200).json({
    status: "success",
    message: "Data sinyal SOS berhasil diperbarui",
    data: sos,
  });
}

// ==================================================================
// DELETE /api/sos/:id  --  Menghapus sinyal SOS
// ==================================================================
async function deleteSosController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const result = await deleteSosServices(id);
  const io = req.app.get("io");
  io.emit("sos:delete", { id });

  res.status(200).json({
    status: "success",
    message: result.message,
  });
}

// ===== EXPORT SEMUA CONTROLLER =====
export {
  createSosController,
  getAllSosController,
  getSosByIdController,
  getSosByUserController,
  updateSosStatusController,
  updateSosDataController,
  deleteSosController,
};

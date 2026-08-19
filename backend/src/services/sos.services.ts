import { Sos } from "../model/sos.model.js";
import { AppError } from "../error/app.error.js";
import { Types } from "mongoose";
import type {
  ICreateSosInput,
  IUpdateSosDataInput,
  IUpdateSosStatusInput,
} from "../interface/sos.interface.js";
import { unlink } from "fs/promises";
import path from "path";

async function createSosServices(
  userId: string | Types.ObjectId,
  input: ICreateSosInput,
) {
  const sos = await Sos.create({
    userId,
    latitude: input.latitude,
    longitude: input.longitude,
    description: input.description || "",
    image: input.image || null,
  });
  return sos;
}

async function getAllSosServices() {
  const sos = await Sos.find()
    .populate("userId", "nama email")
    .populate("volunteerId", "nama")
    .sort({ createdAt: -1 });
  return sos;
}

async function getSosByIdServices(id: string) {
  const sos = await Sos.findById(id)
    .populate("userId", "nama email")
    .populate("volunteerId", "nama");

  if (!sos) {
    throw new AppError(404, "Sinyal SOS tidak ditemukan");
  }

  return sos;
}

async function getSosByUserServices(userId: string | Types.ObjectId) {
  const sosList = await Sos.find({ userId })
    .populate("volunteerId", "nama")
    .sort({ createdAt: -1 });

  if (!sosList || sosList.length == 0) {
    throw new AppError(404, "Belum ada riwayat SOS");
  }
  return sosList;
}

async function updateSosStatusServices(
  id: string | Types.ObjectId,
  input: IUpdateSosStatusInput,
  volunteerId: string | Types.ObjectId | null,
  isAdmin = false,
) {
  const existing = await Sos.findById(id);
  if (!existing) {
    throw new AppError(404, "Sinyal SOS tidak ditemukan");
  }

  // ---- 1. Aturan transisi status ----
  const allowedTransitions: Record<string, string[]> = {
    pending: ["in_progress"],             // pending hanya bisa diklaim
    in_progress: ["resolved", "pending"], // lanjut selesai / batalkan
    resolved: [],                          // sudah selesai = terkunci
    rejected: [],                          // ditolak admin = terkunci
  };
  if (!allowedTransitions[existing.status]?.includes(input.status)) {
    throw new AppError(
      400,
      `Tidak bisa mengubah status dari "${existing.status}" ke "${input.status}"`,
    );
  }

  // ---- 2. Status "rejected" khusus admin (batalkan laporan palsu) ----
  if (input.status === "rejected" && !isAdmin) {
    throw new AppError(403, "Hanya admin yang bisa menolak/membatalkan SOS");
  }

  // ---- 3. Dari "in_progress": hanya pemilik yang boleh lanjut ----
  if (existing.status === "in_progress" && !isAdmin) {
    const ownerId = existing.volunteerId ? String(existing.volunteerId) : "";
    if (!ownerId || ownerId !== String(volunteerId)) {
      throw new AppError(
        403,
        "Hanya relawan yang menerima SOS ini yang bisa mengubah statusnya",
      );
    }
  }

  // ---- 4. Anti rebutan saat klaim ----
  if (
    input.status === "in_progress" &&
    existing.volunteerId &&
    String(existing.volunteerId) !== String(volunteerId)
  ) {
    throw new AppError(409, "Sinyal SOS sudah diambil relawan lain");
  }

  // ---- 5. Set / lepas volunteerId sesuai status ----
  const updateData: {
    status: IUpdateSosStatusInput["status"];
    volunteerId?: Types.ObjectId | null;
  } = { status: input.status };

  if (input.status === "in_progress" || input.status === "resolved") {
    if (!volunteerId) {
      throw new AppError(400, "volunteerId wajib diisi saat mengklaim sinyal");
    }
    updateData.volunteerId = volunteerId as Types.ObjectId;
  } else {
    updateData.volunteerId = null; // pending/rejected = lepas tanggung jawab
  }

  const sos = await Sos.findByIdAndUpdate(id, updateData, { new: true });
  return sos;
}

async function updateSosDataServices(id: string, input: IUpdateSosDataInput) {
  const existing = await Sos.findById(id);
  if (!existing) {
    throw new AppError(404, "Sinyal SOS tidak ditemukan");
  }

  const sos = await Sos.findByIdAndUpdate(id, input, { new: true });
  return sos;
}

async function deleteSosServices(id: string) {
  const existing = await Sos.findById(id);
  if (!existing) {
    throw new AppError(404, "Sinyal SOS tidak ditemukan");
  }
  if (existing.image) {
    const filename = existing.image.replace("/uploads/", "");
    await unlink(path.join("uploads", filename)).catch(()=>{

    })
  }

  await Sos.findByIdAndDelete(id);
  return { message: "Sinyal Sos Berhasil di hapus" };
}
export {
  createSosServices,
  getAllSosServices,
  getSosByIdServices,
  getSosByUserServices,
  updateSosStatusServices,
  updateSosDataServices,
  deleteSosServices,
};

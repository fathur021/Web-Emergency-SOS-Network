import { Sos } from "../model/sos.model.js";
import { User } from "../model/user.model.js";
import { AppError } from "../error/app.error.js";
import { Types } from "mongoose";
import type {
  ICreateSosInput,
  IUpdateSosDataInput,
  IUpdateSosStatusInput,
} from "../interface/sos.interface.js";
import { unlink } from "fs/promises";
import path from "path";
import { request } from "http";

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
    pending: ["in_progress"], // pending hanya bisa diklaim
    in_progress: ["resolved", "pending"], // lanjut selesai / batalkan
    resolved: [], // sudah selesai = terkunci
    rejected: [], // ditolak admin = terkunci
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

async function deleteSosServices(
  id: string,
  requester?: { userId: string | Types.ObjectId; isAdmin: boolean },
) {
  const existing = await Sos.findById(id);
  if (!existing) {
    throw new AppError(404, "Sinyal SOS tidak ditemukan");
  }

  if (requester && !requester.isAdmin) {
    const isOwner = String(existing.userId) === String(requester.userId);
    if (!isOwner) {
      throw new AppError(
        403,
        "Kamu hanya bisa membatalkan sinyal SOS milikmu sendiri",
      );
    }
    if (existing.status !== "pending") {
      throw new AppError(
        403,
        "Sinyal sudah ditangani relawan dan tidak bisa dibatalkan lagi",
      );
    }
  }

  if (existing.image) {
    const filename = existing.image.replace("/uploads/", "");
    await unlink(path.join("uploads", filename)).catch(() => {});
  }

  await Sos.findByIdAndDelete(id);
  return { message: "Sinyal Sos Berhasil di hapus" };
}

async function getBestVolunteerServices(days = 30) {
  //batas waktu: 30 hari terakhir (WIB via timestamp UTC, cukup pakai data)
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  //1. Group SOS resolved per volunteer dalam rentang waktu
  const stats = await Sos.aggregate([
    { $match: { status: "resolved", createdAt: { $gte: since } } },
    { $group: { _id: "$volunteerId", totalResolved: { $sum: 1 } } },
    { $sort: { totalResolved: -1 } },
    //2. Ambil nama relawan dari koleksi User
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "volunteer",
      },
    },
    { $unwind: { path: "$volunteer", preserveNullAndEmptyArrays: false } },
    {
      $project: {
        _id: 0,
        volunteerId: "$_id",
        nama: "$volunteer.nama",
        totalResolved: 1,
      },
    },
  ]);
  return stats;
}

// ==================================================================
// SERVICE: getStatisticsSummaryServices
// ==================================================================
// Menghitung angka ringkasan untuk halaman statistik admin (30 hari terakhir):
//   - totalLaporan  : semua SOS yang masuk
//   - totalResolved : SOS yang berhasil diselesaikan
//   - totalVolunteer: jumlah akun berrole volunteer
async function getStatisticsSummaryServices(days = 30) {
  // Rentang waktu: 30 hari terakhir dihitung dari sekarang.
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Group semua SOS dalam rentang waktu → hitung total & jumlah resolved.
  const [summary] = await Sos.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: null,
        totalLaporan: { $sum: 1 },
        totalResolved: {
          $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
        },
      },
    },
  ]);

  // Jumlah akun relawan (role "volunteer").
  const totalVolunteer = await User.countDocuments({ role: "volunteer" });

  return {
    totalLaporan: summary?.totalLaporan || 0,
    totalResolved: summary?.totalResolved || 0,
    totalVolunteer,
  };
}

export {
  createSosServices,
  getAllSosServices,
  getSosByIdServices,
  getSosByUserServices,
  updateSosStatusServices,
  updateSosDataServices,
  deleteSosServices,
  getBestVolunteerServices,
  getStatisticsSummaryServices,
};

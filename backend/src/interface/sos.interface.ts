import { Types } from "mongoose";

// ================================================================
// FILE: backend/src/interface/sos.interface.ts
// ================================================================
// Kontrak data untuk fitur SOS.
// - ISos                : bentuk dokumen SOS di database
// - I*Input             : bentuk body yang diterima dari client
// ================================================================

// ---- Bentuk dokumen SOS di database ----
// `_id`, `createdAt`, `updatedAt` otomatis dibuat MongoDB & mongoose.
export interface ISos {
  // id user yang mengirim sinyal SOS (diisi dari token, bukan client)
  userId: Types.ObjectId;

  // koordinat lokasi kejadian
  latitude: number;
  longitude: number;

  // deskripsi / kronologi kejadian
  description?: string;

  // path / URL foto kejadian (opsional)
  image?: string | null;

  // status penanganan
  status: "pending" | "in_progress" | "resolved" | "rejected";

  // id relawan penanggung jawab (opsional, diisi saat diklaim)
  volunteerId?: Types.ObjectId;
}

// ---- Body saat membuat SOS baru (POST /api/sos) ----
// userId TIDAK termasuk karena diambil dari token JWT.
export interface ICreateSosInput {
  latitude: number;
  longitude: number;
  description?: string;
  image?: string;
}

// ---- Body saat mengubah status (PATCH /api/sos/:id) ----
export interface IUpdateSosStatusInput {
  status: "pending" | "in_progress" | "resolved" | "rejected";
}

// ---- Body saat mengoreksi data SOS (PATCH /api/sos/:id/data) ----
// Semua field opsional karena hanya field yang dikirim yang diubah.
export interface IUpdateSosDataInput {
  latitude?: number;
  longitude?: number;
  description?: string;
  image?: string;
}

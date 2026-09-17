import mongoose from "mongoose";
import type {ISos} from "../interface/sos.interface.js";
import { formatWIB } from "../utils/date.utils.js";
import { signImageUrl } from "../utils/signedUrl.utils.js";

const sosSchema = new mongoose.Schema<ISos>({
    // pengirim sinyal
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    //lokasi Kejadian
    latitude: {
        type: Number,
        required:true,
    },
    longitude: {
      type: Number,
      required: true,
    },

    // ---- Deskripsi kejadian ----
    description: {
      type: String,
      default:"",
      trim: true,
    },
    // ---- Foto kejadian (opsional) ----
    image: {
      type: String,          // simpan path/URL, misal "/uploads/sos-123.jpg"
      default: null,
    },

    // ---- Status penanganan ----
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "rejected"],
      default: "pending",    // baru dibuat = pending
    },

    // ---- Relawan yang menangani (opsional) ----
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",           // referensi ke model User
      default: null,         // kosong saat belum ada relawan
    },
},
    {timestamps:true}
)

// Otomatis ubah createdAt/updatedAt ke WIB setiap dokumen dijadikan JSON.
// Berlaku untuk SEMUA controller yang mengirim data SOS.
// Otomatis ubah waktu ke WIB + stempel path gambar.
// Dijalankan setiap dokumen SOS diubah menjadi JSON (kiriman ke frontend).
// Semua controller otomatis kena — tidak perlu edit satu-satu.
sosSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    ret.createdAt = formatWIB(ret.createdAt);
    ret.updatedAt = formatWIB(ret.updatedAt);
    // Stempel gambar: di DB tetap "/uploads/..", saat dikirim barulah
    // ditambahi "?e=..&sig=.." supaya bisa melewati route bertanda tangan.
    if (ret.image) {
      ret.image = signImageUrl(ret.image);
    }
    return ret;
  },
});

const Sos = mongoose.model<ISos>("Sos", sosSchema);

export { Sos };
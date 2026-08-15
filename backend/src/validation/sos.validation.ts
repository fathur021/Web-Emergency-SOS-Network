import Joi from "joi";
import { AppError } from "../error/app.error.js";
// ================================================================
// Validasi Joi untuk data sinyal SOS.
// Pola diikuti dari auth.validation.ts (pakai messages berbahasa Indonesia).
// ================================================================

// Helper: menjalankan schema Joi + mengubah error Joi menjadi AppError 400.
// Dipindah dari auth.validation.ts agar sos.controller.ts tidak perlu
// bergantung ke file validation milik modul auth.
async function validateWith<T>(schema: Joi.ObjectSchema<T>, data: unknown): Promise<T> {
  try {
    // abortEarly: false => kumpulkan SEMUA error sekaligus, bukan berhenti di error pertama
    // stripUnknown: true  => BUANG field yang tidak ada di schema
    const value = await schema.validateAsync(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    return value as T;
  } catch (error) {
    const validationError = error as Joi.ValidationError;
    throw new AppError(400, validationError.message);
  }
}

// ---- Schema: Membuat sinyal SOS baru ----
// Dipakai di POST /api/sos (dikirim dari tombol SOS di halaman utama)
// CATATAN: userId TIDAK perlu dikirim dari client karena sudah diambil
// dari token JWT (req.user._id) oleh middleware `authenticate`.
export const createSosSchema = Joi.object({
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
      "number.base": "Latitude harus berupa angka",
      "number.min": "Latitude minimal -90",
      "number.max": "Latitude maksimal 90",
      "any.required": "Latitude harus diisi",
    }),

  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
      "number.base": "Longitude harus berupa angka",
      "number.min": "Longitude minimal -180",
      "number.max": "Longitude maksimal 180",
      "any.required": "Longitude harus diisi",
    }),

  description: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .messages({
      "string.empty": "Deskripsi harus diisi",
      "string.min": "Deskripsi minimal 5 karakter",
      "string.max": "Deskripsi maksimal 500 karakter",
      "any.required": "Deskripsi harus diisi",
    }),

  // Opsional: path/URL foto kejadian
  image: Joi.string()
    .allow("", null)
    .messages({
      "string.base": "Gambar harus berupa teks",
    }),
});

// ---- Schema: Update status penanganan ----
// Dipakai di PATCH /api/sos/:id
// CATATAN: volunteerId TIDAK perlu dikirim karena diambil dari token
// (req.user._id) saat relawan meng-klaim SOS.
export const updateSosStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "in_progress", "resolved", "rejected")
    .required()
    .messages({
      "any.only": "Status harus salah satu: pending, in_progress, resolved, atau rejected",
      "any.required": "Status harus diisi",
    }),
});

// ---- Schema: Update lokasi / deskripsi ----
// Dipakai di PATCH /api/sos/:id/location jika ingin mengoreksi data
export const updateSosDataSchema = Joi.object({
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .messages({
      "number.base": "Latitude harus berupa angka",
    }),

  longitude: Joi.number()
    .min(-180)
    .max(180)
    .messages({
      "number.base": "Longitude harus berupa angka",
    }),

  description: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .messages({
      "string.min": "Deskripsi minimal 5 karakter",
      "string.max": "Deskripsi maksimal 500 karakter",
    }),

  image: Joi.string()
    .allow("", null)
    .messages({
      "string.base": "Gambar harus berupa teks",
    }),
}).min(1); // wajib ada minimal 1 field yang diubah

export { validateWith };

import Joi from "joi";
import { AppError } from "../error/app.error.js";
export const registerSchema = Joi.object({
  nama: Joi.string().trim().min(3).required().messages({
    "string.empty": "Nama harus diisi",
    "string.min": "Nama minimal 3 karakter",
    "any.required": "Nama harus diisi",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email harus diisi",
    "string.email": "Format email tidak valid",
    "any.required": "Email harus diisi",
  }),

  password: Joi.string().min(8).max(64).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).required().messages({
    "string.empty": "Password harus diisi",
    "string.min": "Password minimal 8 karakter",
    "string.max": "Password maksimal 64 karakter",
    "string.pattern.base": "Password harus mengandung huruf kecil, huruf besar, dan angka",
    "any.required": "Password harus diisi",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email harus diisi",
    "string.email": "Format email tidak valid",
    "any.required": "Email harus diisi",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password harus diisi",
    "any.required": "Password harus diisi",
  }),
});

// Helper: menjalankan schema Joi + mengubah error Joi menjadi AppError 400.
async function validateWith<T>(
  schema: Joi.ObjectSchema<T>,
  data: unknown,
): Promise<T> {
  try {
    // abortEarly: false => kumpulkan SEMUA error sekaligus, bukan berhenti di error pertama
    // stripUnknown: true  => BUANG field yang tidak ada di schema (misal "role" saat register)
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

export const createUserSchema = Joi.object({
  nama: Joi.string().trim().min(3).required().messages({
    "string.empty": "Nama harus diisi",
    "string.min": "Nama minimal 3 karakter",
    "any.required": "Nama harus diisi",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email harus diisi",
    "string.email": "Format email tidak valid",
    "any.required": "Email harus diisi",
  }),

  password: Joi.string().min(8).max(64).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).required().messages({
    "string.empty": "Password harus diisi",
    "string.min": "Password minimal 8 karakter",
    "string.max": "Password maksimal 64 karakter",
    "string.pattern.base": "Password harus mengandung huruf kecil, huruf besar, dan angka",
    "any.required": "Password harus diisi",
  }),

  role: Joi.string().valid("user", "volunteer", "admin").required().messages({
    "any.only": "Role harus user, volunteer, atau admin",
    "any.required": "Role harus dipilih",
  }),
});

// Semua field OPSIONAL, tapi minimal satu harus diisi (.min(1)).
// password boleh string kosong -> service akan mengabaikannya.
export const updateUserSchema = Joi.object({
  nama: Joi.string().trim().min(3).messages({
    "string.min": "Nama minimal 3 karakter",
  }),

  email: Joi.string().email().messages({
    "string.email": "Format email tidak valid",
  }),

  role: Joi.string().valid("user", "volunteer", "admin").messages({
    "any.only": "Role harus user, volunteer, atau admin",
  }),

  password: Joi.string().min(8).max(64).allow("").pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).messages({
    "string.min": "Password minimal 8 karakter",
    "string.max": "Password maksimal 64 karakter",
    "string.pattern.base": "Password harus mengandung huruf kecil, huruf besar, dan angka",
  }),
})
  .min(1)
  .messages({
    "object.min": "Tidak ada data yang diubah",
  });

export const updateProfileSchema = Joi.object({
  nama: Joi.string().trim().min(3).required().messages({
    "string.empty": "Nama harus di isi",
    "string.min": "Nama minimal 3 karakter",
    "any.required": "Nama wajib di isi",
  }),
});

export const updateLocationSchema = Joi.object({
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
      "number.base": "Latitude harus berupa angka",
      "number.min": "Latitude minimal -90",
      "number.max": "Latitude maksimal 90",
      "any.required": "Latitude wajib diisi",
    }),
   longitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
      "number.base": "Longitude harus berupa angka",
      "number.min": "Longitude minimal -180",
      "number.max": "Longitude maksimal 180",
      "any.required": "Longitude wajib diisi",
    }),

     locationName: Joi.string().allow("").default("").messages({
    "string.base": "Nama lokasi harus berupa teks",
  }),

   radius: Joi.number()
    .min(100)
    .max(10000)
    .default(5000)
    .messages({
      "number.base": "Radius harus berupa angka (meter)",
      "number.min": "Radius minimal 100 meter",
      "number.max": "Radius maksimal 10000 meter",
    }),
})

// Schema untuk ganti password
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Kata sandi lama harus diisi",
    "any.required": "Kata sandi lama harus diisi",
  }),

  newPassword: Joi.string().min(8).max(64).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).required().messages({
    "string.empty": "Kata sandi baru harus diisi",
    "string.min": "Kata sandi baru minimal 8 karakter",
    "string.max": "Kata sandi baru maksimal 64 karakter",
    "string.pattern.base": "Kata sandi baru harus mengandung huruf kecil, huruf besar, dan angka",
    "any.required": "Kata sandi baru harus diisi",
  }),
});

export { validateWith };

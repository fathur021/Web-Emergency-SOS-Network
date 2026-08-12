import Joi from "joi";
import { AppError } from "../error/app.error.js";
export const registerSchema = Joi.object({
  nama: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      "string.empty": "Nama harus diisi",
      "string.min": "Nama minimal 3 karakter",
      "any.required": "Nama harus diisi",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email harus diisi",
      "string.email": "Format email tidak valid",
      "any.required": "Email harus diisi",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Password harus diisi",
      "string.min": "Password minimal 6 karakter",
      "any.required": "Password harus diisi",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email harus diisi",
      "string.email": "Format email tidak valid",
      "any.required": "Email harus diisi",
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password harus diisi",
      "any.required": "Password harus diisi",
    }),
});


// Helper: menjalankan schema Joi + mengubah error Joi menjadi AppError 400.
async function validateWith<T>(schema: Joi.ObjectSchema<T>, data: unknown): Promise<T> {
  try {
    // abortEarly: false => kumpulkan SEMUA error sekaligus, bukan berhenti di error pertama
    // stripUnknown: true  => BUANG field yang tidak ada di schema (misal "role" saat register)
    const  value  = await schema.validateAsync(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    return value as T;
  } catch (error) {
    const validationError = error as Joi.ValidationError;
    throw new AppError(400, validationError.message);
  }
}

export { validateWith };
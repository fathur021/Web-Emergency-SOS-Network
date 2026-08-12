import type { Request, Response } from "express";
import { registerSchema, loginSchema, validateWith } from "../validation/auth.validation.js";
import { registerService, loginService } from "../services/auth.services.js";
import type { IRegisterInput, ILoginInput } from "../interface/auth.interface.js";

// PENTING: Express 5 otomatis meneruskan error yang di-throw dari fungsi async
// ke errorHandler. Jadi di sini tidak perlu try/catch sama sekali.

// ---- POST /api/auth/register ----
// Validasi otomatis pakai schema Joi, lalu panggil service.
async function registerController(req: Request, res: Response) {
  // Kalau gagal validasi, validateWith melempar AppError 400.
  // Kalau sukses, `input` sudah bersih (field ekstra sudah dibuang).
  const input = await validateWith<IRegisterInput>(registerSchema, req.body);

  const result = await registerService(input);

  // Respons sukses 201 (Created)
  res.status(201).json({
    status: "success",
    message: "Registrasi berhasil",
    data: result,
  });
}

// ---- POST /api/auth/login ----
async function loginController(req: Request, res: Response) {
  const input = await validateWith<ILoginInput>(loginSchema, req.body);

  const result = await loginService(input);

  res.status(200).json({
    status: "success",
    message: "Login berhasil",
    data: result,
  });
}

// ===== EXPORT SEMUA DI BAWAH =====
export { registerController, loginController };
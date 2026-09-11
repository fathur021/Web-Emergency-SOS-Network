import type { Request, Response } from "express";
import { registerSchema, loginSchema, validateWith } from "../validation/auth.validation.js";
import { registerService, loginService } from "../services/auth.services.js";
import { User } from "../model/user.model.js";
import type { IRegisterInput, ILoginInput } from "../interface/auth.interface.js";


function setTokenCookie(res: Response, token: string) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // Hanya kirim cookie via HTTPS di production
    sameSite: "lax", // Cegah CSRF, tapi masih bisa dipakai di subdomain
    path: "/", // Cookie berlaku untuk semua path
    maxAge: 60 * 60 * 1000, // 1 jam (dalam milidetik)
  })
}

function clearTokenCookie(res: Response) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Hapus cookie dengan mengatur maxAge ke 0
  })
}

// ---- POST /api/auth/register ----
// Validasi otomatis pakai schema Joi, lalu panggil service.
// ---- POST /api/auth/register ----
async function registerController(req: Request, res: Response) {
  const input = await validateWith<IRegisterInput>(registerSchema, req.body);

  const result = await registerService(input);

  // Set token ke cookie (bukan di response body)
  setTokenCookie(res, result.token);

  res.status(201).json({
    status: "success",
    message: "Registrasi berhasil",
    data: { user: result.user },   // ← hanya user, tanpa token
  });
}




// ---- POST /api/auth/login ----
async function loginController(req: Request, res: Response) {
  const input = await validateWith<ILoginInput>(loginSchema, req.body);

  const result = await loginService(input);
   setTokenCookie(res, result.token);
  res.status(200).json({
    status: "success",
    message: "Login berhasil",
    data: { user: result.user },
  });
}

// ---- POST /api/auth/logout ----
// Naikkan tokenVersion agar semua token lama jadi tidak valid.
async function logoutController(req: Request, res: Response) {
  await User.findByIdAndUpdate(req.user!._id, { $inc: { tokenVersion: 1 } });
  clearTokenCookie(res);

  res.status(200).json({ status: "success", message: "Logout berhasil" });
}

// ===== EXPORT SEMUA DI BAWAH =====
export { registerController, loginController, logoutController };
import bcrypt from "bcryptjs";
import type { IRegisterInput, ILoginInput, IAuthResponse } from "../interface/auth.interface.js";
import { User } from "../model/user.model.js";
import { AppError } from "../error/app.error.js";
import { signToken } from "../utils/jwt.utils.js";

// ===== REGISTER =====
// Logika bisnis: cek email duplikat, hash password, simpan user, buat token.
async function registerService(input: IRegisterInput): Promise<IAuthResponse> {
  // 1. Cek apakah email sudah dipakai.
  //    (Schema sudah punya `unique: true`, tapi cek manual biar pesan errornya jelas.)
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new AppError(409, "Email sudah terdaftar"); // 409 = Conflict
  }

  // 2. Hash password. Salt rounds 10 = cukup aman & cepat.
  const hashedPassword = await bcrypt.hash(input.password, 10);

  // 3. Simpan user baru. Role otomatis "user" (default dari schema model).
  const user = await User.create({
    nama: input.nama,
    email: input.email,
    password: hashedPassword,
  });

  // 4. Buat token (biar user langsung "login" setelah register).
  const token = signToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // 5. Kembalikan token + data user. PASSWORD TIDAK DIKIRIM!
  return {
    token,
    user: {
      id: user._id.toString(),
      nama: user.nama,
      email: user.email,
      role: user.role,
    },
  };
}

// ===== LOGIN =====
// Logika bisnis: cari user, cocokkan password, buat token.
async function loginService(input: ILoginInput): Promise<IAuthResponse> {
  // 1. Cari user berdasarkan email
  const user = await User.findOne({ email: input.email });
  if (!user) {
    throw new AppError(401, "Email atau password salah"); // 401 = Unauthorized
  }

  // 2. Bandingkan password input dengan hash di database (dilakukan bcrypt, bukan manual)
  const passwordMatch = await bcrypt.compare(input.password, user.password);
  if (!passwordMatch) {
    throw new AppError(401, "Email atau password salah");
  }

  // 3. Password benar -> buat token
  const token = signToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // 4. Kembalikan token + data user
  return {
    token,
    user: {
      id: user._id.toString(),
      nama: user.nama,
      email: user.email,
      role: user.role,
    },
  };
}

// ===== EXPORT SEMUA DI BAWAH =====
export { registerService, loginService };
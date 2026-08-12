import jwt, { type SignOptions } from 'jsonwebtoken';
import type { IJwtPayload } from '../interface/auth.interface.js';
import { AppError } from '../error/app.error.js';

// Ambil secret & durasi token dari .env.
// DIPANGGIL LAZY (di dalam fungsi, bukan saat module di-load).
// Kenapa? Di ESM, semua `import` dieksekusi sebelum body app.ts berjalan,
// termasuk config() dari dotenv. Kalau secret dibaca saat module di-load,
// proses.env.JWT_SECRET masih kosong dan pasti error.
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET wajib diisi di file .env');
  }
  return secret;
}

function getJwtExpiresIn(): Exclude<SignOptions['expiresIn'], undefined> {
  return (process.env.JWT_EXPIRES_IN || '7d') as Exclude<SignOptions['expiresIn'], undefined>;
}

// Buat token. payload = data user yang ingin disimpan di dalam token.
export function signToken(payload: IJwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: getJwtExpiresIn() });
}

// Verifikasi token dari client. Kalau token invalid/expired, lempar AppError 401
// agar errorHandler bisa membalas dengan status HTTP yang benar.
export function verifyToken(token: string): IJwtPayload {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    return decoded as IJwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(401, 'Token sudah kedaluwarsa, silakan login ulang');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(401, 'Token tidak valid');
    }
    throw error;
  }
}

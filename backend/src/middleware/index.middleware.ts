import type { NextFunction, Request, Response } from 'express';

// Middleware 1: dipanggil ketika URL tidak ditemukan
// Ia membuat error baru lalu meneruskannya ke errorHandler
export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);                       // set status HTTP 404 (Not Found)
  const error = new Error(`Not Found - ${req.originalUrl}`);  // simpan URL yang dicari
  next(error);                           // kirim error ke errorHandler
}

// Middleware 2: menangkap semua error yang diteruskan next(error)
// Lalu mengirim respons JSON ke client
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // log error di terminal agar developer bisa debug
  console.error(err.stack);

  // Jika respons belum punya status error (masih 200/2xx), ubah jadi 500.
  // (sebelumnya pakai "!== 200" yang salah jika status 201/204)
  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // stack hanya ditampilkan saat development, di production disembunyikan
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
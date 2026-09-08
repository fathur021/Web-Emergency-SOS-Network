import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5, // Batasi setiap IP hanya dapat melakukan 5 permintaan dalam 15 menit
    standardHeaders: true, // Kirim header `RateLimit-*`
    legacyHeaders: false, // Nonaktifkan header `X-RateLimit-*`
    message: {status: "error", message: "Terlalu banyak permintaan, silakan coba lagi nanti."},
})
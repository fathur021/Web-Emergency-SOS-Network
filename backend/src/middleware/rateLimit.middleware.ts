import rateLimit from 'express-rate-limit';

// Saat development limiter dilewati total (skip) supaya tidak mengganggu
// pengujian. Di production kembali aktif dengan batas ketat.
// Catatan: max: 0 di express-rate-limit v7+ MALAH memblokir SEMUA request,
// jadi gunakan `skip` untuk menonaktifkan.
const isDev = process.env.NODE_ENV !== "production";

// helper untuk menonaktifkan limiter saat dev
const skipDev = () => isDev;

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 20, // Prod: 20 permintaan per IP dalam 15 menit
    skip: skipDev, // Dev: lewati limiter
    standardHeaders: true, // Kirim header `RateLimit-*`
    legacyHeaders: false, // Nonaktifkan header `X-RateLimit-*`
    message: {status: "error", message: "Terlalu banyak permintaan, silakan coba lagi nanti."},
})

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: skipDev, // Dev: lewati limiter
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: "error",
        message: "Terlalu banyak permintaan, silahkan coba lagi nanti."
    }
})

// Limiter KHUSUS tombol SOS — mencegah spam "kirim SOS" dari IP yang sama.
// Prod: 5 pengiriman / 15 menit / IP.
export const sosLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skip: skipDev, // Dev: lewati limiter
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: "error",
        message: "Terlalu banyak sinyal SOS dikirim, mohon tunggu beberapa saat."
    }
})
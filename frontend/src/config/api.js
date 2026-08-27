// ============================================================
// KONFIGURASI API — dibaca dari env (Vite)
// ============================================================
// Nilai diambil dari file `.env` (atau `.env.local`) di folder frontend.
// Jika env tidak di-set, nilainya menjadi `undefined`.
// Wajib ada: VITE_API_ORIGIN (host backend) — lihat file .env
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// ============================================================
// HELPER: getImageUrl
// ============================================================
// Backend menyimpan path gambar sebagai RELATIF, contoh: "/uploads/sos-abc.jpg"
// Browser menganggap "/uploads/..." sebagai alamat dari HOST FRONTEND — salah!
// Padahal file-nya tersimpan di HOST BACKEND.
//
// Helper ini menggabungkan host backend (API_ORIGIN) + path relatif,
// sehingga <img src={...}> menunjuk ke lokasi file yang BENAR.
//
// - Kalau path sudah http(s) lengkap → biarkan apa adanya (URL absolut).
// - Kalau path relatif (mulai "/") → gabung dengan API_ORIGIN.
// - Kalau kosong/null → kembalikan null (tidak ada gambar).
// ============================================================
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
};

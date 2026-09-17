import { io } from "socket.io-client";
import { API_ORIGIN, API_BASE_URL } from "../config/api";

const SOCKET = API_ORIGIN;

let socket = null;
let connecting = false;          // penanda: proses connect sedang berjalan
const pendingHandlers = [];      // antrian handler selama socket belum siap

// ================================================================
// Memulai proses koneksi socket (ASYNC).
// Socket.IO butuh token di handshake, tapi token ada di HttpOnly
// cookie yang tidak bisa dibaca JS. Jadi kita:
//   1. fetch /auth/token (cookie otomatis terkirim oleh browser)
//   2. server memverifikasi cookie → balas token
//   3. token dipakai untuk koneksi socket
// Selama proses ini, handler yang masuk di-antri (pendingHandlers).
// ================================================================
function ensureConnected() {
  if (socket || connecting) return;   // sudah konek / sedang konek → selesai

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;                   // belum login → jangan connect

  connecting = true;

  fetch(`${API_BASE_URL}/auth/token`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      connecting = false;
      if (data.status === "success" && data.token) {
        socket = io(SOCKET, { auth: { token: data.token } });

        // Lampirkan semua handler yang di-antri selama connect
        const queued = pendingHandlers.splice(0);
        queued.forEach(([event, handler]) => socket.on(event, handler));
      }
    })
    .catch(() => {
      connecting = false;              // gagal → biarkan null, selesai
    });
}

// ================================================================
// API BARU untuk komponen: onSocket / offSocket.
// Kenapa bukan getSocket().on()? Karena socket dibuat async —
// bisa null saat dipanggil pertama kali. API baru ini menangani
// antrian handler otomatis.
// ================================================================
export function onSocket(event, handler) {
  ensureConnected();
  if (socket) {
    socket.on(event, handler);         // socket siap → attach langsung
  } else {
    pendingHandlers.push([event, handler]);  // belum → antri
  }
}

export function offSocket(event, handler) {
  if (socket) {
    socket.off(event, handler);
  }
  // Kalau masih di antrian (socket belum konek) → hapus juga,
  // agar tidak bocor setelah socket jadi.
  const idx = pendingHandlers.findIndex(([e, h]) => e === event && h === handler);
  if (idx !== -1) pendingHandlers.splice(idx, 1);
}

export const getSocket = () => socket;   // boleh dipakai untuk cek, tapi jangan .on() langsung

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
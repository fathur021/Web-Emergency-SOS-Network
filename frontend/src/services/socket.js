import { io } from "socket.io-client";
import { API_ORIGIN, API_BASE_URL } from "../config/api";

const SOCKET = API_ORIGIN;

let socket = null;

export const getSocket = () => {
  // Kalau socket sudah pernah dibuat, jangan buat lagi.
  if (!socket) {
    // Cek apakah user sedang login (data user ada di localStorage).
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return null;   // belum login → jangan connect socket

    // ================================================================
    // Token JWT kita ada di HttpOnly cookie → JS tidak bisa baca.
    // Socket.IO membutuhkan token di handshake auth, tapi dia tidak
    // mengirim cookie secara otomatis. Jadi kita:
    //
    //   1. Panggil GET /api/auth/token (fetch biasa → cookie HttpOnly
    //      OTOMATIS terkirim oleh browser karena credentials 'include').
    //   2. Server verifikasi cookie → balas token baru.
    //   3. Token itu kita pakai untuk handshake Socket.IO.
    //
    // Proses ini ASYNC, makanya dibuat promise di dalam getSocket.
    // ================================================================
    fetch(`${API_BASE_URL}/auth/token`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.token) {
          socket = io(SOCKET, {
            auth: { token: data.token },   // token dikirim ke middleware socket
          });
        }
      })
      .catch(() => {
        // Cookie expired / belum login → biarkan socket tetap null.
        // UI akan tetap berfungsi tanpa real-time.
      });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
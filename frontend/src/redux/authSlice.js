import { createSlice } from '@reduxjs/toolkit';
import { disconnectSocket } from '../services/socket';

// ---- Initial state: baca dari localStorage ----
// Kalau user sudah pernah login, saat refresh browser
// token & user otomatis terbaca kembali.
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    // ===== setCredentials: dipanggil setelah login/register sukses =====
    // action.payload = { user: { id, nama, email, role } }
    // Token TIDAK ada lagi — token ada di HttpOnly cookie (di-set server).
    setCredentials: (state, action) => {
      state.user = action.payload.user;

      // Simpan hanya data user (bukan token) agar persist setelah refresh.
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    // ===== logout: dipanggil saat user menekan tombol Keluar =====
    logout: (state) => {
      state.user = null;

      // Hapus data user dari localStorage. Cookie dihapus server
      // lewat POST /api/auth/logout (clearTokenCookie).
      localStorage.removeItem('user');
      disconnectSocket();
    },
  },
});

// Export action creator (setCredentials, logout)
export const { setCredentials, logout } = authSlice.actions;

// Export reducer (akan diregistrasi di store.js)
export default authSlice.reducer;

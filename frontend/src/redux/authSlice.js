
// ================================================================
// FILE: src/redux/authSlice.js
// ================================================================
// Slice untuk menyimpan status autentikasi (token & data user)
// secara global di Redux store.
// ================================================================

import { createSlice } from '@reduxjs/toolkit';

// ---- Initial state: baca dari localStorage ----
// Kalau user sudah pernah login, saat refresh browser
// token & user otomatis terbaca kembali.
const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    // ===== setCredentials: dipanggil setelah login/register sukses =====
    setCredentials: (state, action) => {
      // action.payload = { token, user } dari backend
      state.token = action.payload.token;
      state.user = action.payload.user;

      // Simpan ke localStorage supaya tetap ada setelah refresh browser
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    // ===== logout: dipanggil saat user menekan tombol Keluar =====
    logout: (state) => {
      state.token = null;
      state.user = null;

      // Hapus dari localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

// Export action creator (setCredentials, logout)
export const { setCredentials, logout } = authSlice.actions;

// Export reducer (akan diregistrasi di store.js)
export default authSlice.reducer;

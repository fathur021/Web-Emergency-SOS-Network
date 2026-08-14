
// ================================================================
// Store Redux = tempat penyimpanan global untuk seluruh state aplikasi.
// ================================================================

import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi'; // import API yang tadi dibuat
import authReducer from './authSlice'; // <-- BARU: state autentikasi

// configureStore: cara modern membuat store (otomatis ada thunk middleware).
export const store = configureStore({
  // reducer: kumpulan reducer / state manager aplikasi.
  reducer: {
    // [authApi.reducerPath] menghasilkan key "authApi" di dalam store,
    // berisi state cache, loading, dan error dari RTK Query.
    [authApi.reducerPath]: authApi.reducer,

    // auth: menyimpan { token, user } global.
    // Diakses lewat useSelector((state) => state.auth)
    auth: authReducer,
  },

  // middleware: logika tambahan yang berjalan untuk setiap action.
  // default sudah termasuk thunk (untuk async),
  // kita TAMBAHKAN authApi.middleware agar RTK Query bekerja.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
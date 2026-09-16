
// ================================================================
// RTK Query adalah fitur bawaan @reduxjs/toolkit yang otomatis
// menangani loading state, error state, dan caching request.
// ================================================================

// createApi   : fungsi untuk mendefinisikan kumpulan endpoint API
// fetchBaseQuery : fungsi bawaan yang menjalankan request fetch (HTTP)
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';

// ---- 1. Base URL backend ----
// Backend Express kamu berjalan di port 5000, semua route di-prefix "/api"
// (lihat backend/src/app.ts -> app.use("/api/", api)).
const BASE_URL = API_BASE_URL;

// ---- 2. Base query (konfigurasi fetch global) ----
// Semua request di file ini memakai baseUrl yang sama.
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,

  // credentials: 'include' → browser ikut mengirim cookie HttpOnly
  // pada setiap request. Token tidak lagi di localStorage,
  // melainkan otomatis terkirim lewat cookie.
  credentials: 'include',
});

// ---- 3. Definisikan API ----
export const authApi = createApi({
  // reducerPath: nama key dari state API ini di dalam Redux store.
  // Nilainya HARUS sama dengan key di store.js nanti.
  reducerPath: 'authApi',

  // baseQuery: semua endpoint memakai base query di atas.
  baseQuery,

  // tagTypes: dipakai untuk auto-refresh data.
  // Kosong dulu karena login/register tidak menampilkan daftar data.
  tagTypes: [],

  // endpoints: daftar operasi API pada modul ini.
  endpoints: (builder) => ({

    // ===== Endpoint: POST /api/auth/login =====
    // Mutation = operasi yang MENGUBAH/mengirim data ke server (POST/PUT/DELETE).
    login: builder.mutation({
      // query: menentukan URL, method, dan body yang dikirim.
      // `credentials` adalah argumen dari halaman Login = { email, password }.
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // ===== Endpoint: POST /api/auth/register =====
    register: builder.mutation({
      // `userData` = { nama, email, password } dari halaman Register.
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // ===== Endpoint: GET /api/auth/token (khusus Socket.IO) =====
    // Query (bukan mutation) karena hanya MEMBACA token baru dari server.
    // Dipakai oleh services/socket.js untuk handshake Socket.IO.
    getSocketToken: builder.query({
      query: () => '/auth/token',
    }),
  }),
});

// ---- 4. Export hook hasil generate otomatis ----
// Pola nama hook mutation: use<NamaEndpoint>Mutation
// Setiap hook mengembalikan array [trigger, result]:
//   const [login, { data, error, isLoading, isSuccess }] = useLoginMutation();
export const { useLoginMutation, useRegisterMutation, useGetSocketTokenQuery } = authApi;

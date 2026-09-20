import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  // Konfigurasi tambahan untuk dijalankan di dalam Docker
  server: {
    // host: true => Vite mendengarkan SEMUA alamat (bukan cuma localhost).
    // Tanpa ini, Vite hanya bisa diakses dari dalam container sendiri.
    host: true,
    // Port yang dipakai Vite dev server (harus sama dengan mapping port di docker-compose.yml)
    port: 5173,
    // usePolling: true => di Windows, perubahan file dari bind mount Docker
    // kadang tidak "dilaporkan" ke dalam container. Polling membuat Vite
    // aktif memeriksa perubahan setiap beberapa saat, sehingga HMR tetap jalan.
    watch: { usePolling: true },
  },
})

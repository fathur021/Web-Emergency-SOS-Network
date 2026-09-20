# ============================================================
# Dockerfile — Backend Emergency SOS Network (MODE DEVELOPMENT)
# ============================================================
# Dockerfile = "resep/cetakan" untuk membuat IMAGE backend.
# Image ini isinya: Node.js + semua dependency (npm ci) + kode.
#
# Di mode development, source code ASLI tetap di folder backend/
# (bind mount di docker-compose.yml). Peran image di sini adalah:
#   1) menyediakan Node.js versi yang konsisten (node:22-alpine)
#   2) menyiapkan node_modules hasil `npm ci` yang Linux,
#      yang nantinya "diwariskan" ke named volume.
# ============================================================

# 1) Dasar image: Node.js versi 22.
#    "alpine" = versi Linux paling ringan (ukurannya kecil).
FROM node:22-alpine

# 2) WORKDIR = folder kerja di dalam container.
#    Semua perintah (COPY, RUN, CMD) dijalankan dari folder ini.
#    Jadi di dalam container lokasi kode kita adalah /app.
WORKDIR /app

# 3) Salin DULU 2 file package (belum salin semua kode).
#    Kenapa dibagi dua? Supaya instruksi "RUN npm ci" punya file
#    package.json + package-lock.json lebih dulu.
#    Efeknya: kalau kamu hanya mengubah kode (bukan dependency),
#    Docker bisa memakai "cache" build dan TIDAK mengulang npm ci.
#    (Build kali kedua jadi jauh lebih cepat.)
COPY package.json package-lock.json ./

# 4) Install semua dependency.
#    `npm ci` = install PERSIS sesuai package-lock.json
#    (lebih ketat daripada `npm install`, hasilnya konsisten).
#    Hasilnya tersimpan di /app/node_modules.
RUN npm ci

# 5) Salin seluruh sisa kode backend ke container.
#    (file yang ada di .dockerignore TIDAK ikut disalin)
COPY . .

# 6) Hanya dokumen: beri tahu bahwa container ini mendengarkan port 5000.
#    (Bukan benar-benar membuka port — itu tugas "ports:" di compose.)
EXPOSE 5000

# 7) Perintah yang dijalankan saat container start.
#    npm run dev => tsx watch src/index.ts (hot-reload backend).
CMD ["npm", "run", "dev"]
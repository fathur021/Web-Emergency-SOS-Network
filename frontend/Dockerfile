# ============================================================
# Dockerfile — Frontend Emergency SOS Network (MODE DEVELOPMENT)
# ============================================================
# Polanya sama persis dengan backend/Dockerfile, bedanya hanya:
#   - folder ini isinya kode React/Vite
#   - port yang dipakai 5173 (Vite dev server)
#   - perintah jalannya `npm run dev` = `vite` (HMR)
#
# Di mode development, source code ASLI tetap di folder frontend/
# (bind mount di docker-compose.yml). Peran image di sini sama:
# menyediakan Node.js yang konsisten + node_modules Linux.
# ============================================================

# Node.js versi 22 (ringan, alpine)
FROM node:22-alpine

# Folder kerja di dalam container
WORKDIR /app

# Salin package dulu (supaya npm install bisa di-cache oleh Docker)
COPY package.json package-lock.json ./

# Install dependency persis sesuai package-lock.json
RUN npm ci

# Salin seluruh kode frontend (kecuali yang ada di .dockerignore)
COPY . .

# Tanda dokumentasi: Vite dev server mendengarkan port 5173
EXPOSE 5173

# Jalankan Vite dev server (HMR aktif)
CMD ["npm", "run", "dev"]
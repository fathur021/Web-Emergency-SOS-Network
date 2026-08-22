import Swal from "sweetalert2";

// Tema SweetAlert2 agar serasi dengan desain aplikasi:
// kartu putih rounded-2xl, border stone-200, shadow-neo-lg,
// tombol merah red-600 (danger) dan netral stone.
const gayaApp = {
  background: "#ffffff",
  color: "#1c1917", // stone-900
  confirmButtonColor: "#dc2626", // red-600
  cancelButtonColor: "#e7e5e4", // stone-200
  customClass: {
    popup: "!rounded-2xl !border !border-stone-200 !shadow-neo-lg !p-6",
    title: "!text-base !font-bold !text-stone-900",
    htmlContainer: "!text-xs !text-stone-500 !leading-relaxed",
    confirmButton: "!rounded-xl !text-xs !font-bold !px-5 !py-2.5 !bg-red-600 hover:!bg-red-700",
    cancelButton: "!rounded-xl !text-xs !font-bold !px-5 !py-2.5 !bg-surface !border !border-stone-300 !text-stone-600",
    actions: "!gap-2 !mt-5",
  },
};

// Dialog konfirmasi hapus pengguna — resolve true kalau user setuju
export const konfirmasiHapus = (nama) =>
  Swal.fire({
    ...gayaApp,
    showCancelButton: true,
    reverseButtons: true,
    title: "Hapus Pengguna?",
    text: `Apakah kamu yakin ingin menghapus ${nama}? Semua laporannya juga akan ikut terhapus. Tindakan ini tidak bisa dibatalkan.`,
    icon: "warning",
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
  });

// Popup sukses — otomatis tertutup dalam 2 detik
export const popupSukses = (pesan) =>
  Swal.fire({
    ...gayaApp,
    timer: 2000,
    showConfirmButton: false,
    title: "Berhasil!",
    text: pesan,
    icon: "success",
  });

// Popup gagal dengan pesan dari backend
export const popupGagal = (pesan) =>
  Swal.fire({
    ...gayaApp,
    confirmButtonText: "Mengerti",
    confirmButtonColor: "#2563eb", // blue-600
    title: "Gagal",
    text: pesan || "Terjadi kesalahan.",
    icon: "error",
  });

// Dialog konfirmasi logout admin — resolve true kalau user setuju
export const konfirmasiLogout = () =>
  Swal.fire({
    ...gayaApp,
    showCancelButton: true,
    reverseButtons: true,
    title: "Yakin Ingin Keluar?",
    text: "Kamu harus login lagi untuk mengakses halaman ini.",
    icon: "question",
    confirmButtonText: "Ya, Keluar",
    cancelButtonText: "Batal",
  });

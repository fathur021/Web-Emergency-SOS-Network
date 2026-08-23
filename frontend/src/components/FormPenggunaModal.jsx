import { useState } from "react";
import { X, UserPlus, Loader2, Pencil } from "lucide-react";
import { useCreateUserMutation, useUpdateUserMutation } from "../redux/api/sos.Api";
import { popupSukses, popupGagal } from "../utils/alert";

// value = yang nanti dikirim ke backend, label = yang tampil di layar
const roleOptions = [
  { value: "user", label: "Warga" },
  { value: "volunteer", label: "Relawan" },
  { value: "admin", label: "Admin" },
];

// Bentuk awal form yang kosong (dipakai untuk mode tambah)
const EMPTY_FORM = { nama: "", email: "", password: "", role: "user" };

const inputClass =
  "w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 outline-none focus:border-blue-500/40 transition";

const FormPenggunaModal = ({ open, onClose, initialData }) => {
  // initialData = null -> mode TAMBAH, objek user -> mode EDIT
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(EMPTY_FORM);
  // isLoading otomatis true selama request berjalan (dari RTK Query)
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const isSaving = isLoading || isUpdating;

  // Penanda form yang terakhir dimuat: null (tertutup),
  // "__tambah__" (mode tambah), atau id user (mode edit).
  // Dipakai untuk mendeteksi perpindahan mode/user TANPA useEffect.
  const [loadedKey, setLoadedKey] = useState(null);

  // Pola resmi React "menyesuaikan state saat prop berubah": dilakukan
  // SAAT RENDER (bukan dalam useEffect) agar tidak memicu render berantai.
  // Setiap kali modal dibuka untuk user/mode yang berbeda, form diisi ulang.
  const nextKey = open ? (initialData?.id ?? "__tambah__") : null;
  if (nextKey !== loadedKey) {
    setLoadedKey(nextKey);
    setForm(
      open && initialData
        ? {
            nama: initialData.name,
            email: initialData.email,
            role: initialData.roleValue,
            password: "",
          }
        : EMPTY_FORM,
    );
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); // cegah reload halaman bawaan <form>
    try {
      if (isEdit) {
        await updateUser({ id: initialData.id, ...form }).unwrap();
        popupSukses(`Data "${form.nama}" berhasil diperbarui`);
      } else {
        await createUser(form).unwrap();
        popupSukses(`Pengguna "${form.nama}" berhasil ditambahkan`);
      }
      onClose();
    } catch (error) {
      // pesan dari backend (validasi Joi / email duplikat) ditampilkan apa adanya
      popupGagal(error?.data?.message || "Gagal menyimpan data pengguna");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        open ? "" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Overlay gelap: fade in/out mengikuti state open */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel modal: muncul dengan efek scale + slide ke atas */}
      <div
        className={`relative w-full max-w-md bg-surface border border-stone-200 rounded-2xl shadow-neo-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-stone-200">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
            {isEdit ? (
              <Pencil className="w-4 h-4 text-blue-600" />
            ) : (
              <UserPlus className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-stone-900">
              {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isEdit
                ? `Ubah data akun ${initialData?.email}.`
                : "Buat akun baru beserta perannya."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="nama" className="block text-xs font-semibold text-stone-600 mb-1.5">
              Nama Lengkap
            </label>
            <input
              id="nama"
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="cth. Budi Santoso"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-stone-600 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="cth. budi@mail.com"
              className={inputClass}
            />
          </div>

          {/* Password cuma ada di mode tambah (edit tidak boleh asal ganti password) */}
          {!isEdit && (
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-stone-600 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label htmlFor="role" className="block text-xs font-semibold text-stone-600 mb-1.5">
              Role / Peran
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol aksi */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-600 border border-stone-300 shadow-neo-sm rounded-xl font-bold text-xs transition cursor-pointer"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "MENYIMPAN..." : "SIMPAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPenggunaModal;

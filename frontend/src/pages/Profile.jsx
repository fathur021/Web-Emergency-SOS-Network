import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Camera,
  Key,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Lock,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getImageUrl } from "../config/api";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePhotoMutation,
  useChangePasswordMutation,
} from "../redux/api/sos.Api";

const Profile = () => {
  const navigate = useNavigate();
  const userFromRedux = useSelector((state) => state.auth.user);
  const { data: profileData } = useGetProfileQuery();
  const user = profileData?.data || userFromRedux;

  const isRegularUser = user?.role === "user";

  const handleBack = () => {
    if (user?.role === "admin") navigate("/admin");
    else if (user?.role === "volunteer") navigate("/volunteer");
    else navigate("/");
  };

  return (
    <div className="h-full overflow-y-auto w-full bg-stone-100/50">
      {/* Tampilkan Navbar jika diakses oleh user biasa */}
      {isRegularUser && <Navbar />}

      <div className={`w-full p-4 md:p-6 pb-24 md:pb-32 space-y-6 ${isRegularUser ? "pt-28" : ""}`}>
        {/* Header & Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 bg-surface border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-100 transition cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-stone-900">Pengaturan Profil</h2>
            <p className="text-xs text-stone-500">
              Kelola data pribadi, foto profil, dan kata sandi akun Anda.
            </p>
          </div>
        </div>

        {/* Key memaksa form di-mount ulang setiap kali data user berubah,
            sehingga state form selalu terisi dengan data terbaru */}
        <ProfileForm key={user?._id || "anon"} user={user} />
      </div>
    </div>
  );
};

const ProfileForm = ({ user }) => {
  const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation();
  const [updatePhoto, { isLoading: savingPhoto }] = useUpdatePhotoMutation();
  const [changePassword, { isLoading: savingPassword }] = useChangePasswordMutation();

  // Form States - Data Diri (dipakai sebagai nilai awal, lalu diisi user)
  const [nama, setNama] = useState(user?.nama || "");
  // Email readOnly — diambil langsung dari user, tidak butuh setter
  const email = user?.email || "";

  // Form States - Upload Foto Profil
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Form States - Ganti Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Feedback Messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Handle pilih file foto
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Simpan Perubahan Profil (Data Diri)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nama.trim()) {
      setErrorMsg("Nama tidak boleh kosong.");
      return;
    }

    try {
      await updateProfile({ nama }).unwrap();
      setSuccessMsg("Profil berhasil diperbarui!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err?.data?.message || "Gagal memperbarui profil.");
    }
  };

  // Simpan Foto Profil
  const handleSavePhoto = async () => {
    if (!selectedImage) return;
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("photo", selectedImage);

    try {
      await updatePhoto(formData).unwrap();
      setSuccessMsg("Foto profil berhasil diunggah!");
      setSelectedImage(null);
      setPreviewUrl(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err?.data?.message || "Gagal mengunggah foto.");
    }
  };

  // Simpan Perubahan Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Harap isi semua bidang kata sandi.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      setSuccessMsg("Kata sandi berhasil diperbarui!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err?.data?.message || "Gagal mengganti kata sandi.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifikasi Pesan Sukses / Error */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 1. BAGIAN FOTO PROFIL */}
      {/* ---------------------------------------------------- */}
      <div className="p-5 bg-surface border border-stone-200 rounded-2xl shadow-neo-sm space-y-4 w-full">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Camera className="w-4 h-4 text-stone-700" />
          Foto Profil
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Solid Avatar Display (Tanpa Gradien) */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-stone-900 text-white text-3xl font-bold flex items-center justify-center border border-stone-200 shadow-neo-sm overflow-hidden uppercase shrink-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview Avatar"
                  className="w-full h-full object-cover"
                />
              ) : user?.photo ? (
                <img
                  src={getImageUrl(user.photo)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.nama?.charAt(0) || "U"
              )}
            </div>
          </div>

          {/* Upload Button Controls */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <p className="text-xs font-semibold text-stone-800">
              Unggah Foto Profil Baru
            </p>
            <p className="text-[11px] text-stone-500">
              Format yang didukung: JPG, PNG, atau WEBP. Maksimal 2MB.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <label className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 transition cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih File Gambar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {selectedImage && (
                <button
                  onClick={handleSavePhoto}
                  disabled={savingPhoto}
                  className="px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition cursor-pointer disabled:opacity-50"
                >
                  {savingPhoto ? "Mengunggah..." : "Simpan Foto"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. BAGIAN DATA DIRI */}
      {/* ---------------------------------------------------- */}
      <form onSubmit={handleSaveProfile} className="p-5 bg-surface border border-stone-200 rounded-2xl shadow-neo-sm space-y-4 w-full">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <User className="w-4 h-4 text-stone-700" />
          Data Diri
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Nama Lengkap */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full bg-stone-100 border border-stone-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 transition"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Input Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Alamat Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                readOnly
                disabled
                className="w-full bg-stone-200/60 border border-stone-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-600 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Role Akun */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Role Akun
            </label>
            <div className="relative">
              <input
                type="text"
                value={user?.role || "user"}
                readOnly
                disabled
                className="w-full bg-stone-200/60 border border-stone-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-600 capitalize cursor-not-allowed font-semibold"
              />
              <Shield className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Tombol Simpan Data Diri */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-neo-sm cursor-pointer transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingProfile ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>

      {/* ---------------------------------------------------- */}
      {/* 3. BAGIAN GANTI SANDI */}
      {/* ---------------------------------------------------- */}
      <form onSubmit={handleChangePassword} className="p-5 bg-surface border border-stone-200 rounded-2xl shadow-neo-sm space-y-4 w-full">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Key className="w-4 h-4 text-stone-700" />
          Ganti Kata Sandi
        </h3>

        {/* Sandi Lama */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Kata Sandi Saat Ini
          </label>
          <div className="relative">
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan kata sandi lama Anda"
              className="w-full bg-stone-100 border border-stone-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 transition"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Sandi Baru */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-stone-100 border border-stone-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 transition"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full bg-stone-100 border border-stone-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 transition"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Tombol Simpan Password */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-neo-sm cursor-pointer transition disabled:opacity-50"
          >
            <Key className="w-4 h-4" />
            <span>{savingPassword ? "Menyimpan..." : "Perbarui Kata Sandi"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

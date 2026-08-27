import React, { useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  RotateCcw,
  Loader2,
  Bike,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useCreateSosMutation,
  useGetSosByUserQuery,
  useDeleteSosMutation,
} from "../redux/api/sos.Api";
import { konfirmasiBatalSos, popupSukses, popupGagal } from "../utils/alert";
import { getImageUrl } from "../config/api";


const DEFAULT_COORDS = { latitude: -0.947, longitude: 100.354 };

const SosCard = ({ onCoordsChange, onSosCreated, onSosDeleted }) => {
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");

  const hasToken = Boolean(localStorage.getItem("token"));
  const [createSos] = useCreateSosMutation();
  const [deleteSos] = useDeleteSosMutation();

  // Deteksi SOS aktif milik user (pending / in_progress).
  // State kartu dibaca dari server → anti duplikat & tetap ada setelah refresh.
  const { data: mySosData } = useGetSosByUserQuery(undefined, {
    skip: !hasToken,
  });
  const activeSos = (mySosData?.data || []).find(
    (s) => s.status === "pending" || s.status === "in_progress",
  );
  const activePendingId =
    activeSos?.status === "pending" ? activeSos._id : null;

  const getCurrentPosition = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(DEFAULT_COORDS);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () => resolve(DEFAULT_COORDS),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  };

  const handleSendSOS = async () => {
    setError("");    if (!hasToken) {
      setError("Silahkan login terlebih dahulu untuk mengirim SOS");
      setTimeout(() => navigate("/login"), 800);
      return;
    }

    setIsLoading(true);
    try {
      const coords = await getCurrentPosition();
      onCoordsChange?.(coords);

      const formData = new FormData();
      formData.append("latitude", coords.latitude);
      formData.append("longitude", coords.longitude);
      if (description.trim())
        formData.append("description", description.trim());
      if (imageFile) formData.append("image", imageFile);

      const response = await createSos(formData).unwrap();
      onSosCreated?.(response?.data);
      setDescription("");
      setImageFile(null);
    } catch (error) {
      setError(error?.data?.message || "Gagal mengirim SOS, coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSOS = async () => {
    if (!activePendingId) return;
    const hasil = await konfirmasiBatalSos();
    if (!hasil.isConfirmed) return;

    setIsCancelling(true);
    try {
      await deleteSos(activePendingId).unwrap();
      popupSukses("Sinyal SOS berhasil dibatalkan");
      onSosDeleted?.(activePendingId);
    } catch (error) {
      popupGagal(error?.data?.message || "Gagal membatalkan sinyal SOS");
    } finally {
      setIsCancelling(false);
    }
  };

  // Koordinat & nama relawan diambil dari data SOS aktif di server
  const sosCoords = activeSos
    ? { latitude: activeSos.latitude, longitude: activeSos.longitude }
    : null;
  const volunteerName = activeSos?.volunteerId?.nama;
  const isClaimed = activeSos?.status === "in_progress";

  // URL preview untuk foto yang BARU dipilih user (belum dikirim ke server).
  // URL.createObjectURL membuat alamat sementara dari file lokal,
  // sehingga preview langsung tampil sebelum di-upload.
  const imagePreview = imageFile ? URL.createObjectURL(imageFile) : null;

  return (
    <div className="bg-surface/90 backdrop-blur-xl border border-stone-200 rounded-3xl p-6 shadow-neo space-y-6 text-center w-full max-w-md">
      {!activeSos ? (
        /* STATE A: BELUM ADA SOS AKTIF */
        <>
          <div>
            <h1 className="text-xl font-bold text-stone-900">
              Butuh Bantuan Darurat?
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Tekan tombol di bawah untuk mengirim sinyal SOS ke relawan
              terdekat.
            </p>
          </div>

          {/* Tombol SOS Utama */}
          <div className="py-2 flex justify-center items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-36 h-36 rounded-full bg-red-500/20 animate-ping"></div>
              <div className="absolute w-44 h-44 rounded-full bg-red-500/10"></div>

              <button
                onClick={handleSendSOS}
                disabled={isLoading}
                className="relative w-32 h-32 rounded-full
                 bg-gradient-to-br from-red-600 to-red-700 shadow-[0_0_40px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center active:scale-95 transition-all border-4 border-red-400/40 hover:shadow-[0_0_60px_rgba(239,68,68,0.6)] cursor-pointer group"
              >
                {isLoading ? (
                  <Loader2 className="w-9 h-9 text-white animate-spin" />
                ) : (
                  <>
                    <AlertTriangle className="w-9 h-9 text-white mb-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-black tracking-wider text-white">
                      SOS
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Opsional */}
          <div className="space-y-3 pt-2 text-left">
            <div>
              <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                Deskripsi Kejadian (Opsional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Kecelakaan motor, butuh P3K..."
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                Upload Foto Lokasi (Opsional)
              </label>
              <input
                type="file"
                id="photo-input"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="photo-input"
                className="w-full bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-500 flex items-center justify-between cursor-pointer transition"
              >
                <span className="truncate">
                  {imageFile ? imageFile.name : "Pilih foto kejadian..."}
                </span>
                <Camera className="w-4 h-4 text-stone-500" />
              </label>
            </div>
          </div>
          {/* PREVIEW FOTO — tampilkan gambar yang baru dipilih user */}
          {imagePreview && (
            <div className="pt-1 text-left">
              <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                Pratinjau Foto
              </label>
              <img
                src={imagePreview}
                alt="Pratinjau lokasi kejadian"
                className="w-full h-40 object-cover rounded-xl border border-stone-200"
              />
            </div>
          )}
          {/* Pesan error (belum login / gagal kirim) */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-400/30 rounded-xl p-3 text-left">
              {error}
            </p>
          )}
        </>
      ) : isClaimed ? (
        /* STATE C: DIKLAIM RELAWAN — TIDAK BISA DIBATALKAN */
        <>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-500 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Relawan Menuju Lokasi
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              {volunteerName
                ? `${volunteerName} Sedang Membantu`
                : "Relawan Sedang Menangani"}
            </h2>
            {sosCoords && (
              <p className="text-[11px] text-stone-400 font-mono">
                Lokasi: {sosCoords.latitude.toFixed(6)},
                {" "}
                {sosCoords.longitude.toFixed(6)}
              </p>
            )}
          </div>

          {/* FOTO SOS — tampilkan gambar dari backend (STATE C: sudah diklaim) */}
          {activeSos?.image && (
            <div className="pt-1">
              <img
                src={getImageUrl(activeSos.image)}
                alt="Foto lokasi kejadian"
                className="w-full h-40 object-cover rounded-xl border border-stone-200"
              />
            </div>
          )}

          {/* Stepper Status */}
          <div className="py-4 space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-stone-800 font-medium">
                Sinyal diterima sistem
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Bike className="w-5 h-5 text-blue-600 animate-pulse shrink-0" />
              <span className="text-blue-600 font-medium">
                {volunteerName
                  ? `${volunteerName} dalam perjalanan ke lokasimu`
                  : "Menunggu kedatangan relawan"}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-stone-400">
            Sinyal sudah ditangani relawan dan tidak bisa dibatalkan lagi.
          </p>
        </>
      ) : (
        /* STATE B: PENDING — MASIH BISA DIBATALKAN */
        <>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-400/30 text-red-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>{" "}
              Sinyal Terkirim
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              Mencari Relawan Terdekat...
            </h2>
            {sosCoords && (
              <p className="text-[11px] text-stone-400 font-mono">
                Lokasi: {sosCoords.latitude.toFixed(6)},
                {" "}
                {sosCoords.longitude.toFixed(6)}
              </p>
            )}
          </div>

          {/* FOTO SOS — tampilkan gambar dari backend (STATE B: pending) */}
          {activeSos?.image && (
            <div className="pt-1">
              <img
                src={getImageUrl(activeSos.image)}
                alt="Foto lokasi kejadian"
                className="w-full h-40 object-cover rounded-xl border border-stone-200"
              />
            </div>
          )}

          {/* Stepper Status */}
          <div className="py-4 space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-stone-800 font-medium">
                Sinyal diterima sistem
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
              <span className="text-amber-400 font-medium">
                Menunggu respon relawan
              </span>
            </div>
          </div>

          {/* Tombol Batal — benar-benar menghapus sinyal lewat API */}
          <button
            onClick={handleCancelSOS}
            disabled={isCancelling}
            className="w-full py-2.5 bg-stone-200 hover:bg-stone-300 disabled:opacity-60 text-stone-600 rounded-xl shadow-neo-sm font-semibold text-xs transition border border-stone-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isCancelling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            {isCancelling ? "MEMBATALKAN..." : "Batalkan SOS (Salah Tekan)"}
          </button>
        </>
      )}
    </div>
  );
};

export default SosCard;

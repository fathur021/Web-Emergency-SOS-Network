import React, { useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateSosMutation } from "../redux/api/sos.Api";

const DEFAULT_COORDS = { latitude: -9.947, longitude: 100.354 };

const SosCard = ({ onCoordsChange }) => {
  const [isSosSent, setIsSosSent] = useState(false);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [sentCoords, setSentCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [createSos] = useCreateSosMutation();

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
    setError("");

    if (!localStorage.getItem("token")) {
      setError("Silahkan login terlebih dahulu untuk mengirim SOS");
      setTimeout(() => navigate("/login"), 800);
      return;
    }

    setIsLoading(true);
    try {
      const coords = await getCurrentPosition();
      onCoordsChange?.(coords);
      setSentCoords(coords);

      const formData = new FormData();
      formData.append("latitude", coords.latitude);
      formData.append("longitude", coords.longitude);
      if (description.trim())
        formData.append("description", description.trim());
      if (imageFile) formData.append("image", imageFile);

      await createSos(formData).unwrap();
      setIsSosSent(true);
    } catch (error) {
      setError(error?.data?.message || "Gagal mengirim SOS, coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSOS = () => {
    // Panggil API / Socket.IO event batalkan SOS di sini
    setIsSosSent(false);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-center w-full max-w-md">
      {!isSosSent ? (
        /* STATE A: SEBELUM TOMBOL SOS DITEKAN */
        <>
          <div>
            <h1 className="text-xl font-bold text-slate-100">
              Butuh Bantuan Darurat?
            </h1>
            <p className="text-xs text-slate-400 mt-1">
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
                 bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_40px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center active:scale-95 transition-all border-4 border-red-400/30 hover:shadow-[0_0_60px_rgba(239,68,68,0.6)] cursor-pointer group"
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
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Deskripsi Kejadian (Opsional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Kecelakaan motor, butuh P3K..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
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
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-400 flex items-center justify-between cursor-pointer transition"
              >
                <span className="truncate">
                  {imageFile ? imageFile.name : "Pilih foto kejadian..."}
                </span>
                <Camera className="w-4 h-4 text-slate-400" />
              </label>
            </div>
          </div>
          {/* Pesan error (belum login / gagal kirim) */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-left">
              {error}
            </p>
          )}
        </>
      ) : (
        /* STATE B: SETELAH SOS DITEKAN (STATUS TRACKER) */
        <>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>{" "}
              Sinyal Terkirim
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              Mencari Relawan Terdekat...
            </h2>
             {sentCoords && (
              <p className="text-[11px] text-slate-500 font-mono">
                Lokasi: {sentCoords.latitude.toFixed(6)}, {sentCoords.longitude.toFixed(6)}
              </p>
            )}
          </div>

          {/* Stepper Status */}
          <div className="py-4 space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-medium">
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

          {/* Tombol Batal */}
          <button
            onClick={handleCancelSOS}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition border border-slate-700 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Batalkan SOS (Salah Tekan)
          </button>
        </>
      )}
    </div>
  );
};

export default SosCard;

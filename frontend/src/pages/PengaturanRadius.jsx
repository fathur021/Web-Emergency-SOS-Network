import { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Save,
  Loader2,
  CheckCircle2,
  Ruler,
} from "lucide-react";
import {
  useGetProfileQuery,
  useUpdateLocationMutation,
} from "../redux/api/sos.Api";

const PengaturanRadius = () => {
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();
  const [updateLocation, { isLoading: saving }] = useUpdateLocationMutation();

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationName, setLocationName] = useState("");
  const [radius, setRadius] = useState(5000);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Isi form dari data profil saat pertama load
  useEffect(() => {
    if (profileData?.data) {
      const p = profileData.data;
      if (p.latitude) setLatitude(String(p.latitude));
      if (p.longitude) setLongitude(String(p.longitude));
      if (p.locationName) setLocationName(p.locationName);
      if (p.radius) setRadius(p.radius);
    }
  }, [profileData]);

  // Ambil lokasi GPS otomatis
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Browser tidak mendukung Geolocation");
      return;
    }
    setGpsLoading(true);
    setErrorMsg("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setGpsLoading(false);
      },
      () => {
        setErrorMsg(
          "Gagal mendapatkan lokasi GPS. Pastikan izin lokasi diaktifkan.",
        );
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Simpan ke backend
  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setErrorMsg("Latitude dan longitude harus berupa angka yang valid");
      return;
    }

    if (lat < -90 || lat > 90) {
      setErrorMsg("Latitude harus antara -90 dan 90");
      return;
    }

    if (lng < -180 || lng > 180) {
      setErrorMsg("Longitude harus antara -180 dan 180");
      return;
    }

    try {
      await updateLocation({
        latitude: lat,
        longitude: lng,
        locationName: locationName.trim(),
        radius,
      }).unwrap();

      setSuccessMsg("Lokasi dan radius berhasil disimpan!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err?.data?.message || "Gagal menyimpan, coba lagi.");
    }
  };

  // Format radius untuk tampilan
  const formatRadius = (m) => {
    if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
    return `${m} m`;
  };

  if (profileLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-slate-400 animate-pulse">
          Memuat pengaturan...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Pengaturan Radius & Lokasi
          </h2>
          <p className="text-xs text-slate-400">
            Atur lokasi posisi Anda dan radius tanggap darurat. SOS dari warga
            dalam radius ini akan muncul di peta Anda.
          </p>
        </div>

        {/* Kartu Lokasi Saat Ini */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Lokasi Posisi
            </h3>
            <button
              onClick={handleDetectLocation}
              disabled={gpsLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-semibold hover:bg-emerald-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {gpsLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              {gpsLoading ? "Mendeteksi..." : "Deteksi GPS"}
            </button>
          </div>

          {/* Input Nama Lokasi */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Nama Lokasi
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Contoh: Kantor Relawan, Rumah, Posko Utama..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Input Latitude & Longitude */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-6.2088"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="106.8456"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono"
              />
            </div>
          </div>
        </div>

        {/* Kartu Pengaturan Radius */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-amber-400" />
            Radius Tanggap Darurat
          </h3>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Tentukan seberapa jauh jangkauan SOS yang ingin Anda pantau. Sinyal
            SOS dari warga dalam radius ini akan muncul di peta radar Anda.
          </p>

          {/* Slider Radius */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-emerald-400">
                {formatRadius(radius)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {radius} meter
              </span>
            </div>

            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex justify-between text-[10px] text-slate-500">
              <span>500 m</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Preset Radius Cepat */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "1 km", value: 1000 },
              { label: "3 km", value: 3000 },
              { label: "5 km", value: 5000 },
              { label: "10 km", value: 10000 },
              { label: "25 km", value: 25000 },
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => setRadius(preset.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  radius === preset.value
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pesan Sukses / Error */}
        {successMsg && (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            {errorMsg}
          </p>
        )}

        {/* Tombol Simpan */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-lg shadow-emerald-600/20"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
};

export default PengaturanRadius;

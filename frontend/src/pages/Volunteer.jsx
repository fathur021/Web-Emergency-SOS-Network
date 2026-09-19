import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import MapView from "../components/MapContainer";
import { useGetVolunteersQuery } from "../redux/api/sos.Api";
import {
  Navigation,
  AlertTriangle,
  ExternalLink,
  X,
  RefreshCw,
} from "lucide-react";

const Volunteer = () => {
  const {
    sosList = [],
    volunteerCoords,
    acceptedSos,
    incomingSos,
    refreshGps,
    userName,
  } = useOutletContext();
  const { data: volunteersData } = useGetVolunteersQuery();

  const [selectedSos, setSelectedSos] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [gpsDetecting, setGpsDetecting] = useState(false);

  // Ubah data SOS dari backend jadi format markers yang dimengerti MapView:
  const markers = sosList
    .filter(
      (s) =>
        s.latitude != null &&
        s.longitude != null &&
        (s.status === "pending" || s.status === "in_progress"),
    )
    .map((s) => ({
      id: s._id,
      lat: Number(s.latitude),
      lng: Number(s.longitude),
      title: s.description || "Sinyal SOS Darurat",
      desc: s.description || "",
      reporter: s.userId?.nama || "Anonim",
      status: s.status,
      raw: s,
    }));

  // Ubah data relawan jadi format markers:
  const volunteerMarkers = (volunteersData?.data || [])
    .filter((v) => v.latitude != null && v.longitude != null)
    .map((v) => ({
      lat: Number(v.latitude),
      lng: Number(v.longitude),
      nama: v.nama,
      locationName: v.locationName || "",
      radius: v.radius || 5000,
    }));

  // Tentukan SOS mana yang menjadi target rute:
  // 1. SOS yang sedang ditangani relawan ini (prioritas utama)
  // 2. SOS yang dipilih manual dengan tombol "Tampilkan Rute ke Sini"
  // 3. SOS yang sedang masuk di modal notifikasi (pratinjau)
  const activeTargetSos =
    acceptedSos ||
    selectedSos ||
    (incomingSos
      ? {
          _id: incomingSos.id,
          title: incomingSos.title,
          description: incomingSos.description,
          latitude: incomingSos.latitude,
          longitude: incomingSos.longitude,
          isIncomingPreview: true,
        }
      : null);

  const routeFrom = volunteerCoords
    ? { lat: Number(volunteerCoords.lat), lng: Number(volunteerCoords.lng) }
    : null;

  const routeTo =
    activeTargetSos && activeTargetSos.latitude != null && activeTargetSos.longitude != null
      ? {
          lat: Number(activeTargetSos.latitude),
          lng: Number(activeTargetSos.longitude),
        }
      : null;

  const handleSelectSosMarker = (sosMarker) => {
    setSelectedSos(sosMarker.raw || sosMarker);
  };

  const handleClearSelectedSos = () => {
    setSelectedSos(null);
    setRouteInfo(null);
  };

  const handleRefreshGpsClick = () => {
    setGpsDetecting(true);
    if (refreshGps) refreshGps();
    setTimeout(() => setGpsDetecting(false), 2000);
  };

  // Link navigasi eksternal Google Maps
  const googleMapsUrl =
    routeFrom && routeTo
      ? `https://www.google.com/maps/dir/?api=1&origin=${routeFrom.lat},${routeFrom.lng}&destination=${routeTo.lat},${routeTo.lng}&travelmode=driving`
      : null;

  return (
    <div className="relative w-full h-full">
      {/* 1. PETA RADAR SOS + LOKASI RELAWAN + RUTE NAVIGASI */}
      <div className="absolute inset-0 z-0">
        <MapView
          markers={markers}
          volunteers={volunteerMarkers}
          zoom={13}
          routeFrom={routeFrom}
          routeTo={routeTo}
          onSelectSos={handleSelectSosMarker}
          selectedSosId={activeTargetSos?._id || activeTargetSos?.id}
          onRouteInfoChange={setRouteInfo}
          volunteerName={userName ? `${userName} (Anda)` : "Lokasi Saya"}
        />
      </div>

      {/* 2. BANNER PERINGATAN GPS JIKA BELUM TERSEDIA */}
      {!volunteerCoords && (
        <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 z-20 max-w-md">
          <div className="bg-amber-500/90 backdrop-blur-md text-amber-950 px-4 py-3 rounded-2xl shadow-lg border border-amber-400/50 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-900 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-amber-950">Lokasi Relawan Belum Terdeteksi</p>
              <p className="text-amber-900/90 mt-0.5 leading-relaxed">
                Aktifkan izin GPS browser atau atur titik lokasi di menu Pengaturan Radius agar rute navigasi dapat ditampilkan di peta.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleRefreshGpsClick}
                  disabled={gpsDetecting}
                  className="px-2.5 py-1 bg-amber-950 text-amber-100 hover:bg-black rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${gpsDetecting ? "animate-spin" : ""}`} />
                  {gpsDetecting ? "Mendeteksi..." : "Deteksi GPS"}
                </button>
                <Link
                  to="/volunteer/pengaturan-radius"
                  className="px-2.5 py-1 bg-white/70 hover:bg-white text-amber-950 rounded-lg font-semibold transition"
                >
                  Atur Lokasi Manual
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. NAVIGATION HUD / PANEL INFORMASI RUTE */}
      {routeFrom && routeTo && (
        <div className="absolute top-4 left-4 z-20 max-w-sm sm:max-w-md pointer-events-auto">
          <div className="bg-surface/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-neo p-4 text-stone-900 transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Navigation className="w-4 h-4 text-blue-600 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20">
                      {acceptedSos
                        ? "Misi Darurat Aktif"
                        : activeTargetSos?.isIncomingPreview
                          ? "Pratinjau SOS Masuk"
                          : "Navigasi Tujuan"}
                    </span>
                    {routeInfo?.isFallback && (
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 border border-amber-400/30 px-1.5 py-0.5 rounded">
                        Garis Lurus
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 truncate mt-1">
                    {activeTargetSos?.description || activeTargetSos?.title || "Sinyal SOS"}
                  </h3>
                </div>
              </div>

              {!acceptedSos && selectedSos && (
                <button
                  type="button"
                  onClick={handleClearSelectedSos}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition cursor-pointer"
                  title="Tutup rute ini"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Statistik Jarak & Waktu Tempuh */}
            <div className="mt-3 pt-3 border-t border-stone-200/80 grid grid-cols-2 gap-2 text-center">
              <div className="bg-stone-100/80 rounded-xl p-2 border border-stone-200/60">
                <span className="text-[11px] text-stone-500 font-medium block">Perkiraan Jarak</span>
                <span className="text-base font-extrabold text-blue-600">
                  {routeInfo?.distanceKm ? `${routeInfo.distanceKm} km` : "Menghitung..."}
                </span>
              </div>
              <div className="bg-stone-100/80 rounded-xl p-2 border border-stone-200/60">
                <span className="text-[11px] text-stone-500 font-medium block">Estimasi Waktu</span>
                <span className="text-base font-extrabold text-emerald-600">
                  {routeInfo?.durationMin ? `~${routeInfo.durationMin} menit` : "Menghitung..."}
                </span>
              </div>
            </div>

            {/* Aksi Navigasi */}
            {googleMapsUrl && (
              <div className="mt-3 flex gap-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka di Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteer;

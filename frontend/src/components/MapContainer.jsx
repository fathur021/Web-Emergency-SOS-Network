import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

// 1. Kustomisasi Icon Marker SOS (Menggunakan Tailwind & HTML)
const createSosIcon = () => {
  return L.divIcon({
    className: 'custom-sos-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-10 h-10 rounded-full bg-red-500/40 animate-ping absolute"></div>
        <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-xs shadow-lg">
          🚨
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// 2. Kustomisasi Icon Marker Relawan (hijau, tanpa animasi ping)
const createVolunteerIcon = () => {
  return L.divIcon({
    className: 'custom-volunteer-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-xs shadow-lg">
          🟢
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Component helper: auto-fit bounds ke semua marker (termasuk relawan + SOS)
const FitBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (!markers || markers.length === 0) return;

    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 15);
    } else {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
};

// markers = array [ { lat, lng, title, desc }, ... ] → SOS
// volunteers = array [ { lat, lng, nama, locationName, radius }, ... ] → relawan
// latitude/longitude = 1 titik → user/relawan
const MapView = ({ latitude, longitude, markers = [], volunteers = [], zoom = 13 }) => {
  // Gabungkan semua titik untuk auto-fit bounds
  const allPoints = [
    ...markers.map((m) => ({ lat: m.lat, lng: m.lng })),
    ...volunteers.map((v) => ({ lat: v.lat, lng: v.lng })),
  ];

  // Tentukan center awal peta
  let center;
  if (allPoints.length > 0) {
    center = [allPoints[0].lat, allPoints[0].lng];
  } else {
    center = [latitude ?? -0.947, longitude ?? 100.354];
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Marker tunggal (Home / relawan) — tampil hanya kalau TIDAK pakai markers array */}
      {markers.length === 0 && volunteers.length === 0 && latitude != null && longitude != null && (
        <>
          <Marker position={[latitude, longitude]} icon={createSosIcon()}>
            <Popup className="custom-popup">
              <div className="text-slate-900 font-sans p-1">
                <h4 className="font-bold text-sm text-red-600">Sinyal SOS Darurat</h4>
                <p className="text-xs text-slate-600 mt-1">Butuh Bantuan Segera!</p>
              </div>
            </Popup>
          </Marker>
          <FitBounds markers={[{ lat: latitude, lng: longitude }]} />
        </>
      )}

      {/* Multi marker SOS */}
      {markers.map((m, i) => (
        <Marker key={m.id || i} position={[m.lat, m.lng]} icon={createSosIcon()}>
          <Popup className="custom-popup">
            <div className="text-slate-900 font-sans p-1">
              <h4 className="font-bold text-sm text-red-600">{m.title || 'SOS Darurat'}</h4>
              {m.desc && <p className="text-xs text-slate-600 mt-1">{m.desc}</p>}
              {m.reporter && <p className="text-[10px] text-slate-500 mt-1">Pelapor: {m.reporter}</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Marker relawan */}
      {volunteers.map((v, i) => (
        <Marker key={`vol-${i}`} position={[v.lat, v.lng]} icon={createVolunteerIcon()}>
          <Popup className="custom-popup">
            <div className="text-slate-900 font-sans p-1">
              <h4 className="font-bold text-sm text-emerald-600">Relawan</h4>
              <p className="text-xs text-slate-700 font-semibold mt-1">{v.nama}</p>
              {v.locationName && <p className="text-[10px] text-slate-500 mt-1">📍 {v.locationName}</p>}
              {v.radius && <p className="text-[10px] text-slate-500">Radius: {(v.radius / 1000).toFixed(1)} km</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Auto-fit ke semua marker kalau ada titik */}
      {allPoints.length > 0 && <FitBounds markers={allPoints} />}
    </MapContainer>
  );
};

export default MapView;
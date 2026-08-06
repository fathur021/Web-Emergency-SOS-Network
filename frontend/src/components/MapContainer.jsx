import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Component helper untuk memindahkan fokus peta secara otomatis saat lokasi berubah
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  map.setView([lat, lng], map.getZoom());
  return null;
};

const MapView = ({ latitude = -0.947, longitude = 100.354, zoom = 15 }) => {
  return (
    <MapContainer 
      center={[latitude, longitude]} 
      zoom={zoom} 
      scrollWheelZoom={true}
      className="w-full h-full z-0"
    >
      {/* TileLayer CartoDB Dark Matter untuk tema Dark Mode */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Marker SOS Pengguna */}
      <Marker position={[latitude, longitude]} icon={createSosIcon()}>
        <Popup className="custom-popup">
          <div className="text-slate-900 font-sans p-1">
            <h4 className="font-bold text-sm text-red-600">🚨 Sinyal SOS Darurat</h4>
            <p className="text-xs text-slate-600 mt-1">Butuh Bantuan Segera!</p>
          </div>
        </Popup>
      </Marker>

      {/* Recenter otomatis jika koordinat GPS berubah */}
      <RecenterMap lat={latitude} lng={longitude} />
    </MapContainer>
  );
};

export default MapView;
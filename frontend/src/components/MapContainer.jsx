import { Circle, MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from 'react-leaflet';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import L from 'leaflet';

const VOLUNTEER_COLORS = ['#2563eb', '#0f766e', '#d97706', '#16a34a', '#c026d3', '#4f46e5', '#0891b2'];

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const createSosIcon = () => {
  return L.divIcon({
    className: 'custom-sos-marker',
    html: `
      <div class="map-marker map-marker--sos">
        <span class="map-marker__pulse"></span>
        <span class="map-marker__pin">!</span>
        <span class="map-marker__label">SOS</span>
      </div>
    `,
    iconSize: [68, 68],
    iconAnchor: [34, 34],
    popupAnchor: [0, -28],
  });
};

const createVolunteerIcon = (color, name) => {
  const label = escapeHtml(name || 'Relawan');

  return L.divIcon({
    className: 'custom-volunteer-marker',
    html: `
      <div class="map-marker map-marker--volunteer" style="--marker-color: ${color}">
        <span class="map-marker__pulse"></span>
        <span class="map-marker__pin">+</span>
        <span class="map-marker__label">${label}</span>
      </div>
    `,
    iconSize: [78, 68],
    iconAnchor: [39, 34],
    popupAnchor: [0, -28],
  });
};

// Jarak dua titik koordinat dalam meter (rumus haversine).
const haversineMeters = (a, b) => {
  if (!a || !b) return 0;
  const aLat = Number(a.lat);
  const aLng = Number(a.lng);
  const bLat = Number(b.lat);
  const bLng = Number(b.lng);
  if (isNaN(aLat) || isNaN(aLng) || isNaN(bLat) || isNaN(bLng)) return 0;

  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(Math.max(0, s))));
};

const createMySelfIcon = (name) => {
  const label = escapeHtml(name || 'Lokasi Saya');

  return L.divIcon({
    className: 'custom-myself-marker',
    html: `
      <div class="map-marker map-marker--volunteer" style="--marker-color: #2563eb;">
        <span class="map-marker__pulse" style="background: rgba(37, 99, 235, 0.45); transform: scale(1.4);"></span>
        <span class="map-marker__pin" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; box-shadow: 0 0 12px rgba(37, 99, 235, 0.6);">📍</span>
        <span class="map-marker__label" style="background: #1e293b; color: #93c5fd; font-weight: 700; border: 1px solid #3b82f6;">${label}</span>
      </div>
    `,
    iconSize: [84, 68],
    iconAnchor: [42, 34],
    popupAnchor: [0, -28],
  });
};

// 🆕 Komponen rute navigasi dari relawan ke lokasi SOS
const RouteLine = ({ from, to, onRouteInfoChange }) => {
  const map = useMap();
  const [coordinates, setCoordinates] = useState([]);
  const [isFallback, setIsFallback] = useState(false);

  // Simpan posisi terakhir yang berhasil difetch untuk menghindari request berulang
  const lastFetchedRef = useRef(null);

  useEffect(() => {
    if (!from || !to) {
      setCoordinates([]);
      lastFetchedRef.current = null;
      if (onRouteInfoChange) onRouteInfoChange(null);
      return;
    }

    const fromLat = Number(from.lat);
    const fromLng = Number(from.lng);
    const toLat = Number(to.lat);
    const toLng = Number(to.lng);

    if (isNaN(fromLat) || isNaN(fromLng) || isNaN(toLat) || isNaN(toLng)) {
      setCoordinates([]);
      if (onRouteInfoChange) onRouteInfoChange(null);
      return;
    }

    const currentFrom = { lat: fromLat, lng: fromLng };
    const currentTo = { lat: toLat, lng: toLng };
    const distMeters = haversineMeters(currentFrom, currentTo);

    // Titik awal & akhir sangat dekat (< 10m)
    if (distMeters < 10) {
      const directCoords = [[fromLat, fromLng], [toLat, toLng]];
      setCoordinates(directCoords);
      setIsFallback(false);
      if (onRouteInfoChange) {
        onRouteInfoChange({
          distanceKm: (distMeters / 1000).toFixed(2),
          durationMin: 1,
          isFallback: false,
        });
      }
      return;
    }

    // Hindari refetch jika koordinat SUDAH ada dan pergeseran kecil (< 30m) serta target sama
    if (
      coordinates.length > 0 &&
      lastFetchedRef.current &&
      haversineMeters(currentFrom, lastFetchedRef.current.from) < 30 &&
      lastFetchedRef.current.to.lat === toLat &&
      lastFetchedRef.current.to.lng === toLng
    ) {
      return;
    }

    let cancelled = false;

    const fetchRoute = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`Routing OSRM gagal (${res.status})`);
        const data = await res.json();

        if (!cancelled && data.routes?.[0]?.geometry?.coordinates?.length > 0) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
          setCoordinates(coords);
          setIsFallback(false);
          lastFetchedRef.current = { from: currentFrom, to: currentTo };

          const distKm = (route.distance / 1000).toFixed(1);
          const durMin = Math.max(1, Math.round(route.duration / 60));
          if (onRouteInfoChange) {
            onRouteInfoChange({
              distanceKm: distKm,
              durationMin: durMin,
              isFallback: false,
            });
          }
          return;
        }
      } catch (err) {
        clearTimeout(timeoutId);
        // OSRM gagal / timeout / offline / CORS -> gunakan garis lurus sebagai fallback
        if (!cancelled) {
          console.warn('[RouteLine] Menggunakan fallback garis lurus:', err.message);
          const directCoords = [[fromLat, fromLng], [toLat, toLng]];
          setCoordinates(directCoords);
          setIsFallback(true);
          lastFetchedRef.current = { from: currentFrom, to: currentTo };

          const distKm = (distMeters / 1000).toFixed(1);
          const durMin = Math.max(1, Math.round((distMeters / 1000 / 35) * 60));
          if (onRouteInfoChange) {
            onRouteInfoChange({
              distanceKm: distKm,
              durationMin: durMin,
              isFallback: true,
            });
          }
        }
      }
    };

    fetchRoute();

    return () => {
      cancelled = true;
    };
  }, [from?.lat, from?.lng, to?.lat, to?.lng]);

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;
    try {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
    } catch {
      // ignore
    }
  }, [coordinates, map]);

  if (!coordinates || coordinates.length === 0) return null;

  return (
    <>
      {/* 1. Halo / Glow effect di bawah garis utama */}
      <Polyline
        positions={coordinates}
        pathOptions={{
          color: isFallback ? '#fbbf24' : '#60a5fa',
          weight: 9,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* 2. Garis utama rute navigasi */}
      <Polyline
        positions={coordinates}
        pathOptions={{
          color: isFallback ? '#d97706' : '#2563eb',
          weight: 4.5,
          opacity: 0.95,
          dashArray: isFallback ? '10, 10' : undefined,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </>
  );
};

const MapFixer = () => {
  const map = useMap();

  useLayoutEffect(() => {
    const container = map.getContainer();

    requestAnimationFrame(() => {
      map.invalidateSize();
      requestAnimationFrame(() => map.invalidateSize());
    });

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [map]);

  return null;
};

const FitBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (!markers || markers.length === 0) return;

    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 15);
    } else {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [72, 72], maxZoom: 15 });
    }
  }, [markers, map]);

  return null;
};

const MapPopup = ({ eyebrow, title, description, meta, variant = 'sos' }) => (
  <div className="map-popup">
    <p className={`map-popup__eyebrow ${variant === 'volunteer' ? 'map-popup__eyebrow--volunteer' : ''}`}>
      {eyebrow}
    </p>
    <h4>{title}</h4>
    {description && <p>{description}</p>}
    {meta && <span>{meta}</span>}
  </div>
);

const MapView = ({
  latitude,
  longitude,
  markers = [],
  volunteers = [],
  zoom = 13,
  routeFrom = null,
  routeTo = null,
  onSelectSos = null,
  selectedSosId = null,
  onRouteInfoChange = null,
  volunteerName = 'Lokasi Saya',
}) => {
  const allPoints = [
    ...markers.map((m) => ({ lat: m.lat, lng: m.lng })),
    ...volunteers.map((v) => ({ lat: v.lat, lng: v.lng })),
  ];

  if (routeFrom && routeTo) {
    allPoints.push(routeFrom, routeTo);
  }

  const center = allPoints.length > 0
    ? [allPoints[0].lat, allPoints[0].lng]
    : latitude != null && longitude != null
      ? [latitude, longitude]
      : [0, 0];

  const hasActiveRoute = Boolean(routeFrom && routeTo);

  return (
    <div className="map-shell">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={true}
        className="w-full h-full"
      >
        <MapFixer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          className="road-map-tiles"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.length === 0 && volunteers.length === 0 && latitude != null && longitude != null && (
          <>
            <Marker position={[latitude, longitude]} icon={createSosIcon()}>
              <Popup className="custom-popup">
                <MapPopup
                  eyebrow="Darurat"
                  title="Sinyal SOS Darurat"
                  description="Butuh bantuan segera."
                />
              </Popup>
            </Marker>
            {!hasActiveRoute && <FitBounds markers={[{ lat: latitude, lng: longitude }]} />}
          </>
        )}

        {markers.map((m, i) => (
          <Marker key={m.id || i} position={[m.lat, m.lng]} icon={createSosIcon()}>
            <Popup className="custom-popup">
              <MapPopup
                eyebrow="Laporan SOS"
                title={m.title || 'SOS Darurat'}
                description={m.desc}
                meta={m.reporter ? `Pelapor: ${m.reporter}` : ''}
              />
              {onSelectSos && (
                <div className="pt-2 border-t border-stone-200 mt-2">
                  <button
                    type="button"
                    onClick={() => onSelectSos(m)}
                    className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <span>📍</span> {selectedSosId === m.id ? 'Rute Sedang Ditampilkan' : 'Tampilkan Rute ke Sini'}
                  </button>
                </div>
              )}
            </Popup>
          </Marker>
        ))}

        {volunteers.map((v, i) => {
          const color = VOLUNTEER_COLORS[i % VOLUNTEER_COLORS.length];

          return (
            <Fragment key={`vol-wrap-${i}`}>
              {v.radius && (
                <Circle
                  center={[v.lat, v.lng]}
                  radius={v.radius}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.06,
                    opacity: 0.28,
                    weight: 1.5,
                  }}
                />
              )}
              <Marker
                position={[v.lat, v.lng]}
                icon={createVolunteerIcon(color, v.nama)}
              >
                <Popup className="custom-popup">
                  <MapPopup
                    eyebrow="Relawan"
                    title={v.nama || 'Relawan'}
                    description={v.locationName}
                    meta={v.radius ? `Radius: ${(v.radius / 1000).toFixed(1)} km` : ''}
                    variant="volunteer"
                  />
                </Popup>
              </Marker>
            </Fragment>
          );
        })}

        {/* 🆕 Marker Posisi Relawan Sendiri jika memiliki koordinat routeFrom */}
        {routeFrom && routeFrom.lat != null && routeFrom.lng != null && (
          <Marker
            position={[Number(routeFrom.lat), Number(routeFrom.lng)]}
            icon={createMySelfIcon(volunteerName)}
            zIndexOffset={1000}
          >
            <Popup className="custom-popup">
              <MapPopup
                eyebrow="Relawan (Anda)"
                title={volunteerName || 'Lokasi Saya'}
                description="Titik awal rute navigasi Anda."
                variant="volunteer"
              />
            </Popup>
          </Marker>
        )}

        {/* 🆕 Render garis rute navigasi */}
        {routeFrom && routeTo && (
          <RouteLine from={routeFrom} to={routeTo} onRouteInfoChange={onRouteInfoChange} />
        )}

        {/* Hanya fitBounds global jika TIDAK sedang navigasi rute aktif */}
        {!hasActiveRoute && allPoints.length > 0 && <FitBounds markers={allPoints} />}
      </MapContainer>

      <div className="map-status-panel" aria-hidden="true">
        <span><strong>{markers.length}</strong> SOS aktif</span>
        <span><strong>{volunteers.length}</strong> relawan</span>
        {/* 🆕 Badge navigasi aktif */}
        {routeFrom && routeTo && (
          <span className="!bg-blue-500/10 !border-blue-500/40 !text-blue-700">
            <strong>Navigasi Aktif</strong>
          </span>
        )}
      </div>
    </div>
  );
};

export default MapView;

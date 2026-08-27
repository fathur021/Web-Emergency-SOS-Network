import { Circle, MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from 'react-leaflet';
import { Fragment, useEffect, useLayoutEffect, useState } from 'react';
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

// 🆕 TAMBAH BARU — Komponen rute navigasi dari relawan ke lokasi SOS
const RouteLine = ({ from, to }) => {
  const map = useMap();
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    if (!from || !to) { setCoordinates(null); return; }
    let cancelled = false;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled && data.routes?.[0]?.geometry?.coordinates) {
          const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
          setCoordinates(coords);
        } else if (!cancelled) {
          setCoordinates([[from.lat, from.lng], [to.lat, to.lng]]);
        }
      } catch {
        if (!cancelled) setCoordinates([[from.lat, from.lng], [to.lat, to.lng]]);
      }
    };

    fetchRoute();
    return () => { cancelled = true; };
  }, [from?.lat, from?.lng, to?.lat, to?.lng]);

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;
    const bounds = L.latLngBounds(coordinates);
    map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
  }, [coordinates, map]);

  if (!coordinates || coordinates.length === 0) return null;

  return (
    <Polyline
      positions={coordinates}
      pathOptions={{
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
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

const MapView = ({ latitude, longitude, markers = [], volunteers = [], zoom = 13, routeFrom = null, routeTo = null }) => {
  const allPoints = [
    ...markers.map((m) => ({ lat: m.lat, lng: m.lng })),
    ...volunteers.map((v) => ({ lat: v.lat, lng: v.lng })),
  ];

  // 🆕 TAMBAH BARU — masukkan titik rute ke bounds supaya peta zoom otomatis
  if (routeFrom && routeTo) {
    allPoints.push(routeFrom, routeTo);
  }

  const center = allPoints.length > 0
    ? [allPoints[0].lat, allPoints[0].lng]
    : [latitude ?? -0.947, longitude ?? 100.354];

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
            <FitBounds markers={[{ lat: latitude, lng: longitude }]} />
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

        {/* 🆕 TAMBAH BARU — render garis rute navigasi */}
        {routeFrom && routeTo && (
          <RouteLine from={routeFrom} to={routeTo} />
        )}

        {allPoints.length > 0 && <FitBounds markers={allPoints} />}
      </MapContainer>

      <div className="map-status-panel" aria-hidden="true">
        <span><strong>{markers.length}</strong> SOS aktif</span>
        <span><strong>{volunteers.length}</strong> relawan</span>
        {/* 🆕 TAMBAH BARU — badge navigasi aktif */}
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

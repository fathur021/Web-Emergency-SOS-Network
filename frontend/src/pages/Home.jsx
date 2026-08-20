import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SosCard from '../components/SosCard';
import MapView from '../components/MapContainer';
import { useGetSosByUserQuery, useGetVolunteersQuery } from '../redux/api/sos.Api';

const DEFAULT_COORDS = { latitude: -0.947, longitude: 100.354 };

const Home = () => {
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [activeSosMarkers, setActiveSosMarkers] = useState([]);
  const hasToken = Boolean(localStorage.getItem('token'));
  const { data: volunteersData } = useGetVolunteersQuery(undefined, {
    skip: !hasToken,
  });
  const { data: userSosData } = useGetSosByUserQuery(undefined, {
    skip: !hasToken,
  });

  const volunteerMarkers = (volunteersData?.data || [])
    .filter((v) => v.latitude != null && v.longitude != null)
    .map((v) => ({
      lat: v.latitude,
      lng: v.longitude,
      nama: v.nama,
      locationName: v.locationName || '',
      radius: v.radius || 5000,
    }));

  const toSosMarker = (sos, fallbackReporter = 'Saya') => {
    if (sos?.latitude == null || sos?.longitude == null) return;

    return {
      id: sos._id || `${sos.latitude}-${sos.longitude}`,
      lat: sos.latitude,
      lng: sos.longitude,
      title: sos.description || 'Sinyal SOS Darurat',
      desc: sos.description || 'Butuh bantuan segera.',
      reporter: sos.userId?.nama || fallbackReporter,
    };
  };

  const serverSosMarkers = (userSosData?.data || [])
    .filter((s) => s.latitude != null &&
                   s.longitude != null &&
                  (s.status === 'pending' || s.status === 'in_progress'))
    .map((s) => toSosMarker(s))
    .filter(Boolean);

  const visibleSosMarkers = [
    ...activeSosMarkers,
    ...serverSosMarkers.filter((serverMarker) =>
      !activeSosMarkers.some((localMarker) => localMarker.id === serverMarker.id)
    ),
  ];

  const handleSosCreated = (sos) => {
    const marker = toSosMarker(sos);
    if (!marker) return;

    setActiveSosMarkers((prev) => [
      marker,
      ...prev,
    ]);
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return (
    <div className="relative w-screen h-screen bg-stone-100 font-sans text-stone-900 overflow-hidden flex items-center justify-center">
      
      {/* 1. NAVBAR */}
      <Navbar location="Jl. Jendral Sudirman No. 42" />

      {/* 2. PETA (React Leaflet MapView) */}
      <div className="absolute top-[68px] bottom-0 left-0 right-0" style={{ zIndex: 0 }}>
        <MapView
          latitude={coords.latitude}
          longitude={coords.longitude}
          markers={visibleSosMarkers}
          volunteers={volunteerMarkers}
        />
      </div>

      {/* 3. MAIN CONTENT (TOMBOL SOS CARD) */}
      <main className="relative z-20 p-4">
        <SosCard onCoordsChange={setCoords} onSosCreated={handleSosCreated}/>
      </main>

      {/* 4. FOOTER */}
      <Footer />

    </div>
  );
};

export default Home;

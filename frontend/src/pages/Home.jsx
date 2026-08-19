import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SosCard from '../components/SosCard';
import MapView from '../components/MapContainer';

const DEFAULT_COORDS = { latitude: -0.947, longitude: 100.354 };

const Home = () => {
  const [coords, setCoords] = useState(DEFAULT_COORDS);

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
    <div className="relative w-screen h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden flex items-center justify-center">
      
      {/* 1. NAVBAR */}
      <Navbar location="Jl. Jendral Sudirman No. 42" />

      {/* 2. PETA (React Leaflet MapView) */}
      <div className="absolute top-[68px] bottom-0 left-0 right-0" style={{ zIndex: 0 }}>
        <MapView latitude={coords.latitude} longitude={coords.longitude}/>
      </div>

      {/* 3. MAIN CONTENT (TOMBOL SOS CARD) */}
      <main className="relative z-20 p-4">
        <SosCard onCoordsChange={setCoords}/>
      </main>

      {/* 4. FOOTER */}
      <Footer />

    </div>
  );
};

export default Home;

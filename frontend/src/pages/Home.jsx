import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SosCard from '../components/SosCard';
import MapView from '../components/MapContainer';
const Home = () => {
  return (
    <div className="relative w-screen h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden flex items-center justify-center">
      
      {/* 1. NAVBAR */}
      <Navbar location="Jl. Jendral Sudirman No. 42" />

      {/* 2. PETA (React Leaflet MapView) */}
      <div className="absolute inset-x-0 top-[68px] md:top-[84px] bottom-0 z-0">
        <MapView />
      </div>

      {/* 3. MAIN CONTENT (TOMBOL SOS CARD) */}
      <main className="relative z-20 p-4">
        <SosCard />
      </main>

      {/* 4. FOOTER */}
      <Footer />

    </div>
  );
};

export default Home;
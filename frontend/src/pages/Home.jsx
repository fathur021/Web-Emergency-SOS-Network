import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SosCard from '../components/SosCard';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div className="relative w-screen h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden flex items-center justify-center">
      
      {/* 1. NAVBAR */}
      <Navbar location="Jl. Jendral Sudirman No. 42" />

      {/* 2. BACKGROUND MAP CANVAS */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30 z-0">
        {/* Tempat ReactLeaflet MapContainer */}
      </div>

      {/* Pin Lokasi di Tengah Peta */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-red-500/10 animate-ping absolute"></div>
          <div className="w-8 h-8 rounded-full bg-red-600 border-4 border-slate-900 shadow-xl flex items-center justify-center text-xs">
            📍
          </div>
        </div>
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
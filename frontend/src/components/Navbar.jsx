import React from 'react';
import { Siren, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
const Navbar = ({ location = "Jl. Sudirman, No. 42" }) => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-30 backdrop-blur-sm bg-slate-950/40 border-b border-slate-800/50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500 font-bold">
          <Siren className="w-5 h-5 text-red-500 animate-pulse" />
        </div>
        <span className="font-bold text-sm tracking-wider text-slate-100">
          SOS NETWORK
        </span>
      </div>

      {/* Indikator GPS */}
      <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-slate-300 hidden sm:inline flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 inline" />
          Lokasi: <strong class="text-slate-100 font-medium">{location}</strong>
        </span>
        <span className="text-slate-300 sm:hidden">GPS Aktif</span>
      </div>

      {/* Link Masuk Sebagai Relawan */}
      <Link
        to="/volunteer"
        className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-full font-semibold text-xs hover:bg-emerald-500/20 transition"
      >
        <ShieldCheck className="w-4 h-4" />
        <span className="hidden sm:inline">Masuk Relawan</span>
        <span className="sm:hidden">Relawan</span>
      </Link>
    </header>
  );
};

export default Navbar;
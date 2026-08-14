import React from 'react';
import { Siren, MapPin, ShieldCheck, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = ({ location = "Jl. Sudirman, No. 42" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Baca data user dari Redux (null kalau belum login)
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());      // hapus token & user dari store + localStorage
    navigate('/login');      // kembali ke halaman login
  };

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
      <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-slate-300 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 inline" />
          Lokasi: <strong className="text-slate-100 font-medium">{location}</strong>
        </span>
      </div>

      {/* Bagian kanan: berubah tergantung status login */}
      {user ? (
        <div className="flex items-center gap-2">
          {/* Info user yang sedang login */}
          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div className="text-right leading-tight">
              <p className="text-xs font-semibold text-slate-100">{user.nama}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Tombol Keluar */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900/80 border border-slate-700 text-red-400 rounded-full font-semibold text-xs hover:bg-red-500/10 hover:border-red-500/50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/80 border border-slate-700 text-slate-200 rounded-full font-semibold text-xs hover:bg-slate-800 hover:border-slate-500 transition"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Masuk</span>
            <span className="sm:hidden">Login</span>
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-red-600 border border-red-500 text-white rounded-full font-semibold text-xs hover:bg-red-500 transition shadow-lg shadow-red-600/20"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Daftar</span>
            <span className="sm:hidden">Daftar</span>
          </Link>

          <Link
            to="/volunteer"
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-full font-semibold text-xs hover:bg-emerald-500/20 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Relawan</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
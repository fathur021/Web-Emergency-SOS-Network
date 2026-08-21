import { Siren, MapPin, ShieldCheck, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useGetProfileQuery } from '../redux/api/sos.Api';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Baca data user dari Redux (null kalau belum login)
  const user = useSelector((state) => state.auth.user);

  // Lokasi asli dari profil user (skip kalau belum login)
  const hasToken = Boolean(localStorage.getItem('token'));
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !hasToken,
  });
  const locationName = profileData?.data?.locationName;

  const handleLogout = () => {
    dispatch(logout());      // hapus token & user dari store + localStorage
    navigate('/login');      // kembali ke halaman login
  };

  return (
    <header className="absolute top-3 left-3 right-3 md:top-4 md:left-5 md:right-5 z-30">
      <div className="flex justify-between items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md bg-surface/75 border border-stone-200/80 shadow-neo">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 font-bold">
          <Siren className="w-5 h-5 text-red-400 animate-pulse" />
        </div>
        <span className="font-bold text-sm tracking-wider text-stone-900">
          SOS NETWORK
        </span>
      </div>

      {/* Indikator GPS — hanya tampil kalau user sudah mengatur lokasi */}
      {locationName && (
        <div className="hidden md:flex items-center gap-2 bg-surface px-3.5 py-1.5 rounded-full border border-stone-200 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-stone-600 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600 inline" />
            Lokasi: <strong className="text-stone-900 font-medium">{locationName}</strong>
          </span>
        </div>
      )}

      {/* Bagian kanan: berubah tergantung status login */}
      {user ? (
        <div className="flex items-center gap-2">
          {/* Info user yang sedang login */}
          <div className="flex items-center gap-2 bg-surface px-3.5 py-1.5 rounded-full border border-stone-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div className="text-right leading-tight">
              <p className="text-xs font-semibold text-stone-900">{user.nama}</p>
              <p className="text-[10px] text-stone-500 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Tombol Keluar */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface/80 border border-stone-300 text-red-400 rounded-full font-semibold text-xs hover:bg-red-500/10 hover:border-red-400 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-surface/80 border border-stone-300 text-stone-800 rounded-full font-semibold text-xs hover:bg-stone-300 hover:border-stone-400 transition"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Masuk</span>
            <span className="sm:hidden">Login</span>
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-red-600 border border-red-500 text-white rounded-full font-semibold text-xs hover:bg-red-500 transition shadow-md shadow-red-600/20"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Daftar</span>
            <span className="sm:hidden">Daftar</span>
          </Link>

          <Link
            to="/volunteer"
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/40 text-blue-700 rounded-full font-semibold text-xs hover:bg-blue-500/20 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Relawan</span>
          </Link>
        </div>
      )}
      </div>
    </header>
  );
};

export default Navbar;
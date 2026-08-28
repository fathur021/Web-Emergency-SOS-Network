import { useState } from 'react';
import { Menu, Bell, ChevronDown, User, LogOut, Clock3, Radio, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { konfirmasiLogout } from '../utils/alert';

const StatChip = ({ icon: Icon, count, label, chipClass }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold ${chipClass}`}
    title={`${count} ${label}`}
  >
    <Icon className="w-3.5 h-3.5 shrink-0" />
    <span className="tabular-nums">{count}</span>
    <span className="hidden lg:inline">{label}</span>
  </span>
);

const AdminTopBar = ({ onOpenSidebar, pendingCount = 0, inProgressCount = 0, volunteersCount = 0 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil data admin yang sedang login dari Redux
  const user = useSelector((state) => state.auth.user);

  // State buka/tutup dropdown profil admin
  const [profilOpen, setProfilOpen] = useState(false);

  const handleLogout = async () => {
    const result = await konfirmasiLogout();
    if (!result.isConfirmed) return;
    dispatch(logout());      // hapus token & user dari store + localStorage
    navigate('/login');      // kembali ke halaman login
  };

  return (
    <header className="h-16 border-b border-stone-200 bg-surface/85 backdrop-blur-md px-4 md:px-6 flex items-center justify-between gap-3 shrink-0">
      {/* Kiri: Toggle Mobile + Judul + Statistik */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Toggle Hamburger Button untuk Mobile */}
        <button
          onClick={onOpenSidebar}
          className="p-2.5 bg-surface text-stone-600 rounded-xl shadow-neo-sm border border-stone-200 hover:bg-stone-100 active:scale-95 transition md:hidden"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Judul Halaman */}
        <div className="hidden md:flex flex-col leading-tight min-w-0">
          <h2 className="text-sm font-extrabold tracking-tight text-stone-900">Command Center</h2>
          <p className="text-[10px] font-medium text-stone-500">Pantau & tangani sinyal darurat</p>
        </div>

        {/* Metric Indicator Widgets */}
        <div className="flex items-center gap-2 ml-auto md:ml-2">
          <StatChip
            icon={Clock3}
            count={pendingCount}
            label="Pending"
            chipClass="bg-red-500/10 border-red-400/30 text-red-500"
          />
          <StatChip
            icon={Radio}
            count={inProgressCount}
            label="In Progress"
            chipClass="bg-amber-500/10 border-amber-400/40 text-amber-600"
          />
          <StatChip
            icon={HeartHandshake}
            count={volunteersCount}
            label="Relawan Siaga"
            chipClass="bg-blue-500/10 border-blue-500/30 text-blue-700"
          />
        </div>
      </div>

      {/* Kanan: Notifikasi + Profil Admin + Logout */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          className="relative p-2.5 bg-surface text-stone-600 rounded-xl shadow-neo-sm border border-stone-200 hover:bg-stone-100 active:scale-95 transition"
          aria-label="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 flex w-2.5 h-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-red-500 border-2 border-white" />
          </span>
        </button>

        <div className="w-px h-8 bg-stone-200 hidden sm:block" />

        {/* Dropdown Profil Admin */}
        <div className="relative">
          <button
            onClick={() => setProfilOpen(!profilOpen)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-xl bg-surface border border-stone-200 shadow-neo-sm hover:bg-stone-100 transition cursor-pointer"
            title="Menu profil"
          >
            {/* Avatar: nanti diganti foto dari file avatar saat upload sudah ada */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs font-extrabold uppercase flex items-center justify-center ring-2 ring-white shrink-0">
              {user?.nama?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:flex flex-col items-start leading-tight text-left">
              <p className="text-xs font-bold text-stone-900 max-w-[120px] truncate">{user?.nama}</p>
              <p className="text-[10px] font-semibold text-emerald-500 capitalize flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {user?.role}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${profilOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Panel dropdown */}
          {profilOpen && (
            <>
              {/* Overlay: klik di luar untuk menutup */}
              <div className="fixed inset-0 z-40" onClick={() => setProfilOpen(false)} />

              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-stone-200 rounded-2xl shadow-neo-lg z-50 overflow-hidden">
                {/* Header kecil dalam dropdown */}
                <div className="px-4 py-3 border-b border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider">Masuk sebagai</p>
                  <p className="text-xs font-bold text-stone-900 truncate">{user?.nama}</p>
                  <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
                </div>

                {/* Menu Profile */}
                <button
                  onClick={() => setProfilOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 hover:text-blue-700 transition cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  Profil Saya
                </button>

                {/* Pemisah */}
                <div className="my-1 h-px bg-stone-100" />

                {/* Menu Logout */}
                <button
                  onClick={() => { setProfilOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;

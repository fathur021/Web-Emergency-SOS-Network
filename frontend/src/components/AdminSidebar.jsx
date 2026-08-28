import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  History,
  BarChart3,
  Siren,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Live Dashboard' },
  { to: '/admin/pengguna', icon: Users, label: 'Kelola Pengguna' },
  { to: '/admin/riwayat-laporan', icon: History, label: 'Riwayat Laporan' },
  { to: '/admin/statistik-relawan', icon: BarChart3, label: 'Statistik Relawan' },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  // Ambil data admin yang sedang login dari Redux
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-stone-200 flex flex-col p-4 shrink-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0 shadow-neo-lg md:shadow-none' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo & Identity */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-neo-sm flex items-center justify-center">
              <Siren className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-stone-900">SOS COMMAND</h1>
              <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
          {/* Tombol Close Sidebar (Mobile Only) */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Label Section */}
        <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-stone-400">
          Menu Utama
        </p>

        {/* Navigasi Links */}
        <nav className="space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map(({ to, end, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose}>
              {({ isActive }) => (
                <span
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-neo-sm'
                      : 'text-stone-600 bg-transparent border-transparent hover:bg-stone-100 hover:text-blue-700'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-stone-400 group-hover:text-blue-600'
                    }`}
                  />
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Status Sistem */}
        <div className="mt-4 rounded-2xl border border-stone-200 bg-gradient-to-br from-surface to-inset p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500" />
            </span>
            <p className="text-[10px] font-bold text-stone-700">SEMUA SISTEM NORMAL</p>
          </div>
          <p className="mt-1 text-[10px] font-medium text-stone-500 truncate">
            Masuk sebagai {user?.nama || 'Admin'} • v1.0
          </p>
        </div>
      </aside>

      {/* Overlay Gelap jika Sidebar Dibuka di Layar Kecil */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
};

export default AdminSidebar;

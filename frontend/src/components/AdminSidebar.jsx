import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { konfirmasiLogout } from '../utils/alert';
import { 
  LayoutDashboard, 
  Users, 
  History, 
  Siren, 
  X,
  LogOut
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil data admin yang sedang login dari Redux
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    const result = await konfirmasiLogout();
    if(!result.isConfirmed) return;
    dispatch(logout());      // hapus token & user dari store + localStorage
    navigate('/login');      // kembali ke halaman login
  };

  return (
    <>
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-stone-200 transition-transform duration-300 flex flex-col justify-between p-4 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 font-bold">
                <Siren className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide text-stone-900">SOS COMMAND</h1>
                <p className="text-[10px] text-stone-500">Admin Control Panel</p>
              </div>
            </div>
            {/* Tombol Close Sidebar (Mobile Only) */}
            <button onClick={onClose} className="md:hidden text-stone-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigasi Links */}
          <nav className="space-y-1">
            <NavLink
              to="/admin"
              end
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition border ${
                isActive
                  ? 'bg-blue-500/10 text-blue-700 border-blue-500/30'
                  : 'text-stone-500 hover:bg-stone-300 border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Live Dashboard
            </NavLink>
            <NavLink
              to="/admin/pengguna"
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition border ${
                isActive
                  ? 'bg-blue-500/10 text-blue-700 border-blue-500/30'
                  : 'text-stone-500 hover:bg-stone-300 border-transparent'
              }`}
            >
              <Users className="w-4 h-4" /> Kelola Pengguna
            </NavLink>
            <NavLink
              to="/admin/riwayat-laporan"
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition border ${
                isActive
                  ? 'bg-blue-500/10 text-blue-700 border-blue-500/30'
                  : 'text-stone-500 hover:bg-stone-300 border-transparent'
              }`}
            >
              <History className="w-4 h-4" /> Riwayat Laporan
            </NavLink>
          </nav>
        </div>

        {/* Info Petugas Admin + Tombol Logout */}
        <div className="space-y-2">
          <div className="p-3 bg-stone-200/60 rounded-xl border border-stone-200 flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center uppercase">
              {user?.nama ? user.nama.charAt(0) : 'A'}
            </div>
            <div className="truncate">
              <p className="font-semibold text-stone-800 truncate">{user?.nama || 'Admin'}</p>
              <p className="text-[10px] text-emerald-400">● System Active</p>
            </div>
          </div>

          {/* Tombol Keluar */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-stone-200/60 rounded-xl shadow-neo-sm border border-stone-200 text-red-400 font-semibold text-xs hover:bg-red-500/10 hover:border-red-400 transition"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Overlay Gelap jika Sidebar Dibuka di Layar Kecil */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
};

export default AdminSidebar;
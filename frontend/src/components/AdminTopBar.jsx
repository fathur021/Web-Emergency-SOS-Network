import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const AdminTopBar = ({ onOpenSidebar, pendingCount = 1, inProgressCount = 1, volunteersCount = 14 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil data admin yang sedang login dari Redux
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());      // hapus token & user dari store + localStorage
    navigate('/login');      // kembali ke halaman login
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 px-4 md:px-6 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3">
        {/* Toggle Hamburger Button untuk Mobile */}
        <button 
          onClick={onOpenSidebar}
          className="p-2 bg-slate-800 text-slate-300 rounded-xl md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Metric Indicator Widgets */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-300 hidden lg:inline">STATISTIK:</span>
          <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full font-semibold">
            ● {pendingCount} Pending
          </span>
          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full font-semibold">
            ● {inProgressCount} In Progress
          </span>
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full font-semibold hidden sm:inline">
            ● {volunteersCount} Relawan Siaga
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Info admin yang login */}
        {user && (
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <p className="text-xs font-semibold text-slate-100">{user.nama}</p>
            <p className="text-[10px] text-emerald-400 capitalize">● {user.role} active</p>
          </div>
        )}

        <button className="p-2 bg-slate-800 text-slate-300 rounded-xl relative hover:bg-slate-700 transition">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 animate-ping"></span>
        </button>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-red-400 rounded-xl font-semibold text-xs hover:bg-red-500/10 transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopBar;
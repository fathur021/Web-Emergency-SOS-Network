import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  History, 
  Siren, 
  X 
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 flex flex-col justify-between p-4 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500 font-bold">
                <Siren className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide text-slate-100">SOS COMMAND</h1>
                <p className="text-[10px] text-slate-400">Admin Control Panel</p>
              </div>
            </div>
            {/* Tombol Close Sidebar (Mobile Only) */}
            <button onClick={onClose} className="md:hidden text-slate-400">
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
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'text-slate-400 hover:bg-slate-800 border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Live Dashboard
            </NavLink>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl font-medium text-xs transition">
              <Users className="w-4 h-4" /> Kelola Pengguna
            </a>
            <NavLink
              to="/admin/relawan"
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition border ${
                isActive
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'text-slate-400 hover:bg-slate-800 border-transparent'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Kelola Relawan
            </NavLink>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl font-medium text-xs transition">
              <History className="w-4 h-4" /> Riwayat Laporan
            </a>
          </nav>
        </div>

        {/* Info Petugas Admin */}
        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center">
            A
          </div>
          <div className="truncate">
            <p className="font-semibold text-slate-200">Admin Command</p>
            <p className="text-[10px] text-emerald-400">● System Active</p>
          </div>
        </div>
      </aside>

      {/* Overlay Gelap jika Sidebar Dibuka di Layar Kecil */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
};

export default AdminSidebar;
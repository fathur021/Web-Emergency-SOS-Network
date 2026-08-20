import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Map, History, Settings, X } from 'lucide-react';

const VolunteerSideBar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Drawer Container */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-stone-200 transition-transform duration-300 flex flex-col justify-between p-4 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Header Sidebar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/40 flex items-center justify-center text-blue-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm tracking-wide text-stone-900">RELAWAN PORTAL</span>
            </div>
            <button onClick={onClose} className="md:hidden text-stone-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigasi Links */}
          <nav className="space-y-1">
            <NavLink
              to="/volunteer"
              end
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition ${
                isActive
                  ? 'bg-blue-500/10 border border-blue-500/30 text-blue-700'
                  : 'text-stone-500 hover:bg-stone-300 border border-transparent'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Peta Radar SOS</span>
            </NavLink>
            <NavLink
              to="/volunteer/riwayat"
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition ${
                isActive
                  ? 'bg-blue-500/10 border border-blue-500/30 text-blue-700'
                  : 'text-stone-500 hover:bg-stone-300 border border-transparent'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat Bantuan</span>
            </NavLink>
            <NavLink
              to="/volunteer/pengaturan-radius"
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition ${
                isActive
                  ? 'bg-blue-500/10 border border-blue-500/30 text-blue-700'
                  : 'text-stone-500 hover:bg-stone-300 border border-transparent'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan Radius</span>
            </NavLink>
          </nav>
        </div>

        {/* Profil Mini Relawan */}
        <div className="p-3 bg-stone-200/60 rounded-xl border border-stone-200 flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
            R
          </div>
          <div className="truncate">
            <p className="font-semibold text-stone-800">Relawan Aktif</p>
            <p className="text-[10px] text-stone-500">ID: #VOL-402</p>
          </div>
        </div>
      </aside>

      {/* Overlay Gelap untuk Mobile */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
};

export default VolunteerSideBar;
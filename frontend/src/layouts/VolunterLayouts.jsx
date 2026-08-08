import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import VolunteerSideBar from '../components/VolunteerSideBar';
import VolunteerTopBar from '../components/VolunteerTopBar';
import VolunteerSosModal from '../components/VolunteerSosModal';

const VolunterLayouts = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Demo State Notifikasi SOS Masuk dari Socket.IO
  const [incomingSos, setIncomingSos] = useState({
    id: 101,
    title: "Kecelakaan Lalu Lintas",
    location: "Jl. Jendral Sudirman No. 42",
    description: "Pengendara motor jatuh, membutuhkan pertolongan pertama."
  });

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <VolunteerSideBar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* 2. AREA UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* TOPBAR */}
        <VolunteerTopBar 
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {/* HALAMAN YANG DITUJU */}
        <main className="flex-1 relative z-10 overflow-hidden">
          <Outlet />

          {/* Modal / Card Laporan Masuk */}
          {incomingSos && isOnline && (
            <VolunteerSosModal 
              sosData={incomingSos}
              onAccept={() => alert("Bantuan Diterima! Menuju ke lokasi...")}
              onReject={() => setIncomingSos(null)}
            />
          )}
        </main>

      </div>

    </div>
  );
};

export default VolunterLayouts;

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopBar from '../components/AdminTopBar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Demo State Incident Feed
  const [incidents, setIncidents] = useState([
    { 
      id: 101, 
      title: 'Kecelakaan Lalu Lintas', 
      status: 'Pending', 
      location: 'Jl. Jendral Sudirman No. 42', 
      time: '1 mnt lalu',
      desc: 'Pengendara motor terjatuh, butuh pertolongan pertama.'
    },
    { 
      id: 100, 
      title: 'Pohon Tumbang', 
      status: 'In Progress', 
      location: 'Jl. Ahmad Yani (Taman City)', 
      time: '10 mnt lalu',
      desc: 'Menutup jalan utama, relawan Budi sedang menuju lokasi.'
    },
    { 
      id: 99, 
      title: 'Genangan Air / Banjir', 
      status: 'Resolved', 
      location: 'Jl. Riau No. 12', 
      time: '45 mnt lalu',
      desc: 'Penanganan selesai oleh tim BPBD.'
    }
  ]);

  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  const inProgressCount = incidents.filter(i => i.status === 'In Progress').length;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* 2. AREA UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* TOPBAR */}
        <AdminTopBar 
          onOpenSidebar={() => setIsSidebarOpen(true)}
          pendingCount={pendingCount}
          inProgressCount={inProgressCount}
        />

        {/* HALAMAN YANG DITUJU */}
        <div className="flex-1 flex overflow-hidden">
          <Outlet context={{ incidents, setIncidents }} />
        </div>

      </div>

    </div>
  );
};

export default AdminLayout;

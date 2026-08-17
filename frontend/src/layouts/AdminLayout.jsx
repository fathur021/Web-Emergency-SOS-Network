import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { useGetAllSosQuery } from "../redux/api/sos.Api";
import { getSocket } from "../services/socket";

const statusMap = {
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);

  //1. ambil data awal dari get /api/sos
  const { data } = useGetAllSosQuery();

  useEffect(() => {
    if (data?.data) {
      setIncidents(
        data.data.map((s) => ({
          id: s._id,
          title: s.description || "Sinyal SOS Darurat",
          status: statusMap[s.status] || s.status,
          location: `Lat: ${s.latitude}, Lng: ${s.longitude}`,
          time: s.createdAt,
          desc: s.description || "",
          image: s.image,
          reporter: s.userId?.nama || "Anonim",
        })),
      );
    }
  }, [data]);

// 2. Real-time: SOS baru yang dikirim user langsung muncul via socket
  useEffect(() => {
    const socket = getSocket();
    const handleNewSos = (sos) => {
      setIncidents((prev) => [
        {
          id: sos._id,
          title: sos.description || 'Sinyal SOS Darurat',
          status: 'Pending',
          location: `Lat: ${sos.latitude}, Lng: ${sos.longitude}`,
          time: sos.createdAt,
          desc: sos.description || '',
          image: sos.image,
          reporter: sos.userId?.nama || 'Anonim',
        },
        ...prev,
      ]);
    };
    socket.on('sos:new', handleNewSos);
    return () => socket.off('sos:new', handleNewSos);
  }, []);

  const pendingCount = incidents.filter((i) => i.status === 'Pending').length;
  const inProgressCount = incidents.filter((i) => i.status === 'In Progress').length;


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

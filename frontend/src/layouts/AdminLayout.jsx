import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { useGetAllSosQuery, useGetVolunteersQuery } from "../redux/api/sos.Api";
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
  const { data: volunteersData } = useGetVolunteersQuery();

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

  //3. ambil data relawan untuk ditampilkan di peta
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    if (volunteersData?.data) {
      setVolunteers(
        volunteersData.data
          .filter((v) => v.latitude != null && v.longitude != null)
          .map((v) => ({
            lat: v.latitude,
            lng: v.longitude,
            nama: v.nama,
            locationName: v.locationName || "",
            radius: v.radius || 5000,
          }))
      );
    }
  }, [volunteersData]);

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

  useEffect(() => {
  const socket = getSocket();
  const handleUpdateSos = (sos) => {
    setIncidents((prev) =>
      prev.map((item) =>
        item.id === sos._id
          ? { ...item, status: statusMap[sos.status] || sos.status }
          : item,
      ),
    );
  };
  socket.on('sos:update', handleUpdateSos);
  return () => socket.off('sos:update', handleUpdateSos);
}, []);

// 2b. Real-time: SOS dihapus → langsung hilang dari peta & daftar
useEffect(() => {
  const socket = getSocket();
  const handleDeleteSos = ({ id }) => {
    setIncidents((prev) => prev.filter((item) => item.id !== id));
  };
  socket.on('sos:delete', handleDeleteSos);
  return () => socket.off('sos:delete', handleDeleteSos);
}, []);

  const pendingCount = incidents.filter((i) => i.status === 'Pending').length;
  const inProgressCount = incidents.filter((i) => i.status === 'In Progress').length;


  return (
    <div className="flex h-screen bg-stone-100 text-stone-900 font-sans overflow-hidden">
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
          <Outlet context={{ incidents, setIncidents, volunteers }} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

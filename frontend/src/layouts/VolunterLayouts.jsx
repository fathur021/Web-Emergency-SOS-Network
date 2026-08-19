import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import VolunteerSideBar from '../components/VolunteerSideBar';
import VolunteerTopBar from '../components/VolunteerTopBar';
import VolunteerSosModal from '../components/VolunteerSosModal';
import { useGetAllSosQuery } from '../redux/api/sos.Api';
import { getSocket } from '../services/socket';

const VolunterLayouts = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [incomingSos, setIncomingSos] = useState(null);

  // 1. Ambil semua SOS dari database (data awal)
  const { data } = useGetAllSosQuery();
  const [sosList, setSosList] = useState([]);

  // Isi data awal dari API
  useEffect(() => {
    if (data?.data) {
      setSosList(data.data);
    }
  }, [data]);

  // 2. Real-time: SOS baru masuk lewat socket
  useEffect(() => {
    const socket = getSocket();

    const handleNewSos = (sos) => {
      // Tambahkan ke daftar (untuk peta)
      setSosList((prev) => [sos, ...prev]);

      // Tampilkan modal notifikasi (kalau relawan在线)
      setIncomingSos({
        id: sos._id,
        title: sos.description || 'Sinyal SOS Darurat',
        location: `Lat: ${sos.latitude}, Lng: ${sos.longitude}`,
        description: sos.description || 'Butuh pertolongan segera',
        image: sos.image,
      });
    };

    socket.on('sos:new', handleNewSos);
    return () => socket.off('sos:new', handleNewSos);
  }, []);

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
        <main className="flex-1 relative z-0 overflow-hidden">
          {/* sosList diteruskan ke child (Volunteer.jsx) lewat context */}
          <Outlet context={{ sosList }} />

          {/* Modal Notifikasi SOS Masuk */}
          {incomingSos && isOnline && (
            <VolunteerSosModal
              sosData={incomingSos}
              onAccept={() => alert('Bantuan Diterima! Menuju ke lokasi...')}
              onReject={() => setIncomingSos(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default VolunterLayouts;
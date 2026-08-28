import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import VolunteerSideBar from '../components/VolunteerSideBar';
import VolunteerTopBar from '../components/VolunteerTopBar';
import VolunteerSosModal from '../components/VolunteerSosModal';
import {
  useGetAllSosQuery,
  useGetVolunteersQuery,
  useUpdateLocationMutation,
  useUpdateSosStatusMutation,
} from '../redux/api/sos.Api';
import { getSocket } from '../services/socket';

// volunteerId bisa berupa objek hasil populate { _id, nama } atau string/ObjectId
const getVolunteerId = (s) =>
  s?.volunteerId ? String(s.volunteerId._id ?? s.volunteerId) : null;

// Ubah dokumen SOS (dari DB/socket) jadi bentuk yang dipakai modal
const toSosData = (sos) => ({
  id: sos._id,
  title: sos.description || "Sinyal SOS Darurat",
  location: `Lat: ${sos.latitude}, Lng: ${sos.longitude}`,
  latitude: sos.latitude,
  longitude: sos.longitude,
  description: sos.description || "Butuh pertolongan segera",
  image: sos.image,
});

const VolunterLayouts = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [incomingSos, setIncomingSos] = useState(null);

  const user = useSelector((state) => state.auth.user);

  // 🆕 TAMBAH BARU — posisi GPS relawan secara real-time.
  // Dipakai sebagai titik MULAI rute navigasi.
  const [volunteerCoords, setVolunteerCoords] = useState(null);

  // Semua SOS dari DATABASE — modal bersumber dari sini,
  // jadi tetap muncul walau halaman di-refresh
  const { data } = useGetAllSosQuery();
  const [updateSosStatus] = useUpdateSosStatusMutation();
  const { data: volunteersData } = useGetVolunteersQuery();
  const [updateLocation] = useUpdateLocationMutation();

  // 🆕 TAMBAH BARU — ambil posisi GPS.
  // - getCurrentPosition dipanggil SEKALI saat mount supaya dapat lokasi cepat
  // - watchPosition untuk pembaruan real-time
  // - Posisi terakhir disimpan: TIDAK pernah di-reset ke null supaya garis tidak berkedip
  // - Posisi juga dikirim ke server (updateLocation) agar posisi DB = posisi diri sendiri,
  //   sehingga fallback tidak salah menunjuk relawan lain
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('[GPS] Geolocation tidak didukung browser.');
      return;
    }

    const applyPos = (pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setVolunteerCoords(coords);
      // simpan ke server supaya DB = posisi diri (untuk fallback yang benar)
      updateLocation({ latitude: coords.lat, longitude: coords.lng })
        .catch((e) => console.warn('[GPS] Gagal update lokasi ke server:', e?.data?.message));
    };

    const errorPos = (err) => {
      console.warn('[GPS] error:', err.code, err.message);
    };

    // 1) dapat lokasi cepat sekali
    navigator.geolocation.getCurrentPosition(applyPos, errorPos, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    });

    // 2) pantau pergerakan real-time
    const watchId = navigator.geolocation.watchPosition(applyPos, errorPos, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user?.id]);

  // Fallback: kalau GPS belum dapat posisi, pakai koordinat DB MILIK DIRI SENDIRI
  // (bukan relawan lain) supaya garis rute tidak mulai dari lokasi volunteer lain.
  const dbVolunteerPos = (() => {
    if (!user?.id || !volunteersData?.data) return null;
    const me = volunteersData.data.find((v) => String(v._id) === String(user.id));
    return me && me.latitude != null && me.longitude != null
      ? { lat: me.latitude, lng: me.longitude }
      : null;
  })();

  // Prioritas: GPS real-time > posisi DB diri sendiri > null (tanpa rute)
  const effectiveVolunteerCoords = volunteerCoords || dbVolunteerPos;

  const [sosList, setSosList] = useState([]);

  // 1. Isi peta + tampilkan modal untuk SOS pending terbaru
  useEffect(() => {
    if (!data?.data) return;
    setSosList(data.data);
    const pending = data.data.filter(
      (s) => s.status === 'pending' && !s.volunteerId,
    );
    setIncomingSos((current) => {
      if (current) return current; // jangan timpa modal yang sedang tampil
      if (pending.length > 0) return toSosData(pending[0]);
      return null;
    });
  }, [data]);

  // 2. Real-time: SOS baru masuk & SOS yang di-claim/selesai relawan lain
  useEffect(() => {
    const socket = getSocket();

    const handleNewSos = (sos) => {
      setSosList((prev) => [sos, ...prev]);
      setIncomingSos((current) => (current ? current : toSosData(sos)));
    };

    // Kalau SOS yang sedang tampil di-claim/diselesaikan relawan LAIN
    // → tutup modal (SOS sudah tidak menunggu lagi)
    const handleUpdateSos = (sos) => {
      setSosList((prev) =>
        prev.map((s) => (s._id === sos._id ? sos : s)),
      );
      if (sos.status === 'in_progress' || sos.status === 'resolved') {
        const claimedByMe = getVolunteerId(sos) === user?.id;
        if (!claimedByMe) {
          setIncomingSos((cur) => (cur?.id === sos._id ? null : cur));
        }
      }
    };

    // SOS dihapus → hapus dari daftar & tutup modal jika sedang tampil
    const handleDeleteSos = ({ id }) => {
      setSosList((prev) => prev.filter((s) => s._id !== id));
      setIncomingSos((cur) => (cur?.id === id ? null : cur));
    };

    socket.on('sos:new', handleNewSos);
    socket.on('sos:update', handleUpdateSos);
    socket.on('sos:delete', handleDeleteSos);
    return () => {
      socket.off('sos:new', handleNewSos);
      socket.off('sos:update', handleUpdateSos);
      socket.off('sos:delete', handleDeleteSos);
    };
  }, [user?.id]);

  // TERIMA → klaim SOS (status in_progress) → modal tutup,
  // item otomatis pindah ke lonceng "Sedang Ditangani"
  const handleAccept = async () => {
    if (!incomingSos) return;
    try {
      await updateSosStatus({ id: incomingSos.id, status: 'in_progress' }).unwrap();
      setIncomingSos(null);
    } catch (e) {
      alert(e?.data?.message || 'Gagal menerima SOS, coba lagi');
    }
  };

  // TOLAK → tutup modal saja. Status SOS tetap pending di DB,
  // jadi akan muncul lagi saat halaman di-refresh sampai ada
  // relawan lain yang menerimanya.
  const handleReject = () => {
    setIncomingSos(null);
  };

  // 🆕 TAMBAH BARU — cari SOS yang sedang ditangani relawan ini (untuk rute)
  const acceptedSos = sosList.find(
    (s) =>
      s.status === "in_progress" &&
      getVolunteerId(s) === user?.id &&
      s.latitude != null &&
      s.longitude != null,
  );

  return (
    <div className="flex h-screen bg-stone-100 text-stone-900 font-sans overflow-hidden">

      {/* 1. SIDEBAR */}
      <VolunteerSideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. AREA UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">

        {/* TOPBAR — z-50 agar dropdown profil tidak tertutup konten di bawah */}
        <div className="relative z-50">
          <VolunteerTopBar
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
        </div>

        {/* HALAMAN YANG DITUJU */}
        <main className="flex-1 relative z-0 overflow-hidden">
          {/* sosList diteruskan ke child (Volunteer.jsx) lewat context */}
          <Outlet context={{ sosList, volunteerCoords: effectiveVolunteerCoords, acceptedSos }} />

          {/* Modal Notifikasi SOS Masuk (pending) */}
          {incomingSos && isOnline && (
            <VolunteerSosModal
              sosData={incomingSos}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default VolunterLayouts;
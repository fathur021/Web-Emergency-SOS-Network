import { useState } from 'react';
import { Menu, Power, LogOut, Bell, Check, X, MapPin, ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { konfirmasiLogout } from '../utils/alert';
import {
  useGetAllSosQuery,
  useUpdateSosStatusMutation,
  useGetProfileQuery,
  useToggleMyStatusMutation,
} from '../redux/api/sos.Api';
import { getImageUrl } from '../config/api';

// volunteerId bisa berupa objek hasil populate { _id, nama } atau string/ObjectId
const getVolunteerId = (s) =>
  s?.volunteerId ? String(s.volunteerId._id ?? s.volunteerId) : null;

const VolunteerTopBar = ({ isOnline, setIsOnline, onOpenSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // State buka/tutup dropdown profil
  const [profilOpen, setProfilOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const { data: profileData } = useGetProfileQuery();
  const photo = profileData?.data?.photo;
  const { data } = useGetAllSosQuery();
  const [updateSosStatus] = useUpdateSosStatusMutation();
  const [toggleMyStatus] = useToggleMyStatusMutation();

  const allSos = data?.data || [];

  // SOS yang sedang ditangani relawan ini (sudah TERIMA, belum di-resolved)
  const myHandling = allSos.filter(
    (s) =>
      s.status === 'in_progress' &&
      getVolunteerId(s) === user?.id,
  );

  const totalNotif = myHandling.length;

  const runStatus = async (id, status) => {
    try {
      await updateSosStatus({ id, status }).unwrap();
    } catch (e) {
      alert(e?.data?.message || 'Gagal memperbarui status SOS');
    }
  };

  // TANDAI SELESAI → status resolved, hilang dari lonceng → masuk riwayat
  const handleResolve = (id) => runStatus(id, 'resolved');

  // BATALKAN → lepas tanggung jawab, SOS kembali pending
  const handleCancel = (id) => runStatus(id, 'pending');

  const handleToggleStatus = async () => {
    try {
      await toggleMyStatus().unwrap();
      setIsOnline(!isOnline);
    } catch (e) {
      alert(e?.data?.message || 'Gagal mengubah status');
    }
  };

  const handleLogout = async () => {
    const result = await konfirmasiLogout();
    if (!result.isConfirmed) return;
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-stone-200/80 bg-surface/70 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center gap-3">
        {/* Tombol Hamburger (Mobile Only) */}
        <button
          onClick={onOpenSidebar}
          className="p-2 bg-surface border border-stone-200 text-stone-600 rounded-xl md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold text-stone-600">
          Status Relawan: <strong className={isOnline ? "text-emerald-400" : "text-stone-400"}>
            {isOnline ? "Mode Siaga (Online)" : "Offline"}
          </strong>
        </span>
      </div>

      {/* Quick Action Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleStatus}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
            isOnline
              ? 'bg-blue-500/10 border-blue-500/40 text-blue-700'
              : 'bg-stone-200 border-stone-300 text-stone-500'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isOnline ? 'NONAKTIFKAN' : 'AKTIFKAN'}</span>
        </button>

        {/* Bel Notifikasi: hanya SOS yang sudah diterima belum di-resolved */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-stone-200 text-stone-600 rounded-xl shadow-neo-sm relative hover:bg-stone-300 transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {totalNotif > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {totalNotif}
              </span>
            )}
          </button>

          {isOpen && (
            <>
              {/* Overlay untuk menutup dropdown saat klik di luar */}
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

              <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-stone-200 rounded-2xl shadow-neo z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">Sedang Ditangani</p>
                  <span className="text-[10px] text-stone-500">{totalNotif} belum selesai</span>
                </div>

                <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                  {myHandling.length === 0 && (
                    <p className="text-[11px] text-stone-400 px-2 py-1">
                      Tidak ada SOS yang sedang ditangani.
                    </p>
                  )}
                  {myHandling.map((s) => (
                    <div key={s._id} className="bg-stone-200/70 border border-amber-400/40 rounded-xl p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-stone-800 line-clamp-2">
                          {s.description || 'Sinyal SOS Darurat'}
                        </p>
                        <span className="text-[10px] text-stone-400 font-mono shrink-0">
                          #{String(s._id).slice(-5)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        {s.latitude?.toFixed(4)}, {s.longitude?.toFixed(4)}
                      </p>
                      {/* FOTO SOS — tampilkan gambar yang di-upload pelapor.
                          Hanya dirender kalau field image ada (truthy). */}
                      {s.image && (
                        <img
                          src={getImageUrl(s.image)}
                          alt="Foto lokasi kejadian"
                          className="w-full h-28 object-cover rounded-lg border border-stone-300 mt-1"
                        />
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolve(s._id)}
                          className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> TANDAI SELESAI
                        </button>
                        <button
                          onClick={() => handleCancel(s._id)}
                          className="flex-1 py-1.5 bg-stone-300 hover:bg-stone-300 text-stone-800 rounded-lg shadow-neo-sm font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" /> BATALKAN
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-8 bg-stone-200 hidden sm:block" />

        {/* Dropdown Profil Relawan */}
        <div className="relative">
          <button
            onClick={() => setProfilOpen(!profilOpen)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-xl bg-surface border border-stone-200 shadow-neo-sm hover:bg-stone-100 transition cursor-pointer"
            title="Menu profil"
          >
            {/* Avatar: tampil foto kalau ada, kalau tidak pakai inisial */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 text-white text-xs font-extrabold uppercase flex items-center justify-center ring-2 ring-white shrink-0 overflow-hidden">
              {photo ? (
                <img src={getImageUrl(photo)} alt="Foto profil" className="w-full h-full object-cover" />
              ) : (
                user?.nama?.charAt(0) || 'V'
              )}
            </div>
            <div className="hidden lg:flex flex-col items-start leading-tight text-left">
              <p className="text-xs font-bold text-stone-900 max-w-[120px] truncate">{user?.nama}</p>
              <p className="text-[10px] font-semibold text-emerald-500 capitalize flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {user?.role}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${profilOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Panel dropdown */}
          {profilOpen && (
            <>
              {/* Overlay: klik di luar untuk menutup */}
              <div className="fixed inset-0 z-40" onClick={() => setProfilOpen(false)} />

              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-stone-200 rounded-2xl shadow-neo-lg z-50 overflow-hidden">
                {/* Header kecil dalam dropdown */}
                <div className="px-4 py-3 border-b border-stone-100">
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider">Masuk sebagai</p>
                  <p className="text-xs font-bold text-stone-900 truncate">{user?.nama}</p>
                  <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
                </div>

                {/* Menu Profile */}
                <button
                  onClick={() => { setProfilOpen(false); navigate('/volunteer/profil'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 hover:text-emerald-700 transition cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  Profil Saya
                </button>

                {/* Pemisah */}
                <div className="my-1 h-px bg-stone-100" />

                {/* Menu Logout */}
                <button
                  onClick={() => { setProfilOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default VolunteerTopBar;


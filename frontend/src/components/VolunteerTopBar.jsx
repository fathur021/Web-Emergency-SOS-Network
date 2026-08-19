import { useState } from 'react';
import { Menu, Power, LogOut, Bell, Check, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import {
  useGetAllSosQuery,
  useUpdateSosStatusMutation,
} from '../redux/api/sos.Api';

// volunteerId bisa berupa objek hasil populate { _id, nama } atau string/ObjectId
const getVolunteerId = (s) =>
  s?.volunteerId ? String(s.volunteerId._id ?? s.volunteerId) : null;

const VolunteerTopBar = ({ isOnline, setIsOnline, onOpenSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const { data } = useGetAllSosQuery();
  const [updateSosStatus] = useUpdateSosStatusMutation();

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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center gap-3">
        {/* Tombol Hamburger (Mobile Only) */}
        <button
          onClick={onOpenSidebar}
          className="p-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold text-slate-300">
          Status Relawan: <strong className={isOnline ? "text-emerald-400" : "text-slate-500"}>
            {isOnline ? "Mode Siaga (Online)" : "Offline"}
          </strong>
        </span>
      </div>

      {/* Quick Action Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
            isOnline
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isOnline ? 'NONAKTIFKAN' : 'AKTIFKAN'}</span>
        </button>

        {/* Info Relawan yang Login */}
        {user && (
          <div className="hidden md:flex flex-col items-end leading-tight">
            <p className="text-xs font-semibold text-slate-100">{user.nama}</p>
            <p className="text-[10px] text-emerald-400 capitalize">● {user.role} active</p>
          </div>
        )}

        {/* Bel Notifikasi: hanya SOS yang sudah diterima belum di-resolved */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-slate-800 text-slate-300 rounded-xl relative hover:bg-slate-700 transition cursor-pointer"
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

              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">Sedang Ditangani</p>
                  <span className="text-[10px] text-slate-400">{totalNotif} belum selesai</span>
                </div>

                <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                  {myHandling.length === 0 && (
                    <p className="text-[11px] text-slate-500 px-2 py-1">
                      Tidak ada SOS yang sedang ditangani.
                    </p>
                  )}
                  {myHandling.map((s) => (
                    <div key={s._id} className="bg-slate-800/60 border border-amber-500/30 rounded-xl p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                          {s.description || 'Sinyal SOS Darurat'}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          #{String(s._id).slice(-5)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        {s.latitude?.toFixed(4)}, {s.longitude?.toFixed(4)}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolve(s._id)}
                          className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> TANDAI SELESAI
                        </button>
                        <button
                          onClick={() => handleCancel(s._id)}
                          className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
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

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-red-400 rounded-xl font-semibold text-xs hover:bg-red-500/10 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};

export default VolunteerTopBar;
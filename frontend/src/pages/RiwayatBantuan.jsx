import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Search,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Siren,
  Check,
} from 'lucide-react';
import {
  useGetAllSosQuery,
  useUpdateSosStatusMutation,
} from '../redux/api/sos.Api';

// volunteerId bisa berupa objek hasil populate { _id, nama } atau string/ObjectId
const getVolunteerId = (s) =>
  s?.volunteerId ? String(s.volunteerId._id ?? s.volunteerId) : null;

const STATUS_META = {
  pending: {
    label: 'Menunggu',
    style: 'bg-red-500/20 text-red-400 border border-red-400/30',
    icon: <Siren className="w-3 h-3" />,
  },
  in_progress: {
    label: 'Dalam Proses',
    style: 'bg-amber-500/10 text-amber-400 border border-amber-400/40',
    icon: <Clock className="w-3 h-3" />,
  },
  resolved: {
    label: 'Selesai',
    style: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  rejected: {
    label: 'Ditolak',
    style: 'bg-red-500/20 text-red-400 border border-red-400/30',
    icon: <XCircle className="w-3 h-3" />,
  },
};

const RiwayatBantuan = () => {
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  const user = useSelector((state) => state.auth.user);
  const { data } = useGetAllSosQuery();
  const [updateSosStatus] = useUpdateSosStatusMutation();

  // Hanya SOS yang ditangani relawan yang login
  const history = (data?.data || []).filter(
    (s) => s.volunteerId && getVolunteerId(s) === user?.id,
  );

  const handleResolve = async (id) => {
    try {
      await updateSosStatus({ id, status: 'resolved' }).unwrap();
    } catch (e) {
      alert(e?.data?.message || 'Gagal menandai selesai, coba lagi');
    }
  };

  const filters = ['Semua', 'Selesai', 'Dalam Proses', 'Ditolak', 'Menunggu'];

  const filtered = history.filter((item) => {
    const label = STATUS_META[item.status]?.label;
    const matchStatus = filter === 'Semua' || label === filter;
    const matchSearch =
      (item.description || '').toLowerCase().includes(search.toLowerCase()) ||
      `${item.latitude}, ${item.longitude}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    total: history.length,
    selesai: history.filter((i) => i.status === 'resolved').length,
    proses: history.filter((i) => i.status === 'in_progress').length,
    ditolak: history.filter((i) => i.status === 'rejected').length,
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-stone-900">Riwayat Bantuan</h2>
          <p className="text-xs text-stone-500">Daftar bantuan SOS yang pernah Anda tangani.</p>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-surface border border-stone-200 rounded-xl shadow-neo-sm">
            <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Total</p>
            <p className="text-2xl font-bold text-stone-900">{counts.total}</p>
          </div>
          <div className="p-3.5 bg-surface border border-emerald-500/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Selesai</p>
            <p className="text-2xl font-bold text-emerald-400">{counts.selesai}</p>
          </div>
          <div className="p-3.5 bg-surface border border-amber-400/40 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Proses</p>
            <p className="text-2xl font-bold text-amber-400">{counts.proses}</p>
          </div>
          <div className="p-3.5 bg-surface border border-red-400/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-red-400 font-semibold">Ditolak</p>
            <p className="text-2xl font-bold text-red-400">{counts.ditolak}</p>
          </div>
        </div>

        {/* Filter & Pencarian */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari deskripsi atau lokasi..."
              className="w-full pl-9 pr-4 py-2.5 bg-surface border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 outline-none focus:border-blue-500/40 transition"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 cursor-pointer ${
                  filter === f
                    ? 'bg-blue-500/10 border-blue-500/40 text-blue-700'
                    : 'bg-surface border-stone-200 text-stone-500 shadow-neo-sm hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Daftar Riwayat */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 bg-surface/60 border border-stone-200 rounded-2xl shadow-neo-sm">
              <p className="text-sm text-stone-500 font-semibold">Tidak ada riwayat ditemukan</p>
              <p className="text-xs text-stone-400 mt-1">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          )}

          {filtered.map((item) => {
            const meta = STATUS_META[item.status] || STATUS_META.pending;
            return (
              <div
                key={item._id}
                className="p-4 bg-surface border border-stone-200 rounded-xl shadow-neo-sm space-y-2 hover:border-stone-300 transition group"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded uppercase shrink-0 ${meta.style}`}>
                      {meta.icon}
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">#{String(item._id).slice(-5)}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {item.createdAt || '-'}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-stone-900">
                      {item.description || 'Sinyal SOS Darurat'}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span>
                        {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
                      </span>
                    </p>
                  </div>
                  {item.status === 'in_progress' && (
                    <button
                      onClick={() => handleResolve(item._id)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      TANDAI SELESAI
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RiwayatBantuan;
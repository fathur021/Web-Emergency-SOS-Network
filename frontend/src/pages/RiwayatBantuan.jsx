import React, { useState } from 'react';
import {
  Search,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Siren,
  ChevronRight
} from 'lucide-react';

const RiwayatBantuan = () => {
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  const history = [
    {
      id: 104,
      title: 'Kebakaran Rumah',
      location: 'Jl. Melati No. 8',
      date: '08 Agu 2026',
      time: '14:30',
      status: 'Selesai',
      desc: 'Kebakaran rumah warga, dibantu evakuasi dan pemadaman awal.'
    },
    {
      id: 103,
      title: 'Kecelakaan Lalu Lintas',
      location: 'Jl. Jendral Sudirman No. 42',
      date: '07 Agu 2026',
      time: '09:15',
      status: 'Selesai',
      desc: 'Pengendara motor terjatuh, pertolongan pertama dilakukan.'
    },
    {
      id: 102,
      title: 'Pohon Tumbang',
      location: 'Jl. Ahmad Yani (Taman City)',
      date: '06 Agu 2026',
      time: '17:45',
      status: 'Dalam Proses',
      desc: 'Menutup akses jalan, sedang menunggu tim tambahan.'
    },
    {
      id: 101,
      title: 'Genangan Air / Banjir',
      location: 'Jl. Riau No. 12',
      date: '05 Agu 2026',
      time: '11:00',
      status: 'Ditolak',
      desc: 'Laporan ganda, ditangani relawan lain.'
    },
    {
      id: 100,
      title: 'Orang Hilang',
      location: 'Jl. Pemuda No. 3',
      date: '04 Agu 2026',
      time: '20:10',
      status: 'Selesai',
      desc: 'Warga lanjut usia ditemukan dalam kondisi sehat.'
    }
  ];

  const statusStyles = {
    Selesai: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    'Dalam Proses': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    Ditolak: 'bg-red-500/20 text-red-400 border border-red-500/30',
    Pending: 'bg-red-500 text-white'
  };

  const statusIcons = {
    Selesai: <CheckCircle2 className="w-3 h-3" />,
    'Dalam Proses': <Clock className="w-3 h-3" />,
    Ditolak: <XCircle className="w-3 h-3" />,
    Pending: <Siren className="w-3 h-3" />
  };

  const filters = ['Semua', 'Selesai', 'Dalam Proses', 'Ditolak'];

  const filtered = history.filter((item) => {
    const matchStatus = filter === 'Semua' || item.status === filter;
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    total: history.length,
    selesai: history.filter((i) => i.status === 'Selesai').length,
    proses: history.filter((i) => i.status === 'Dalam Proses').length,
    ditolak: history.filter((i) => i.status === 'Ditolak').length
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-slate-100">Riwayat Bantuan</h2>
          <p className="text-xs text-slate-400">Daftar bantuan SOS yang pernah Anda tangani.</p>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total</p>
            <p className="text-2xl font-bold text-slate-100">{counts.total}</p>
          </div>
          <div className="p-3.5 bg-slate-900 border border-emerald-500/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Selesai</p>
            <p className="text-2xl font-bold text-emerald-400">{counts.selesai}</p>
          </div>
          <div className="p-3.5 bg-slate-900 border border-amber-500/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Proses</p>
            <p className="text-2xl font-bold text-amber-400">{counts.proses}</p>
          </div>
          <div className="p-3.5 bg-slate-900 border border-red-500/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-red-400 font-semibold">Ditolak</p>
            <p className="text-2xl font-bold text-red-400">{counts.ditolak}</p>
          </div>
        </div>

        {/* Filter & Pencarian */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari jenis bantuan atau lokasi..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-emerald-500/50 transition"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 cursor-pointer ${
                  filter === f
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600'
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
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400 font-semibold">Tidak ada riwayat ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          )}

          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-600 transition group cursor-pointer"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded uppercase shrink-0 ${statusStyles[item.status]}`}>
                    {statusIcons[item.status]}
                    {item.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">#{item.id}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{item.date} · {item.time}</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-100">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{item.location}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">"{item.desc}"</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 mt-1 group-hover:text-emerald-400 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiwayatBantuan;

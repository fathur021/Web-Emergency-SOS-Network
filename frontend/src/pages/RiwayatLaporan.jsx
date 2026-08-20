import React, { useState } from 'react';
import {
  Search,
  MapPin,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  Siren,
  ChevronRight,
  Download
} from 'lucide-react';

const RiwayatLaporan = () => {
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  const reports = [
    {
      id: 204,
      title: 'Kebakaran Rumah',
      category: 'Kebakaran',
      location: 'Jl. Melati No. 8',
      reporter: 'Ahmad Fauzi',
      date: '08 Agu 2026',
      time: '14:30',
      status: 'Selesai',
      assignedTo: 'Budi Santoso',
      desc: 'Kebakaran rumah warga, dibantu evakuasi dan pemadaman awal.'
    },
    {
      id: 203,
      title: 'Kecelakaan Lalu Lintas',
      category: 'Kecelakaan',
      location: 'Jl. Jendral Sudirman No. 42',
      reporter: 'Dewi Lestari',
      date: '07 Agu 2026',
      time: '09:15',
      status: 'Selesai',
      assignedTo: 'Siti Rahma',
      desc: 'Pengendara motor terjatuh, pertolongan pertama dilakukan.'
    },
    {
      id: 202,
      title: 'Pohon Tumbang',
      category: 'Bencana Alam',
      location: 'Jl. Ahmad Yani (Taman City)',
      reporter: 'Rudi Hartono',
      date: '06 Agu 2026',
      time: '17:45',
      status: 'Dalam Proses',
      assignedTo: 'Budi Santoso',
      desc: 'Menutup akses jalan, sedang menunggu tim tambahan.'
    },
    {
      id: 201,
      title: 'Genangan Air / Banjir',
      category: 'Bencana Alam',
      location: 'Jl. Riau No. 12',
      reporter: 'Andi Wijaya',
      date: '05 Agu 2026',
      time: '11:00',
      status: 'Ditolak',
      assignedTo: '-',
      desc: 'Laporan ganda, ditangani relawan lain.'
    },
    {
      id: 200,
      title: 'Orang Hilang',
      category: 'Kemanusiaan',
      location: 'Jl. Pemuda No. 3',
      reporter: 'Siti Nurhaliza',
      date: '04 Agu 2026',
      time: '20:10',
      status: 'Selesai',
      assignedTo: 'Dewi Lestari',
      desc: 'Warga lanjut usia ditemukan dalam kondisi sehat.'
    }
  ];

  const statusStyles = {
    Selesai: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    'Dalam Proses': 'bg-amber-500/10 text-amber-400 border border-amber-400/40',
    Ditolak: 'bg-red-500/20 text-red-400 border border-red-400/30',
    Pending: 'bg-red-500 text-white'
  };

  const statusIcons = {
    Selesai: <CheckCircle2 className="w-3 h-3" />,
    'Dalam Proses': <Clock className="w-3 h-3" />,
    Ditolak: <XCircle className="w-3 h-3" />,
    Pending: <Siren className="w-3 h-3" />
  };

  const filters = ['Semua', 'Selesai', 'Dalam Proses', 'Ditolak'];

  const filtered = reports.filter((item) => {
    const matchStatus = filter === 'Semua' || item.status === filter;
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.reporter.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toString().includes(search);
    return matchStatus && matchSearch;
  });

  const counts = {
    total: reports.length,
    selesai: reports.filter((i) => i.status === 'Selesai').length,
    proses: reports.filter((i) => i.status === 'Dalam Proses').length,
    ditolak: reports.filter((i) => i.status === 'Ditolak').length
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Riwayat Laporan</h2>
            <p className="text-xs text-stone-500">
              Daftar laporan SOS yang masuk dari warga beserta status penanganannya.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition cursor-pointer">
            <Download className="w-4 h-4" />
            EKSPOR LAPORAN
          </button>
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
              placeholder="Cari judul, lokasi, pelapor, atau ID laporan..."
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

        {/* Daftar Laporan */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 bg-surface/60 border border-stone-200 rounded-2xl shadow-neo-sm">
              <p className="text-sm text-stone-500 font-semibold">Tidak ada laporan ditemukan</p>
              <p className="text-xs text-stone-400 mt-1">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          )}

          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-surface border border-stone-200 rounded-xl shadow-neo-sm space-y-2 hover:border-stone-300 transition group cursor-pointer"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded uppercase shrink-0 ${statusStyles[item.status]}`}>
                    {statusIcons[item.status]}
                    {item.status}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">#{item.id}</span>
                </div>
                <span className="text-[10px] text-stone-400 shrink-0">{item.date} · {item.time}</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-stone-900">{item.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-stone-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      {item.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      {item.reporter}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1.5 line-clamp-2">"{item.desc}"</p>
                  <p className="text-[10px] text-stone-400 mt-1.5">
                    Kategori: <span className="text-stone-500 font-semibold">{item.category}</span>
                    <span className="mx-1.5 text-stone-600">|</span>
                    Ditangani oleh: <span className="text-stone-500 font-semibold">{item.assignedTo}</span>
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500 shrink-0 mt-1 group-hover:text-blue-600 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiwayatLaporan;

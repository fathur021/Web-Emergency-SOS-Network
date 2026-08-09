import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  UserPlus,
  MapPin,
  Phone,
  Power,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';

const KelolaRelawan = () => {
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  const initialVolunteers = [
    {
      id: 'VOL-402',
      name: 'Budi Santoso',
      role: 'Pertolongan Pertama',
      status: 'Siaga',
      location: 'Jl. Jendral Sudirman',
      phone: '+62 812-3456-7890',
      tasks: 18,
      lastActive: 'Aktif sekarang'
    },
    {
      id: 'VOL-401',
      name: 'Siti Rahma',
      role: 'Evakuasi',
      status: 'Bertugas',
      location: 'Jl. Ahmad Yani',
      phone: '+62 813-9876-5432',
      tasks: 25,
      lastActive: 'Di lokasi kejadian'
    },
    {
      id: 'VOL-399',
      name: 'Andi Wijaya',
      role: 'Logistik',
      status: 'Offline',
      location: 'Jl. Pemuda No. 3',
      phone: '+62 811-2233-4455',
      tasks: 9,
      lastActive: '2 jam lalu'
    },
    {
      id: 'VOL-397',
      name: 'Dewi Lestari',
      role: 'Komunikasi',
      status: 'Siaga',
      location: 'Jl. Riau No. 12',
      phone: '+62 821-7788-9900',
      tasks: 12,
      lastActive: 'Aktif sekarang'
    },
    {
      id: 'VOL-395',
      name: 'Rudi Hartono',
      role: 'Pertolongan Pertama',
      status: 'Offline',
      location: 'Jl. Melati No. 8',
      phone: '+62 822-1122-3344',
      tasks: 6,
      lastActive: '1 hari lalu'
    }
  ];

  const [volunteers, setVolunteers] = useState(initialVolunteers);

  const statusStyles = {
    Siaga: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Bertugas: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    Offline: 'bg-slate-800 text-slate-400 border border-slate-700'
  };

  const statusIcons = {
    Siaga: <Power className="w-3 h-3" />,
    Bertugas: <Clock className="w-3 h-3" />,
    Offline: <Power className="w-3 h-3" />
  };

  const filters = ['Semua', 'Siaga', 'Bertugas', 'Offline'];

  const filtered = volunteers.filter((v) => {
    const matchStatus = filter === 'Semua' || v.status === filter;
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.role.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    total: volunteers.length,
    siaga: volunteers.filter((v) => v.status === 'Siaga').length,
    bertugas: volunteers.filter((v) => v.status === 'Bertugas').length,
    offline: volunteers.filter((v) => v.status === 'Offline').length
  };

  const toggleStatus = (id) => {
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: v.status === 'Offline' ? 'Siaga' : 'Offline' }
          : v
      )
    );
  };

  const removeVolunteer = (id) => {
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Kelola Relawan</h2>
            <p className="text-xs text-slate-400">
              Pantau status, aktivitas, dan keanggotaan relawan.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs transition cursor-pointer">
            <UserPlus className="w-4 h-4" />
            TAMBAH RELAWAN
          </button>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Relawan</p>
            <p className="text-2xl font-bold text-slate-100">{counts.total}</p>
          </div>
          <div className="p-3.5 bg-slate-900 border border-emerald-500/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Siaga</p>
            <p className="text-2xl font-bold text-emerald-400">{counts.siaga}</p>
          </div>
          <div className="p-3.5 bg-slate-900 border border-amber-500/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Bertugas</p>
            <p className="text-2xl font-bold text-amber-400">{counts.bertugas}</p>
          </div>
          <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Offline</p>
            <p className="text-2xl font-bold text-slate-300">{counts.offline}</p>
          </div>
        </div>

        {/* Pencarian & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, ID, atau peran relawan..."
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

        {/* Daftar Relawan */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400 font-semibold">Tidak ada relawan ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          )}

          {filtered.map((v) => (
            <div
              key={v.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                  {v.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-100">{v.name}</h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded uppercase ${statusStyles[v.status]}`}>
                      {statusIcons[v.status]}
                      {v.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
                    <span className="font-mono text-slate-500">#{v.id}</span>
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      {v.role}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {v.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {v.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {v.tasks} bantuan ditangani
                    </span>
                    <span>{v.lastActive}</span>
                  </div>
                </div>

                {/* Aksi */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleStatus(v.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                      v.status === 'Offline'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    {v.status === 'Offline' ? 'AKTIFKAN' : 'NONAKTIFKAN'}
                  </button>
                  <button
                    onClick={() => removeVolunteer(v.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                    title="Hapus relawan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KelolaRelawan;

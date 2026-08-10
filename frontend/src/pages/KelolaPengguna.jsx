import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  User,
  Phone,
  ShieldCheck,
  Power,
  Trash2,
  MoreVertical,
  Mail,
  Calendar
} from 'lucide-react';

const KelolaPengguna = () => {
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  const initialUsers = [
    {
      id: 'USR-104',
      name: 'Ahmad Fauzi',
      role: 'Warga',
      status: 'Aktif',
      email: 'ahmad.fauzi@gmail.com',
      phone: '+62 812-3456-7890',
      reports: 12,
      joined: '12 Feb 2026'
    },
    {
      id: 'USR-103',
      name: 'Dewi Lestari',
      role: 'Warga',
      status: 'Aktif',
      email: 'dewi.lestari@gmail.com',
      phone: '+62 813-9876-5432',
      reports: 7,
      joined: '20 Mar 2026'
    },
    {
      id: 'USR-102',
      name: 'Rudi Hartono',
      role: 'Relawan',
      status: 'Aktif',
      email: 'rudi.hartono@gmail.com',
      phone: '+62 811-2233-4455',
      reports: 25,
      joined: '05 Jan 2026'
    },
    {
      id: 'USR-101',
      name: 'Siti Nurhaliza',
      role: 'Warga',
      status: 'Nonaktif',
      email: 'siti.nurhaliza@gmail.com',
      phone: '+62 821-7788-9900',
      reports: 2,
      joined: '18 Apr 2026'
    },
    {
      id: 'USR-100',
      name: 'Andi Wijaya',
      role: 'Relawan',
      status: 'Aktif',
      email: 'andi.wijaya@gmail.com',
      phone: '+62 822-1122-3344',
      reports: 9,
      joined: '30 Des 2025'
    }
  ];

  const [users, setUsers] = useState(initialUsers);

  const roleStyles = {
    Warga: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    Relawan: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Admin: 'bg-red-500/20 text-red-400 border border-red-500/30'
  };

  const statusStyles = {
    Aktif: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Nonaktif: 'bg-slate-800 text-slate-400 border border-slate-700'
  };

  const filters = ['Semua', 'Warga', 'Relawan', 'Aktif', 'Nonaktif'];

  const filtered = users.filter((u) => {
    const matchFilter =
      filter === 'Semua' ||
      u.role === filter ||
      u.status === filter;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    total: users.length,
    warga: users.filter((u) => u.role === 'Warga').length,
    relawan: users.filter((u) => u.role === 'Relawan').length,
    nonaktif: users.filter((u) => u.status === 'Nonaktif').length
  };

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'Aktif' ? 'Nonaktif' : 'Aktif' }
          : u
      )
    );
  };

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Kelola Pengguna</h2>
            <p className="text-xs text-slate-400">
              Kelola akun pengguna, peran, dan status keanggotaan.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs transition cursor-pointer">
            <UserPlus className="w-4 h-4" />
            TAMBAH PENGGUNA
          </button>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Pengguna</p>
            <p className="text-2xl font-bold text-slate-100">{counts.total}</p>
          </div>
          <div className="p-3.5 bg-slate-900 border border-sky-500/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold">Warga</p>
            <p className="text-2xl font-bold text-sky-400">{counts.warga}</p>
          </div>
          <div className="p-3.5 bg-slate-900 border border-emerald-500/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Relawan</p>
            <p className="text-2xl font-bold text-emerald-400">{counts.relawan}</p>
          </div>
          <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Nonaktif</p>
            <p className="text-2xl font-bold text-slate-300">{counts.nonaktif}</p>
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
              placeholder="Cari nama, email, atau ID pengguna..."
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

        {/* Daftar Pengguna */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400 font-semibold">Tidak ada pengguna ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          )}

          {filtered.map((u) => (
            <div
              key={u.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-600/20 border border-sky-500/40 text-sky-400 font-bold flex items-center justify-center shrink-0">
                  {u.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-100">{u.name}</h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded uppercase ${roleStyles[u.role]}`}>
                      <ShieldCheck className="w-3 h-3" />
                      {u.role}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded uppercase ${statusStyles[u.status]}`}>
                      <Power className="w-3 h-3" />
                      {u.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
                    <span className="font-mono text-slate-500">#{u.id}</span>
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {u.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {u.phone}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      Bergabung {u.joined}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-500" />
                      {u.reports} laporan dibuat
                    </span>
                  </div>
                </div>

                {/* Aksi */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                      u.status === 'Nonaktif'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    {u.status === 'Nonaktif' ? 'AKTIFKAN' : 'NONAKTIFKAN'}
                  </button>
                  <button
                    onClick={() => removeUser(u.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                    title="Hapus pengguna"
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

export default KelolaPengguna;

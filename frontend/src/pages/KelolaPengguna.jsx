import { useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  User,
  MapPin,
  ShieldCheck,
  Power,
  Trash2,
  MoreVertical,
  Mail,
  Calendar,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useGetAllUsersQuery, useGetAllSosQuery, useUpdateUserStatusMutation,useDeleteUserMutation } from "../redux/api/sos.Api";

const roleLabel = { user: "Warga", volunteer: "Relawan", admin: "Admin" };

const formatTanggal = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const KelolaPengguna = () => {
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  //ambil data
  const { data: usersData, isLoading, isError, error } = useGetAllUsersQuery();
  const { data: sosData } = useGetAllSosQuery();

  const users = useMemo(() => {
    if (!usersData?.data) return [];
    const sosList = sosData?.data || [];

    return usersData.data.map((u) => ({
      id: u._id,
      name: u.nama,
      role: roleLabel[u.role] || u.role,
      status:
        u.role === "volunteer"
          ? u.isVolunteerActive
            ? "Aktif"
            : "Nonaktif"
          : "Aktif",
      email: u.email,
      locationName: u.locationName || "",
      joined: formatTanggal(u.createdAt),
      reports: sosList.filter(
        (s) => String(s.userId?._id || s.userId) === String(u._id),
      ).length,
    }));
  }, [usersData, sosData]);

  const roleStyles = {
    Warga: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
    Relawan: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    Admin: "bg-red-500/20 text-red-400 border border-red-400/30",
  };

  const statusStyles = {
    Aktif: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    Nonaktif: "bg-stone-200 text-stone-500 border border-stone-300",
  };

  const filters = ["Semua", "Warga", "Relawan", "Admin", "Aktif", "Nonaktif"];

  const filtered = users.filter((u) => {
    const matchFilter =
      filter === "Semua" || u.role === filter || u.status === filter;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    total: users.length,
    warga: users.filter((u) => u.role === "Warga").length,
    relawan: users.filter((u) => u.role === "Relawan").length,
    admin: users.filter((u) => u.role === "Admin").length,
  };

  const toggleStatus = async (u) => {
    try {
      await updateUserStatus({
        id: u.id,
        isVolunteerActive: u.status === 'Nonaktif',
      }).unwrap();
    } catch (error) {
      alert(error?.data?.message || "Gagal mengubah status relawan");
    }
  }
  const removeUser = async (u) => {
  if (!window.confirm(`Hapus pengguna "${u.name}"? Semua laporannya juga akan dihapus.`)) return;
  try {
    await deleteUser(u.id).unwrap();
  } catch (error) {
    alert(error?.data?.message || "Gagal menghapus pengguna");
  }
};

  // ===== State: loading =====
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-sm font-semibold">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  // ===== State: error =====
  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 bg-surface border border-red-400/30 rounded-2xl shadow-neo-sm text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-900">
            Gagal memuat data pengguna
          </p>
          <p className="text-xs text-stone-500 mt-1">
            {error?.data?.message || error?.error || "Terjadi kesalahan."}
            <br />
            Pastikan kamu login sebagai Admin dan backend berjalan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Kelola Pengguna
            </h2>
            <p className="text-xs text-stone-500">
              Kelola akun pengguna, peran, dan status keanggotaan.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition cursor-pointer">
            <UserPlus className="w-4 h-4" />
            TAMBAH PENGGUNA
          </button>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-surface border border-stone-200 rounded-xl shadow-neo-sm">
            <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
              Total Pengguna
            </p>
            <p className="text-2xl font-bold text-stone-900">{counts.total}</p>
          </div>
          <div className="p-3.5 bg-surface border border-sky-500/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold">
              Warga
            </p>
            <p className="text-2xl font-bold text-sky-400">{counts.warga}</p>
          </div>
          <div className="p-3.5 bg-surface border border-emerald-500/30 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
              Relawan
            </p>
            <p className="text-2xl font-bold text-emerald-400">
              {counts.relawan}
            </p>
          </div>
          <div className="p-3.5 bg-surface border border-red-500/20 rounded-xl">
            <p className="text-[10px] uppercase tracking-wider text-red-400 font-semibold">
              Admin
            </p>
            <p className="text-2xl font-bold text-red-400">{counts.admin}</p>
          </div>
        </div>

        {/* Pencarian & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, atau ID pengguna..."
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
                    ? "bg-blue-500/10 border-blue-500/40 text-blue-700"
                    : "bg-surface border-stone-200 text-stone-500 shadow-neo-sm hover:text-stone-900 hover:border-stone-300"
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
            <div className="text-center py-12 bg-surface/60 border border-stone-200 rounded-2xl shadow-neo-sm">
              <p className="text-sm text-stone-500 font-semibold">
                Tidak ada pengguna ditemukan
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Coba ubah filter atau kata kunci pencarian.
              </p>
            </div>
          )}

          {filtered.map((u) => (
            <div
              key={u.id}
              className="p-4 bg-surface border border-stone-200 rounded-xl shadow-neo-sm hover:border-stone-300 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold flex items-center justify-center shrink-0">
                  {u.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-sm text-stone-900">
                      {u.name}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded uppercase ${roleStyles[u.role]}`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      {u.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded uppercase ${statusStyles[u.status]}`}
                    >
                      <Power className="w-3 h-3" />
                      {u.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-stone-500">
                    <span className="font-mono text-stone-400">#{u.id}</span>
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3 h-3 text-stone-400" />
                      {u.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {u.locationName || "Lokasi belum diatur"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      Bergabung {u.joined}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-[10px] text-stone-400">
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3 h-3 text-blue-600" />
                      {u.reports} laporan dibuat
                    </span>
                  </div>
                </div>

                {/* Aksi */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                  {u.role === "Relawan" && (
  <button
    onClick={() => toggleStatus(u)}   // ← kirim objek u, bukan u.id
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
      u.status === "Nonaktif"
        ? "bg-blue-500/10 border-blue-500/40 text-blue-700 hover:bg-blue-500/20"
        : "bg-stone-200 border-stone-300 text-stone-500 hover:text-stone-900"
    }`}
  >
    <Power className="w-3 h-3" />
    {u.status === "Nonaktif" ? "AKTIFKAN" : "NONAKTIFKAN"}
  </button>
)}
                  <button
                    onClick={() => removeUser(u)}
                    className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                    title="Hapus pengguna"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-300 transition cursor-pointer">
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

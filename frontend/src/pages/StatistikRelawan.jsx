import {
  Trophy,
  FileText,
  Users,
  BarChart3,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useGetSosStatisticQuery } from "../redux/api/sos.Api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const StatistikRelawan = () => {
  const { data, isLoading, isError, error } = useGetSosStatisticQuery();

  // Data respons: { status, message, data: { ranking, summary, trend } }
  const ranking = data?.data?.ranking || [];
  const summary = data?.data?.summary || {};
  const podium = ranking.slice(0, 3);
  const tabel = ranking;
  const trend = data?.data?.trend || [];

  // Format label tanggal sumbu X: "2026-08-31" → "31 Agu"
  // Buat grafik lebih mudah dibaca dibanding "08-31" (bulan-tanggal membingungkan).
  const formatTanggalShort = (iso) => {
    const [, month, day] = (iso || "").split("-"); // ["2026","08","31"]
    const namaBulan = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
      "05": "Mei", "06": "Jun", "07": "Jul", "08": "Agu",
      "09": "Sep", "10": "Okt", "11": "Nov", "12": "Des",
    };
    return `${day} ${namaBulan[month] || month}`;
  };

  // State loading
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-sm font-semibold">Memuat statistik relawan...</p>
        </div>
      </div>
    );
  }

  // State error
  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 bg-surface border border-red-400/30 rounded-2xl shadow-neo-sm text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-900">Gagal memuat statistik</p>
          <p className="text-xs text-stone-500 mt-1">
            {error?.data?.message || error?.error || "Terjadi kesalahan."}
            <br />
            Pastikan kamu login sebagai Admin dan backend berjalan.
          </p>
        </div>
      </div>
    );
  }

  // Urutan podium di layar: juara 2 (kiri) → juara 1 (tengah) → juara 3 (kanan)
  const urutanPodium = [podium[1], podium[0], podium[2]].filter(Boolean);

  // Definisi medali berdasarkan posisi di urutanPodium (idx 0 = perak, 1 = emas, 2 = perunggu)
  const medali = [
    { label: "Juara 2", emoji: "🥈", bg: "bg-gray-300/20", ring: "border-gray-300", text: "text-gray-400", tinggi: "pt-2" },
    { label: "Juara 1", emoji: "🥇", bg: "bg-yellow-400/15", ring: "border-yellow-400", text: "text-yellow-500", tinggi: "pt-6" },
    { label: "Juara 3", emoji: "🥉", bg: "bg-orange-400/15", ring: "border-orange-400", text: "text-orange-500", tinggi: "pt-2" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-stone-900">Statistik Relawan</h2>
          <p className="text-xs text-stone-500">
            Rekapitulasi bantuan SOS (30 hari terakhir) & relawan terbaik.
          </p>
        </div>

        {/* Kartu Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-surface border border-emerald-500/30 rounded-2xl shadow-neo-sm">
            <div className="flex items-center gap-2 text-emerald-400">
              <Trophy className="w-4 h-4" />
              <p className="text-[10px] uppercase tracking-wider font-semibold">SOS Selesai</p>
            </div>
            <p className="text-3xl font-bold text-stone-900 mt-2">{summary.totalResolved ?? 0}</p>
          </div>
          <div className="p-4 bg-surface border border-stone-200 rounded-2xl shadow-neo-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <FileText className="w-4 h-4" />
              <p className="text-[10px] uppercase tracking-wider font-semibold">Total Laporan</p>
            </div>
            <p className="text-3xl font-bold text-stone-900 mt-2">{summary.totalLaporan ?? 0}</p>
          </div>
          <div className="p-4 bg-surface border border-stone-200 rounded-2xl shadow-neo-sm">
            <div className="flex items-center gap-2 text-stone-500">
              <Users className="w-4 h-4" />
              <p className="text-[10px] uppercase tracking-wider font-semibold">Relawan Aktif</p>
            </div>
            <p className="text-3xl font-bold text-stone-900 mt-2">{summary.totalVolunteer ?? 0}</p>
          </div>
        </div>

        {/* Grafik Tren SOS per Hari */}
        <div className="p-4 md:p-6 bg-surface border border-stone-200 rounded-2xl shadow-neo-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-stone-900">Tren SOS 7 Hari Terakhir</h3>
            </div>
            {trend.length > 0 && (
              <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-mono">
                {trend.length} hari
              </span>
            )}
          </div>

          {trend.length > 0 ? (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 5, right: 10, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#a8a29e" }}
                    tickFormatter={formatTanggalShort} // "2026-08-31" → "31 Agu"
                    tickLine={false}
                    axisLine={{ stroke: "#e7e5e4" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#a8a29e" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} SOS`, "Jumlah"]}
                    labelFormatter={formatTanggalShort}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e7e5e4",
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-stone-500 font-semibold text-center py-8">
              Belum ada data SOS dalam 7 hari terakhir
            </p>
          )}
        </div>

        {/* Podium 3 Terbaik */}
        {podium.length > 0 ? (
          <div className="p-4 md:p-6 bg-surface border border-stone-200 rounded-2xl shadow-neo-sm">
            <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" /> Relawan Terbaik
            </h3>

            <div className="grid grid-cols-3 gap-2 md:gap-4 items-end text-center">
              {urutanPodium.map((vol, idx) => {
                const m = medali[idx] || medali[1];
                return (
                  <div key={vol.volunteerId} className={`flex flex-col items-center ${m.tinggi}`}>
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${m.bg} ${m.ring} border-2 flex items-center justify-center text-2xl mb-2`}
                    >
                      {m.emoji}
                    </div>
                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${m.text}`}>
                      {m.label}
                    </p>
                    <p className="text-xs md:text-sm font-bold text-stone-900 truncate w-full">{vol.nama}</p>
                    <p className="text-[11px] text-stone-500">{vol.totalResolved} SOS selesai</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-surface border border-stone-200 rounded-2xl shadow-neo-sm text-center">
            <p className="text-sm text-stone-500 font-semibold">
              Belum ada relawan yang menyelesaikan SOS dalam 30 hari terakhir
            </p>
          </div>
        )}

        {/* Tabel Ranking Lengkap */}
        {tabel.length > 0 && (
          <div className="bg-surface border border-stone-200 rounded-2xl shadow-neo-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">Peringkat Relawan</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Peringkat</th>
                    <th className="px-4 py-2.5">Nama Relawan</th>
                    <th className="px-4 py-2.5 text-right">SOS Selesai</th>
                  </tr>
                </thead>
                <tbody>
                  {tabel.map((vol, i) => (
                    <tr key={vol.volunteerId} className={`border-t border-stone-100 ${i === 0 ? "bg-emerald-500/10" : ""}`}>
                      <td className="px-4 py-2.5 font-bold">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-stone-800">{vol.nama}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-stone-900">{vol.totalResolved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatistikRelawan;

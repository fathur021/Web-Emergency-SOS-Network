import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

// dayjs secara default HANYA tahu waktu lokal. Plugin utc + timezone
// inilah yang memberi kemampuan mengenali zona waktu dunia
dayjs.extend(utc);
dayjs.extend(timezone);
// Baca zona dari .env, default Asia/Jakarta (WIB).
// Dipanggil di dalam fungsi (lazy), mengikuti pola jwt.utils.ts.
function getTimeZone(): string {
  return process.env.TZ || "Asia/Jakarta";
}

// Waktu sekarang dalam string Indonesia, contoh: "15/08/2026 15:13:43"
export function nowWIB(): string {
  return dayjs().tz(getTimeZone()).format("DD/MM/YYYY HH:mm:ss");
}

// Ubah tanggal (UTC apa pun) jadi string WIB.
export function formatWIB(date: Date | string | number): string {
  return dayjs(date).tz(getTimeZone()).format("DD/MM/YYYY HH:mm:ss");
}

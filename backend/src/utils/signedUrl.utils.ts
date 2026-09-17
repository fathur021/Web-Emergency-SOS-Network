import crypto from "crypto";

function getSecret(): string {
  return (
    process.env.SIGNED_URL_SECRET || crypto.randomBytes(32).toString("hex")
  );
}
// Masa berlaku tiket: 24 jam. Setelah itu link mati.
const TTL_DETIK = 60 * 60 * 24;

// Membuat stempel: hash( path + waktu-kadaluarsa ) dengan kunci rahasia.
function buatStampel(imagePath: string, expiresAt: number): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`${imagePath}:${expiresAt}`)
    .digest("base64url");
}

// Ubah "/uploads/sos-123.jpg" menjadi:
//   "/uploads/sos-123.jpg?e=1789...&sig=AbCd..."
export function signImageUrl(imagePath: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + TTL_DETIK;
  const sig = buatStampel(imagePath, expiresAt);
  return `${imagePath}?e=${expiresAt}&sig=${sig}`;
}

export function verifyImageUrl(imagePath:string, e:string, sig:string, ) : boolean {
    const expiresAt = Number(e);
    if(Number.isNaN(expiresAt)) return false;
    if(expiresAt < Date.now() / 1000) return false;
    if(!sig) return false;

    const expected = Buffer.from(buatStampel(imagePath, expiresAt))
    const received = Buffer.from(sig);

  // Bandingkan dengan "timing safe" supaya penyerang tidak bisa
  // menebak rahasia lewat perbedaan waktu hitung.
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);

}


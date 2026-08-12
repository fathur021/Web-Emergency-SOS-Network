// Error khusus untuk kesalahan yang sudah bisa diprediksi API kita
// (contoh: email duplikat, password salah).
// Keunggulannya: membawa statusCode (400, 401, 409, dst)
// sehingga middleware errorHandler tahu harus mengirim status HTTP apa.

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message); // panggil konstruktor Error agar message & stack terisi
    this.name = "AppError";
    this.statusCode = statusCode; // 400 Bad Request, 401 Unauthorized, 409 Conflict

    // Perbaiki prototype chain. Penting agar `instanceof AppError`
    // bekerja dengan benar saat class mewarisi Error.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
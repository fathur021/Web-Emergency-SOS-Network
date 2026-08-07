import React, { useState } from 'react';
import { Siren, User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const Register = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    isVolunteer: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register Data:', formData);
    // Nanti akan dihubungkan ke Endpoint API POST /auth/register
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans text-slate-100 flex">
      
      {/* SISI KIRI: BRANDING & KATA-KATA MOTIVASI (Hidden di Mobile, Visible di MD ke Atas) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 border-r border-slate-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Dekorasi Background Glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo & Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500">
            <Siren className="w-6 h-6 animate-pulse" />
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-100">SOS NETWORK</span>
        </div>

        {/* Main Hero Words */}
        <div className="space-y-6 relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            <span>🚨 Rapid Response Community</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-100 leading-tight">
            Satu Sentuhan, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
              Menyelamatkan Nyawa.
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Bergabunglah dengan jaringan tanggap darurat berbasis komunitas. Kirim sinyal SOS instan saat butuh bantuan atau mendaftar sebagai relawan untuk menolong sesama di sekitar Anda.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4 border-t border-slate-800/80">
            <div>
              <p className="text-2xl font-bold text-slate-100">100%</p>
              <p className="text-xs text-slate-400">Real-time GPS Tracking</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">Siaga</p>
              <p className="text-xs text-slate-400">Jaringan Relawan Terdekat</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-xs text-slate-500 relative z-10">
          © {new Date().getFullYear()} Emergency SOS Network. Hak Cipta Dilindungi.
        </p>
      </div>

      {/* SISI KANAN: FORM REGISTER */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header Mobile / Title */}
          <div className="space-y-2">
            <div className="flex md:hidden items-center gap-2 mb-4">
              <Siren className="w-6 h-6 text-red-500" />
              <span className="font-bold text-base tracking-wider text-slate-100">SOS NETWORK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Buat Akun Baru</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Lengkapi data di bawah ini untuk memulai akses darurat.
            </p>
          </div>

          {/* Form Element */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* Opsi Checkbox: Daftar sebagai Relawan */}
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3">
              <input
                type="checkbox"
                id="isVolunteer"
                name="isVolunteer"
                checked={formData.isVolunteer}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-700 text-red-600 focus:ring-red-500/20 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="isVolunteer" className="text-xs text-slate-300 cursor-pointer select-none space-y-0.5">
                <span className="font-bold text-slate-100 block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Daftar sebagai Relawan Tanggap Darurat
                </span>
                <span className="text-slate-400 block text-[11px]">
                  Anda akan menerima notifikasi sinyal SOS saat berada di sekitar lokasi insiden[cite: 1].
                </span>
              </label>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition"
            >
              Daftar Sekarang <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Link ke Login */}
          <div className="text-center text-xs text-slate-400 pt-2">
            Sudah memiliki akun?{' '}
            <a href="/login" className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-4">
              Masuk di sini
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;
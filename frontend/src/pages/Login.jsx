import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Siren, Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { useLoginMutation } from '../redux/api/authApi';
import { setCredentials } from '../redux/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });

  // State untuk mengontrol status animasi sukses
  const [isSuccess, setIsSuccess] = useState(false);

  // Hook mutation login: mengembalikan [trigger, result]
  // login()   -> memanggil POST /api/auth/login
  // data      -> respons sukses dari backend
  // error     -> objek error jika request gagal
  // isLoading -> true selama request berjalan
  const [login, { data, error, isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kirim { email, password } ke POST /api/auth/login.
      // .unwrap() melempar error ke blok catch jika request gagal.
      const response = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // response = { status, message, data: { token, user } }
      // Simpan ke Redux + localStorage sekaligus lewat action setCredentials
      dispatch(setCredentials(response.data));

      // console.log('Login berhasil:', response);

      // Picu animasi keluar (split-screen terbelah)
      setIsSuccess(true);

      // Redirect sesuai role user (dari backend)
      const role = response.data.user.role;
      setTimeout(() => {
        if (role === 'admin') navigate('/admin');
        else if (role === 'volunteer') navigate('/volunteer');
        else navigate('/');
      }, 700);
    } catch (err) {
      // err.data.message berasal dari errorHandler backend:
      // { status: "error", message: "Email atau password salah" }
      console.error('Login gagal:', err?.data?.message);
      alert(err?.data?.message || 'Login gagal');
    }
  };

  return (
    /* overflow-hidden pada container utama mencegah munculnya scrollbar horizontal saat animasi berjalan */
    <div className="min-h-screen w-full bg-stone-100 font-sans text-stone-900 flex overflow-hidden">
      
      {/* SISI KIRI: BRANDING (Bergerak ke Kiri) */}
      <div 
        className={`hidden md:flex md:w-1/2 bg-surface border-r border-stone-200 p-12 flex-col justify-between relative overflow-hidden transition-all duration-700 ease-in-out z-10 ${
          isSuccess ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        {/* Dekorasi Background Glow */}
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo & Identity */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400">
            <Siren className="w-6 h-6 animate-pulse" />
          </div>
          <span className="font-bold text-lg tracking-wider text-stone-900">SOS NETWORK</span>
        </div>

        {/* Hero Words */}
        <div className="space-y-6 relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-400/30 text-red-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sistem Akses Tanggap Cepat</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold text-stone-900 leading-tight">
            Selamat Datang <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
              Kembali, Petugas & Warga.
            </span>
          </h1>
          
          <p className="text-stone-500 text-sm leading-relaxed max-w-md">
            Masuk ke akun Anda untuk mengirimkan sinyal darurat, memantau laporan lokasi secara real-time, atau merespons panggilan bantuan sebagai relawan.
          </p>

          <div className="p-4 rounded-xl bg-inset border border-stone-200 space-y-1">
            <p className="text-xs font-semibold text-stone-800">📌 Butuh Bantuan Darurat Instan?</p>
            <p className="text-[11px] text-stone-500">
              Sinyal SOS dapat langsung dikirimkan melalui halaman utama tanpa memerlukan penundaan koordinat.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-xs text-stone-400 relative z-10">
          © {new Date().getFullYear()} Emergency SOS Network. Hak Cipta Dilindungi.
        </p>
      </div>

      {/* SISI KANAN: FORM LOGIN (Bergerak ke Kanan) */}
      <div 
        className={`w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-stone-100 transition-all duration-700 ease-in-out z-10 ${
          isSuccess ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        <div className="w-full max-w-md space-y-8">
          
          {/* Title Header */}
          <div className="space-y-2">
            <div className="flex md:hidden items-center gap-2 mb-4">
              <Siren className="w-6 h-6 text-red-400" />
              <span className="font-bold text-base tracking-wider text-stone-900">SOS NETWORK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Masuk ke Akun</h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Masukkan kredensial Anda untuk melanjutkan ke dashboard.
            </p>
          </div>

          {/* Form Element */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-stone-600">Kata Sandi</label>
                <a href="#" className="text-[11px] text-red-400 hover:text-red-400">
                  Lupa sandi?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Tombol Submit Login */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : 'Masuk Sekarang'} <ArrowRight className="w-4 h-4" />
            </button>

            {/* Tampilkan pesan error dari backend (misal "Email atau password salah") */}
            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-400/30 rounded-xl p-3">
                {error?.data?.message || 'Terjadi kesalahan, coba lagi.'}
              </p>
            )}
          </form>

          {/* Link ke Register */}
          <div className="text-center text-xs text-stone-500 pt-2">
            Belum memiliki akun?{' '}
            <a href="/register" className="text-red-400 hover:text-red-400 font-semibold underline underline-offset-4">
              Daftar akun baru
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
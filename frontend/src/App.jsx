import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Volunteer from './pages/Volunteer.jsx'
import RiwayatBantuan from './pages/RiwayatBantuan.jsx'
import PengaturanRadius from './pages/PengaturanRadius.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import RiwayatLaporan from './pages/RiwayatLaporan.jsx'
import KelolaPengguna from './pages/KelolaPengguna.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import VolunterLayouts from './layouts/VolunterLayouts.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import StatistikRelawan from './pages/StatistikRelawan.jsx'
import Profile from './pages/Profile.jsx'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman publik: bisa diakses siapa saja */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Route profil: bisa diakses semua user yang sudah login (role apapun) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profil" element={<Profile />} />
        </Route>

        {/* Route relawan: wajib login dengan role volunteer */}
        <Route element={<ProtectedRoute allowedRoles={['volunteer']} />}>
          <Route path="/volunteer" element={<VolunterLayouts />}>
            <Route index element={<Volunteer />} />
            <Route path="riwayat" element={<RiwayatBantuan />} />
            <Route path="pengaturan-radius" element={<PengaturanRadius />} />
            <Route path="profil" element={<Profile />} />
          </Route>
        </Route>

        {/* Route admin: wajib login dengan role admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="pengguna" element={<KelolaPengguna />} />
            <Route path="riwayat-laporan" element={<RiwayatLaporan />} />
            <Route path="statistik-relawan" element={<StatistikRelawan />} />
            <Route path="profil" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Volunteer from './pages/Volunteer.jsx'
import RiwayatBantuan from './pages/RiwayatBantuan.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import KelolaRelawan from './pages/KelolaRelawan.jsx'
import RiwayatLaporan from './pages/RiwayatLaporan.jsx'
import KelolaPengguna from './pages/KelolaPengguna.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import VolunterLayouts from './layouts/VolunterLayouts.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/volunteer" element={<VolunterLayouts />}>
          <Route index element={<Volunteer />} />
          <Route path="riwayat" element={<RiwayatBantuan />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pengguna" element={<KelolaPengguna />} />
          <Route path="relawan" element={<KelolaRelawan />} />
          <Route path="riwayat-laporan" element={<RiwayatLaporan />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

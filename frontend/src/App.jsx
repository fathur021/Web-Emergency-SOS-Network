import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Volunteer from './pages/Volunteer.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
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
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

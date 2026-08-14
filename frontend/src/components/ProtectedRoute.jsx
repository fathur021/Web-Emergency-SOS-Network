
// ================================================================
// FILE: src/components/ProtectedRoute.jsx
// ================================================================
// "Middleware" frontend: melindungi halaman yang hanya boleh
// diakses user yang sudah login (atau dengan role tertentu).
// ================================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Props:
// - allowedRoles (opsional): array role yang diizinkan, contoh ["admin"]
//   Kalau diisi, user dengan role lain akan dilempar ke "/".
const ProtectedRoute = ({ allowedRoles }) => {
  // Ambil status login dari Redux store
  const { user } = useSelector((state) => state.auth);

  // 1. Belum login -> arahkan ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Sudah login tapi role tidak diizinkan -> arahkan ke halaman utama
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Aman -> render halaman anaknya (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;

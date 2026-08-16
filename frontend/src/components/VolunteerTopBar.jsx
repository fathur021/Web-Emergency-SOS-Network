import { Menu, Power, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const VolunteerTopBar = ({ isOnline, setIsOnline, onOpenSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center gap-3">
        {/* Tombol Hamburger (Mobile Only) */}
        <button 
          onClick={onOpenSidebar}
          className="p-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold text-slate-300">
          Status Relawan: <strong className={isOnline ? "text-emerald-400" : "text-slate-500"}>
            {isOnline ? "Mode Siaga (Online)" : "Offline"}
          </strong>
        </span>
      </div>

      {/* Quick Action Button */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
            isOnline 
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isOnline ? 'NONAKTIFKAN' : 'AKTIFKAN'}</span>
        </button>

        {/* Info Relawan yang Login */}
        {user && (
          <div className="hidden md:flex flex-col items-end leading-tight">
            <p className="text-xs font-semibold text-slate-100">{user.nama}</p>
            <p className="text-[10px] text-emerald-400 capitalize">● {user.role} active</p>
          </div>
        )}

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-red-400 rounded-xl font-semibold text-xs hover:bg-red-500/10 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};

export default VolunteerTopBar;
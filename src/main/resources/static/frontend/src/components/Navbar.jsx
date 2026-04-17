import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css'
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xl">
      {/* Brand Logo */}
      <Link 
        to="/dashboard" 
        className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white hover:text-blue-400 transition-colors"
      >
        <span className="text-3xl">🏦</span>
        <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          SecureBank
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        {user ? (
          <>
            <div className="hidden md:block">
              <span className="text-slate-400 text-sm italic">Welcome back,</span>
              <span className="ml-1 font-semibold text-blue-300 capitalize">{user.username}</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-slate-200 hover:text-white font-medium transition-all hover:-translate-y-0.5">
                Dashboard
              </Link>
              <Link to="/transfer" className="text-slate-200 hover:text-white font-medium transition-all hover:-translate-y-0.5">
                Transfer
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-red-900/20 transition-all active:scale-95"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-200 hover:text-white font-medium px-4 py-2">
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/30"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
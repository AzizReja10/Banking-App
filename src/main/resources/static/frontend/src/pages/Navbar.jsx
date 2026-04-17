import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import React from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <span className="text-2xl">🏦</span>
              <span className="font-bold text-xl tracking-tight group-hover:text-blue-400 transition-colors">
                SecureBank
              </span>
            </Link>
          </div>

          {/* Links Section */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="hidden md:block">
                  <span className="text-slate-400 text-sm">Welcome back,</span>
                  <span className="ml-1 font-medium text-blue-300">{user.username}</span>
                </div>
                
                <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
                  <Link to="/dashboard" className="hover:text-blue-400 transition-colors font-medium">
                    Dashboard
                  </Link>
                  <Link to="/transfer" className="hover:text-blue-400 transition-colors font-medium">
                    Transfer
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-md shadow-red-900/20"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors ">
                  Login
                </Link>
                <Link to="/Register" className="text-slate-300 hover:text-white transition-colors pr-3">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
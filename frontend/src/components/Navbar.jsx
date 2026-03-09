import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Database, LayoutDashboard, UserCircle, LogOut, Menu } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShieldCheck className="w-8 h-8 text-primary-500" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              Block<span className="text-primary-500">Vote</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explorer" className="flex items-center space-x-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <Database className="w-4 h-4" />
              <span>Explorer</span>
            </Link>
            <Link to="/tech" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Technology
            </Link>

            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-1 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center space-x-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  <UserCircle className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
             <button className="text-slate-300 hover:text-white">
                <Menu className="w-6 h-6" />
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User } from 'lucide-react';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🎬</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:inline">Absolute Cinema!</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
              {isAuthenticated && user?.role === 'customer' && (
                <Link to="/account" className="text-gray-300 hover:text-white transition">
                  My Tickets
                </Link>
              )}
              {isAuthenticated && (user?.role === 'employee' || user?.role === 'admin') && (
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>
              )}
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-4">
                  <span className="text-gray-300 text-sm">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-400 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition px-3 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800 py-4 space-y-3">
              <Link
                to="/"
                className="block text-gray-300 hover:text-white transition px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {isAuthenticated && user?.role === 'customer' && (
                <Link
                  to="/account"
                  className="block text-gray-300 hover:text-white transition px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Tickets
                </Link>
              )}
              {isAuthenticated && (user?.role === 'employee' || user?.role === 'admin') && (
                <Link
                  to="/dashboard"
                  className="block text-gray-300 hover:text-white transition px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-500 hover:text-red-400 transition px-4 py-2"
                >
                  Logout
                </button>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-300 hover:text-white transition px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-gray-300 hover:text-white transition px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <Outlet />
    </>
  );
}

export default Navbar;

import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Sold Tickets', path: '/dashboard/sold-tickets' },
    { label: 'Movie Records', path: '/dashboard/movie-records' },
    { label: 'Statistics', path: '/dashboard/statistics' },
    ...(user?.role === 'admin' ? [{ label: 'Movie Studio', path: '/dashboard/movie-studio' }] : []),
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-40 md:hidden text-white p-2 bg-gray-800 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } md:w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto transition-all duration-300 fixed md:relative h-full md:h-auto md:translate-x-0 z-30`}
      >
        <div className="p-6">
          <h2 className="text-white font-bold text-xl mb-8">Dashboard</h2>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pt-20 md:pt-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default DashboardLayout;

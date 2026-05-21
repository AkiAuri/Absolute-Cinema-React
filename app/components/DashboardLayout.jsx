import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Film, Ticket, BarChart3, CalendarPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function DashboardLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Sold Tickets', path: '/dashboard/sold-tickets', icon: Ticket },
        { label: 'Movie Records', path: '/dashboard/movie-records', icon: Film },
        { label: 'Statistics', path: '/dashboard/statistics', icon: BarChart3 },
        ...(user?.role === 'admin'
            ? [
                { label: 'Movie Studio', path: '/dashboard/movie-studio', icon: Film },
                { label: 'Manage Schedules', path: '/dashboard/schedules', icon: CalendarPlus }
            ]
            : []),
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
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 w-64 bg-gray-800 border-r border-gray-700 transition-all duration-300 fixed md:relative h-full z-30`}
            >
                <div className="p-6">
                    <h2 className="text-white font-bold text-xl mb-8">Dashboard</h2>

                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                        isActive(item.path)
                                            ? 'bg-amber-600 text-white font-bold'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
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
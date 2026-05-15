import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { MovieProvider } from './context/MovieContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

// Customer pages
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import Account from './pages/Account';

// Dashboard pages
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import SoldTickets from './pages/SoldTickets';
import MovieRecords from './pages/MovieRecords';
import Statistics from './pages/Statistics';
import MovieStudio from './pages/MovieStudio';

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <MovieProvider>
            <Routes>
            {/* Auth routes - no navbar */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Customer routes with navbar */}
            <Route element={<Navbar />}>
              <Route path="/" element={<Home />} />
              <Route path="/schedule/:movieId" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
              <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
              <Route path="/success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

              {/* Dashboard routes */}
              <Route path="/dashboard" element={<ProtectedRoute roles={['employee', 'admin']}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="sold-tickets" element={<SoldTickets />} />
                <Route path="movie-records" element={<MovieRecords />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="movie-studio" element={<ProtectedRoute roles={['admin']}><MovieStudio /></ProtectedRoute>} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MovieProvider>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRouter;

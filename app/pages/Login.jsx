import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the updated secure login function with individual strings
      await login(email, password);
      // Send them to the dashboard (or home) on success
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">🎬</span>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">CineBook</h1>
            <p className="text-gray-400">Book your cinema tickets</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 dark:bg-gray-900">
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
            )}

            <div className="mb-5">
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
                  required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
                  required
              />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="mt-4 text-center">
              <Link to="/forgot-password" className="text-amber-600 hover:text-amber-500 text-sm transition">
                Forgot password?
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-amber-600 hover:text-amber-500 transition font-bold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}

export default Login;
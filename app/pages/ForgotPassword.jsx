import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
    }, 500);
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
          <p className="text-gray-400">Reset your password</p>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-8 dark:bg-gray-900">
          {!submitted ? (
            <>
              <p className="text-gray-400 text-sm mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 text-2xl">✓</span>
              </div>
              <h2 className="text-white text-xl font-bold mb-2">Check Your Email</h2>
              <p className="text-gray-400 mb-6">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Don't see it? Check your spam folder or try again.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-amber-600 hover:text-amber-500 transition font-bold">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

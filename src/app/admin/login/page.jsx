'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Authentication failed');
      }
      
      const data = await response.json();
      
      // Store the token in localStorage
      localStorage.setItem('authToken', data.token);
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:shadow-2xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.jpg"
            alt="ShahBazar Logo"
            width={100}
            height={100}
            className="object-contain rounded-full sm:w-28 sm:h-28"
            priority
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-800 mb-2">
          ShahBazar Admin Portal
        </h2>
        <p className="text-center text-emerald-600 mb-6 sm:mb-8 text-sm sm:text-base">
          Welcome to the Admin Dashboard
        </p>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-emerald-700 mb-1 sm:mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full px-4 py-2.5 sm:py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors bg-emerald-50/50 text-gray-800 placeholder-emerald-400 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-emerald-700 mb-1 sm:mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-4 py-2.5 sm:py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors bg-emerald-50/50 text-gray-800 placeholder-emerald-400 text-sm sm:text-base"
            />
          </div>
          {error && (
            <p className="text-rose-500 text-xs sm:text-sm text-center bg-rose-50 py-2 rounded-lg">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-colors font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-emerald-600 text-xs sm:text-sm">
          ShahBazar Admin Dashboard © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
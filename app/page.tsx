// REGISTER PAGE
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = 'https://service-testnet.maschain.com';
const CLIENT_ID = 'ed52d2c279e03d238660490f9d90125df150cecd632c246d15800d5e6f9898e1';
const CLIENT_SECRET = 'sk_add3fbb2b5b89d5cfc6a03f112a494d31481685a1c5a7b81201de2b8196ddc7e';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ic, setIc] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem('is_logged_in');
        const userData = localStorage.getItem('devspace_user');
        
        if (isLoggedIn === 'true' && userData) {
          const user = JSON.parse(userData);
          if (user.email && user.wallet) {
            console.log('✅ User already logged in, redirecting to main app...');
            router.push('/blog');
            return;
          }
        }
        
        // If not logged in, stop loading and show register form
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [router]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const requestBody = {
      name,
      email,
      ic,
      phone,
      wallet_name: `${name}'s wallet`
    };

    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/api/wallet/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client_id': CLIENT_ID,
          'client_secret': CLIENT_SECRET
        },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();

      if (res.ok && data.result?.wallet?.wallet_address) {
        // Save user data
        const userData = {
          name: data.result.user.name,
          email: data.result.user.email,
          wallet: data.result.wallet.wallet_address,
          password: password
        };
        
        localStorage.setItem('devspace_user', JSON.stringify(userData));
        
        // Automatically log the user in
        localStorage.setItem('is_logged_in', 'true');
        
        console.log('✅ Registration successful! Auto-logging in...');
        
        // Redirect to blog page (main app)
        router.push('/blog');
      } else {
        throw new Error('Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center w-full h-[100vh] px-6 py-12">
        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-2xl shadow-xl w-full max-w-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full h-[100vh] px-6 py-12">
      <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-2xl shadow-xl w-full max-w-xl">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent text-center mb-6">
          Register New User with Wallet
        </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-black bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out hover:shadow-orange-500/50"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
              ) : (
                'Register'
              )}
            </button>
            <div className="mt-6 text-center text-gray-400 text-sm">
              Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-orange-400 hover:text-orange-500 underline font-medium transition-colors"
                >
                  Log in
                </button>
              </div> 

          </form>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
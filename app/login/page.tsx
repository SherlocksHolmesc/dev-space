'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem('is_logged_in')
        const userData = localStorage.getItem('devspace_user')
        
        if (isLoggedIn === 'true' && userData) {
          const user = JSON.parse(userData)
          if (user.email && user.wallet) {
            console.log('✅ User already logged in, redirecting...')
            router.push('/blog')
            return
          }
        }
        
        setLoading(false)
        setIsCheckingAuth(false)
      } catch (error) {
        console.error('Error checking authentication:', error)
        setLoading(false)
        setIsCheckingAuth(false)
      }
    }

    checkExistingAuth()
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const stored = localStorage.getItem('devspace_user')
    if (!stored) {
      setError('No registered user found.')
      setLoading(false)
      return
    }

    const user = JSON.parse(stored)

    if (user.email === email && user.password === password) {
      localStorage.setItem('is_logged_in', 'true')
      router.push('/blog')
    } else {
      setError('Invalid credentials.')
    }

    setLoading(false)
  }

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center w-full h-[100vh] px-6 py-12">
        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-2xl shadow-xl w-full max-w-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center w-full h-[100vh] px-6 py-12">
      <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-2xl shadow-xl w-full max-w-xl">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent text-center mb-6">
          Login to DevSpace
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-black bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out hover:shadow-orange-500/50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-800/30 text-red-300 border border-red-700">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage
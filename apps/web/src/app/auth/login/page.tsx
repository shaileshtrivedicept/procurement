'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/dashboard/vendors');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="mb-6 text-2xl font-bold text-center text-blue-800">Procurement ERP Login</h2>
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@erp.com"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            id="login-button"
            disabled={submitting}
            className={`w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100 text-xs text-blue-700">
          <p className="font-bold mb-1">Demo Credentials:</p>
          <p>Email: admin@erp.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}

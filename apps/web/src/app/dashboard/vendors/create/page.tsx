'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

export default function CreateVendorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/vendors', formData);
      router.push('/dashboard/vendors');
    } catch (err: any) {
      console.error('Failed to create vendor:', err);
      setError(err.response?.data?.message || 'Failed to create vendor. Ensure you are logged in as admin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New Vendor</h1>
      {error && <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 border-gray-300"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 border-gray-300"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 border-gray-300"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 border-gray-300"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax ID</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 border-gray-300"
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
          />
        </div>
        <div className="pt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Saving...' : 'Create Vendor'}
          </button>
        </div>
      </form>
    </div>
  );
}

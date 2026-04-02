'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Vendor {
  id: string;
  vendorCode: string;
  name: string;
  category: string;
  status: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get('/vendors');
        setVendors(response.data);
      } catch (err) {
        console.error('Failed to fetch vendors:', err);
        setError('Failed to load vendors. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading vendors...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendor Management</h1>
        <Link
          href="/dashboard/vendors/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add New Vendor
        </Link>
      </div>

      {error && <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No vendors found.</td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.vendorCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/vendors/${vendor.id}`} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

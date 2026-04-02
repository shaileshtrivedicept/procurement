'use client';

import Link from 'next/link';
import { useState } from 'react';

const mockPRs = [
  { id: '1', prNumber: 'PR-2024-00001', description: 'Office Supplies Q2', totalAmount: 15000, status: 'DRAFT', priority: 'MEDIUM', requester: 'John Doe' },
  { id: '2', prNumber: 'PR-2024-00002', description: 'Server Upgrade', totalAmount: 750000, status: 'PENDING_APPROVAL', priority: 'HIGH', requester: 'Jane Smith' },
];

export default function PRsPage() {
  const [prs] = useState(mockPRs);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchase Requisitions</h1>
        <Link
          href="/dashboard/purchase-requisitions/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Create New PR
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PR Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prs.map((pr) => (
              <tr key={pr.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pr.prNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pr.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pr.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    pr.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    pr.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pr.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pr.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/dashboard/purchase-requisitions/${pr.id}`} className="text-blue-600 hover:text-blue-900">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

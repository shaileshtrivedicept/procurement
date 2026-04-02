'use client';

import { useState } from 'react';

const mockApprovals = [
  { id: '1', prNumber: 'PR-2024-00002', description: 'Server Upgrade', amount: 750000, requester: 'Jane Smith', department: 'IT', step: 2, createdAt: '2024-04-01' },
];

export default function ApprovalInboxPage() {
  const [approvals, setApprovals] = useState(mockApprovals);

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    // In a real app, this would call the API
    console.log(`${action}ed approval:`, id);
    setApprovals(approvals.filter((a) => a.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Approval Inbox</h1>

      {approvals.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Your inbox is empty. No pending approvals found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-blue-600">{approval.prNumber}</span>
                  <span className="text-xs text-gray-400">Created: {approval.createdAt}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{approval.description}</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Requester</p>
                    <p className="text-sm font-medium text-gray-700">{approval.requester} ({approval.department})</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Total Amount</p>
                    <p className="text-sm font-bold text-gray-900">₹{approval.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 md:border-l md:pl-6 border-gray-100">
                <button
                  onClick={() => handleAction(approval.id, 'REJECT')}
                  className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(approval.id, 'APPROVE')}
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition-colors font-medium"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

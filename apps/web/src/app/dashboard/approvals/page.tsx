'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Approval {
  id: string;
  prNumber: string;
  description: string;
  amount: number;
  requesterName: string;
  departmentName: string;
  createdAt: string;
}

export default function ApprovalInboxPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const response = await api.get('/approvals/inbox');
      // Map backend structure if needed
      setApprovals(response.data.map((a: any) => ({
        id: a.id,
        prNumber: a.purchaseRequisition?.prNumber || 'PR-N/A',
        description: a.purchaseRequisition?.description || 'No Description',
        amount: a.purchaseRequisition?.totalAmount || 0,
        requesterName: a.purchaseRequisition?.requester?.name || 'Unknown',
        departmentName: a.purchaseRequisition?.department?.name || 'N/A',
        createdAt: new Date(a.createdAt).toLocaleDateString()
      })));
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
      setError('Failed to load approval inbox.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.post(`/approvals/${id}/action`, { status });
      setApprovals(approvals.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to action approval:', err);
      alert('Failed to process approval action.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading inbox...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Approval Inbox</h1>

      {error && <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

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
                    <p className="text-sm font-medium text-gray-700">{approval.requesterName} ({approval.departmentName})</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Total Amount</p>
                    <p className="text-sm font-bold text-gray-900">₹{approval.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 md:border-l md:pl-6 border-gray-100">
                <button
                  onClick={() => handleAction(approval.id, 'REJECTED')}
                  className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(approval.id, 'APPROVED')}
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

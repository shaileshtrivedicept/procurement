'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

export default function CreatePRPage() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/purchase-requisitions', {
        description,
        priority,
        items
      });
      router.push('/dashboard/purchase-requisitions');
    } catch (err: any) {
      console.error('Failed to create PR:', err);
      setError(err.response?.data?.message || 'Failed to create Purchase Requisition.');
    } finally {
      setSubmitting(false);
    }
  };

  const total = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Purchase Requisition</h1>
      {error && <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 border-gray-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 border-gray-300"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              + Add Item
            </button>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-end border-b pb-4 border-gray-100">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Item Description</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 border rounded text-gray-800 border-gray-300"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs text-gray-500 mb-1">Qty</label>
                  <input
                    type="number"
                    className="w-full px-3 py-1.5 border rounded text-gray-800 border-gray-300"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs text-gray-500 mb-1">Unit Price</label>
                  <input
                    type="number"
                    className="w-full px-3 py-1.5 border rounded text-gray-800 border-gray-300"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="w-32 text-right">
                  <label className="block text-xs text-gray-500 mb-1">Subtotal</label>
                  <div className="py-1.5 font-medium text-gray-800">₹{(item.quantity * item.unitPrice).toLocaleString()}</div>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 mb-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-xl font-bold text-gray-800">
            Total: ₹{total.toLocaleString()}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Submitting...' : 'Submit PR'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

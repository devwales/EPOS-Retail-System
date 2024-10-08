import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Sale } from '../../types';
import { X } from 'lucide-react';

const SalesPage: React.FC = () => {
  const { sales, refundSale } = useAppContext();
  const [refundingSale, setRefundingSale] = useState<Sale | null>(null);
  const [refundReason, setRefundReason] = useState('');

  const handleRefund = () => {
    if (refundingSale && refundReason) {
      refundSale(refundingSale.id, refundReason);
      setRefundingSale(null);
      setRefundReason('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sales</h2>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Recent Sales</h3>
        {sales.length === 0 ? (
          <p>No sales recorded yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Transaction ID</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Payment Method</th>
                <th className="p-2 text-left">Items</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale: Sale) => (
                <tr key={sale.id} className={`border-b ${sale.refunded ? 'bg-red-100' : ''}`}>
                  <td className="p-2">{sale.transactionId}</td>
                  <td className="p-2">{sale.date.toLocaleString()}</td>
                  <td className="p-2">${sale.total.toFixed(2)}</td>
                  <td className="p-2">{sale.paymentMethod}</td>
                  <td className="p-2">
                    <ul>
                      {sale.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2">
                    {sale.refunded ? (
                      <span className="text-red-600">Refunded: {sale.refundReason}</span>
                    ) : (
                      <button
                        onClick={() => setRefundingSale(sale)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {refundingSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Refund Sale</h2>
              <button onClick={() => setRefundingSale(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <p className="mb-4">Transaction ID: {refundingSale.transactionId}</p>
            <p className="mb-4">Total Amount: ${refundingSale.total.toFixed(2)}</p>
            <textarea
              placeholder="Enter refund reason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={3}
            />
            <button
              onClick={handleRefund}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full"
            >
              Confirm Refund
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
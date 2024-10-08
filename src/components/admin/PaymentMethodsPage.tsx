import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { PaymentMethod } from '../../types';

const PaymentMethodsPage: React.FC = () => {
  const {
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    updatePaymentMethod
  } = useAppContext();

  const [newPaymentMethod, setNewPaymentMethod] = useState({ name: '' });

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.name) {
      addPaymentMethod({ ...newPaymentMethod, id: Date.now().toString(), enabled: true });
      setNewPaymentMethod({ name: '' });
    }
  };

  const handleTogglePaymentMethod = (method: PaymentMethod) => {
    updatePaymentMethod({ ...method, enabled: !method.enabled });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Add New Payment Method</h3>
        <input
          type="text"
          placeholder="Payment Method Name"
          value={newPaymentMethod.name}
          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button onClick={handleAddPaymentMethod} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full">
          Add Payment Method
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Payment Method List</h3>
        {paymentMethods.map((method: PaymentMethod) => (
          <div key={method.id} className="flex justify-between items-center mb-2 p-2 hover:bg-gray-100 rounded">
            <span>{method.name}</span>
            <div>
              <button
                onClick={() => handleTogglePaymentMethod(method)}
                className="mr-2 text-blue-500 hover:text-blue-700"
              >
                {method.enabled ? (
                  <ToggleRight size={24} />
                ) : (
                  <ToggleLeft size={24} />
                )}
              </button>
              {method.name.toLowerCase() !== 'cash' && (
                <button onClick={() => removePaymentMethod(method.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
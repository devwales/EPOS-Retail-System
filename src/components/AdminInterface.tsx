import React, { useState } from 'react';
import { Layers, ShoppingBag, DollarSign, Settings, CreditCard } from 'lucide-react';
import ProductsPage from './admin/ProductsPage';
import CategoriesPage from './admin/CategoriesPage';
import SalesPage from './admin/SalesPage';
import SettingsPage from './admin/SettingsPage';
import PaymentMethodsPage from './admin/PaymentMethodsPage';

const AdminInterface: React.FC = () => {
  const [activePage, setActivePage] = useState('products');

  const renderPage = () => {
    switch (activePage) {
      case 'products':
        return <ProductsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'sales':
        return <SalesPage />;
      case 'paymentMethods':
        return <PaymentMethodsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ProductsPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <ul className="mt-4">
          <li>
            <button
              onClick={() => setActivePage('products')}
              className={`flex items-center w-full text-left px-4 py-2 ${
                activePage === 'products' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ShoppingBag className="mr-2" size={20} />
              Products
            </button>
          </li>
          <li>
            <button
              onClick={() => setActivePage('categories')}
              className={`flex items-center w-full text-left px-4 py-2 ${
                activePage === 'categories' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Layers className="mr-2" size={20} />
              Categories
            </button>
          </li>
          <li>
            <button
              onClick={() => setActivePage('sales')}
              className={`flex items-center w-full text-left px-4 py-2 ${
                activePage === 'sales' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <DollarSign className="mr-2" size={20} />
              Sales
            </button>
          </li>
          <li>
            <button
              onClick={() => setActivePage('paymentMethods')}
              className={`flex items-center w-full text-left px-4 py-2 ${
                activePage === 'paymentMethods' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CreditCard className="mr-2" size={20} />
              Payment Methods
            </button>
          </li>
          <li>
            <button
              onClick={() => setActivePage('settings')}
              className={`flex items-center w-full text-left px-4 py-2 ${
                activePage === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings className="mr-2" size={20} />
              Settings
            </button>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default AdminInterface;
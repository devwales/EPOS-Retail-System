import React, { useState } from 'react';
import CashierInterface from './CashierInterface';
import AdminInterface from './AdminInterface';
import { ShoppingCart, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const MainApp: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { siteName } = useAppContext();

  const handleAdminToggle = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{siteName}</h1>
          <button
            onClick={handleAdminToggle}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 flex items-center"
          >
            {isAdmin ? (
              <>
                <ShoppingCart size={18} className="mr-2" />
                Switch to Cashier
              </>
            ) : (
              <>
                <Settings size={18} className="mr-2" />
                Switch to Admin
              </>
            )}
          </button>
        </div>
      </nav>
      <main className="container mx-auto mt-8">
        {isAdmin ? <AdminInterface /> : <CashierInterface />}
      </main>
    </div>
  );
};

export default MainApp;
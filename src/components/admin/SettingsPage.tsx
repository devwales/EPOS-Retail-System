import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const SettingsPage: React.FC = () => {
  const {
    siteName,
    updateSiteName,
    currency,
    updateCurrency,
  } = useAppContext();

  const [newSiteName, setNewSiteName] = useState(siteName);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const handleSiteNameChange = () => {
    updateSiteName(newSiteName);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
    updateCurrency(e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {/* Site Name Setting */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Site Name</h3>
        <input
          type="text"
          value={newSiteName}
          onChange={(e) => setNewSiteName(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleSiteNameChange}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Site Name
        </button>
      </div>

      {/* Currency Setting */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Currency</h3>
        <select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="$">US Dollars ($)</option>
          <option value="£">British Pounds (£)</option>
          <option value="€">Euros (€)</option>
        </select>
      </div>
    </div>
  );
};

export default SettingsPage;
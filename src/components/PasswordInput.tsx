import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PasswordInputProps {
  onCorrectPassword: () => void;
  onCancel: () => void;
  correctPassword: string;
  mode?: 'verify' | 'create';
}

const PasswordInput: React.FC<PasswordInputProps> = ({ onCorrectPassword, onCancel, correctPassword, mode = 'verify' }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') {
      if (password === confirmPassword) {
        onCorrectPassword();
      } else {
        setError('Passwords do not match. Please try again.');
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      if (password === correctPassword) {
        onCorrectPassword();
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'create' ? 'Enter new password' : 'Enter password'}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      {mode === 'create' && (
        <div className="mb-4">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex justify-between">
        <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
          {mode === 'create' ? 'Set Password' : 'Enter'}
        </button>
        <button type="button" onClick={onCancel} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PasswordInput;
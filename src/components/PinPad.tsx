import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PinPadProps {
  onCorrectPin: () => void;
  onCancel: () => void;
  correctPin: string;
  mode?: 'verify' | 'create';
}

const PinPad: React.FC<PinPadProps> = ({ onCorrectPin, onCancel, correctPin, mode = 'verify' }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>(mode === 'create' ? 'enter' : 'confirm');
  const [error, setError] = useState('');

  const handleNumberClick = (number: number) => {
    if (step === 'enter' && pin.length < 4) {
      setPin(prevPin => prevPin + number);
    } else if (step === 'confirm' && confirmPin.length < 4) {
      setConfirmPin(prevPin => prevPin + number);
    }
  };

  const handleDelete = () => {
    if (step === 'enter') {
      setPin(prevPin => prevPin.slice(0, -1));
    } else {
      setConfirmPin(prevPin => prevPin.slice(0, -1));
    }
    setError('');
  };

  const handleSubmit = () => {
    if (mode === 'create') {
      if (step === 'enter') {
        if (pin.length === 4) {
          setStep('confirm');
        } else {
          setError('Please enter a 4-digit PIN');
        }
      } else {
        if (pin === confirmPin) {
          onCorrectPin();
        } else {
          setError('PINs do not match. Please try again.');
          setPin('');
          setConfirmPin('');
          setStep('enter');
        }
      }
    } else {
      if (pin === correctPin) {
        onCorrectPin();
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="password"
          value={step === 'enter' ? pin : confirmPin}
          readOnly
          className="w-full p-2 text-center text-2xl border rounded"
          maxLength={4}
        />
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <button
            key={number}
            onClick={() => handleNumberClick(number)}
            className="bg-gray-200 p-4 rounded text-xl font-bold hover:bg-gray-300"
          >
            {number}
          </button>
        ))}
        <button onClick={handleDelete} className="bg-red-500 text-white p-4 rounded text-xl font-bold hover:bg-red-600">
          Delete
        </button>
        <button onClick={() => handleNumberClick(0)} className="bg-gray-200 p-4 rounded text-xl font-bold hover:bg-gray-300">
          0
        </button>
        <button onClick={handleSubmit} className="bg-green-500 text-white p-4 rounded text-xl font-bold hover:bg-green-600">
          {mode === 'create' && step === 'enter' ? 'Next' : 'Enter'}
        </button>
      </div>
      {mode === 'create' && (
        <p className="mt-4 text-sm text-gray-600">
          {step === 'enter' ? 'Enter a new 4-digit PIN' : 'Confirm your new PIN'}
        </p>
      )}
    </div>
  );
};

export default PinPad;
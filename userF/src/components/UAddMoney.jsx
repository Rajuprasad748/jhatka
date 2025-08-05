import React, { useState } from 'react';

const AddMoney = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const walletBalance = 1500; // Replace with actual value from backend in production

  const presetAmounts = [100, 200, 500, 1000];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !paymentMethod) return;
    setIsLoading(true);

    setTimeout(() => {
      alert(`₹${amount} added using ${paymentMethod}`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
          Add Money to Wallet
        </h2>

        <div className="text-center text-gray-600">
          Current Balance: <span className="font-bold text-green-600">₹{walletBalance}</span>
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Enter Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Or select a preset:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                  amount == amt
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Select Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Method --</option>
            <option value="UPI">UPI</option>
            <option value="Card">Credit/Debit Card</option>
            <option value="NetBanking">Net Banking</option>
            <option value="Wallet">Wallet (Paytm, PhonePe)</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!amount || !paymentMethod || isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            !amount || !paymentMethod || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : 'Add Money'}
        </button>
      </div>
    </div>
  );
};

export default AddMoney;

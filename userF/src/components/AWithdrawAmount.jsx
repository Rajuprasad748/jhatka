import React, { useState } from 'react';

function WithdrawForm() {
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const isFormValid = () => {
    if (!amount || amount <= 0 || !otp || otp.length !== 4) return false;
    if (method === 'upi') {
      return upiId.trim().length >= 5;
    } else {
      return (
        accountName.trim().length >= 3 &&
        accountNumber.trim().length >= 8 &&
        ifsc.trim().length === 11
      );
    }
  };

  const handleSendOtp = () => {
    console.log(isOtpSent)
    setIsOtpSent(true);
    alert('OTP sent to your registered number');
  };

  const handleWithdraw = () => {
    if (isFormValid()) {
      alert('Withdrawal request submitted!');
    }
  };

  return (
    <div className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10 max-w-lg mx-auto mt-6 mb-12 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">
        Withdraw Funds
      </h2>

      {/* Method Switch */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setMethod('upi')}
          className={`px-4 py-2 rounded-lg border text-sm sm:text-base transition ${
            method === 'upi'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border-gray-300'
          }`}
        >
          UPI
        </button>
        <button
          onClick={() => setMethod('bank')}
          className={`px-4 py-2 rounded-lg border text-sm sm:text-base transition ${
            method === 'bank'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border-gray-300'
          }`}
        >
          Bank
        </button>
      </div>

      {/* UPI or Bank Inputs */}
      {method === 'upi' ? (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">UPI ID</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="example@upi"
            className="w-full px-4 py-2 border rounded-md text-sm sm:text-base"
          />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Account Holder Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2 border rounded-md text-sm sm:text-base"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="XXXXXXXXXXXX"
              className="w-full px-4 py-2 border rounded-md text-sm sm:text-base"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">IFSC Code</label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              placeholder="SBIN0001234"
              className="w-full px-4 py-2 border rounded-md text-sm sm:text-base"
            />
          </div>
        </>
      )}

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-2 border rounded-md text-sm sm:text-base"
        />
      </div>

      {/* OTP */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="4"
            placeholder="4-digit OTP"
            className="w-full px-4 py-2 border rounded-md text-lg tracking-widest text-center"
          />
        </div>
        <button
          onClick={handleSendOtp}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-white font-semibold w-full sm:w-auto"
        >
          Send OTP
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={handleWithdraw}
        disabled={!isFormValid()}
        className={`w-full py-3 rounded-md text-white font-bold transition ${
          isFormValid()
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Withdraw
      </button>
    </div>
  );
}

export default WithdrawForm;

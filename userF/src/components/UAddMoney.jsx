import React, { useState } from "react";
import QRCode from "react-qr-code"; // ✅ works with Vite

const AddMoney = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState("");

  const presetAmounts = [100, 200, 500, 1000];

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(amount, 10);

    if (isNaN(value) || value <= 99) {
      setError("Amount must be greater than ₹100");
      return;
    }

    setError("");
    // Example UPI/Payment QR string
    const paymentString = `upi://pay?pa=7489177858@ybl&pn=Raju%20Prasad&am=${amount}&cu=INR`;
    setQrData(paymentString);
  };

  const handleWhatsAppRedirect = () => {
    const phoneNumber = "+917489177858"; // ✅ Add your WhatsApp number in international format
    const message = `Hello, I have made a payment of ₹${amount}. Please confirm.`; // ✅ Pre-filled message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank"); // Opens in new tab (works on both desktop & mobile)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
          Add Money
        </h2>

        {!qrData ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount input */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Enter Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (min 101)"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                  [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none
                  [-moz-appearance:textfield]"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Preset buttons */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Or select a preset:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                      parseInt(amount) === amt
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Generate QR Code
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="font-medium text-gray-700">Scan to Pay:</p>
            <div className="flex justify-center bg-white p-4 rounded-lg shadow">
              <QRCode value={qrData} size={200} />
            </div>

            {/* ✅ WhatsApp redirect button */}
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition"
            >
              Message on WhatsApp
            </button>

            <button
              onClick={() => {
                setQrData("");
                setAmount("");
              }}
              className="mt-4 w-full py-3 rounded-lg font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50 transition"
            >
              Add Another Amount
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMoney;

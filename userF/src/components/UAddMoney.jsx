import React, { useState } from "react";
import { useAuth } from "../context/useAuth";

const AddMoney = () => {
  const [amount, setAmount] = useState("");
  const { user } = useAuth();

  const presetAmounts = [500, 1000, 5000, 10000];
  const adminNumber = "917489177858"; // ✅ WhatsApp number in international format (+91 not needed in wa.me link if you prefix 91)

  const handleWhatsAppRedirect = () => {
    if (!amount) {
      alert("Please select an amount first.");
      return;
    }

    const message = `I want to add ₹${amount} to my account\n${user?.mobile}`;
    const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank"); // opens WhatsApp
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 text-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Add Money
        </h2>

        {/* Preset buttons */}
        <div>
          <p className="text-sm text-gray-300 mb-2">Select an amount:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                  parseInt(amount) === amt
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Send to WhatsApp */}
        <button
          onClick={handleWhatsAppRedirect}
          className="w-full py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition"
        >
          Add Amount
        </button>
      </div>
    </div>
  );
};

export default AddMoney;

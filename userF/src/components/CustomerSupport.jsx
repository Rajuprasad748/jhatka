import React from 'react';

const CustomerSupport = () => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* WhatsApp */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">WhatsApp</h2>
        <p>Chat with us on WhatsApp!</p>
        <p className="font-semibold">+1 (234) 567-8901</p>
      </div>

      {/* Email */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Email</h2>
        <p>Send us an email anytime.</p>
        <p className="font-semibold">support@example.com</p>
      </div>

      {/* Phone Contact */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Contact</h2>
        <p >Call our support team.</p>
        <p className="font-semibold">+1 (800) 123-4567</p>
      </div>

      {/* Telegram */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Telegram</h2>
        <p>Join our Telegram channel.</p>
        <p className="font-semibold">@example_support</p>
      </div>

    </div>
  );
};

export default CustomerSupport;

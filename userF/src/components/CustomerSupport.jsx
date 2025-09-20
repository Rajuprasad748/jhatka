import React from 'react';

const CustomerSupport = () => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* WhatsApp */}
      <a
        href="https://wa.me/919755534587"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-800 text-white p-6 rounded-lg shadow-md block"
      >
        <h2 className="text-xl font-bold mb-2">WhatsApp</h2>
        <p>Chat with us on WhatsApp!</p>
        <p className="font-semibold">+91 97555 34587</p>
      </a>

      {/* Email */}
      <a
        href="mailto:Royalmoney10x@gmail.com"
        className="bg-gray-800 text-white p-6 rounded-lg shadow-md block"
      >
        <h2 className="text-xl font-bold mb-2">Email</h2>
        <p>Send us an email anytime.</p>
        <p className="font-semibold">Royalmoney10x@gmail.com</p>
      </a>

      {/* Phone Contact (dummy) */}
      <a
        href="tel:+18001234567"
        className="bg-gray-800 text-white p-6 rounded-lg shadow-md block"
      >
        <h2 className="text-xl font-bold mb-2">Contact</h2>
        <p>Call our support team.</p>
        <p className="font-semibold">+1 (800) 123-4567</p>
      </a>

      {/* Telegram (dummy) */}
      <a
        href="https://t.me/example_support"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-800 text-white p-6 rounded-lg shadow-md block"
      >
        <h2 className="text-xl font-bold mb-2">Telegram</h2>
        <p>Join our Telegram channel.</p>
        <p className="font-semibold">@example_support</p>
      </a>

    </div>
  );
};

export default CustomerSupport;

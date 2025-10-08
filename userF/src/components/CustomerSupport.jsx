import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaWhatsapp, FaTelegram, FaInstagram, FaEnvelope } from "react-icons/fa";

const CustomerSupport = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/contactInfo`,
          { withCredentials: true }
        );
        // Keep your same logic but ensure safe handling
        setContactInfo(Array.isArray(res.data) ? res.data[0] : res.data);
      } catch (err) {
        console.error("Error fetching contact info:", err);
        setError("Failed to load contact info. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // ✅ Skeleton Loader
  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array(4)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="bg-gray-700 h-32 rounded-lg shadow-md"
            ></div>
          ))}
      </div>
    );
  }

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">{error}</p>
    );

  if (!contactInfo)
    return (
      <p className="text-center mt-10 text-gray-400">
        No contact info available.
      </p>
    );

  // ✅ Format WhatsApp number safely
  const whatsappNumber = contactInfo?.contactNumber
    ? contactInfo.contactNumber.replace(/[^\d]/g, "")
    : "";

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* WhatsApp */}
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 text-white p-6 rounded-lg shadow-md block hover:bg-gray-700 transition"
        >
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaWhatsapp className="text-green-400" /> WhatsApp
          </h2>
          <p>Click to chat with us on WhatsApp!</p>
        </a>
      )}

      {/* Email */}
      {contactInfo?.email && (
        <a
          href={`mailto:${contactInfo.email.trim()}`}
          className="bg-gray-800 text-white p-6 rounded-lg shadow-md block hover:bg-gray-700 transition"
        >
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaEnvelope className="text-yellow-400" /> Email
          </h2>
          <p>Click to send us an email anytime.</p>
        </a>
      )}

      {/* Telegram */}
      {contactInfo?.telegram && (
        <a
          href={contactInfo.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 text-white p-6 rounded-lg shadow-md block hover:bg-gray-700 transition"
        >
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaTelegram className="text-blue-400" /> Telegram
          </h2>
          <p>Click to join our Telegram channel.</p>
        </a>
      )}

      {/* Instagram */}
      {contactInfo?.instagram && (
        <a
          href={contactInfo.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 text-white p-6 rounded-lg shadow-md block hover:bg-gray-700 transition"
        >
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaInstagram className="text-pink-400" /> Instagram
          </h2>
          <p>Click to follow us on Instagram.</p>
        </a>
      )}

    </div>
  );
};

export default CustomerSupport;

import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerSupport = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/contactInfo`,
          { withCredentials: true }
        );
        setContactInfo(res.data[0]);
      } catch (err) {
        console.error("Error fetching contact info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading contact info...</p>;
  if (!contactInfo) return <p className="text-center mt-10">No contact info available.</p>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${contactInfo.contactNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-800 text-white p-6 rounded-lg shadow-md block hover:bg-gray-700 transition"
      >
        <h2 className="text-xl font-bold mb-2">WhatsApp</h2>
        <p>Click to chat with us on WhatsApp!</p>
      </a>

      {/* Email */}
      <a
        href={`mailto:${contactInfo.email.trim()}`}
        className="bg-gray-800 text-white p-6 rounded-lg shadow-md block hover:bg-gray-700 transition"
      >
        <h2 className="text-xl font-bold mb-2">Email</h2>
        <p>Click to send us an email anytime.</p>
      </a>

      {/* Telegram */}
      <a
        href={contactInfo.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-800 text-white p-6 rounded-lg shadow-md block hover:bg-gray-700 transition"
      >
        <h2 className="text-xl font-bold mb-2">Telegram</h2>
        <p>Click to join our Telegram channel.</p>
      </a>

      {/* Instagram */}
      <a
        href={contactInfo.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-800 text-white p-6 rounded-lg shadow-md block hover:bg-gray-700 transition"
      >
        <h2 className="text-xl font-bold mb-2">Instagram</h2>
        <p>Click to follow us on Instagram.</p>
      </a>

    </div>
  );
};

export default CustomerSupport;

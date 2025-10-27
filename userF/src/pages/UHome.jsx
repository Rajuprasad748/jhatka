import AddTab from "../components/AddTab";
import UData from "../components/UData";
import axios from "axios";
import React, { useEffect, useState } from "react";
import WelcomeAnimation from "../WelcomeAnimation";

const UHome = () => {
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/contactInfo`);
      setMessage(res.data[0]?.marquee || "");
    };
    fetchData();
  }, []);

  return (
    <div className="relative">
      {token && <WelcomeAnimation />} {/* Will automatically disappear after 3s */}
      <section className="w-full text-gray-400 bg-white flex flex-col items-center justify-center">
        <div className="overflow-hidden bg-white text-red-600 py-2 font-semibold uppercase">
          <div className="whitespace-nowrap animate-marquee px-5 text-center">
            {message || "RoyalMoney10x में आपका स्वागत है! यहाँ आपको मिलेगा ऑनलाइन बेटिंग और गेमिंग का मस्त तड़का 🔥। हमारा प्लेटफ़ॉर्म है Safe, Secure और 100% भरोसेमंद—ताकि आप खेलें बिना किसी टेंशन के और मज़ा आए दोगुना।"}
          </div>
        </div>
        <AddTab />
        <div className="w-screen p-4">
          <UData />
        </div>
      </section>
    </div>
  );
};

export default UHome;

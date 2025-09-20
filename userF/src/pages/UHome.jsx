import AddTab from "../components/AddTab";
import UData from "../components/UData";

const UHome = () => {
  return (
    <div>
      <section className="w-full text-gray-400 bg-white flex flex-col items-center justify-center">
        <div className="overflow-hidden bg-white text-red-600 py-2 font-semibold uppercase">
          <div className="whitespace-nowrap animate-marquee px-5 text-center">
           "RoyalMoney10x में आपका स्वागत है! यहाँ आपको मिलेगा ऑनलाइन बेटिंग और गेमिंग का मस्त तड़का 🔥। हमारा प्लेटफ़ॉर्म है Safe, Secure और 100% भरोसेमंद—ताकि आप खेलें बिना किसी टेंशन के और मज़ा आए दोगुना।"
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

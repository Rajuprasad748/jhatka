import AddTab from "../components/AddTab";
import UData from "../components/UData";

const UHome = () => {
  return (
    <div>
      <section className="w-full text-gray-400 bg-white flex flex-col items-center justify-center">
        <div className="overflow-hidden bg-white text-red-600 py-2 font-semibold uppercase">
          <div className="whitespace-nowrap animate-marquee px-5 text-center">
            Welcome to RoyalMoney9x, your premier destination for online betting
            and gaming. Our platform is designed to provide a seamless and
            secure betting experience.
          </div>
        </div>

        <AddTab />
        <div className="w-screen p-8">
          <UData />
        </div>
      </section>
    </div>
  );
};

export default UHome;

import React from 'react';

const AAbout = () => {
  return (
    <div className="bg-gray-100 min-h-screen px-4 py-6 flex flex-col items-center">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
        About Us
      </h1>
      <ul className="list-disc pl-5 sm:pl-6 md:pl-8 text-sm sm:text-base md:text-lg text-gray-700 space-y-4 w-full max-w-3xl">
        <li>
          Welcome to <strong>RoyalMoney9x</strong>, your premier destination for online betting and gaming. Our platform is designed to provide a seamless and secure betting experience, offering a wide range of games and betting options.
        </li>
        <li>
          At <strong>RoyalMoney9x</strong>, we prioritize user satisfaction and security. Our team is dedicated to ensuring that your personal information and transactions are protected with the highest standards of security.
        </li>
        <li>
          Join us today and experience the thrill of online betting with <strong>RoyalMoney9x</strong>. Whether you're a seasoned bettor or new to the world of online gaming, we have something for everyone. Thank you for choosing RoyalMoney9x!
        </li>
        <li>
          For any inquiries or support, feel free to contact our customer service team. We are here to assist you 24/7.
        </li>
        <li>
          <strong>Happy betting!</strong>
        </li>
      </ul>
    </div>
  );
};

export default AAbout;

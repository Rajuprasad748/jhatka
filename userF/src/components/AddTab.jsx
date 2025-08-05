import React from 'react';
import { Link } from 'react-router-dom';

const buttons = [
  { label: '💰 Add Money', to: '/add-money' },
  { label: '💸 Withdraw', to: '/withdraw' },
  { label: '📩 Place a bet', to: '/place-bet' },
  { label: '🟢 History', to: '/history' },
];

function AddTab() {
  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {buttons.map((button, index) => (
          <Link
            key={index}
            to={button.to}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm sm:text-base font-semibold py-3 sm:py-4 px-2 rounded-lg text-center transition duration-300 shadow-md"
          >
            {button.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AddTab;

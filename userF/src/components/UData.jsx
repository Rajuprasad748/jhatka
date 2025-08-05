import React from 'react';

// Helper: Generate random opening/closing time
const getRandomTime = () => {
  const openHour = Math.floor(1 + Math.random() * 11);
  const closeHour = openHour + Math.floor(1 + Math.random() * 5);
  const format = (hour) => `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  return {
    open: format(openHour),
    close: format(closeHour),
  };
};

// Helper: Generate a formatted code like 123-45-678
const generateFormattedCode = () => {
  const part1 = Math.floor(100 + Math.random() * 900);
  const part2 = Math.floor(10 + Math.random() * 90);
  const part3 = Math.floor(100 + Math.random() * 900);
  return `${part1}-${part2}-${part3}`;
};

// Game data list
const gameData = [
  'Kalyan Matka Bhopal',
  'Sita Morning Bhopal',
  'Sridevi Morning Bhopal',
  'Karnataka Day',
  'Tulsi Morning',
  'Milan Bazar',
  'Khatri Morning',
  'Rajdhani Night',
].map((name) => ({
  name,
  code: generateFormattedCode(),
  time: getRandomTime(),
}));

const UData = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800 p-4 shadow text-center text-2xl font-bold text-yellow-400 border-b border-gray-700">
        MAIN RESULT
      </header>

      <main className="max-w-4xl mx-auto px-3 py-6 space-y-5">
        {gameData.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md space-y-3"
          >
            {/* Time Row */}
            <div className="text-sm text-center text-gray-400">
              Open: {item.time.open} | Close: {item.time.close}
            </div>

            {/* Name + Code + Emoji */}
            <div className="flex items-center justify-between text-lg sm:text-xl font-semibold">
              <span role="img" aria-label="money">💰</span>

              <div className="flex-1 text-center">
                <p className="text-base sm:text-lg">{item.name}</p>
                <p className="text-yellow-400 text-lg">{item.code}</p>
              </div>

              <span role="img" aria-label="money">💰</span>
            </div>

            {/* Status */}
            <div className="text-center text-sm font-semibold text-red-500">
              Close for today
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default UData;

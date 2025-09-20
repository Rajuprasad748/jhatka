function GameRates() {
  const rates = [
    { name: "Single Digit", rate: "10-100" },
    { name: "Jodi Digit", rate: "10-1000" },
    { name: "Single Pana", rate: "10-1600" },
    { name: "Double Pana", rate: "10-3200" },
    { name: "Triple Pana", rate: "10-9000" },
    { name: "Half Sangam", rate: "10-15000" },
    { name: "Full Sangam", rate: "10-100000" },
  ]

  return (
    <div className="w-full max-w-sm mx-auto p-4 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl sm:p-6 md:p-8">
  
      {/* List */}
      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
        {rates.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-800 text-white shadow-sm rounded-lg p-3 border border-gray-700 hover:bg-gray-700 transition-colors duration-200 sm:p-4 md:p-5 sm:rounded-xl md:shadow-md lg:shadow-lg"
          >
            {/* Rate Name */}
            <span className="font-medium text-sm text-gray-100 sm:text-base md:text-lg lg:text-xl">{item.name}</span>

            {/* Game Rate */}
            <span className="font-bold text-sm text-green-400 sm:text-base md:text-lg lg:text-xl">{item.rate}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GameRates

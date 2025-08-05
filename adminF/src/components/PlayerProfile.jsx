import React from 'react'

const PlayerProfile = () => {
  return (
    <div>
      <div className="w-[190px] h-[254px] mx-auto bg-black rounded-lg relative z-[1]">
      <div className="flex items-center p-2">
        <div className="px-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ff605c]" />
        </div>
        <div className="px-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ffbd44]" />
        </div>
        <div className="px-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00ca4e]" />
        </div>
      </div>
      <div className="p-4">
        {/* Card Content goes here */}
      </div>
    </div>
    </div>
  )
}

export default PlayerProfile

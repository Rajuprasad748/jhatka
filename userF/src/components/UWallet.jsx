import React from 'react'

const UWallet = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Wallet</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-lg">Balance: ₹ 1,500</p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Add Money</button>
      </div>
    </div>
  )
}

export default UWallet

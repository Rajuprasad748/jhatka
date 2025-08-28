import React from 'react'
import { Link } from 'react-router-dom';

const ADashboard = () => {

    const products = [
  {
    title: 'All Players',
    Link: '/users',
    img: 'https://dummyimage.com/420x260',
  },
  {
    title: 'Place Bet',
    Link: '/bet',
    img: 'https://dummyimage.com/421x261',
  },
  {
    title: 'Payment History',
    Link: '/paymentHistory',
    img: 'https://dummyimage.com/422x262',
  },
  {
    title: 'Bet History',
    Link: '/betHistory',
    img: 'https://dummyimage.com/423x263',
  },
  {
    title: 'Add Tokens',
    Link: '/addToken',
    img: 'https://dummyimage.com/424x264',
  },
  {
    title: 'Remove Tokens',
    Link: '/removeToken',
    img: 'https://dummyimage.com/425x265',
  },
  {
    title: 'Neptune',
    Link: '/',
    img: 'https://dummyimage.com/427x267',
  },
  {
    title: 'Tokens',
    Link: '/tokens',
    img: 'https://dummyimage.com/428x268',
  },
];


  return (
    <div>
      <section className=" bg-white body-font min-h-screen">
      <div className="container px-5 py-20 mx-auto">
        <div className="flex flex-wrap -m-4">
          {products.map((product, index) => (
            <div key={index} className="lg:w-1/4 md:w-1/2 p-4 w-full cursor-pointer ">
                <Link to={product.Link}>
              <div className="mt-4 flex flex-col items-center justify-center bg-gray-800 py-4 text-white">
                <h2 className="title-font text-lg font-medium">{product.title}</h2>
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>
  )
}

export default ADashboard

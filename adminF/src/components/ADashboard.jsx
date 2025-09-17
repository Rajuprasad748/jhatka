import React from 'react'
import { Link } from 'react-router-dom';

const ADashboard = () => {

    const products = [
  {
    title: 'All Players',
    Link: '/users',
  },
  {
    title: 'Place Bet',
    Link: '/bet',
  },
  {
    title: 'Update Time',
    Link: '/updateTime',
  },
  {
    title: 'Bet History',
    Link: '/betHistory',
  },
  {
    title: 'Add Tokens',
    Link: '/addToken',
  },
  {
    title: 'Remove Tokens',
    Link: '/removeToken',
  },
  {
    title: 'Add Token History',
    Link: '/addTokenHistory',
  },
  {
    title: 'Remove Token History',
    Link: '/removeTokenHistory',
  },
  {
    title: 'Hide Games',
    Link: '/hideGames',
  },
  {
    title: 'Add Game',
    Link: '/addGame',
  },
  {
    title: 'Remove Game',
    Link: '/removeGame',
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

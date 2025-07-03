'use client';
import { useState } from 'react';

export default function ProductsSection() {
  // Sample product data - you can replace with your actual data
  const products = [
    {
      id: 1,
      name: "Winter Coat",
      originalPrice: "R 399,99",
      discountedPrice: "R 299,99",
      image: "/winter-coat-1.jpg"
    },
    {
      id: 2,
      name: "Winter Coat",
      originalPrice: "R 499,99",
      discountedPrice: "R 350,00",
      image: "/winter-coat-2.jpg"
    },
    {
      id: 3,
      name: "Winter Coat",
      originalPrice: "R 300,00",
      discountedPrice: "R 250,00",
      image: "/winter-coat-3.jpg"
    },
    {
      id: 4,
      name: "Winter Coat",
      originalPrice: "R 300,00",
      discountedPrice: "R 200,00",
      image: "/winter-coat-4.jpg"
    }
  ];

  return (
    <section className="bg-neutral-100 py-16 px-6 relative">
      {/* Top wave transition (to match the design theme) */}
      <div className="absolute top-0 left-0 right-0 h-[30px] -mt-[30px] overflow-hidden">
        <svg 
          viewBox="0 0 1360 30" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
          preserveAspectRatio="none"
        >
          <path d="M0,30 C85,25 170,15 340,10 C680,0 1020,15 1360,30 L1360,30 L0,30 Z" fill="rgb(243, 244, 246)"/>
        </svg>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        {/* Section header with title and "View More" button */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Explore Our Latest Collections For You
          </h2>
          <a href="#" className="flex items-center text-gray-900 font-medium hover:text-emerald-800 transition-all">
            View More 
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              {/* Product image container */}
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Favorite button */}
                <button className="absolute top-3 right-3 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Product info */}
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 line-through text-sm">{product.originalPrice}</span>
                    <span className="text-emerald-700 font-bold">{product.discountedPrice}</span>
                  </div>
                </div>
                
                {/* Add to cart button */}
                <button className="w-10 h-10 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination indicator */}
        <div className="flex justify-center mt-10">
          <div className="inline-flex bg-gray-200 rounded-full p-1">
            <div className="h-2 w-8 bg-emerald-800 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-300 rounded-full mx-1"></div>
            <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Bottom wave for transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-[30px]">
        <svg viewBox="0 0 1360 30" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C85,5 170,15 340,20 C680,30 1020,15 1360,0 L1360,30 L0,30 Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
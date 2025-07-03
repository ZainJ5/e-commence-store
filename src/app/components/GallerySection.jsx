'use client';
import React from 'react';

export default function GallerySection() {
  return (
    <div className="relative w-full">
      {/* Curved Top Section /}
      {/ <div className="relative w-full h-[20px]">
        <svg viewBox="0 0 1360 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M0,0 L1360,0 L1360,120 Q680,200 0,120 Z" fill="
#000000"/>
</svg>
      </div> */}

      {/* Gallery Grid */}
     <div className="w-full -mt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="aspect-square overflow-hidden rounded-2xl">
              <img 
                src="/1.jpg" 
                alt="Fashion model in casual wear"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-2xl">
              <img 
                src="/2.jpg" 
                alt="Fashion model in patterned outfit"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-2xl">
              <img 
                src="/3.jpg" 
                alt="Fashion model in red coat"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-2xl">
              <img 
                src="/4.jpg" 
                alt="Fashion model in denim jacket"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
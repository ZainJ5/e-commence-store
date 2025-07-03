'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function HolidaySaleBanner() {
  return (
    <div className="overflow-hidden rounded-3xl border w-[95%] m-auto border-neutral-200 bg-[#214731] flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl text-[#f0e6d2] font-serif mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Save 50% this Holiday season
        </h2>
        
        <p 
          className="text-[#f0e6d2] text-base md:text-lg mb-10 leading-relaxed"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          It's time to revamp your fashion game without breaking the bank! Dive into our 
          exclusive 50% off sale and discover unbearable deals on the most coveted styles.
        </p>
        
        <div>
          <Link 
            href="/sale" 
            className="inline-block border border-[#f0e6d2] text-[#f0e6d2] rounded-full px-12 py-3 hover:bg-[#f0e6d2] hover:text-[#214731] transition-all duration-300"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Shop Now
          </Link>
        </div>
      </div>
      
      <div className="w-full md:w-[40%] ml-auto h-80 md:h-auto relative">
        <Image
          src="/discount-banner.jpg" 
          alt="Man in denim shirt with Mickey Mouse graphic"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover bg-center"
          priority
        />
      </div>
    </div>
  );
}
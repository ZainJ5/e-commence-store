'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function HolidaySaleBanner() {
  return (
    <div className="overflow-hidden rounded-3xl border w-[95%] m-auto border-neutral-200 bg-[#214731] flex flex-row">
      <div className="w-[60%] xs:w-[65%] sm:w-[60%] lg:w-[55%] p-4 xs:p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <h2 
          className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-serif mb-2 xs:mb-3 sm:mb-4 md:mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Save 50% this Holiday season
        </h2>
        
        <p 
          className="text-white text-xs xs:text-sm sm:text-base md:text-lg mb-3 xs:mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed line-clamp-2 sm:line-clamp-3 md:line-clamp-none"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          It's time to revamp your fashion game without breaking the bank! Dive into our 
          exclusive 50% off sale and discover unbearable deals on the most coveted styles.
        </p>
        
        <div>
          <Link 
            href="/collections" 
            className="inline-block border border-white text-white rounded-full text-xs xs:text-sm sm:text-base px-4 xs:px-6 sm:px-8 md:px-12 py-1 xs:py-2 sm:py-3 hover:bg-white hover:text-[#214731] transition-all duration-300"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Shop Now
          </Link>
        </div>
      </div>
      
      <div className="w-[40%] xs:w-[35%] sm:w-[40%] lg:w-[45%] relative">
        <Image
          src="/discount-banner.jpg" 
          alt="Man in denim shirt with Mickey Mouse graphic"
          fill
          sizes="(max-width: 768px) 40vw, (max-width: 1024px) 40vw, 45vw"
          className="object-cover object-top"
          priority
        />
      </div>
    </div>
  );
}
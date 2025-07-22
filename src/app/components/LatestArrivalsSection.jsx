'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LatestArrivalsSection() {
  const [activeCollection, setActiveCollection] = useState(null);

  const collections = [
    { name: 'Men', path: '/collections/men' },
    { name: 'Women', path: '/collections/women' },
    { name: 'Kids', path: '/collections/kids' },
    { name: 'Customizable', path: '/collections/customizable' },
    { name: 'Mr Shah Collection', path: '/collections/mr-shah-collection' }
  ];
  
  const midRangeCollections = [
    { name: 'Men', path: '/collections/men' },
    { name: 'Women', path: '/collections/women' },
    { name: 'Kids', path: '/collections/kids' },
    { name: 'Customizable', path: '/collections/customizable' }
  ];
  
  const smallCollections = [
    { name: 'Men', path: '/collections/men' },
    { name: 'Women', path: '/collections/women' },
    { name: 'Kids', path: '/collections/kids' }
  ];

  return (
    <section className="relative w-full bg-[rgb(240,230,210)] md:w-[95%] overflow-hidden rounded-l-none sm:rounded-3xl ml-0 sm:m-auto">
      <div 
        className="absolute inset-0 bg-cover bg-top z-0 rounded-l-none sm:rounded-l-3xl"
        style={{ backgroundImage: "url('/latest-arrival-image.jpg')" }}
      ></div>

      <div className="absolute inset-0 z-0 opacity-60 mix-blend-overlay rounded-l-none sm:rounded-l-3xl">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 mix-blend-multiply"></div>
        <div 
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 flex flex-col justify-center items-center min-h-[40vh] xs:min-h-[50vh] sm:min-h-[60vh] md:min-h-[80vh] w-full px-4 sm:px-6 py-6 sm:py-10 md:py-16">
        <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-10 sm:mb-14 text-center drop-shadow-2xl">
          Our Collections
        </h2>

        <div className="w-full sm:hidden flex justify-center gap-6">
          {smallCollections.map((collection) => (
            <Link
              key={collection.name}
              href={collection.path}
              onClick={() => setActiveCollection(collection.name)}
              className={`text-base font-serif tracking-wide transition-all duration-300 relative pb-1 ${
                activeCollection === collection.name
                  ? 'text-white font-medium after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-white'
                  : 'text-white/90 hover:text-white hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-white/60'
              }`}
            >
              {collection.name}
            </Link>
          ))}
        </div>

        <div className="w-full hidden sm:flex md:hidden justify-center gap-8">
          {midRangeCollections.map((collection) => (
            <Link
              key={collection.name}
              href={collection.path}
              onClick={() => setActiveCollection(collection.name)}
              className={`text-lg font-serif tracking-wide transition-all duration-300 relative pb-1 ${
                activeCollection === collection.name
                  ? 'text-white font-medium after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-white'
                  : 'text-white/90 hover:text-white hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-white/60'
              }`}
            >
              {collection.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex justify-center gap-12 lg:gap-16 flex-wrap">
          {collections.map((collection) => (
            <Link
              key={collection.name}
              href={collection.path}
              onClick={() => setActiveCollection(collection.name)}
              className={`text-xl lg:text-2xl font-serif tracking-wide transition-all duration-300 relative pb-1 ${
                activeCollection === collection.name
                  ? 'text-white font-medium after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-white'
                  : 'text-white/90 hover:text-white hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-white/60'
              }`}
            >
              {collection.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
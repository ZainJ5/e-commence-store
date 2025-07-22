import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import LatestArrivalsSection from './components/LatestArrivalsSection';
import FeaturedProducts from './components/FeaturedProducts';
import Footer from './components/Footer';
import HolidaySaleBanner from './components/HolidaySaleBanner';
import TopDiscountBanner from './components/DiscountSection';
import MrShahCollection from './components/MrShahCollection';


export default function Home() {
  return (
    <div className="min-h-screen text-black bg-white">
      <TopDiscountBanner/>
      <Navbar />
      <HeroSection />
      {/* <GallerySection/> */}
      <ProductsSection/>
      <LatestArrivalsSection/>
      <FeaturedProducts />
      <MrShahCollection/>
      <div className='pb-4 md:p-6'>
      <HolidaySaleBanner />
      </div>
      
      <Footer />
    </div>
  );
}
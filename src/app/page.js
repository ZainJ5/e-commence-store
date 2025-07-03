import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import LatestArrivalsSection from './components/LatestArrivalsSection';
import FeaturedProducts from './components/FeaturedProducts';
import Footer from './components/Footer';
import HolidaySaleBanner from './components/HolidaySaleBanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      {/* <GallerySection/> */}
      <ProductsSection/>
      <LatestArrivalsSection/>
      <FeaturedProducts />
      <div className='p-6'>
      <HolidaySaleBanner />
      </div>
      
      <Footer />
    </div>
  );
}
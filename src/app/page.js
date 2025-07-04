import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import LatestArrivalsSection from './components/LatestArrivalsSection';
import FeaturedProducts from './components/FeaturedProducts';
import Footer from './components/Footer';
import HolidaySaleBanner from './components/HolidaySaleBanner';
import TopDiscountBanner, { BannerProvider } from './components/DiscountSection';

export default function Home() {
  return (
    <BannerProvider>
      <div className="min-h-screen bg-[rgb(240,230,210)]">
        <TopDiscountBanner />
        <HeroSection />
        <ProductsSection/>
        <LatestArrivalsSection/>
        <FeaturedProducts />
        <div className='pb-10 pt-6 md:p-6'>
          <HolidaySaleBanner />
        </div>
        <Footer />
      </div>
    </BannerProvider>
  );
}
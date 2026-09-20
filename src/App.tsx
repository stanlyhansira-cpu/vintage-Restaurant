import React, { useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedSection } from './components/FeaturedSection';
import { WhyVintageSection } from './components/WhyVintageSection';
import { MenuSection } from './components/MenuSection';
import { GallerySection } from './components/GallerySection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FoodDetailModal } from './components/FoodDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { StickyMobileCartBar } from './components/StickyMobileCartBar';
import { ToastContainer } from './components/ToastContainer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ReserveTable } from './components/ReserveTable';
import { ReviewsSection } from './components/ReviewsSection';
import { PromoBanner } from './components/PromoBanner';

const MainContent: React.FC = () => {
  const { activeView, setActiveView } = useRestaurant();

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  return (
    <div className="min-h-screen bg-[#12110F] text-[#E5DFD7] flex flex-col selection:bg-[#C59A4E] selection:text-black">
      {/* High-Impact Dismissible Promotional Banner */}
      <PromoBanner />

      {/* Top Navbar */}
      <Navbar />

      {/* Main View Display */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <Hero />
            <FeaturedSection />
            <WhyVintageSection />
            <ReserveTable />
            <ReviewsSection />
            <AboutSection />
            <ContactSection />
          </>
        )}

        {activeView === 'menu' && (
          <div className="pt-6">
            <MenuSection />
          </div>
        )}

        {activeView === 'reserve' && (
          <div className="pt-6">
            <ReserveTable isStandalone={true} />
          </div>
        )}

        {activeView === 'gallery' && (
          <div className="pt-6">
            <GallerySection />
          </div>
        )}

        {activeView === 'about' && (
          <div className="pt-6">
            <AboutSection />
            <WhyVintageSection />
          </div>
        )}

        {activeView === 'contact' && (
          <div className="pt-6">
            <ContactSection />
          </div>
        )}

        {activeView === 'checkout' && (
          <div className="pt-6">
            <CheckoutPage />
          </div>
        )}

        {activeView === 'order-success' && (
          <div className="pt-6">
            <OrderSuccessPage />
          </div>
        )}

        {activeView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer (rendered on all customer pages) */}
      {activeView !== 'admin' && <Footer />}

      {/* Overlays & Drawers */}
      <FoodDetailModal />
      <CartDrawer />
      <StickyMobileCartBar />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <MainContent />
    </RestaurantProvider>
  );
}

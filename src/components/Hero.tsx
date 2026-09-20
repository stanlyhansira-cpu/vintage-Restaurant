import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ArrowDown, Star, Clock, MapPin, ChevronRight, MessageCircle } from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings, setActiveView, t, language } = useRestaurant();

  const handleScrollToMenu = () => {
    setActiveView('menu');
    const menuEl = document.getElementById('menu-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background imagery with sophisticated warm dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.hero_image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"}
          alt="Vintage Restaurant and Cafe Ambiance"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12110f] via-[#12110f]/60 to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(18,17,15,0.7)_100%)]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center flex flex-col items-center">
        {/* Brand Crest / Logo */}
        <div className="mb-5 flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#C59A4E]/50 bg-black p-0.5 shadow-2xl shadow-black/80 hover:border-[#C59A4E] transition-all hover:scale-105">
            <img
              src={settings.logo_url || "/logo.png"}
              alt="Vintage Restaurant & Cafe Official Logo"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="mt-2 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#C59A4E] font-semibold">
            Vintage Restaurant &amp; Café • Gampaha
          </span>
        </div>

        {/* Verified Business Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6 text-xs text-[#E8DDCF]">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#C59A4E]/30">
            <Star className="w-3.5 h-3.5 text-[#C59A4E] fill-[#C59A4E]" />
            <span className="font-semibold text-white">{settings.google_rating}</span>
            <span className="text-[#A89F93]">({settings.review_count} {t('reviews_label')})</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#C59A4E]" />
            <span>{language === 'si' ? 'දිනපතා රාත්‍රී 11:00 දක්වා' : settings.opening_hours}</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-[#C59A4E]" />
            <span>{language === 'si' ? 'ගම්පහ මහා මාර්ගය' : 'Gampaha Highway'}</span>
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif-vintage text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#F6F3EE] mb-6 leading-[1.1] drop-shadow-md">
          {t('hero_tagline')}
        </h1>

        {/* Supporting text */}
        <p className="max-w-2xl text-base sm:text-xl text-[#C3BAAF] mb-10 leading-relaxed font-light">
          {t('hero_description')}
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-hero-order-now"
            onClick={handleScrollToMenu}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C59A4E] via-[#E2BF4D] to-[#C59A4E] text-black font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-[#C59A4E]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{t('hero_order_now')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            id="btn-hero-reserve-table"
            onClick={() => setActiveView('reserve')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#201e1a]/90 hover:bg-[#2a2621] text-[#F6F3EE] font-semibold text-xs sm:text-sm tracking-wider uppercase border border-[#C59A4E]/50 hover:border-[#C59A4E] transition-all backdrop-blur-sm flex items-center justify-center gap-2 shadow-lg"
          >
            <span>{t('hero_reserve_table')}</span>
          </button>

          <button
            id="btn-hero-view-menu"
            onClick={handleScrollToMenu}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-black/40 hover:bg-black/60 text-[#C3BAAF] hover:text-white font-medium text-xs sm:text-sm tracking-wider uppercase border border-white/10 transition-all backdrop-blur-sm"
          >
            {t('hero_view_menu')}
          </button>
        </div>

        {/* WhatsApp Direct Ordering Notice */}
        <div className="mt-8 flex items-center gap-2 text-xs text-[#9E9589]">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>{t('hero_whatsapp_note')}</span>
        </div>

        {/* Subtle scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 text-xs text-[#7A7268] animate-bounce">
          <span>{t('hero_scroll')}</span>
          <ArrowDown className="w-4 h-4 text-[#C59A4E]" />
        </div>
      </div>
    </section>
  );
};

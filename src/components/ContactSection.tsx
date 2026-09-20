import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MapPin, Phone, MessageCircle, Clock, Navigation, ExternalLink, Star } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings } = useRestaurant();

  const handleDirectionsClick = () => {
    if (settings.google_maps_url) {
      window.open(settings.google_maps_url, '_blank', 'noopener,noreferrer');
    } else {
      const query = encodeURIComponent(`${settings.name} ${settings.address}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWhatsAppClick = () => {
    let cleanPhone = settings.whatsapp_number.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '94' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('94')) {
      cleanPhone = '94' + cleanPhone;
    }
    const msg = encodeURIComponent(`Hello ${settings.name}! I would like to inquire about food orders / table availability.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact-section" className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C59A4E] block mb-2">
          Find Us & Connect
        </span>
        <h2 className="font-serif-vintage text-3xl sm:text-4xl md:text-5xl font-bold text-[#F6F3EE] mb-3">
          Location & Contact
        </h2>
        <p className="text-sm text-[#A89F93]">
          Visit us along the Ja-Ela–Ekala–Gampaha–Yakkala highway or reach out anytime for takeaway and orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Card 1: Address & Hours */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-lg space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C59A4E] mb-2">
                <MapPin className="w-4 h-4" />
                <span>Restaurant Location</span>
              </div>
              <h3 className="font-serif-vintage text-xl font-bold text-[#F6F3EE] mb-1">
                {settings.name}
              </h3>
              <p className="text-sm text-[#C3BAAF] leading-relaxed">
                {settings.address}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C59A4E] mb-2">
                <Clock className="w-4 h-4" />
                <span>Opening Hours</span>
              </div>
              <p className="text-sm text-[#F6F3EE] font-medium">
                {settings.opening_hours}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#857D74]">
                <Star className="w-3.5 h-3.5 text-[#C59A4E] fill-[#C59A4E]" />
                <span className="text-[#C3BAAF]">{settings.google_rating} rating</span>
                <span>•</span>
                <span>{settings.review_count} Google Reviews</span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                id="btn-get-directions"
                onClick={handleDirectionsClick}
                className="flex-1 py-3 px-4 rounded-xl bg-[#262420] hover:bg-[#302d28] text-[#F6F3EE] text-xs font-semibold uppercase tracking-wider border border-white/10 flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#C59A4E]" />
                <span>Get Directions</span>
              </button>

              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                id="btn-call-now"
                className="flex-1 py-3 px-4 rounded-xl bg-[#C59A4E] hover:bg-[#E2BF4D] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Card 2: Phone & WhatsApp */}
          <div className="p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-[#857D74] block">WhatsApp Ordering Hotline</span>
              <a 
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="text-xl font-mono font-bold text-[#F6F3EE] hover:text-[#C59A4E] transition-colors"
              >
                {settings.phone}
              </a>
            </div>

            <button
              type="button"
              id="btn-contact-whatsapp"
              onClick={handleWhatsAppClick}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Google Maps Visual Interactive Section */}
        <div className="lg:col-span-7 rounded-3xl bg-[#1d1b18] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="relative flex-1 min-h-[340px] bg-[#22201c] flex flex-col items-center justify-center p-6 text-center">
            {/* Map stylized placeholder & trigger */}
            <div className="w-16 h-16 rounded-full bg-[#C59A4E]/15 border border-[#C59A4E]/30 flex items-center justify-center text-[#C59A4E] mb-4">
              <MapPin className="w-8 h-8" />
            </div>

            <h4 className="font-serif-vintage text-2xl font-bold text-[#F6F3EE] mb-2">
              Vintage Restaurant & Cafe
            </h4>
            <p className="text-sm text-[#A89F93] max-w-md mb-6 leading-relaxed">
              141 Ja-Ela–Ekala–Gampaha–Yakkala Hwy, Gampaha 11870, Sri Lanka
            </p>

            <button
              type="button"
              onClick={handleDirectionsClick}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C59A4E] to-[#A8811F] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>

          <div className="p-4 bg-[#171513] border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-[#857D74]">
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#C59A4E]" />
              <span>Easy roadside parking available</span>
            </span>
            <span className="text-[#C59A4E]">
              Price range: {settings.price_range}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

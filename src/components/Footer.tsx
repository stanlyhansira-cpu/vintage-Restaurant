import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Utensils, Phone, MapPin, Clock, Shield, Globe } from 'lucide-react';
import { NewsletterSignup } from './NewsletterSignup';

export const Footer: React.FC = () => {
  const { settings, setActiveView, isAdminAuthenticated, language, setLanguage, t } = useRestaurant();

  const handleNav = (view: any) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0f0e0c] text-[#A89F93] border-t border-white/5 pt-16 pb-24 md:pb-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Signup Component */}
        <NewsletterSignup />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#C59A4E]/30 bg-black flex items-center justify-center shrink-0 shadow-md">
              <img
                src={settings.logo_url || "/logo.png"}
                alt="Vintage Restaurant & Cafe Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-serif-vintage text-xl font-bold text-white block uppercase tracking-wider">
                Vintage
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#C59A4E] block font-medium">
                Restaurant & Café
              </span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-[#857D74]">
            {language === 'si' 
              ? 'උසස් තත්ත්වයේ ප්‍රණීත ආහාර. සොඳුරු අවස්ථා. මතකයේ රැඳෙන අපූරු භෝජන අත්දැකීමක්.' 
              : (settings.description || "A grade foods. Great food. Good moments. A dining experience worth remembering.")}
          </p>

          <div className="pt-2 text-xs text-[#C59A4E]">
            ★ {settings.google_rating} on Google ({settings.review_count} {language === 'si' ? 'සත්‍යාපිත සමාලෝචන' : 'verified reviews'})
          </div>

          {/* Footer Language Toggle */}
          <div className="pt-2 flex items-center gap-2 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#C59A4E]" />
            <span className="text-[#857D74]">{language === 'si' ? 'භාෂාව:' : 'Language:'}</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                language === 'en' ? 'bg-[#C59A4E] text-black font-bold' : 'text-[#857D74] hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('si')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                language === 'si' ? 'bg-[#C59A4E] text-black font-bold' : 'text-[#857D74] hover:text-white'
              }`}
            >
              සිංහල
            </button>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#F6F3EE]">
            {t('footer_quick_links')}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleNav('home')} className="hover:text-[#C59A4E] transition-colors">
                {t('nav_home')}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('menu')} className="hover:text-[#C59A4E] transition-colors">
                {t('nav_menu')}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('reserve')} className="hover:text-[#C59A4E] transition-colors">
                {t('nav_reserve')}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('about')} className="hover:text-[#C59A4E] transition-colors">
                {t('nav_about')}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('gallery')} className="hover:text-[#C59A4E] transition-colors">
                {t('nav_gallery')}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('contact')} className="hover:text-[#C59A4E] transition-colors">
                {t('nav_contact')}
              </button>
            </li>
          </ul>
        </div>

        {/* Hours & Service */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#F6F3EE]">
            {t('footer_service_hours')}
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#C59A4E] shrink-0 mt-0.5" />
              <div>
                <span className="text-white block font-medium">
                  {language === 'si' ? 'දිනපතා ආහාර සහ Takeaway' : 'Daily Dining & Takeaway'}
                </span>
                <span>{language === 'si' ? 'දිනපතා: පෙ.ව. 11:00 – රාත්‍රී 11:00' : settings.opening_hours}</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-[#7A7268]">
              {language === 'si' 
                ? 'ගම්පහ සහ ඒ අවට ප්‍රදේශ සඳහා WhatsApp හරහා ඩිලිවරි සේවාව ලබා ගත හැක.' 
                : 'Delivery available in Gampaha & surrounding areas via WhatsApp ordering.'}
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#F6F3EE]">
            {t('footer_hotline')}
          </h4>
          <div className="space-y-2 text-xs">
            <a 
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-white hover:text-[#C59A4E] transition-colors font-mono font-semibold"
            >
              <Phone className="w-4 h-4 text-[#C59A4E]" />
              <span>{settings.phone}</span>
            </a>
            <div className="flex items-start gap-2 text-[#857D74] pt-1">
              <MapPin className="w-4 h-4 text-[#C59A4E] shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Bottom copyright & admin access */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6A635B]">
        <div>
          © {new Date().getFullYear()} {settings.name}. {t('footer_rights')}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNav('admin')}
            className="flex items-center gap-1.5 hover:text-[#C59A4E] transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t('footer_admin_link')}</span>
            {isAdminAuthenticated && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
          </button>
        </div>
      </div>
    </footer>
  );
};

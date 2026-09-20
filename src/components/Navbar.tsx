import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ShoppingBag, Phone, Menu as MenuIcon, X, Utensils, Shield, MapPin, Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    settings, 
    cartItemCount, 
    cartSubtotal, 
    activeView, 
    setActiveView, 
    setIsCartDrawerOpen,
    isAdminAuthenticated,
    language,
    setLanguage,
    t
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: string; label: string; view: 'home' | 'menu' | 'reserve' | 'about' | 'gallery' | 'contact' | 'admin' }[] = [
    { id: 'nav-home', label: t('nav_home'), view: 'home' },
    { id: 'nav-menu', label: t('nav_menu'), view: 'menu' },
    { id: 'nav-reserve', label: t('nav_reserve'), view: 'reserve' },
    { id: 'nav-about', label: t('nav_about'), view: 'about' },
    { id: 'nav-gallery', label: t('nav_gallery'), view: 'gallery' },
    { id: 'nav-contact', label: t('nav_contact'), view: 'contact' },
  ];

  const handleNavClick = (view: any) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#151412]/95 backdrop-blur-md border-b border-[#C59A4E]/15 transition-all">
      {/* Top micro bar with address & phone & language */}
      <div className="hidden md:flex justify-between items-center px-6 lg:px-12 py-1.5 text-xs text-[#9E9589] border-b border-white/5">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#C59A4E]" />
          <span>{settings.address}</span>
          <span className="text-[#555]">•</span>
          <span className="text-[#C59A4E]">{language === 'si' ? 'දිනපතා රාත්‍රී 11:00 දක්වා' : settings.opening_hours}</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Microbar Language Switcher */}
          <div className="flex items-center gap-1.5 border-r border-white/10 pr-3">
            <Globe className="w-3.5 h-3.5 text-[#C59A4E]" />
            <button
              onClick={() => setLanguage('en')}
              className={`hover:text-[#C59A4E] transition-colors ${language === 'en' ? 'text-[#C59A4E] font-bold' : 'text-[#857D74]'}`}
            >
              English
            </button>
            <span className="text-[#555]">/</span>
            <button
              onClick={() => setLanguage('si')}
              className={`hover:text-[#C59A4E] transition-colors ${language === 'si' ? 'text-[#C59A4E] font-bold' : 'text-[#857D74]'}`}
            >
              සිංහල
            </button>
          </div>

          <a 
            href={`tel:${settings.phone.replace(/\s+/g, '')}`} 
            className="flex items-center gap-1.5 hover:text-[#C59A4E] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#C59A4E]" />
            <span>{settings.phone}</span>
          </a>
          <button
            onClick={() => handleNavClick('admin')}
            className="flex items-center gap-1 text-[#857D74] hover:text-[#C59A4E] transition-colors"
          >
            <Shield className="w-3 h-3" />
            <span>{t('nav_admin')}</span>
            {isAdminAuthenticated && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
          </button>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="btn-brand-home"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-[#C59A4E]/40 bg-black flex items-center justify-center group-hover:border-[#C59A4E] transition-all shadow-md group-hover:scale-105 shrink-0">
            <img
              src={settings.logo_url || "/logo.png"}
              alt="Vintage Restaurant & Cafe Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="block font-serif-vintage text-lg sm:text-xl font-bold tracking-wider text-[#F6F3EE] group-hover:text-[#C59A4E] transition-colors leading-tight uppercase">
              Vintage
            </span>
            <span className="block text-[10px] tracking-[0.2em] uppercase text-[#C59A4E] font-medium">
              Restaurant & Café
            </span>
          </div>
        </button>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map(link => {
            const isActive = activeView === link.view;
            return (
              <button
                key={link.id}
                id={link.id}
                onClick={() => handleNavClick(link.view)}
                className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                  isActive 
                    ? 'text-[#C59A4E]' 
                    : 'text-[#C3BAAF] hover:text-[#F6F3EE]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C59A4E] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Language Switcher / Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher Pill */}
          <div 
            id="lang-switcher-navbar"
            aria-label="Language selection"
            className="flex items-center p-1 rounded-full bg-[#201e1a] border border-[#C59A4E]/30 text-xs shadow-inner"
          >
            <button
              id="btn-lang-en"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                language === 'en'
                  ? 'bg-[#C59A4E] text-black shadow-sm'
                  : 'text-[#8E867A] hover:text-[#F6F3EE]'
              }`}
              title="Switch to English"
            >
              EN
            </button>
            <button
              id="btn-lang-si"
              onClick={() => setLanguage('si')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                language === 'si'
                  ? 'bg-[#C59A4E] text-black shadow-sm'
                  : 'text-[#8E867A] hover:text-[#F6F3EE]'
              }`}
              title="සිංහල භාෂාවට මාරු වන්න"
            >
              සිං
            </button>
          </div>

          {/* Book Table button */}
          <button
            id="btn-nav-book-table"
            onClick={() => handleNavClick('reserve')}
            className="hidden md:inline-flex items-center justify-center px-3.5 py-2.5 rounded-full bg-[#201e1a] hover:bg-[#272420] text-[#C59A4E] hover:text-[#F6F3EE] border border-[#C59A4E]/40 font-semibold text-xs tracking-wider uppercase transition-all shadow-sm active:scale-95"
          >
            {t('nav_book_table')}
          </button>

          {/* Order Now button */}
          <button
            id="btn-nav-order-now"
            onClick={() => handleNavClick('menu')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-gradient-to-r from-[#C59A4E] to-[#A8811F] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-md active:scale-95"
          >
            {t('nav_order_now')}
          </button>

          {/* Cart Icon & Counter */}
          <button
            id="btn-nav-cart"
            onClick={() => setIsCartDrawerOpen(true)}
            aria-label="Shopping Cart"
            className="relative p-2.5 rounded-full bg-[#201e1a] hover:bg-[#272420] border border-[#C59A4E]/30 text-[#F6F3EE] transition-all flex items-center gap-2 group"
          >
            <ShoppingBag className="w-5 h-5 text-[#C59A4E] group-hover:scale-110 transition-transform" />
            {cartItemCount > 0 && (
              <span className="hidden md:inline text-xs font-semibold text-[#F6F3EE]">
                {settings.currency} {cartSubtotal.toLocaleString()}
              </span>
            )}
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C59A4E] text-black rounded-full text-[11px] font-bold flex items-center justify-center shadow-md">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#C3BAAF] hover:text-[#F6F3EE] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#181614] border-b border-[#C59A4E]/20 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          {/* Mobile Language Switcher row */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs text-[#9E9589] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#C59A4E]" />
              <span>Language / භාෂාව:</span>
            </span>
            <div className="inline-flex rounded-full bg-[#262420] p-1 border border-[#C59A4E]/30">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-[#C59A4E] text-black'
                    : 'text-[#A89F93]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('si')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  language === 'si'
                    ? 'bg-[#C59A4E] text-black'
                    : 'text-[#A89F93]'
                }`}
              >
                සිංහල
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            {navLinks.map(link => (
              <button
                key={'mobile-' + link.id}
                onClick={() => handleNavClick(link.view)}
                className={`text-left py-2 text-base font-medium transition-colors ${
                  activeView === link.view ? 'text-[#C59A4E] pl-2 border-l-2 border-[#C59A4E]' : 'text-[#C3BAAF]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left py-2 text-sm text-[#857D74] flex items-center gap-2 border-t border-white/5 pt-4"
            >
              <Shield className="w-4 h-4 text-[#C59A4E]" />
              <span>{t('nav_admin')}</span>
              {isAdminAuthenticated && <span className="text-xs text-emerald-400 font-medium">(Logged In)</span>}
            </button>
          </nav>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => handleNavClick('menu')}
              className="w-full py-3 rounded-full bg-[#C59A4E] text-black font-semibold text-sm tracking-wider uppercase text-center"
            >
              {t('nav_order_now')}
            </button>
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="w-full py-2.5 rounded-full border border-[#C59A4E]/30 text-[#F6F3EE] text-sm text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#C59A4E]" />
              <span>{t('call_us')}: {settings.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

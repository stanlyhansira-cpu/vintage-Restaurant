import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Flame, 
  Tag, 
  Copy, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ArrowRight,
  Percent
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface PromoDeal {
  id: string;
  badgeEn: string;
  badgeSi: string;
  titleKey: 'promo_deal_1_title' | 'promo_deal_2_title' | 'promo_deal_3_title';
  descKey: 'promo_deal_1_desc' | 'promo_deal_2_desc' | 'promo_deal_3_desc';
  code: string;
  discount: string;
  tagColor: string;
}

const PROMO_DEALS: PromoDeal[] = [
  {
    id: 'deal-biryani',
    badgeEn: 'TODAY\'S CHEF SPECIAL',
    badgeSi: 'අද විශේෂ ආහාර දීමනාව',
    titleKey: 'promo_deal_1_title',
    descKey: 'promo_deal_1_desc',
    code: 'VINTAGE15',
    discount: '15% OFF',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'deal-cafe',
    badgeEn: 'TWILIGHT HAPPY HOUR (4PM - 7PM)',
    badgeSi: 'සවස 4 - 7 විශේෂ කැෆේ වේලාව',
    titleKey: 'promo_deal_2_title',
    descKey: 'promo_deal_2_desc',
    code: 'TWILIGHT50',
    discount: 'BOGO 50%',
    tagColor: 'bg-[#C59A4E]/20 text-[#E0BC75] border-[#C59A4E]/40'
  },
  {
    id: 'deal-delivery',
    badgeEn: 'LIMITED-TIME HIGHWAY PERK',
    badgeSi: 'සීමිත කාලීන ඩිලිවරි වාසිය',
    titleKey: 'promo_deal_3_title',
    descKey: 'promo_deal_3_desc',
    code: 'FREEGAMPAHA',
    discount: 'FREE DELIVERY',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  }
];

export const PromoBanner: React.FC = () => {
  const { t, language, activeView, setActiveView, showToast } = useRestaurant();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('vintage_promo_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic Countdown Timer to restaurant closing (11:00 PM today)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 0, 0, 0); // 11:00 PM
      if (now.getTime() > target.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      const diff = Math.max(0, target.getTime() - now.getTime());
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate specials every 6 seconds unless hovered
  useEffect(() => {
    if (isDismissed || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_DEALS.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDismissed, isPaused]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('vintage_promo_dismissed', 'true');
    } catch {
      // ignore storage failure
    }
  };

  const handleReopen = () => {
    setIsDismissed(false);
    try {
      sessionStorage.removeItem('vintage_promo_dismissed');
    } catch {
      // ignore
    }
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast(
      language === 'si'
        ? `ප්‍රවර්ධන කේතය (${code}) පිටපත් විය! WhatsApp හරහා ඇණවුම් කිරීමේදී භාවිතා කරන්න.`
        : `Promo code "${code}" copied! Mention it when ordering via WhatsApp for instant discount.`,
      'success'
    );
    setTimeout(() => setCopied(false), 2500);
  };

  const handleActionClick = () => {
    setActiveView('menu');
    const menuEl = document.getElementById('food-menu-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const activeDeal = PROMO_DEALS[currentIndex];

  // Only display on homepage as requested
  if (activeView !== 'home') {
    return null;
  }

  // If dismissed, show a floating pill so user can easily review specials again if desired
  if (isDismissed) {
    return (
      <div className="fixed top-14 sm:top-12 right-3 sm:right-6 z-50 animate-in fade-in slide-in-from-top duration-300">
        <button
          type="button"
          onClick={handleReopen}
          title={t('promo_reopen_tooltip')}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e1b17] hover:bg-[#28241f] border border-[#C59A4E]/50 text-[#C59A4E] text-xs font-semibold shadow-xl backdrop-blur-md transition-all hover:scale-105"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <Percent className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('promo_view_deals')}</span>
          <span className="font-bold text-white bg-[#C59A4E] text-black px-1.5 py-0.2 rounded text-[10px]">
            15% OFF
          </span>
        </button>
      </div>
    );
  }

  const format2Digits = (num: number) => num.toString().padStart(2, '0');

  return (
    <div
      id="promotional-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative z-50 bg-gradient-to-r from-[#14120f] via-[#211d17] to-[#14120f] border-b border-[#C59A4E]/30 text-white shadow-xl overflow-hidden transition-all duration-300"
    >
      {/* Subtle luxury ambient gold glow in background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C59A4E]/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Arrow Controls (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + PROMO_DEALS.length) % PROMO_DEALS.length)}
              className="p-1 rounded-full text-[#9E9589] hover:text-[#C59A4E] hover:bg-white/5 transition-colors"
              aria-label="Previous special"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % PROMO_DEALS.length)}
              className="p-1 rounded-full text-[#9E9589] hover:text-[#C59A4E] hover:bg-white/5 transition-colors"
              aria-label="Next special"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Main High-Impact Offer Display */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left min-w-0">
            
            {/* Live Pulsing Badge */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border shadow-sm ${activeDeal.tagColor}`}>
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{language === 'si' ? activeDeal.badgeSi : activeDeal.badgeEn}</span>
              </span>

              {/* Countdown badge */}
              <div className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 border border-white/10 text-[10px] text-[#A89F93]">
                <Clock className="w-3 h-3 text-[#C59A4E]" />
                <span>{t('promo_countdown_ends')}:</span>
                <span className="font-mono font-bold text-white">
                  {format2Digits(timeLeft.hours)}h {format2Digits(timeLeft.minutes)}m {format2Digits(timeLeft.seconds)}s
                </span>
              </div>
            </div>

            {/* Headline & Description */}
            <div className="flex items-center gap-2 text-xs sm:text-sm truncate">
              <span className="font-bold text-[#F6F3EE] truncate">
                {t(activeDeal.titleKey)}
              </span>
              <span className="hidden xl:inline text-[#A89F93]">
                — {t(activeDeal.descKey)}
              </span>
            </div>

            {/* Interactive Promo Code Box */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={(e) => handleCopyCode(activeDeal.code, e)}
                title="Click to copy promo code"
                className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2b261f] hover:bg-[#383127] border border-[#C59A4E]/50 text-xs font-mono font-bold text-[#E0BC75] transition-all hover:border-[#C59A4E] shadow-sm"
              >
                <Tag className="w-3 h-3 text-[#C59A4E]" />
                <span className="tracking-wider">{activeDeal.code}</span>
                {copied ? (
                  <span className="flex items-center text-emerald-400 text-[10px]">
                    <Check className="w-3 h-3 ml-0.5" />
                    <span className="ml-1 hidden sm:inline">{t('promo_copied')}</span>
                  </span>
                ) : (
                  <Copy className="w-3 h-3 text-[#999] group-hover:text-white transition-colors" />
                )}
              </button>

              {/* CTA Action button */}
              <button
                type="button"
                onClick={handleActionClick}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#C59A4E] hover:bg-[#d6a958] text-black text-xs font-bold uppercase tracking-wider transition-all hover:shadow-md hover:shadow-amber-500/20"
              >
                <span>{t('promo_order_now')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* Right: Carousel Dots + Dismiss Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Dots */}
            <div className="hidden sm:flex items-center gap-1">
              {PROMO_DEALS.map((deal, idx) => (
                <button
                  key={deal.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'w-4 bg-[#C59A4E]' 
                      : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to deal ${idx + 1}`}
                />
              ))}
            </div>

            {/* Dismiss 'X' Button */}
            <button
              type="button"
              id="btn-dismiss-promo-banner"
              onClick={handleDismiss}
              title="Dismiss promotion banner"
              className="p-1 rounded-full text-[#9E9589] hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-[#C59A4E]"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

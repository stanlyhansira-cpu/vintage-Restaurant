import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Sparkles, Gift, ShieldCheck, Loader2 } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const NewsletterSignup: React.FC = () => {
  const { t, language, showToast } = useRestaurant();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastSubscribedEmail, setLastSubscribedEmail] = useState('');

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      showToast(t('newsletter_invalid_email'), 'error');
      return;
    }

    if (!validateEmail(trimmed)) {
      showToast(t('newsletter_invalid_email'), 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Call Backend API
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      // 2. Also record in client localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('vintage_newsletter_subscribers') || '[]');
        if (!saved.includes(trimmed.toLowerCase())) {
          saved.push(trimmed.toLowerCase());
          localStorage.setItem('vintage_newsletter_subscribers', JSON.stringify(saved));
        }
      } catch {
        // ignore localStorage errors
      }

      // 3. Success Toast & UI State
      setIsSubscribed(true);
      setLastSubscribedEmail(trimmed);
      setEmail('');

      const toastMessage = language === 'si'
        ? `සාදරයෙන් පිළිගනිමු! ${trimmed} ලිපිනය වෙත වින්ටේජ් 10% වට්ටම් කේතය සුරැකිණි.`
        : `Welcome! 10% dining welcome voucher queued for ${trimmed}.`;

      showToast(toastMessage, 'success');
    } catch (err) {
      // In case server fails, fallback to local confirmation
      try {
        const saved = JSON.parse(localStorage.getItem('vintage_newsletter_subscribers') || '[]');
        if (!saved.includes(trimmed.toLowerCase())) {
          saved.push(trimmed.toLowerCase());
          localStorage.setItem('vintage_newsletter_subscribers', JSON.stringify(saved));
        }
      } catch {
        // ignore
      }

      setIsSubscribed(true);
      setLastSubscribedEmail(trimmed);
      setEmail('');
      showToast(t('newsletter_success_title'), 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscribeAnother = () => {
    setIsSubscribed(false);
    setEmail('');
  };

  return (
    <div
      id="newsletter-signup-card"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b1916] via-[#201d18] to-[#161412] border border-[#C59A4E]/30 p-6 sm:p-8 lg:p-10 shadow-2xl mb-12"
    >
      {/* Subtle gold gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59A4E]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C59A4E]/5 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Value Proposition */}
        <div className="lg:col-span-6 space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A4E]/15 border border-[#C59A4E]/30 text-[#E0BC75] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C59A4E]" />
            <span>VIP Dining Perks</span>
          </div>

          <h3 className="font-serif-vintage text-2xl sm:text-3xl font-bold text-[#F6F3EE] tracking-wide leading-tight">
            {t('newsletter_title')}
          </h3>

          <p className="text-xs sm:text-sm text-[#A89F93] leading-relaxed max-w-xl">
            {t('newsletter_subtitle')}
          </p>

          {/* Value proposition badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-[#C59A4E]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-[#C59A4E]/20">
              <Gift className="w-3.5 h-3.5" />
              <span>{t('newsletter_perk_discount')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-[#C59A4E]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('newsletter_perk_specials')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-[#C59A4E]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('newsletter_perk_events')}</span>
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Subscription Form / Success State */}
        <div className="lg:col-span-6">
          {isSubscribed ? (
            <div
              id="newsletter-success-state"
              className="rounded-2xl bg-black/50 border border-emerald-500/30 p-5 sm:p-6 text-left space-y-3 animate-in fade-in zoom-in-95 duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {t('newsletter_success_title')}
                  </h4>
                  <p className="text-xs text-[#A89F93] mt-0.5">
                    {t('newsletter_success_desc')}
                  </p>
                </div>
              </div>

              {lastSubscribedEmail && (
                <div className="text-xs font-mono text-[#C59A4E] bg-[#1a1714] px-3 py-1.5 rounded-lg border border-[#C59A4E]/20 inline-block">
                  {lastSubscribedEmail}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  id="newsletter-subscribe-another-btn"
                  onClick={handleSubscribeAnother}
                  className="text-xs text-[#C59A4E] hover:text-[#d6a958] underline underline-offset-4 transition-colors"
                >
                  {language === 'si' ? 'වෙනත් ඊමේල් ලිපිනයක් ලියාපදිංචි කරන්න' : 'Subscribe another email address'}
                </button>
              </div>
            </div>
          ) : (
            <form
              id="newsletter-signup-form"
              onSubmit={handleSubmit}
              className="space-y-3"
              noValidate
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7268]">
                    <Mail className="w-4 h-4 text-[#C59A4E]" />
                  </div>
                  <input
                    id="newsletter-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter_placeholder')}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-black/60 border border-[#C59A4E]/30 text-sm text-[#F6F3EE] placeholder-[#7A7268] focus:outline-none focus:border-[#C59A4E] focus:ring-1 focus:ring-[#C59A4E] transition-all disabled:opacity-60"
                    aria-label="Email address for newsletter"
                    required
                  />
                </div>

                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl bg-[#C59A4E] hover:bg-[#d6a958] active:bg-[#b0873e] text-black font-semibold text-sm tracking-wider uppercase transition-all hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('newsletter_subscribing')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('newsletter_btn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#7A7268]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C59A4E] shrink-0" />
                <span>{t('newsletter_privacy_note')}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

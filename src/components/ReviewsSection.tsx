import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, CheckCircle, Plus, Send, X, ThumbsUp, ShieldCheck } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { CustomerReview } from '../types';
import { DEFAULT_REVIEWS } from '../data/defaultData';

export const ReviewsSection: React.FC = () => {
  const { settings, t, language, showToast } = useRestaurant();
  const [reviews, setReviews] = useState<CustomerReview[]>(DEFAULT_REVIEWS);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setReviews(data);
          }
        }
      } catch (err) {
        // Fallback gracefully to default reviews
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      showToast(language === 'si' ? 'කරුණාකර ඔබගේ නම ඇතුළත් කරන්න' : 'Please enter your name', 'error');
      return;
    }
    if (!comment.trim()) {
      showToast(language === 'si' ? 'කරුණාකර ඔබගේ අදහස් ඇතුළත් කරන්න' : 'Please enter your review feedback', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: reviewerName.trim(),
          rating,
          comment: comment.trim()
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit review');
      }

      const createdReview: CustomerReview = await res.json();
      setReviews(prev => [createdReview, ...prev]);
      setReviewerName('');
      setComment('');
      setRating(5);
      setIsFormOpen(false);
      showToast(
        language === 'si' 
          ? 'ස්තූතියි! ඔබගේ සමාලෝචනය සාර්ථකව පළ විය.' 
          : 'Thank you! Your review has been posted successfully.',
        'success'
      );
    } catch (err) {
      showToast(
        language === 'si'
          ? 'සමාලෝචනය පළ කිරීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.'
          : 'Failed to submit review. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute stats
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : (settings.google_rating || 3.8).toFixed(1);

  return (
    <section id="reviews-section" className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C59A4E] mb-2">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>{t('reviews_tag')}</span>
        </div>
        <h2 className="font-serif-vintage text-3xl sm:text-4xl md:text-5xl font-bold text-[#F6F3EE] mb-3">
          {t('reviews_title')}
        </h2>
        <p className="text-sm text-[#A89F93]">
          {t('reviews_subtitle')}
        </p>
      </div>

      {/* Trust & Google Rating Banner */}
      <div className="rounded-3xl bg-[#1a1815] border border-[#C59A4E]/20 p-6 sm:p-8 mb-12 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-[#262420] border border-[#C59A4E]/30 flex flex-col items-center justify-center shadow-inner">
              <span className="font-serif-vintage text-3xl font-bold text-[#C59A4E]">{averageRating}</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-3 h-3 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {language === 'si' ? 'ගූගල් සත්‍යාපිත සමාලෝචන' : 'Google Verified Rating'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C59A4E]/20 text-[#C59A4E]">
                  {settings.google_rating} ★
                </span>
              </div>
              <p className="text-sm text-[#C3BAAF]">
                {t('reviews_google_summary')} ({settings.review_count}+ {language === 'si' ? 'අදහස්' : 'reviews'})
              </p>
              <span className="text-xs text-[#857D74]">
                {language === 'si' ? 'ගම්පහ ප්‍රදේශයේ ප්‍රමුඛතම භෝජනාගාරයක් ලෙස පිළිගැනීමට ලක්ව ඇත' : 'Ranked among the premier dining destinations along Gampaha highway'}
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            id="btn-write-review"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#C59A4E] hover:bg-[#b0873f] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-black/40 transition-all"
          >
            {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isFormOpen ? t('reviews_cancel_btn') : t('reviews_write_btn')}</span>
          </button>
        </div>

        {/* Inline Review Submission Form */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmitReview}
            className="mt-8 pt-8 border-t border-white/10 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <h3 className="font-serif-vintage text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C59A4E] fill-[#C59A4E]" />
              <span>{t('reviews_write_btn')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                  {language === 'si' ? 'ඔබගේ නම' : 'Your Full Name'} <span className="text-[#C59A4E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder={t('reviews_name_placeholder')}
                  className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#666] focus:outline-none focus:border-[#C59A4E] transition-colors"
                />
              </div>

              {/* Rating selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-2">
                  {t('reviews_rating_label')} <span className="text-[#C59A4E]">*</span>
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-amber-400 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${isFilled ? 'fill-amber-400' : 'text-[#555]'}`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-[#C59A4E] ml-2">
                    {rating} / 5
                  </span>
                </div>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                {language === 'si' ? 'ඔබගේ සමාලෝචන සටහන' : 'Your Review & Comments'} <span className="text-[#C59A4E]">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('reviews_comment_placeholder')}
                className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#666] focus:outline-none focus:border-[#C59A4E] transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#857D74] hover:text-white transition-colors"
              >
                {t('reviews_cancel_btn')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-[#C59A4E] hover:bg-[#b0873f] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : t('reviews_submit_btn')}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-3xl bg-[#1d1b18] border border-white/5 p-6 hover:border-[#C59A4E]/30 transition-all flex flex-col justify-between space-y-4 group shadow-md"
          >
            <div>
              {/* Card top */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2a2622] border border-[#C59A4E]/30 flex items-center justify-center font-serif-vintage text-sm font-bold text-[#C59A4E]">
                    {rev.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white group-hover:text-[#C59A4E] transition-colors">
                      {rev.customer_name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#857D74]">
                      <span>{rev.date}</span>
                      {rev.is_verified && (
                        <span className="flex items-center gap-0.5 text-emerald-400 text-[10px]">
                          <CheckCircle className="w-3 h-3" />
                          <span>{t('reviews_verified')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-[#444]'
                        }`}
                      />
                    ))}
                  </div>
                  {rev.source && (
                    <span className="text-[10px] text-[#777] mt-1">
                      via {rev.source}
                    </span>
                  )}
                </div>
              </div>

              {/* Review text */}
              <p className="text-sm text-[#C3BAAF] leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#6d665e]">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-[#C59A4E]" />
                <span>Vintage Dining Experience</span>
              </span>
              <span>Gampaha</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Utensils, Heart, Sparkles, MapPin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { settings, setActiveView } = useRestaurant();

  return (
    <section id="about-section" className="py-24 px-4 sm:px-6 lg:px-12 bg-[#171513] border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Visual Composition */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
              alt="Vintage Restaurant Culinary Craft"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase tracking-widest text-[#C59A4E] font-semibold block mb-1">
                Gampaha Highway Experience
              </span>
              <p className="font-serif-vintage text-xl text-white font-medium">
                "{settings.tagline || 'Taste the Vintage.'}"
              </p>
            </div>
          </div>

          {/* Floating Accents */}
          <div className="hidden sm:flex absolute -bottom-6 -right-6 p-5 rounded-2xl bg-[#201e1a] border border-[#C59A4E]/30 shadow-xl items-center gap-4 max-w-xs">
            <div className="w-12 h-12 rounded-xl bg-[#C59A4E]/15 text-[#C59A4E] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#857D74] block uppercase font-semibold">Our Promise</span>
              <span className="text-sm font-serif-vintage text-[#F6F3EE] font-bold">
                {settings.description ? settings.description.split('.')[0] : 'A Grade Foods'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Story */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C59A4E]">
            <Utensils className="w-4 h-4" />
            <span>About Vintage Restaurant & Cafe</span>
          </div>

          <h2 className="font-serif-vintage text-3xl sm:text-4xl md:text-5xl font-bold text-[#F6F3EE] leading-tight">
            Crafting Great Food & Unforgettable Moments
          </h2>

          <p className="text-base text-[#C3BAAF] leading-relaxed font-light">
            {settings.about_text || "Welcome to Vintage Restaurant & Cafe Gampaha, where great food and memorable moments come together. Situated conveniently along the Ja-Ela–Ekala–Gampaha–Yakkala highway, we offer a welcoming ambiance paired with freshly prepared Sri Lankan favorites, fusion bites, specialty coffees, and refreshing beverages."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs text-[#A89F93]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C59A4E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Prime Location</span>
                <span>Convenient highway stop with easy parking and comfortable seating.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="w-4 h-4 text-[#C59A4E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Family & Friends</span>
                <span>Spacious dining arrangements suitable for gatherings, celebrations, and casual coffee.</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setActiveView('menu')}
              className="px-8 py-3.5 rounded-full bg-[#C59A4E] hover:bg-[#E2BF4D] text-black font-bold text-xs tracking-wider uppercase transition-colors"
            >
              Explore Our Menu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

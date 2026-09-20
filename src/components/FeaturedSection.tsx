import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodCard } from './FoodCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const { menuItems, setActiveView } = useRestaurant();

  const featuredItems = menuItems.filter(item => item.is_featured && item.is_available);

  if (featuredItems.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C59A4E] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Favorites</span>
          </div>
          <h2 className="font-serif-vintage text-3xl sm:text-4xl md:text-5xl font-bold text-[#F6F3EE]">
            Signature Specialties
          </h2>
          <p className="text-sm text-[#A89F93] mt-2 max-w-xl">
            Freshly prepared with authentic Sri Lankan spices, wok-charred basmati rice, gourmet burgers, and artisan cafe drinks.
          </p>
        </div>

        <button
          onClick={() => setActiveView('menu')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#C59A4E] hover:text-[#E2BF4D] transition-colors group self-start md:self-auto"
        >
          <span>View Complete Menu</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredItems.slice(0, 8).map(item => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { Award, MessageSquare, UtensilsCrossed, Clock } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const WhyVintageSection: React.FC = () => {
  const { settings } = useRestaurant();

  const features = [
    {
      icon: Award,
      title: 'A Grade Foods',
      description: 'We prioritize premium quality ingredients, fresh meats, farm vegetables, and authentic spices in every dish.'
    },
    {
      icon: MessageSquare,
      title: 'Seamless WhatsApp Ordering',
      description: 'Order effortlessly directly to our kitchen phone on WhatsApp. No account or password required.'
    },
    {
      icon: UtensilsCrossed,
      title: 'Versatile Dining & Takeaway',
      description: 'From flavorful Sri Lankan cheese kottu to wok-tossed fried rice and cafe coffees, our menu caters to every craving.'
    },
    {
      icon: Clock,
      title: 'Open Daily till 11 PM',
      description: `Conveniently situated on ${settings.address.split(',')[0]} for evening dinners, takeaway, and late bites.`
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#171513] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C59A4E] block mb-2">
            The Vintage Experience
          </span>
          <h2 className="font-serif-vintage text-3xl sm:text-4xl font-bold text-[#F6F3EE] mb-4">
            Why Dine With Vintage?
          </h2>
          <p className="text-sm text-[#A89F93]">
            Great food, good moments, and genuine hospitality along the Gampaha highway.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[#1d1b18] border border-white/5 hover:border-[#C59A4E]/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#262420] border border-white/10 flex items-center justify-center text-[#C59A4E] mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-vintage text-lg font-semibold text-[#F6F3EE] mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#8F877D] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

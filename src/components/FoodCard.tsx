import React from 'react';
import { MenuItem } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { Plus, SlidersHorizontal, Clock } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { settings, categories, addToCart, openFoodModal } = useRestaurant();

  const category = categories.find(c => c.id === item.category_id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.is_available) return;

    // If item has add-on options, open customization modal so customer can choose
    if (item.add_ons && item.add_ons.length > 0) {
      openFoodModal(item);
    } else {
      addToCart(item, 1, '', []);
    }
  };

  return (
    <div 
      id={`food-card-${item.id}`}
      onClick={() => openFoodModal(item)}
      className={`group relative flex flex-col rounded-2xl bg-[#1d1b18] border border-white/5 hover:border-[#C59A4E]/40 transition-all duration-300 overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-black/40 ${
        !item.is_available ? 'opacity-65 grayscale-[20%]' : ''
      }`}
    >
      {/* Food Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#262420]">
        <img
          src={item.image_url}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1d1b18] via-transparent to-transparent opacity-80" />

        {/* Featured Badge */}
        {item.is_featured && (
          <span className="absolute top-3 left-3 bg-[#C59A4E] text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
            Chef's Special
          </span>
        )}

        {/* Availability Badge */}
        {!item.is_available && (
          <span className="absolute top-3 right-3 bg-red-900/90 text-red-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm border border-red-500/30">
            Currently Unavailable
          </span>
        )}

        {/* Category Pill */}
        {category && (
          <span className="absolute bottom-3 left-3 text-[11px] font-medium text-[#C3BAAF] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
            {category.name}
          </span>
        )}
      </div>

      {/* Food Info Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif-vintage text-lg font-semibold text-[#F6F3EE] group-hover:text-[#C59A4E] transition-colors line-clamp-1">
              {item.name}
            </h3>
          </div>

          <p className="text-xs text-[#8F877D] line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div>
          {/* Preparation / Portion info */}
          {(item.portion_size || item.preparation_note) && (
            <div className="flex items-center gap-2 text-[11px] text-[#A89F93] mb-3">
              {item.portion_size && (
                <span className="bg-[#262420] px-2 py-0.5 rounded text-[10px] text-[#BDB3A7]">
                  {item.portion_size}
                </span>
              )}
              {item.preparation_note && (
                <span className="flex items-center gap-1 text-[10px] truncate text-[#7A7268]">
                  <Clock className="w-2.5 h-2.5" />
                  {item.preparation_note}
                </span>
              )}
            </div>
          )}

          {/* Price and Action Footer */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-[#857D74] block uppercase tracking-wider">Price</span>
              <span className="text-base sm:text-lg font-bold text-[#F6F3EE] font-mono">
                {settings.currency} {item.price.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Customize button */}
              {item.add_ons && item.add_ons.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFoodModal(item);
                  }}
                  className="p-2 rounded-xl bg-[#262420] hover:bg-[#302d28] text-[#C3BAAF] hover:text-[#F6F3EE] border border-white/5 transition-colors text-xs flex items-center gap-1"
                  title="Customize dish"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C59A4E]" />
                  <span className="hidden sm:inline text-[11px]">Options</span>
                </button>
              )}

              {/* Add to Cart button */}
              <button
                type="button"
                id={`btn-add-${item.id}`}
                disabled={!item.is_available}
                onClick={handleQuickAdd}
                className={`px-3.5 py-2 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                  item.is_available
                    ? 'bg-[#C59A4E] hover:bg-[#E2BF4D] text-black active:scale-95'
                    : 'bg-white/5 text-[#666] cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{item.add_ons && item.add_ons.length > 0 ? 'Add' : 'Add'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

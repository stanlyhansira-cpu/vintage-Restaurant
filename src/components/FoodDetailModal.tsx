import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { AddOnOption } from '../types';
import { X, Plus, Minus, Check, Clock, Utensils } from 'lucide-react';

export const FoodDetailModal: React.FC = () => {
  const { selectedFoodForModal, closeFoodModal, addToCart, settings, categories } = useRestaurant();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);

  // Reset local state when item changes
  useEffect(() => {
    setQuantity(1);
    setSpecialInstructions('');
    setSelectedAddOns([]);
  }, [selectedFoodForModal]);

  if (!selectedFoodForModal) return null;

  const item = selectedFoodForModal;
  const category = categories.find(c => c.id === item.category_id);

  const toggleAddOn = (addon: AddOnOption) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!item.is_available) return;
    addToCart(item, quantity, specialInstructions, selectedAddOns);
    closeFoodModal();
  };

  return (
    <div 
      id="food-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={closeFoodModal}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#1d1b18] border border-[#C59A4E]/25 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeFoodModal}
          aria-label="Close food details"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white/80 hover:text-white transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Image Banner */}
        <div className="relative aspect-[16/10] w-full bg-[#262420] overflow-hidden">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1b18] via-transparent to-black/30" />
          
          {category && (
            <span className="absolute bottom-4 left-5 text-xs font-semibold text-[#C59A4E] bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#C59A4E]/30">
              {category.name}
            </span>
          )}

          {!item.is_available && (
            <span className="absolute top-4 left-5 bg-red-900/90 text-red-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-red-500/30">
              Currently Unavailable
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif-vintage text-2xl sm:text-3xl font-bold text-[#F6F3EE]">
                {item.name}
              </h2>
              <span className="text-xl font-bold text-[#C59A4E] whitespace-nowrap font-mono">
                {settings.currency} {item.price.toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-[#A89F93] mt-2 leading-relaxed">
              {item.description}
            </p>

            {(item.portion_size || item.preparation_note) && (
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[#857D74]">
                {item.portion_size && (
                  <span className="flex items-center gap-1.5 bg-[#262420] px-2.5 py-1 rounded-md text-[#BDB3A7]">
                    <Utensils className="w-3 h-3 text-[#C59A4E]" />
                    {item.portion_size}
                  </span>
                )}
                {item.preparation_note && (
                  <span className="flex items-center gap-1.5 bg-[#262420] px-2.5 py-1 rounded-md text-[#BDB3A7]">
                    <Clock className="w-3 h-3 text-[#C59A4E]" />
                    {item.preparation_note}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Add-ons section if available */}
          {item.add_ons && item.add_ons.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-3">
                Optional Add-ons / Extras
              </h4>
              <div className="space-y-2">
                {item.add_ons.map(addon => {
                  const isChecked = selectedAddOns.some(a => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => toggleAddOn(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked 
                          ? 'bg-[#C59A4E]/10 border-[#C59A4E] text-[#F6F3EE]' 
                          : 'bg-[#262420] border-white/5 text-[#A89F93] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked ? 'bg-[#C59A4E] border-[#C59A4E] text-black' : 'border-[#666]'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm font-medium">{addon.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#C59A4E]">
                        +{settings.currency} {addon.price.toLocaleString()}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="pt-4 border-t border-white/10">
            <label 
              htmlFor="special-instructions-input"
              className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-2"
            >
              Special Instructions
            </label>
            <textarea
              id="special-instructions-input"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less spicy please, separate sauce, no celery..."
              rows={2}
              maxLength={200}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#6A635B] focus:outline-none focus:border-[#C59A4E] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-5 sm:p-6 bg-[#171513] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
            <span className="text-xs text-[#857D74] sm:hidden uppercase font-semibold">Quantity</span>
            <div className="flex items-center border border-white/10 rounded-xl bg-[#262420] overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="p-2.5 hover:bg-white/5 text-[#C3BAAF] hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-white min-w-[36px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="p-2.5 hover:bg-white/5 text-[#C3BAAF] hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Submit button */}
          <button
            type="button"
            id="btn-modal-add-to-cart"
            disabled={!item.is_available}
            onClick={handleAddToCart}
            className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${
              item.is_available
                ? 'bg-gradient-to-r from-[#C59A4E] to-[#A8811F] text-black hover:opacity-95 active:scale-98 shadow-[#C59A4E]/10'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            <span>Add to Cart</span>
            <span>•</span>
            <span>{settings.currency} {totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const StickyMobileCartBar: React.FC = () => {
  const { cartItemCount, cartSubtotal, settings, setIsCartDrawerOpen, activeView } = useRestaurant();

  // Hide on desktop or if cart is empty or already in checkout/order-success
  if (cartItemCount === 0 || activeView === 'checkout' || activeView === 'order-success' || activeView === 'admin') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-black via-[#161412] to-transparent pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto">
        <button
          id="btn-sticky-mobile-cart"
          onClick={() => setIsCartDrawerOpen(true)}
          className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#C59A4E] to-[#A8811F] text-black font-semibold shadow-2xl shadow-black/80 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider block opacity-90">Your Order</span>
              <span className="text-sm font-bold block">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} • {settings.currency} {cartSubtotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-black/15 px-3 py-1.5 rounded-lg">
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};

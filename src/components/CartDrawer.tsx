import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    settings,
    setActiveView
  } = useRestaurant();

  if (!isCartDrawerOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreMenu = () => {
    setIsCartDrawerOpen(false);
    setActiveView('menu');
  };

  return (
    <div 
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div 
        id="cart-drawer-content"
        className="relative w-full max-w-md bg-[#181614] border-l border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#151311]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C59A4E]" />
            <h2 className="font-serif-vintage text-xl font-bold text-[#F6F3EE]">
              Your Cart
            </h2>
            {cart.length > 0 && (
              <span className="text-xs bg-[#262420] text-[#C59A4E] px-2 py-0.5 rounded-full font-medium">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-[#857D74] hover:text-red-400 transition-colors p-1"
                title="Empty Cart"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              id="btn-close-cart"
              onClick={() => setIsCartDrawerOpen(false)}
              aria-label="Close cart"
              className="p-2 text-[#A89F93] hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-[#262420] border border-white/5 flex items-center justify-center text-[#7A7268] mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif-vintage text-xl font-semibold text-[#F6F3EE] mb-2">
                Your cart is empty.
              </h3>
              <p className="text-sm text-[#857D74] max-w-xs mb-6">
                Discover our signature dishes, kottu specials, coffees and sweet desserts.
              </p>
              <button
                type="button"
                onClick={handleExploreMenu}
                className="px-6 py-3 rounded-full bg-[#C59A4E] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#E2BF4D] transition-colors"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div 
                  key={item.cart_id}
                  className="p-3.5 rounded-2xl bg-[#201e1a] border border-white/5 flex gap-3.5 items-start"
                >
                  <img
                    src={item.item.image_url}
                    alt={item.item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#2a2723] shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm text-[#F6F3EE] line-clamp-1">
                        {item.item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cart_id)}
                        className="text-[#666] hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Selected add-ons */}
                    {item.selected_add_ons.length > 0 && (
                      <div className="text-[11px] text-[#A89F93] mt-0.5">
                        {item.selected_add_ons.map(a => a.name).join(', ')}
                      </div>
                    )}

                    {/* Special instruction notes */}
                    {item.special_instructions && (
                      <div className="text-[11px] text-[#C59A4E]/90 italic mt-0.5 truncate">
                        "{item.special_instructions}"
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-semibold text-[#C59A4E] font-mono">
                        {settings.currency} {(item.unit_price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity controls */}
                      <div className="flex items-center border border-white/10 rounded-lg bg-[#181614] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cart_id, item.quantity - 1)}
                          className="px-2 py-1 text-[#A89F93] hover:text-white hover:bg-white/5 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-white min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cart_id, item.quantity + 1)}
                          className="px-2 py-1 text-[#A89F93] hover:text-white hover:bg-white/5 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer / Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#151311] space-y-4">
            <div className="space-y-2 text-xs text-[#A89F93]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#F6F3EE] font-mono font-medium">
                  {settings.currency} {cartSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#7A7268]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#C59A4E]" />
                  Delivery fee
                </span>
                <span>Calculated at checkout (Free for pickup)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-between items-baseline">
              <span className="text-sm font-semibold text-[#F6F3EE]">Subtotal</span>
              <span className="text-xl font-bold text-[#C59A4E] font-mono">
                {settings.currency} {cartSubtotal.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              id="btn-drawer-checkout"
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C59A4E] via-[#E2BF4D] to-[#C59A4E] text-black font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-xl"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

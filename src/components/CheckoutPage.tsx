import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { OrderType, CreateOrderRequest } from '../types';
import { ArrowLeft, MessageCircle, Truck, ShoppingBag, ShieldCheck, AlertCircle, Check } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, settings, setActiveView, setLastOrderResult, showToast } = useRestaurant();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('Gampaha');
  const [orderNote, setOrderNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delivery fee calculation
  const deliveryFee = orderType === 'delivery' ? (settings.delivery_fee || 0) : 0;
  const estimatedTotal = cartSubtotal + deliveryFee;

  // Validate Sri Lankan phone number
  const validatePhone = (num: string): boolean => {
    const clean = num.replace(/[\s\-\(\)]/g, '');
    // Sri Lanka phone formats: 07XXXXXXXX (10 digits) or +947XXXXXXXX / 947XXXXXXXX (11-12 digits)
    return /^(?:0|94|\+94)?7[0-9]{8}$/.test(clean);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add food before checking out.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!phone.trim() || !validatePhone(phone)) {
      setErrorMessage('Please enter a valid Sri Lankan mobile phone number (e.g. 071 996 1500 or 077 123 4567).');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please enter your complete delivery street address.');
      return;
    }

    // Prepare payload
    const orderPayload: CreateOrderRequest = {
      customer_name: fullName.trim(),
      customer_phone: phone.trim(),
      order_type: orderType,
      delivery_address: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      city: orderType === 'delivery' ? (city.trim() || 'Gampaha') : undefined,
      special_instructions: orderNote.trim() || undefined,
      items: cart.map(c => ({
        menu_item_id: c.item.id,
        quantity: c.quantity,
        special_instructions: c.special_instructions,
        selected_add_on_ids: c.selected_add_ons.map(a => a.id)
      }))
    };

    setIsSubmitting(true);

    try {
      // POST to backend API for verified server-side price computation and order storage
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      // Success!
      setLastOrderResult(data.order, data.whatsappUrl);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Something went wrong while creating your order. Please try again.');
      showToast(err.message || 'Order failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <ShoppingBag className="w-16 h-16 text-[#857D74] mb-4" />
        <h2 className="font-serif-vintage text-2xl font-bold text-[#F6F3EE] mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-[#A89F93] mb-6">
          Add some delicious food from our menu before proceeding to checkout.
        </p>
        <button
          onClick={() => setActiveView('menu')}
          className="px-6 py-3 rounded-full bg-[#C59A4E] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#E2BF4D] transition-colors"
        >
          View Menu
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setActiveView('menu')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#A89F93] hover:text-[#C59A4E] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continue Browsing Menu</span>
      </button>

      <div className="mb-8">
        <h1 className="font-serif-vintage text-3xl sm:text-4xl font-bold text-[#F6F3EE] mb-2">
          Checkout & Order Details
        </h1>
        <p className="text-sm text-[#A89F93]">
          Complete your information below to place your order directly with Vintage Restaurant via WhatsApp.
        </p>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer and Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact Info Card */}
          <div className="p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C59A4E] flex items-center gap-2">
              <span>1. Contact Information</span>
            </h2>

            <div>
              <label htmlFor="customer-name" className="block text-xs text-[#C3BAAF] mb-1.5 font-medium">
                Full Name <span className="text-[#C59A4E]">*</span>
              </label>
              <input
                id="customer-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Perera"
                className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#6A635B] focus:outline-none focus:border-[#C59A4E] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="customer-phone" className="block text-xs text-[#C3BAAF] mb-1.5 font-medium">
                Phone Number (WhatsApp Active) <span className="text-[#C59A4E]">*</span>
              </label>
              <input
                id="customer-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 071 996 1500 or 077 123 4567"
                className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#6A635B] focus:outline-none focus:border-[#C59A4E] transition-colors"
              />
              <span className="block text-[11px] text-[#7A7268] mt-1">
                We'll prepare your WhatsApp message to send from this number.
              </span>
            </div>
          </div>

          {/* 2. Order Type & Delivery Details */}
          <div className="p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-lg space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C59A4E] flex items-center gap-2">
              <span>2. Order Fulfillment Type</span>
            </h2>

            {/* Order Type Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="btn-order-type-delivery"
                onClick={() => setOrderType('delivery')}
                className={`py-3.5 px-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                  orderType === 'delivery'
                    ? 'bg-[#C59A4E]/15 border-[#C59A4E] text-[#F6F3EE]'
                    : 'bg-[#262420] border-white/5 text-[#A89F93] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#C59A4E]" />
                  <span className="font-semibold text-sm">Delivery</span>
                </div>
                <span className="text-[11px] text-[#857D74]">
                  Delivered to your doorstep (+{settings.currency} {settings.delivery_fee})
                </span>
              </button>

              <button
                type="button"
                id="btn-order-type-pickup"
                onClick={() => setOrderType('pickup')}
                className={`py-3.5 px-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                  orderType === 'pickup'
                    ? 'bg-[#C59A4E]/15 border-[#C59A4E] text-[#F6F3EE]'
                    : 'bg-[#262420] border-white/5 text-[#A89F93] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#C59A4E]" />
                  <span className="font-semibold text-sm">Takeaway / Pickup</span>
                </div>
                <span className="text-[11px] text-[#857D74]">
                  Collect at Gampaha restaurant (Free)
                </span>
              </button>
            </div>

            {/* Delivery address fields if Delivery selected */}
            {orderType === 'delivery' ? (
              <div className="space-y-4 pt-2 border-t border-white/5 animate-in fade-in duration-200">
                <div>
                  <label htmlFor="delivery-address" className="block text-xs text-[#C3BAAF] mb-1.5 font-medium">
                    Delivery Street Address <span className="text-[#C59A4E]">*</span>
                  </label>
                  <input
                    id="delivery-address"
                    type="text"
                    required={orderType === 'delivery'}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. No. 45, Temple Road, Miriswatta"
                    className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#6A635B] focus:outline-none focus:border-[#C59A4E] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="delivery-city" className="block text-xs text-[#C3BAAF] mb-1.5 font-medium">
                    City / Neighborhood <span className="text-[#C59A4E]">*</span>
                  </label>
                  <input
                    id="delivery-city"
                    type="text"
                    required={orderType === 'delivery'}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Gampaha / Yakkala / Miriswatta"
                    className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#6A635B] focus:outline-none focus:border-[#C59A4E] transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#262420] border border-white/5 text-xs text-[#A89F93] flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pick up directly from Vintage Restaurant: {settings.address}</span>
              </div>
            )}
          </div>

          {/* 3. Additional Order Notes */}
          <div className="p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-lg space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C59A4E]">
              3. Special Instructions for Chef / Delivery (Optional)
            </h2>
            <textarea
              id="order-note-input"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="e.g. Please make the food less spicy. Call before arriving."
              rows={3}
              maxLength={250}
              className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#6A635B] focus:outline-none focus:border-[#C59A4E] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#1d1b18] border border-[#C59A4E]/25 shadow-2xl sticky top-28 space-y-6">
            <h2 className="font-serif-vintage text-xl font-bold text-[#F6F3EE] pb-3 border-b border-white/10">
              Order Summary
            </h2>

            {/* Item list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map(c => (
                <div key={c.cart_id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <span className="font-medium text-[#F6F3EE] block">
                      {c.quantity} × {c.item.name}
                    </span>
                    {c.selected_add_ons.length > 0 && (
                      <span className="text-[11px] text-[#A89F93] block">
                        + {c.selected_add_ons.map(a => a.name).join(', ')}
                      </span>
                    )}
                    {c.special_instructions && (
                      <span className="text-[11px] text-[#C59A4E] italic block truncate">
                        "{c.special_instructions}"
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[#F6F3EE] whitespace-nowrap font-medium">
                    {settings.currency} {(c.unit_price * c.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-white/10 space-y-2.5 text-sm text-[#A89F93]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#F6F3EE]">
                  {settings.currency} {cartSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#C59A4E]" />
                  Delivery Fee ({orderType === 'delivery' ? 'Standard' : 'Pickup'})
                </span>
                <span className="font-mono text-[#F6F3EE]">
                  {orderType === 'delivery' ? `${settings.currency} ${deliveryFee.toLocaleString()}` : 'FREE'}
                </span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-base font-bold text-white">Total Amount</span>
                <span className="text-2xl font-bold text-[#C59A4E] font-mono">
                  {settings.currency} {estimatedTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment method note */}
            <div className="p-3 rounded-xl bg-[#262420] border border-white/5 text-xs text-[#A89F93] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Payment method: <strong>Pay on Delivery / In-person</strong></span>
            </div>

            {/* WhatsApp Order Action */}
            <button
              type="submit"
              id="btn-place-whatsapp-order"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{isSubmitting ? 'Preparing Order...' : 'Place Order on WhatsApp'}</span>
            </button>

            <p className="text-[11px] text-[#7A7268] text-center">
              Your order is logged securely in our system, and the formatted order request will immediately open in WhatsApp to {settings.phone}.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

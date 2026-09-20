import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MessageCircle, CheckCircle2, Clock, MapPin, ArrowRight, Utensils, Phone } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastCreatedOrder, lastWhatsAppUrl, settings, setActiveView } = useRestaurant();

  if (!lastCreatedOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="font-serif-vintage text-2xl font-bold text-[#F6F3EE] mb-3">
          No recent order found
        </h2>
        <button
          onClick={() => setActiveView('menu')}
          className="px-6 py-3 rounded-full bg-[#C59A4E] text-black font-semibold text-xs tracking-wider uppercase"
        >
          Go to Menu
        </button>
      </div>
    );
  }

  const order = lastCreatedOrder;

  const handleOpenWhatsApp = () => {
    if (lastWhatsAppUrl) {
      window.open(lastWhatsAppUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div id="order-success-view" className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="rounded-3xl bg-[#1d1b18] border border-[#C59A4E]/30 p-6 sm:p-10 shadow-2xl text-center space-y-6">
        {/* Restaurant Logo & Success Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#C59A4E]/40 bg-black shadow-lg">
            <img
              src={settings.logo_url || "/logo.png"}
              alt="Vintage Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        {/* Headline */}
        <div>
          <h1 className="font-serif-vintage text-3xl sm:text-4xl font-bold text-[#F6F3EE] mb-2">
            Order Created Successfully 🎉
          </h1>
          <p className="text-sm text-[#C3BAAF]">
            Your order details have been prepared for WhatsApp.
          </p>
        </div>

        {/* Order Number Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#262420] border border-white/10 text-xs font-mono text-[#F6F3EE]">
          <span className="text-[#857D74] uppercase">Order ID:</span>
          <span className="text-[#C59A4E] font-bold text-sm">{order.order_number}</span>
        </div>

        {/* Critical Notice: Restaurant must confirm */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs text-left flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">Please send the WhatsApp message to complete your order request.</span>
            <span>Our team at Vintage Restaurant & Cafe will review your items and confirm preparation time and delivery dispatch directly via WhatsApp.</span>
          </div>
        </div>

        {/* Main WhatsApp Continue CTA */}
        {lastWhatsAppUrl && (
          <button
            type="button"
            id="btn-continue-whatsapp"
            onClick={handleOpenWhatsApp}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-base tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/50 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
            <span>Continue to WhatsApp</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {/* Summary Card */}
        <div className="text-left p-5 rounded-2xl bg-[#262420] border border-white/5 space-y-4 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-white/5 text-[#A89F93]">
            <span>Order Type: <strong className="text-white capitalize">{order.order_type}</strong></span>
            <span>Customer: <strong className="text-white">{order.customer_name}</strong></span>
          </div>

          {order.order_type === 'delivery' && (
            <div className="flex items-start gap-2 text-[#A89F93] pb-3 border-b border-white/5">
              <MapPin className="w-4 h-4 text-[#C59A4E] shrink-0 mt-0.5" />
              <span>{order.delivery_address}{order.city ? `, ${order.city}` : ''}</span>
            </div>
          )}

          {/* Items breakdown */}
          <div className="space-y-2">
            <span className="font-semibold uppercase tracking-wider text-[#7A7268] block">Items Ordered</span>
            {order.items.map(it => (
              <div key={it.id} className="flex justify-between items-baseline">
                <span className="text-[#F6F3EE]">
                  {it.quantity} × {it.item_name}
                  {it.add_ons_detail && <span className="text-[10px] text-[#857D74] block">+ {it.add_ons_detail}</span>}
                </span>
                <span className="font-mono text-[#F6F3EE]">
                  {settings.currency} {it.total_price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/5 space-y-1.5">
            <div className="flex justify-between text-[#857D74]">
              <span>Subtotal</span>
              <span className="font-mono text-[#F6F3EE]">{settings.currency} {order.subtotal.toLocaleString()}</span>
            </div>
            {order.order_type === 'delivery' && (
              <div className="flex justify-between text-[#857D74]">
                <span>Delivery Fee</span>
                <span className="font-mono text-[#F6F3EE]">{settings.currency} {order.delivery_fee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-white pt-1">
              <span>Total</span>
              <span className="font-mono text-[#C59A4E]">{settings.currency} {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setActiveView('menu')}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#262420] hover:bg-[#302d28] text-[#F6F3EE] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <Utensils className="w-4 h-4 text-[#C59A4E]" />
            <span>Order More Food</span>
          </button>

          <a
            href={`tel:${settings.phone.replace(/\s+/g, '')}`}
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/10 hover:border-[#C59A4E]/40 text-[#A89F93] hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#C59A4E]" />
            <span>Need Help? Call Us: {settings.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

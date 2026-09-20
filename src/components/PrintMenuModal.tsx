import React, { useState } from 'react';
import { Printer, X, Check, FileText, Settings2, Info } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Category, MenuItem } from '../types';

interface PrintMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCategoryId: string;
  searchQuery: string;
  filteredItems: MenuItem[];
}

export const PrintMenuModal: React.FC<PrintMenuModalProps> = ({
  isOpen,
  onClose,
  currentCategoryId,
  searchQuery,
  filteredItems,
}) => {
  const { settings, categories, menuItems, t, language } = useRestaurant();

  const [printScope, setPrintScope] = useState<'all' | 'current'>(
    currentCategoryId !== 'all' || searchQuery.trim() !== '' ? 'current' : 'all'
  );
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [showAddOns, setShowAddOns] = useState(true);

  // Determine categories and items to print
  const categoriesToPrint: { category: Category; items: MenuItem[] }[] = [];

  const activeCategories = categories.filter((c) => c.is_active);

  if (printScope === 'all') {
    activeCategories.forEach((cat) => {
      const items = menuItems.filter(
        (i) => i.category_id === cat.id && i.is_available
      );
      if (items.length > 0) {
        categoriesToPrint.push({ category: cat, items });
      }
    });
  } else {
    // Current filter or category
    if (currentCategoryId === 'all') {
      activeCategories.forEach((cat) => {
        const items = filteredItems.filter((i) => i.category_id === cat.id);
        if (items.length > 0) {
          categoriesToPrint.push({ category: cat, items });
        }
      });
    } else {
      const cat = activeCategories.find((c) => c.id === currentCategoryId);
      if (cat) {
        categoriesToPrint.push({ category: cat, items: filteredItems });
      }
    }
  }

  const handlePrint = () => {
    // Invoke standard browser print dialog
    window.print();
  };

  const selectedCategoryName =
    currentCategoryId === 'all'
      ? 'All Dishes'
      : categories.find((c) => c.id === currentCategoryId)?.name || 'Filtered Selection';

  const totalItemsCount = categoriesToPrint.reduce(
    (acc, group) => acc + group.items.length,
    0
  );

  return (
    <>
      {/* 1. On-Screen Interactive Modal */}
      {isOpen && (
        <div
          id="print-menu-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] bg-[#1a1815] border border-[#C59A4E]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#E5DFD7]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#151412]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C59A4E]/15 border border-[#C59A4E]/30 flex items-center justify-center text-[#C59A4E] shrink-0">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-vintage text-xl font-bold text-[#F6F3EE]">
                    {t('menu_print_modal_title')}
                  </h3>
                  <p className="text-xs text-[#857D74]">
                    {t('menu_print_modal_subtitle')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-[#857D74] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls Bar */}
            <div className="p-4 sm:p-5 bg-[#201d19] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
              {/* Scope Selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A89F93] font-medium hidden sm:inline">
                  Print Scope:
                </span>
                <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setPrintScope('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      printScope === 'all'
                        ? 'bg-[#C59A4E] text-black shadow font-bold'
                        : 'text-[#A89F93] hover:text-white'
                    }`}
                  >
                    {t('menu_print_scope_all')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintScope('current')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      printScope === 'current'
                        ? 'bg-[#C59A4E] text-black shadow font-bold'
                        : 'text-[#A89F93] hover:text-white'
                    }`}
                  >
                    {t('menu_print_scope_current')} ({selectedCategoryName})
                  </button>
                </div>
              </div>

              {/* Layout Toggles */}
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 text-[#C3BAAF] cursor-pointer hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={showDescriptions}
                    onChange={(e) => setShowDescriptions(e.target.checked)}
                    className="rounded border-[#C59A4E]/40 text-[#C59A4E] focus:ring-[#C59A4E] bg-[#151412]"
                  />
                  <span>Descriptions</span>
                </label>

                <label className="flex items-center gap-1.5 text-[#C3BAAF] cursor-pointer hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={showAddOns}
                    onChange={(e) => setShowAddOns(e.target.checked)}
                    className="rounded border-[#C59A4E]/40 text-[#C59A4E] focus:ring-[#C59A4E] bg-[#151412]"
                  />
                  <span>Add-ons</span>
                </label>
              </div>
            </div>

            {/* Paper Preview Area (Simulating physical printed paper) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0c0b0a] flex justify-center">
              <div className="w-full max-w-2xl bg-white text-[#1a1a1a] shadow-2xl rounded-sm p-6 sm:p-10 text-xs sm:text-sm font-sans border border-neutral-300">
                
                {/* Paper Header */}
                <div className="text-center pb-4 mb-6 border-b-2 border-[#1a1a1a]">
                  <div className="w-14 h-14 mx-auto mb-2 rounded-xl overflow-hidden bg-black p-1 border border-[#C59A4E]/40">
                    <img
                      src={settings.logo_url || '/logo.png'}
                      alt="Vintage Crest"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h1 className="font-serif text-2xl font-bold tracking-wider text-black uppercase">
                    {settings.name}
                  </h1>
                  <p className="text-[11px] text-neutral-600 font-serif italic mt-0.5">
                    {settings.tagline} • Gampaha, Sri Lanka
                  </p>
                  <div className="text-[10px] text-neutral-500 mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                    <span>📍 {settings.address}</span>
                    <span>☎ Hotline: {settings.phone}</span>
                    <span>🕒 {settings.opening_hours}</span>
                  </div>
                  <div className="mt-2 text-[9px] uppercase tracking-widest text-neutral-400">
                    Official Dining & Takeaway Menu • Printed: {new Date().toLocaleDateString()}
                  </div>
                </div>

                {/* Categorized Menu Items */}
                {categoriesToPrint.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400">
                    No items match the current print criteria.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {categoriesToPrint.map((group) => (
                      <div key={group.category.id} className="break-inside-avoid">
                        {/* Category Heading with Classic Ornate Dividers */}
                        <div className="flex items-center gap-3 my-3">
                          <div className="flex-1 h-[1px] bg-neutral-300" />
                          <h2 className="font-serif text-sm font-bold text-neutral-900 tracking-wider uppercase px-2 py-0.5 bg-neutral-100 rounded">
                            ✦ {group.category.name} ✦
                          </h2>
                          <div className="flex-1 h-[1px] bg-neutral-300" />
                        </div>

                        {/* Items List (2 columns on clean paper) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-1">
                          {group.items.map((item) => (
                            <div key={item.id} className="break-inside-avoid pb-2 border-b border-dotted border-neutral-200">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="font-serif font-bold text-neutral-900 text-xs sm:text-sm">
                                  {item.name}
                                </span>
                                <span className="font-mono font-bold text-neutral-900 text-xs sm:text-sm shrink-0">
                                  Rs. {item.price.toLocaleString()}
                                </span>
                              </div>

                              {item.portion_size && (
                                <div className="text-[10px] text-neutral-500 font-medium">
                                  {item.portion_size}
                                </div>
                              )}

                              {showDescriptions && item.description && (
                                <p className="text-[11px] text-neutral-600 leading-snug mt-0.5">
                                  {item.description}
                                </p>
                              )}

                              {showAddOns && item.add_ons && item.add_ons.length > 0 && (
                                <div className="text-[9.5px] text-neutral-500 mt-1 italic">
                                  Add-ons:{' '}
                                  {item.add_ons
                                    .map((a) => `${a.name} (+Rs. ${a.price})`)
                                    .join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Paper Footer Note */}
                <div className="mt-8 pt-4 border-t border-neutral-300 text-center text-[10px] text-neutral-500 space-y-1">
                  <p className="font-serif italic">
                    Thank you for choosing Vintage Restaurant & Café Gampaha.
                  </p>
                  <p>
                    Prices are in Sri Lankan Rupees (Rs.) inclusive of applicable taxes. For reservations & direct WhatsApp orders: {settings.phone}
                  </p>
                </div>

              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#151412] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#857D74]">
                <Info className="w-4 h-4 text-[#C59A4E] shrink-0" />
                <span>{t('menu_print_help_tip')}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A89F93] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Close
                </button>

                <button
                  type="button"
                  id="btn-trigger-browser-print"
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#C59A4E] hover:bg-[#d6a958] active:bg-[#b0873e] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('menu_print_action_btn')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hidden DOM Printable Container (Rendered exclusively during window.print()) */}
      <div id="printable-menu" aria-hidden="true">
        <div className="text-center pb-3 mb-5 border-b-2 border-black">
          <div className="w-16 h-16 mx-auto mb-2 rounded-xl overflow-hidden bg-black p-1 border border-black">
            <img
              src={settings.logo_url || '/logo.png'}
              alt="Vintage Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-black uppercase">
            {settings.name}
          </h1>
          <p className="text-xs text-neutral-700 font-serif italic mt-0.5">
            {settings.tagline} • Gampaha, Sri Lanka
          </p>
          <div className="text-[10px] text-neutral-600 mt-1.5 flex items-center justify-center gap-3">
            <span>📍 {settings.address}</span>
            <span>☎ Hotline: {settings.phone}</span>
            <span>🕒 {settings.opening_hours}</span>
          </div>
          <div className="text-[9px] uppercase tracking-widest text-neutral-500 mt-1">
            Official Dining & Takeaway Menu • Printed: {new Date().toLocaleDateString()}
          </div>
        </div>

        {categoriesToPrint.map((group) => (
          <div key={group.category.id} className="print-category-block mb-5">
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-[1px] bg-black" />
              <h2 className="font-serif text-sm font-bold text-black tracking-wider uppercase px-2 py-0.5 bg-neutral-100">
                ✦ {group.category.name} ✦
              </h2>
              <div className="flex-1 h-[1px] bg-black" />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1">
              {group.items.map((item) => (
                <div key={item.id} className="print-avoid-break pb-1.5 border-b border-dotted border-neutral-300">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-serif font-bold text-black text-xs">
                      {item.name}
                    </span>
                    <span className="font-mono font-bold text-black text-xs shrink-0">
                      Rs. {item.price.toLocaleString()}
                    </span>
                  </div>

                  {item.portion_size && (
                    <div className="text-[9px] text-neutral-600 font-medium">
                      {item.portion_size}
                    </div>
                  )}

                  {showDescriptions && item.description && (
                    <p className="text-[10px] text-neutral-700 leading-tight mt-0.5">
                      {item.description}
                    </p>
                  )}

                  {showAddOns && item.add_ons && item.add_ons.length > 0 && (
                    <div className="text-[8.5px] text-neutral-600 mt-0.5 italic">
                      Add-ons:{' '}
                      {item.add_ons
                        .map((a) => `${a.name} (+Rs. ${a.price})`)
                        .join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 pt-3 border-t border-black text-center text-[9px] text-neutral-600 space-y-0.5">
          <p className="font-serif italic">
            Thank you for dining with Vintage Restaurant & Café Gampaha.
          </p>
          <p>
            Prices in Sri Lankan Rupees (Rs.) inclusive of applicable taxes. For reservations & direct WhatsApp orders: {settings.phone}
          </p>
        </div>
      </div>
    </>
  );
};

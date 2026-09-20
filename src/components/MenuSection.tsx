import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodCard } from './FoodCard';
import { Search, Utensils, X, Printer } from 'lucide-react';
import { PrintMenuModal } from './PrintMenuModal';

export const MenuSection: React.FC = () => {
  const { categories, menuItems, t } = useRestaurant();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const activeCategories = useMemo(() => {
    return categories.filter(c => c.is_active);
  }, [categories]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category match
      const matchesCategory = selectedCategoryId === 'all' || item.category_id === selectedCategoryId;
      
      // Search match
      const matchesSearch = !searchQuery.trim() || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategoryId, searchQuery]);

  return (
    <section id="menu-section" className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C59A4E] block mb-2">
          Discover Flavors
        </span>
        <h2 className="font-serif-vintage text-3xl sm:text-5xl font-bold text-[#F6F3EE] mb-3">
          Our Dynamic Menu
        </h2>
        <p className="text-sm text-[#A89F93] mb-5">
          Browse our freshly prepared menu items and customize your dishes with add-ons.
        </p>

        {/* Print PDF Menu Action Button */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            id="print-pdf-menu-btn"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1e1c19] hover:bg-[#28241e] active:bg-[#151310] border border-[#C59A4E]/40 hover:border-[#C59A4E] text-[#E0BC75] hover:text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-amber-500/10 group cursor-pointer"
            title="Generate a clean printable version of the menu"
          >
            <Printer className="w-4 h-4 text-[#C59A4E] group-hover:scale-110 transition-transform" />
            <span>{t('menu_print_btn')}</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div id="menu-search-filter-controls" className="space-y-6 mb-12">
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-[#857D74] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fried rice, kottu, burger, coffee..."
            className="w-full pl-11 pr-10 py-3 rounded-full bg-[#1e1c19] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#7A7268] focus:outline-none focus:border-[#C59A4E] transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#857D74] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategoryId('all')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all ${
              selectedCategoryId === 'all'
                ? 'bg-[#C59A4E] text-black shadow-md shadow-[#C59A4E]/20'
                : 'bg-[#1e1c19] text-[#A89F93] hover:text-white border border-white/5'
            }`}
          >
            All Dishes ({menuItems.length})
          </button>

          {activeCategories.map(cat => {
            const count = menuItems.filter(i => i.category_id === cat.id).length;
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#C59A4E] text-black shadow-md shadow-[#C59A4E]/20'
                    : 'bg-[#1e1c19] text-[#A89F93] hover:text-white border border-white/5'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#1a1815] border border-white/5 max-w-lg mx-auto p-8">
          <Utensils className="w-12 h-12 text-[#666] mx-auto mb-3" />
          <h3 className="font-serif-vintage text-xl font-bold text-[#F6F3EE] mb-2">
            No dishes found
          </h3>
          <p className="text-xs text-[#857D74] mb-4">
            Try adjusting your search term or select another category.
          </p>
          <button
            onClick={() => { setSelectedCategoryId('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-full bg-[#262420] text-xs text-[#C59A4E] font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Print PDF Menu Modal & Hidden Printable DOM */}
      <PrintMenuModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        currentCategoryId={selectedCategoryId}
        searchQuery={searchQuery}
        filteredItems={filteredItems}
      />
    </section>
  );
};

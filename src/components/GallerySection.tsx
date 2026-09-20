import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { GalleryCategory, GalleryImage } from '../types';
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState<GalleryImage | null>(null);

  const categories: ('All' | GalleryCategory)[] = ['All', 'Restaurant', 'Food', 'Interior', 'Exterior', 'Events'];

  const filteredGallery = selectedCategory === 'All' 
    ? gallery 
    : gallery.filter(g => g.category === selectedCategory);

  return (
    <section id="gallery-section" className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C59A4E] block mb-2">
          Visual Atmosphere
        </span>
        <h2 className="font-serif-vintage text-3xl sm:text-4xl md:text-5xl font-bold text-[#F6F3EE] mb-3">
          Restaurant Gallery
        </h2>
        <p className="text-sm text-[#A89F93]">
          Take a look inside our dining space, freshly plated culinary creations, and memorable moments.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#C59A4E] text-black shadow-md'
                : 'bg-[#1e1c19] text-[#A89F93] hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map(img => (
          <div
            key={img.id}
            onClick={() => setActiveLightboxImage(img)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#22201c] cursor-pointer border border-white/5 shadow-md"
          >
            <img
              src={img.image_url}
              alt={img.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C59A4E] mb-1">
                {img.category}
              </span>
              <h4 className="font-serif-vintage text-lg font-semibold text-white">
                {img.title}
              </h4>
              {img.caption && (
                <p className="text-xs text-[#C3BAAF] mt-1 line-clamp-2">
                  {img.caption}
                </p>
              )}
              <div className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-[#C59A4E]">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-[#C3BAAF] hover:text-white transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-7 h-7" />
            </button>

            <img
              src={activeLightboxImage.image_url}
              alt={activeLightboxImage.title}
              className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/10"
            />

            <div className="mt-4 text-center">
              <span className="text-xs uppercase font-bold tracking-wider text-[#C59A4E] block">
                {activeLightboxImage.category}
              </span>
              <h3 className="font-serif-vintage text-xl font-bold text-white mt-1">
                {activeLightboxImage.title}
              </h3>
              {activeLightboxImage.caption && (
                <p className="text-xs text-[#A89F93] mt-1 max-w-md mx-auto">
                  {activeLightboxImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

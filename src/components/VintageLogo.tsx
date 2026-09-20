import React from 'react';

interface VintageLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'image' | 'badge' | 'full';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const VintageLogo: React.FC<VintageLogoProps> = ({
  size = 'md',
  variant = 'badge',
  showSubtitle = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    xs: { box: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    sm: { box: 'w-9 h-9', text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-11 h-11', text: 'text-lg sm:text-xl', sub: 'text-[10px]' },
    lg: { box: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-24 h-24', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // Full image mode (shows the complete logo image)
  if (variant === 'image') {
    return (
      <div 
        className={`inline-block overflow-hidden rounded-xl bg-black border border-[#C59A4E]/30 shadow-md ${className}`}
        onClick={onClick}
      >
        <img
          src="/logo.png"
          alt="Vintage Restaurant & Cafe Logo"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Full lockup: Emblem image badge + typography
  return (
    <div 
      className={`inline-flex items-center gap-3 select-none text-left ${className}`}
      onClick={onClick}
    >
      {/* Golden Crest / Logo Emblem Badge */}
      <div 
        className={`relative ${currentSize.box} rounded-xl overflow-hidden bg-black border border-[#C59A4E]/40 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 group-hover:border-[#C59A4E] shrink-0`}
      >
        <img
          src="/logo.png"
          alt="Vintage Logo"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to SVG letter crest if image fails
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Brand Typography */}
      <div>
        <span className={`block font-serif-vintage ${currentSize.text} font-bold tracking-wider text-[#F6F3EE] group-hover:text-[#C59A4E] transition-colors leading-tight uppercase`}>
          Vintage
        </span>
        {showSubtitle && (
          <span className={`block ${currentSize.sub} tracking-[0.2em] uppercase text-[#C59A4E] font-medium`}>
            Restaurant & Café
          </span>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../context/I18nContext';
import { getActiveBanners } from '../../store/bannersStore';

/**
 * BannerSlot - Renders promotional banners based on placement and service scope
 * @param {Object} props
 * @param {string} props.placement - Banner placement ('HOME_HERO', 'HOME_MID', 'CATEGORY_TOP', 'MAP_TOP')
 * @param {string} [props.serviceScope] - Service scope filter ('ALL', 'REAL_ESTATE', 'DELIVERY')
 * @param {string} [props.className] - Additional CSS classes
 */
const BannerSlot = ({ placement, serviceScope, className = '' }) => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [banners, setBanners] = useState([]);

  // Load banners on mount and when lang/placement/serviceScope changes
  useEffect(() => {
    const activeBanners = getActiveBanners({
      placement,
      serviceScope,
      lang,
      now: new Date(),
    });
    setBanners(activeBanners);
    setActiveIndex(0);
  }, [placement, serviceScope, lang]);

  // Auto-play if multiple banners (every 5 seconds)
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Don't render if no banners
  if (banners.length === 0) return null;

  const currentBanner = banners[activeIndex];
  const title = currentBanner.title?.[lang] || currentBanner.title?.ko || '';
  const subtitle = currentBanner.subtitle?.[lang] || currentBanner.subtitle?.ko || '';
  const ctaText = currentBanner.ctaText?.[lang] || currentBanner.ctaText?.ko || '';

  const handleClick = () => {
    if (!currentBanner.ctaUrl) return;

    // Check if it's an internal route or external link
    if (currentBanner.ctaUrl.startsWith('http://') || currentBanner.ctaUrl.startsWith('https://')) {
      window.open(currentBanner.ctaUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(currentBanner.ctaUrl);
    }
  };

  // Determine container classes based on placement
  const getContainerClasses = () => {
    const baseClasses = 'relative overflow-hidden rounded-xl shadow-sm transition-all duration-300';
    
    if (placement === 'HOME_HERO') {
      return `${baseClasses} min-h-[200px] md:min-h-[250px]`;
    } else if (placement === 'HOME_MID') {
      return `${baseClasses} min-h-[150px] md:min-h-[180px]`;
    } else if (placement === 'CATEGORY_TOP' || placement === 'MAP_TOP') {
      return `${baseClasses} min-h-[120px] md:min-h-[140px]`;
    }
    
    return `${baseClasses} min-h-[150px]`;
  };

  const containerClasses = `${getContainerClasses()} ${className}`;

  return (
    <div className={containerClasses}>
      {/* Background - gradient only, no images */}
      <div
        className="absolute inset-0"
        style={{
          background: currentBanner.background || 'linear-gradient(135deg, #1A237E 0%, #3741A9 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-8 text-white">
        {/* Sponsored tag */}
        {currentBanner.partnerId && currentBanner.partnerName && (
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full font-medium">
              Sponsored
            </span>
            <span className="text-xs text-white/80 font-medium">
              {currentBanner.partnerName}
            </span>
          </div>
        )}

        {/* Title and Subtitle */}
        <div className="mb-4">
          {title && (
            <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* CTA Button */}
        {ctaText && currentBanner.ctaUrl && (
          <button
            onClick={handleClick}
            className="inline-flex items-center px-5 py-2.5 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 self-start"
          >
            {ctaText}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dots indicator (if multiple banners) */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlot;


import React, { useState, useEffect } from 'react';
import { useBannerContext } from '../../context/BannerContext';
import { trackBannerImpression, trackBannerClick } from '../../lib/api/banners';

/**
 * BannerSlot - Renders a banner for a specific slot on a page
 * @param {Object} props
 * @param {string} props.pageScope - Page scope ('HOME', 'MAP_SEARCH', etc.)
 * @param {string} props.slot - Slot ('GLOBAL_TOP', 'PAGE_TOP', 'INLINE_1', 'SIDEBAR', 'PAGE_BOTTOM')
 * @param {string} [props.domain] - Domain ('REAL_ESTATE', 'DELIVERY', 'ALL')
 * @param {string} [props.device] - Device ('DESKTOP', 'MOBILE', 'ALL')
 * @param {string} [props.language] - Language ('KO', 'EN', 'ALL')
 * @param {string} [props.className] - Additional CSS classes
 */
const BannerSlot = ({
  pageScope,
  slot,
  domain,
  device,
  language,
  className = '',
}) => {
  const { getBannersForPage } = useBannerContext();
  const [banner, setBanner] = useState(null);
  const [impressionTracked, setImpressionTracked] = useState(false);

  useEffect(() => {
    const loadBanner = async () => {
      const result = await getBannersForPage({
        surface: 'USER_WEB',
        pageScope,
        domain,
        device,
        language,
      });

      const slotBanner = result.slots?.[slot] || null;
      setBanner(slotBanner);
      setImpressionTracked(false);
    };

    loadBanner();
  }, [pageScope, slot, domain, device, language, getBannersForPage]);

  // Track impression when banner is rendered
  useEffect(() => {
    if (banner && !impressionTracked) {
      trackBannerImpression(banner.id);
      setImpressionTracked(true);
    }
  }, [banner, impressionTracked]);

  // Don't render if no banner
  if (!banner) return null;

  const handleClick = (e) => {
    e.preventDefault();
    
    // Track click
    trackBannerClick(banner.id);

    // Navigate to link
    if (banner.linkUrl) {
      if (banner.linkUrl.startsWith('http://') || banner.linkUrl.startsWith('https://')) {
        window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = banner.linkUrl;
      }
    }
  };

  // Determine container classes based on slot
  const getContainerClasses = () => {
    const baseClasses = 'relative overflow-hidden transition-all duration-300';
    
    switch (slot) {
      case 'GLOBAL_TOP':
        return `${baseClasses} w-full`;
      case 'PAGE_TOP':
        return `${baseClasses} w-full mb-4`;
      case 'INLINE_1':
        return `${baseClasses} w-full my-6`;
      case 'SIDEBAR':
        return `${baseClasses} w-full mb-4`;
      case 'PAGE_BOTTOM':
        return `${baseClasses} w-full mt-6`;
      default:
        return `${baseClasses} w-full`;
    }
  };

  const containerClasses = `${getContainerClasses()} ${className}`;

  return (
    <div className={containerClasses}>
      <a
        href={banner.linkUrl || '#'}
        onClick={handleClick}
        className="block w-full"
        target={banner.linkUrl?.startsWith('http') ? '_blank' : undefined}
        rel={banner.linkUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        <img
          src={banner.imageUrl}
          alt={banner.title || 'Banner'}
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </a>
    </div>
  );
};

export default BannerSlot;


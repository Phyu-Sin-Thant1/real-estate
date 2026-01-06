import React, { useMemo } from 'react'
import Card from '../ui/Card'
import { getApplicableDiscount, applyDiscount } from '../../lib/helpers/discountEngine'
import { getAgencyById } from '../../mock/agencies'

const ListingCard = ({ listing, isLiked, onToggleLike, onClick }) => {
  // Get agency information
  const agency = useMemo(() => {
    if (!listing.agencyId) return null;
    return getAgencyById(listing.agencyId, 'realEstate');
  }, [listing.agencyId]);

  // Get applicable discount for this listing
  const discount = useMemo(() => {
    if (!listing.partnerId) return null;
    return getApplicableDiscount({
      partnerId: listing.partnerId,
      scope: 'REAL_ESTATE',
      entityType: 'LISTING',
      entityId: listing.id?.toString(),
    });
  }, [listing.partnerId, listing.id]);

  // Calculate discounted price if discount exists
  const priceInfo = useMemo(() => {
    if (!discount || !listing.originalPrice) {
      return { displayPrice: listing.price, savedAmount: 0, hasDiscount: false };
    }
    
    // Extract numeric value from price string (e.g., "5억 5,000만원" -> 550000000)
    // Simplified: assume price is in format like "5억" or "5,000만원"
    const priceMatch = listing.originalPrice?.toString().match(/[\d,]+/);
    const numericPrice = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : null;
    
    if (!numericPrice) {
      return { displayPrice: listing.price, savedAmount: 0, hasDiscount: false };
    }

    const { newAmount, savedAmount } = applyDiscount(numericPrice, discount);
    
    // Format back to Korean currency (simplified)
    const formatPrice = (amount) => {
      if (amount >= 100000000) {
        return `${Math.floor(amount / 100000000)}억 ${Math.floor((amount % 100000000) / 10000)}만원`;
      } else if (amount >= 10000) {
        return `${Math.floor(amount / 10000)}만원`;
      }
      return `${amount.toLocaleString()}원`;
    };

    return {
      displayPrice: formatPrice(newAmount),
      originalPrice: listing.originalPrice || listing.price,
      savedAmount,
      hasDiscount: savedAmount > 0,
      discountTitle: discount.title,
    };
  }, [discount, listing.price, listing.originalPrice]);
  return (
    <Card 
      variant="default" 
      className="overflow-hidden group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl rounded-2xl border-2 border-slate-100 hover:border-indigo-200"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {listing.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-sm shadow-md ${
                tag === '신규' ? 'bg-red-500/90 text-white' :
                tag === '인기' ? 'bg-orange-500/90 text-white' :
                'bg-blue-500/90 text-white'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleLike(listing.id)
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-md ${
              isLiked
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:scale-110'
            }`}
          >
            <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-1 text-base">{listing.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{listing.address}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            {priceInfo.hasDiscount ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-lg font-bold text-dabang-primary">{priceInfo.displayPrice}</p>
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded">
                    할인
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-400 line-through">{priceInfo.originalPrice}</p>
                  <p className="text-xs text-red-600 font-semibold">
                    {priceInfo.savedAmount > 0 && `₩${priceInfo.savedAmount.toLocaleString()} 절약`}
                  </p>
                </div>
                {priceInfo.discountTitle && (
                  <p className="text-xs text-indigo-600 mt-1 font-medium">{priceInfo.discountTitle}</p>
                )}
              </div>
            ) : (
              <>
                <p className="text-lg font-bold text-dabang-primary">{listing.price}</p>
                <p className="text-xs text-gray-500 mt-0.5">{listing.priceType}</p>
              </>
            )}
          </div>
          <span className="text-sm text-gray-600 font-medium ml-2">{listing.area}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {listing.views || 0} 조회
          </span>
          
          {/* Agency Branding */}
          {agency && (
            <div className="flex items-center gap-1.5 group">
              <img 
                src={agency.logo} 
                alt={agency.name}
                className="w-5 h-5 rounded-full object-cover border border-gray-200"
              />
              <span className="text-xs text-gray-600 group-hover:text-dabang-primary transition-colors">
                {agency.name}
              </span>
              {agency.verified && (
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ListingCard

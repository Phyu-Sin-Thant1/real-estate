import React, { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';

const PropertyDetailsModal = ({ listing, isOpen, onClose, onEdit, onDuplicate, onArchive }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedMemo, setExpandedMemo] = useState(false);

  // FIELD_MAP: Comprehensive field mapping with formatters
  // MUST be called before any early returns to follow Rules of Hooks
  const FIELD_MAP = useMemo(() => ({
    // Currency formatter
    formatCurrency: (value) => {
      if (!value && value !== 0) return '미입력';
      const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
      if (isNaN(num)) return value || '미입력';
      return `₩ ${num.toLocaleString('ko-KR')}`;
    },
    
    // Date formatter (short)
    formatDateShort: (dateString) => {
      if (!dateString) return '미입력';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      } catch {
        return dateString || '미입력';
      }
    },
    
    // Boolean formatter
    formatBoolean: (value) => value ? '있음' : '없음',
    
    // Empty value fallback
    getValue: (value, fallback = '미입력') => {
      if (value === null || value === undefined || value === '') return fallback;
      return value;
    },
  }), []);

  // Early return AFTER all hooks (Rules of Hooks requirement)
  if (!isOpen || !listing) return null;

  const formatPrice = (listing) => {
    if (listing.transactionType === '매매') {
      const price = listing.price || listing.salePrice;
      if (!price) return '가격 협의';
      const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
      return isNaN(numPrice) ? '가격 협의' : `₩ ${numPrice.toLocaleString('ko-KR')}`;
    } else if (listing.transactionType === '전세') {
      if (!listing.deposit) return '보증금 협의';
      const numDeposit = typeof listing.deposit === 'string' ? parseFloat(listing.deposit.replace(/[^0-9.]/g, '')) : listing.deposit;
      return isNaN(numDeposit) ? '보증금 협의' : `보증금 ₩ ${numDeposit.toLocaleString('ko-KR')}`;
    } else if (listing.transactionType === '월세') {
      const deposit = listing.deposit;
      const monthly = listing.monthly || listing.monthlyRent;
      const depositStr = deposit ? `보증금 ₩ ${(typeof deposit === 'string' ? parseFloat(deposit.replace(/[^0-9.]/g, '')) : deposit).toLocaleString('ko-KR')}` : '';
      const monthlyStr = monthly ? `월세 ₩ ${(typeof monthly === 'string' ? parseFloat(monthly.replace(/[^0-9.]/g, '')) : monthly).toLocaleString('ko-KR')}` : '';
      return [depositStr, monthlyStr].filter(Boolean).join(' · ') || '가격 협의';
    }
    const price = listing.price;
    if (!price) return '가격 협의';
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    return isNaN(numPrice) ? '가격 협의' : `₩ ${numPrice.toLocaleString('ko-KR')}`;
  };

  const getPropertyTypeLabel = (type) => {
    const typeMap = {
      'apartment': '아파트',
      'house': '주택',
      'office': '오피스텔',
      'studio': '원룸',
      'two-room': '투룸',
      'villa': '빌라',
    };
    return typeMap[type] || type || '미입력';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatRelativeDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return '오늘';
      if (diffDays === 1) return '어제';
      if (diffDays < 7) return `${diffDays}일 전`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
      return `${Math.floor(diffDays / 365)}년 전`;
    } catch {
      return '—';
    }
  };

  const hasImages = listing.image || (listing.images && listing.images.length > 0);
  const images = listing.images || (listing.image ? [listing.image] : []);
  const hasContract = listing.hasContract || listing.contractFile;
  const hasContactInfo = listing.contactName || listing.contactEmail || listing.contactPhone || listing.agent;
  const hasAmenities = listing.amenities && listing.amenities.length > 0;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/property/${listing.id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('링크가 복사되었습니다.');
    });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(listing.id);
    } else {
      window.location.href = `/business/real-estate/listings/${listing.id}/edit`;
    }
    onClose();
  };

  const handleUploadImages = () => {
    window.location.href = `/business/real-estate/listings/${listing.id}/edit?tab=images`;
    onClose();
  };

  const handleAttachContract = () => {
    window.location.href = `/business/real-estate/listings/${listing.id}/edit?tab=contract`;
    onClose();
  };

  const amenityIcons = {
    '주차': '🅿️',
    '엘리베이터': '🛗',
    '보안시설': '🔒',
    '인터넷': '📶',
    '에어컨': '❄️',
    '난방': '🔥',
    '세탁기': '🔧',
    '냉장고': '❄️',
    '전자레인지': '🔔',
    '헬스장': '💪',
    '수영장': '🏊',
    '컨시어지': '👔',
    '반려동물 가능': '🐾',
    '발코니/베란다': '🌳',
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-black/70 via-gray-900/70 to-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-[1040px] max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-300 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header - Premium Sticky */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-white via-white to-gray-50/50 border-b border-gray-200/80 backdrop-blur-xl">
          <div className="px-8 pt-7 pb-5">
            {/* Title Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 truncate leading-tight">
                  {listing.title || listing.name || 'Untitled Property'}
                </h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={listing.status} type="property" size="compact" />
                  <span className="text-xs text-gray-500">
                    {getPropertyTypeLabel(listing.propertyType || listing.type)}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">
                    {listing.transactionType || listing.dealType || 'Not set'}
                  </span>
                  {(listing.city || listing.region1) && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">
                        {listing.city || listing.region1 || ''}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-dabang-primary/50"
                  title="링크 복사"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-dabang-primary/50"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  onClick={handleEdit}
                  className="ml-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-dabang-primary to-indigo-600 rounded-xl hover:from-dabang-primary/90 hover:to-indigo-600/90 transition-all duration-200 shadow-lg shadow-dabang-primary/30 hover:shadow-xl hover:shadow-dabang-primary/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-dabang-primary/50"
                >
                  수정
                </button>
              </div>
            </div>

            {/* Data Quality Checklist Row */}
            {(!hasImages || !hasContract) && (
              <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500">Data Quality:</span>
                <div className="flex items-center gap-3 flex-wrap">
                  {!hasImages && (
                    <button
                      onClick={handleUploadImages}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors border border-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Images missing
                    </button>
                  )}
                  {!hasContract && (
                    <button
                      onClick={handleAttachContract}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors border border-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Contract missing
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Body - Scrollable, Premium Background */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
              {/* Left Column (60%) */}
              <div className="space-y-6">
                {/* Media Gallery Card - Premium */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-gray-900">이미지</h3>
                    {hasImages && images.length > 0 && (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                        총 {images.length}장
                      </span>
                    )}
                  </div>
                  
                  {hasImages ? (
                    <div className="space-y-4">
                      {/* Main Image */}
                      <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300/50 shadow-xl group">
                        <img 
                          src={images[activeImageIndex] || listing.image} 
                          alt={listing.title || 'Property'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        {images.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                            {activeImageIndex + 1} / {images.length}
                          </div>
                        )}
                      </div>
                      {/* Thumbnails */}
                        {images.length > 1 && (
                          <div className="grid grid-cols-4 gap-3">
                            {images.slice(0, 4).map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                                  activeImageIndex === idx 
                                    ? 'border-dabang-primary ring-4 ring-dabang-primary/30 shadow-lg shadow-dabang-primary/20 scale-105' 
                                    : 'border-gray-200/60 hover:border-gray-400 hover:shadow-md'
                                }`}
                              >
                              <img 
                                src={img} 
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50/50">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">이미지가 없습니다</h4>
                      <p className="text-xs text-gray-500 mb-4">매물 사진을 업로드하여 더 많은 고객에게 노출하세요</p>
                      <button
                        onClick={handleUploadImages}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-dabang-primary rounded-lg hover:bg-dabang-primary/90 transition-all duration-200 shadow-sm shadow-dabang-primary/20 hover:shadow-md hover:shadow-dabang-primary/30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        이미지 업로드
                      </button>
                    </div>
                  )}
                </div>

                {/* Pricing & Deal Card - Premium */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <h3 className="text-base font-bold text-gray-900 mb-5">가격 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-blue-50 via-indigo-50/80 to-purple-50/60 rounded-2xl border border-blue-200/60 shadow-md hover:shadow-lg transition-shadow duration-300 col-span-2">
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">거래 가격</div>
                      <div className="text-lg font-bold text-gray-900 leading-tight">{formatPrice(listing)}</div>
                    </div>
                    {listing.maintenance && (
                      <div className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50/80 to-green-50/60 rounded-2xl border border-emerald-200/60 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">관리비</div>
                        <div className="text-lg font-bold text-gray-900 leading-tight">
                          {FIELD_MAP.formatCurrency(listing.maintenance)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Property Specs Card - Premium */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <h3 className="text-base font-bold text-gray-900 mb-5">매물 상세 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50/80 to-cyan-50/60 rounded-2xl border border-emerald-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">면적 (㎡)</div>
                      <div className="text-lg font-bold text-gray-900 leading-tight">
                        {FIELD_MAP.getValue(listing.area, '—')}㎡
                      </div>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-purple-50 via-pink-50/80 to-rose-50/60 rounded-2xl border border-purple-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">방 / 욕실</div>
                      <div className="text-lg font-bold text-gray-900 leading-tight">
                        {listing.rooms || 0}방 {listing.bathrooms || 0}욕
                      </div>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-amber-50 via-orange-50/80 to-yellow-50/60 rounded-2xl border border-amber-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">층수</div>
                      <div className="text-lg font-bold text-gray-900 leading-tight">
                        {FIELD_MAP.getValue(listing.floor, '—')}
                      </div>
                      {listing.totalFloors && (
                        <div className="text-xs text-gray-600 mt-2 font-medium">총 {listing.totalFloors}층</div>
                      )}
                    </div>
                    <div className="p-5 bg-gradient-to-br from-violet-50 via-indigo-50/80 to-purple-50/60 rounded-2xl border border-violet-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">매물 유형</div>
                      <div className="text-lg font-bold text-gray-900 leading-tight">
                        {getPropertyTypeLabel(listing.propertyType)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Property Details */}
                  {(listing.buildYear || listing.parking !== undefined || listing.elevator !== undefined || listing.totalFloors) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-3">
                        {listing.buildYear && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">건축 년도</div>
                            <div className="text-sm text-gray-900">{FIELD_MAP.getValue(listing.buildYear)}</div>
                          </div>
                        )}
                        {listing.parking !== undefined && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">주차</div>
                            <div className="text-sm text-gray-900">{FIELD_MAP.formatBoolean(listing.parking)}</div>
                          </div>
                        )}
                        {listing.elevator !== undefined && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">엘리베이터</div>
                            <div className="text-sm text-gray-900">{FIELD_MAP.formatBoolean(listing.elevator)}</div>
                          </div>
                        )}
                        {listing.totalFloors && listing.floor && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">전체 층수</div>
                            <div className="text-sm text-gray-900">{listing.totalFloors}층</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Amenities - Premium */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-gray-900">편의시설</h3>
                    {!hasAmenities && (
                      <button
                        onClick={handleEdit}
                        className="text-xs font-medium text-dabang-primary hover:text-dabang-primary/80 transition-colors"
                      >
                        편의시설 추가 →
                      </button>
                    )}
                  </div>
                  {hasAmenities ? (
                    <div>
                      <div className="flex flex-wrap gap-2.5">
                        {listing.amenities.map((amenity, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl text-xs font-semibold border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                          >
                            <span>{amenityIcons[amenity] || '✓'}</span>
                            <span>{amenity}</span>
                          </span>
                        ))}
                      </div>
                      {listing.otherAmenities && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-500 mb-1">기타 편의시설</div>
                          <div className="text-sm text-gray-700">{listing.otherAmenities}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-3 text-xs text-gray-500">
                      편의시설이 설정되지 않았습니다. 
                      <button
                        onClick={handleEdit}
                        className="ml-1 text-dabang-primary hover:text-dabang-primary/80 font-medium"
                      >
                        추가하기
                      </button>
                    </div>
                  )}
                </div>

                {/* Description - Expandable */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <h3 className="text-base font-bold text-gray-900 mb-4">상세 설명</h3>
                  {listing.description ? (
                    <div>
                      <p className={`text-sm text-gray-700 whitespace-pre-wrap leading-relaxed ${!expandedDescription ? 'line-clamp-4' : ''}`}>
                        {listing.description}
                      </p>
                      {listing.description.length > 200 && (
                        <button
                          onClick={() => setExpandedDescription(!expandedDescription)}
                          className="mt-2 text-xs font-medium text-dabang-primary hover:text-dabang-primary/80 transition-colors"
                        >
                          {expandedDescription ? '접기' : '더 보기'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">미입력</p>
                  )}
                </div>
              </div>

              {/* Right Column (40%) */}
              <div className="space-y-6">
                {/* Location Card - Premium */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <h3 className="text-base font-bold text-gray-900 mb-5">위치 정보</h3>
                  <div className="space-y-3">
                    {(listing.city || listing.region1) && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">시/도</div>
                        <div className="text-sm text-gray-900">
                          {FIELD_MAP.getValue(listing.city || listing.region1)}
                        </div>
                      </div>
                    )}
                    {(listing.region2 || listing.region) && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">구/군</div>
                        <div className="text-sm text-gray-900">
                          {FIELD_MAP.getValue(listing.region2 || listing.region)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">상세 주소</div>
                      <p className="text-sm text-gray-900 flex items-start gap-2 leading-relaxed">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="flex-1">
                          {FIELD_MAP.getValue(listing.address || listing.region3 || listing.region || listing.city, '미입력')}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const address = listing.address || listing.region3 || listing.region || listing.city || '';
                        if (address) {
                          navigator.clipboard.writeText(address).then(() => {
                            alert('주소가 복사되었습니다.');
                          });
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200/60"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      주소 복사
                    </button>
                  </div>
                </div>

                {/* Timeline / Meta Card - Premium */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <h3 className="text-base font-bold text-gray-900 mb-5">메타 정보</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">등록일</div>
                      <div className="text-sm text-gray-900">{formatDate(listing.createdAt) || '미입력'}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {listing.createdAt ? FIELD_MAP.formatDateShort(listing.createdAt) : ''}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">최종 수정</div>
                      <div className="text-sm text-gray-900">{formatRelativeDate(listing.updatedAt || listing.createdAt) || '미입력'}</div>
                      {listing.updatedAt && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {FIELD_MAP.formatDateShort(listing.updatedAt)}
                        </div>
                      )}
                    </div>
                    {listing.propertyType && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">매물 유형</div>
                        <div className="text-sm text-gray-900">{getPropertyTypeLabel(listing.propertyType)}</div>
                      </div>
                    )}
                    {listing.transactionType && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">거래 유형</div>
                        <div className="text-sm text-gray-900">{FIELD_MAP.getValue(listing.transactionType || listing.dealType)}</div>
                      </div>
                    )}
                    {listing.status === 'PENDING' && (
                      <div className="pt-3 border-t border-gray-100">
                        <div className="text-xs font-medium text-gray-500 mb-1">검토 상태</div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-md border border-amber-200/60">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          관리자 검토 대기 중
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info Card - Premium */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-gray-900">연락처 정보</h3>
                    {!hasContactInfo && (
                      <button
                        onClick={handleEdit}
                        className="text-xs font-medium text-dabang-primary hover:text-dabang-primary/80 transition-colors"
                      >
                        연락처 추가 →
                      </button>
                    )}
                  </div>
                  {hasContactInfo ? (
                    <div className="space-y-3">
                      {(listing.contactName || listing.agent?.name) ? (
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">담당자 이름</div>
                          <div className="text-sm text-gray-900">
                            {FIELD_MAP.getValue(listing.contactName || listing.agent?.name)}
                          </div>
                        </div>
                      ) : null}
                      {(listing.contactPhone || listing.agent?.phone) ? (
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">연락처</div>
                          <div className="text-sm text-gray-900">
                            {FIELD_MAP.getValue(listing.contactPhone || listing.agent?.phone)}
                          </div>
                        </div>
                      ) : null}
                      {(listing.contactEmail || listing.agent?.email) ? (
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">이메일</div>
                          <div className="text-sm text-gray-900 break-all">
                            {FIELD_MAP.getValue(listing.contactEmail || listing.agent?.email)}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="py-3 text-xs text-gray-500">
                      연락처 정보가 없습니다. 
                      <button
                        onClick={handleEdit}
                        className="ml-1 text-dabang-primary hover:text-dabang-primary/80 font-medium"
                      >
                        추가하기
                      </button>
                    </div>
                  )}
                </div>

                {/* Documents Card - Premium */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-gray-900">계약서</h3>
                    {!hasContract && (
                      <button
                        onClick={handleAttachContract}
                        className="text-xs font-medium text-dabang-primary hover:text-dabang-primary/80 transition-colors"
                      >
                        계약서 첨부 →
                      </button>
                    )}
                  </div>
                  {hasContract ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">첨부됨</span>
                      </div>
                      {listing.contractFile && (
                        <div className="text-xs text-gray-500 pl-10">
                          {listing.contractFile}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-3 text-xs text-gray-500">
                      계약서가 첨부되지 않았습니다. 
                      <button
                        onClick={handleAttachContract}
                        className="ml-1 text-dabang-primary hover:text-dabang-primary/80 font-medium"
                      >
                        첨부하기
                      </button>
                    </div>
                  )}
                </div>

                {/* Ownership & Parties Card - Premium */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <h3 className="text-base font-bold text-gray-900 mb-6">소유자 / 거래 당사자</h3>
                  
                  <div className="space-y-5">
                    {/* Owner (소유주) - Required */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-gray-900">소유주</h4>
                          <span className="px-1.5 py-0.5 text-[10px] font-medium text-red-600 bg-red-50 rounded border border-red-200/60">
                            필수
                          </span>
                        </div>
                        {!listing.owner && !listing.ownerName && (
                          <button
                            onClick={handleEdit}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-dabang-primary hover:text-dabang-primary/80 hover:bg-dabang-primary/5 rounded-lg transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            소유자 추가
                          </button>
                        )}
                      </div>
                      {listing.owner || listing.ownerName ? (
                        <div className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-gray-50/50 rounded-xl border border-gray-200/60">
                          <div>
                            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">이름</div>
                            <div className="text-sm font-semibold text-gray-900">
                              {listing.owner?.name || listing.ownerName || '—'}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {(listing.owner?.phone || listing.ownerPhone) && (
                              <div>
                                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">연락처</div>
                                <div className="text-xs text-gray-700">
                                  {listing.owner?.phone || listing.ownerPhone}
                                </div>
                              </div>
                            )}
                            {(listing.owner?.email || listing.ownerEmail) && (
                              <div>
                                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">이메일</div>
                                <div className="text-xs text-gray-700 truncate">
                                  {listing.owner?.email || listing.ownerEmail}
                                </div>
                              </div>
                            )}
                          </div>
                          {(listing.owner?.type || listing.ownerType) && (
                            <div className="pt-2 border-t border-gray-200/60">
                              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">구분</div>
                              <div className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md"
                                style={{
                                  backgroundColor: (listing.owner?.type === 'Company' || listing.ownerType === 'Company') ? '#EFF6FF' : '#F3F4F6',
                                  color: (listing.owner?.type === 'Company' || listing.ownerType === 'Company') ? '#1E40AF' : '#374151',
                                  border: `1px solid ${(listing.owner?.type === 'Company' || listing.ownerType === 'Company') ? '#BFDBFE' : '#D1D5DB'}`,
                                }}
                              >
                                {(listing.owner?.type === 'Company' || listing.ownerType === 'Company') ? '법인' : '개인'}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-300 text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-gray-900 mb-1">소유자 정보 없음</p>
                          <p className="text-[10px] text-gray-500 mb-3">매물을 게시하려면 소유자 정보가 필요합니다</p>
                          <button
                            onClick={handleEdit}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-dabang-primary rounded-lg hover:bg-dabang-primary/90 transition-all shadow-sm shadow-dabang-primary/20"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            소유자 추가
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Buyer / Tenant (구매자 / 임차인) - Optional */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-gray-900">
                            {listing.transactionType === '매매' ? '구매자' : '임차인'}
                          </h4>
                          <span className="px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 rounded border border-gray-200/60">
                            선택
                          </span>
                        </div>
                        {!listing.buyer && !listing.tenant && !listing.buyerName && !listing.tenantName && (
                          <button
                            onClick={handleEdit}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            고객 연결
                          </button>
                        )}
                      </div>
                      {(listing.buyer || listing.tenant || listing.buyerName || listing.tenantName) ? (
                        <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50/30 to-indigo-50/20 rounded-xl border border-blue-200/60">
                          <div>
                            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">이름</div>
                            <div className="text-sm font-semibold text-gray-900">
                              {listing.buyer?.name || listing.tenant?.name || listing.buyerName || listing.tenantName || '—'}
                            </div>
                          </div>
                          {(listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) && (
                            <div className="pt-2 border-t border-blue-200/40">
                              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">상태</div>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg"
                                style={{
                                  backgroundColor: (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === 'Contract Signed' || (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === '계약완료'
                                    ? '#D1FAE5'
                                    : (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === 'In Discussion' || (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === '협의중'
                                    ? '#FEF3C7'
                                    : '#F3F4F6',
                                  color: (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === 'Contract Signed' || (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === '계약완료'
                                    ? '#065F46'
                                    : (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === 'In Discussion' || (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === '협의중'
                                    ? '#92400E'
                                    : '#6B7280',
                                  border: `1px solid ${(listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === 'Contract Signed' || (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === '계약완료'
                                    ? '#A7F3D0'
                                    : (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === 'In Discussion' || (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === '협의중'
                                    ? '#FDE68A'
                                    : '#E5E7EB'}`,
                                }}
                              >
                                <span>
                                  {(listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === 'Contract Signed' || (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === '계약완료' ? '✓' : 
                                   (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === 'In Discussion' || (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === '협의중' ? '●' : '○'}
                                </span>
                                <span>
                                  {(listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === 'Contract Signed' || (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === '계약완료' ? '계약완료' :
                                   (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === 'In Discussion' || (listing.buyer?.status || listing.tenant?.status || listing.buyerStatus || listing.tenantStatus) === '협의중' ? '협의중' :
                                   '미할당'}
                                </span>
                              </div>
                            </div>
                          )}
                          {(listing.buyer?.id || listing.tenant?.id || listing.buyerId || listing.tenantId) && (
                            <div className="pt-2 border-t border-blue-200/40">
                              <button
                                onClick={() => {
                                  const customerId = listing.buyer?.id || listing.tenant?.id || listing.buyerId || listing.tenantId;
                                  window.location.href = `/business/real-estate/customers?customerId=${customerId}`;
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-dabang-primary hover:text-dabang-primary/80 hover:bg-dabang-primary/5 rounded-lg transition-all"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                고객 프로필 보기
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 bg-gray-50/30 rounded-xl border border-dashed border-gray-300 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-gray-600 mb-1">고객 미연결</p>
                          <p className="text-[10px] text-gray-500 mb-3">거래 고객을 연결하면 계약 관리가 편리합니다</p>
                          <button
                            onClick={handleEdit}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            고객 연결
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Agent / Partner - Read-only */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-gray-900">중개 파트너</h4>
                        <span className="px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-50 rounded border border-gray-200/60">
                          읽기 전용
                        </span>
                      </div>
                      <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-200/60">
                        <div>
                          <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">이름</div>
                          <div className="text-sm font-semibold text-gray-700">
                            {listing.partnerName || listing.createdBy || listing.agent?.name || '—'}
                          </div>
                        </div>
                        {listing.partnerEmail && (
                          <div className="mt-3 pt-3 border-t border-gray-200/60">
                            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">이메일</div>
                            <div className="text-xs text-gray-600">{listing.partnerEmail}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Internal Memo - Premium Expandable */}
                <div className="bg-gradient-to-br from-amber-50/80 via-yellow-50/60 to-orange-50/40 rounded-3xl shadow-lg border border-amber-200/80 p-6 backdrop-blur-sm" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                  <h3 className="text-base font-bold text-gray-900 mb-4">내부 메모</h3>
                  {listing.internalMemo ? (
                    <div>
                      <p className={`text-xs text-gray-700 whitespace-pre-wrap leading-relaxed ${!expandedMemo ? 'line-clamp-4' : ''}`}>
                        {listing.internalMemo}
                      </p>
                      {listing.internalMemo.length > 200 && (
                        <button
                          onClick={() => setExpandedMemo(!expandedMemo)}
                          className="mt-2 text-xs font-medium text-dabang-primary hover:text-dabang-primary/80 transition-colors"
                        >
                          {expandedMemo ? '접기' : '더 보기'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">미입력</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Premium Sticky */}
        <div className="sticky bottom-0 flex items-center justify-between px-8 py-5 border-t border-gray-200/80 bg-gradient-to-b from-white via-white to-gray-50/50 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2">
            {onDuplicate && (
              <button
                onClick={() => {
                  onDuplicate(listing.id);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50"
              >
                복제
              </button>
            )}
            {onArchive && (
              <button
                onClick={() => {
                  onArchive(listing.id);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50"
              >
                보관
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50 shadow-sm hover:shadow-md"
            >
              닫기
            </button>
            <button
              onClick={handleEdit}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-dabang-primary to-indigo-600 rounded-xl hover:from-dabang-primary/90 hover:to-indigo-600/90 transition-all duration-200 shadow-lg shadow-dabang-primary/30 hover:shadow-xl hover:shadow-dabang-primary/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-dabang-primary/50"
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;

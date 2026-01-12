import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../context/I18nContext';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { getPlatformCampaigns, seedPlatformCampaigns } from '../../../store/platformCampaignsStore';
import { getDiscountToggleState, setDiscountToggleState } from '../../../store/discountToggleStore';
import { isDiscountEnabledForPartner, toggleDiscountForPartner } from '../../../store/partnerDiscountUsageStore';

const BusinessDeliveryDiscountsPage = () => {
  const { t } = useI18n();
  const { user } = useUnifiedAuth();
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(false);
  const [couponToggleStates, setCouponToggleStates] = useState({});
  const [filters, setFilters] = useState({
    type: 'ALL',
    search: '',
  });

  useEffect(() => {
    // Seed platform campaigns if empty (for demo purposes)
    seedPlatformCampaigns();
    loadData();
    // Load discount toggle state
    setIsDiscountEnabled(getDiscountToggleState());
  }, []);

  useEffect(() => {
    // Load individual coupon toggle states from PartnerDiscountUsage
    const states = {};
    const partnerId = user?.email;
    availableCoupons.forEach((coupon) => {
      states[coupon.id] = isDiscountEnabledForPartner(coupon.id, partnerId);
    });
    setCouponToggleStates(states);
  }, [availableCoupons, user?.email]);

  const loadData = () => {
    // Load only PARTNER owner discounts for DELIVERY scope
    const allCampaigns = getPlatformCampaigns();
    const partnerId = user?.email;
    
    const deliveryCampaigns = allCampaigns.filter((campaign) => {
      // Only show PARTNER owner discounts
      if (campaign.owner !== 'PARTNER') return false;
      
      // Must be for DELIVERY scope
      if (campaign.scope !== 'DELIVERY') return false;
      
      // Must be ACTIVE status
      if (campaign.status !== 'ACTIVE') return false;
      
      // Check partner eligibility
      if (campaign.eligiblePartnerMode === 'ALL_PARTNERS_IN_DOMAIN') {
        return true; // All partners in domain are eligible
      } else if (campaign.eligiblePartnerMode === 'SELECT_PARTNERS') {
        // Check if this partner is in the selected list
        const partnerIds = campaign.partnerIds || [];
        return partnerIds.includes(partnerId) || partnerIds.includes(user?.id);
      }
      
      return false;
    });
    
    setAvailableCoupons(deliveryCampaigns);
  };

  const filteredCoupons = useMemo(() => {
    const now = new Date();
    return availableCoupons.filter((coupon) => {
      // Check if coupon is currently valid (within date range)
      const startAt = coupon.startAt ? new Date(coupon.startAt) : null;
      const endAt = coupon.endAt ? new Date(coupon.endAt) : null;
      if (startAt && now < startAt) return false;
      if (endAt && now > endAt) return false;

      // Filter by type
      if (filters.type !== 'ALL' && coupon.discountType !== filters.type) return false;

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!coupon.title.toLowerCase().includes(searchLower) &&
            !coupon.description?.toLowerCase().includes(searchLower)) return false;
      }

      return true;
    });
  }, [availableCoupons, filters]);

  const handleDiscountToggle = (enabled) => {
    setIsDiscountEnabled(enabled);
    setDiscountToggleState(enabled);
    // Show feedback message
    if (enabled) {
      // You can add a toast notification here if needed
      console.log('Discount coupons are now enabled for use.');
    } else {
      console.log('Discount coupons are now disabled.');
    }
  };

  const handleCouponToggle = (couponId, enabled) => {
    const partnerId = user?.email;
    if (!partnerId) return;
    
    // Use PartnerDiscountUsage store
    toggleDiscountForPartner(couponId, partnerId);
    
    setCouponToggleStates((prev) => ({
      ...prev,
      [couponId]: enabled,
    }));
    
    // Reload data to refresh states
    loadData();
    
    // Show feedback message
    if (enabled) {
      console.log(`Coupon ${couponId} is now ENABLED.`);
    } else {
      console.log(`Coupon ${couponId} is now DISABLED.`);
    }
  };

  const formatValue = (type, value) => {
    if (type === 'PERCENT') return `${value}%`;
    if (type === 'FIXED') return `₩${value.toLocaleString()}`;
    return value;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">할인 쿠폰 관리</h1>
        <p className="text-gray-600 mt-1">사용 가능한 할인 쿠폰을 확인하고 활성화할 수 있습니다.</p>
      </div>

      {/* Discount Usage Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label htmlFor="discount-toggle" className="block text-lg font-semibold text-gray-900 mb-2">
              할인 쿠폰 사용 활성화
            </label>
            <p className="text-sm text-gray-600">
              배송 서비스 주문 시 사용 가능한 할인 쿠폰을 적용할 수 있도록 설정합니다.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${isDiscountEnabled ? 'text-green-600' : 'text-gray-500'}`}>
              {isDiscountEnabled ? '활성화됨' : '비활성화됨'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="discount-toggle"
                checked={isDiscountEnabled}
                onChange={(e) => handleDiscountToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dabang-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할인 유형</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="ALL">전체</option>
              <option value="PERCENT">퍼센트 할인</option>
              <option value="FIXED">고정 금액 할인</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">검색</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="쿠폰 이름 또는 설명 검색"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Available Coupons List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">사용 가능한 쿠폰</h2>
        {filteredCoupons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">사용 가능한 쿠폰이 없습니다</h3>
              <p className="text-sm text-gray-600">관리자가 활성화한 할인 쿠폰이 없습니다.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => {
              const isCouponActive = couponToggleStates[coupon.id] !== false;
              return (
                <div
                  key={coupon.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Coupon Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{coupon.title}</h3>
                    {coupon.description && (
                      <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                    )}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold">
                      {formatValue(coupon.discountType, coupon.value)} OFF
                    </div>
                  </div>

                  {/* Coupon Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">유효 기간:</span>
                      <span>{formatDate(coupon.startAt)} ~ {formatDate(coupon.endAt)}</span>
                    </div>
                    {coupon.minAmount && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">최소 주문 금액:</span>
                        <span>₩{coupon.minAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {coupon.usageLimit && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">사용량:</span>
                        <span>{coupon.usedCount || 0} / {coupon.usageLimit}</span>
                      </div>
                    )}
                  </div>

                  {/* Single Toggle Switch */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <label htmlFor={`coupon-toggle-${coupon.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                      쿠폰 상태
                    </label>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${isCouponActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {isCouponActive ? '활성화됨' : '비활성화됨'}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id={`coupon-toggle-${coupon.id}`}
                          checked={isCouponActive}
                          onChange={(e) => handleCouponToggle(coupon.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dabang-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDeliveryDiscountsPage;


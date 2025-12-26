import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../context/I18nContext';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import {
  getPartnerDiscountsByPartnerId,
  createPartnerDiscount,
  updatePartnerDiscount,
  deletePartnerDiscount,
  togglePartnerDiscount,
  submitPartnerDiscount,
  seedPartnerDiscounts,
} from '../../../store/partnerDiscountsStore';
import DiscountDrawer from '../../../components/discounts/DiscountDrawer';

const BusinessDeliveryDiscountsPage = () => {
  const { t } = useI18n();
  const { user } = useUnifiedAuth();
  const [discounts, setDiscounts] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [filters, setFilters] = useState({
    status: 'ALL',
    type: 'ALL',
    relatedEntityType: 'ALL',
    search: '',
  });

  // Get partnerId from user email (simple mapping for now)
  const partnerId = user?.email ? `partner-${user.email.split('@')[0]}` : null;
  const partnerName = user?.email || 'Unknown Partner';

  useEffect(() => {
    seedPartnerDiscounts();
    loadData();
  }, [partnerId]);

  const loadData = () => {
    if (!partnerId) return;
    const partnerDiscounts = getPartnerDiscountsByPartnerId(partnerId);
    setDiscounts(partnerDiscounts.filter((d) => d.scope === 'DELIVERY'));
  };

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((discount) => {
      if (filters.status === 'DRAFT' && discount.status !== 'DRAFT') return false;
      if (filters.status === 'SUBMITTED' && discount.status !== 'SUBMITTED') return false;
      if (filters.status === 'ACTIVE' && discount.status !== 'ACTIVE') return false;
      if (filters.status === 'REJECTED' && discount.status !== 'REJECTED') return false;
      if (filters.status === 'EXPIRED') {
        const now = new Date();
        const endAt = discount.endAt ? new Date(discount.endAt) : null;
        if (!endAt || endAt > now) return false;
      }
      if (filters.type !== 'ALL' && discount.discountType !== filters.type) return false;
      if (filters.relatedEntityType !== 'ALL' && discount.relatedEntityType !== filters.relatedEntityType) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!discount.title.toLowerCase().includes(searchLower)) return false;
      }
      return true;
    });
  }, [discounts, filters]);

  const kpiStats = useMemo(() => {
    const now = new Date();
    return {
      draft: discounts.filter((d) => d.status === 'DRAFT').length,
      submitted: discounts.filter((d) => d.status === 'SUBMITTED').length,
      active: discounts.filter((d) => {
        if (d.status !== 'ACTIVE') return false;
        const startAt = d.startAt ? new Date(d.startAt) : null;
        const endAt = d.endAt ? new Date(d.endAt) : null;
        if (startAt && now < startAt) return false;
        if (endAt && now > endAt) return false;
        return true;
      }).length,
      rejected: discounts.filter((d) => d.status === 'REJECTED').length,
    };
  }, [discounts]);

  const handleOpenDrawer = (discount = null) => {
    setEditingDiscount(discount);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingDiscount(null);
  };

  const handleSaveDiscount = (data) => {
    if (!partnerId) {
      alert(t('discounts.noPartnerContext'));
      return;
    }

    if (editingDiscount) {
      // When editing, reset to DRAFT if it was rejected
      const updatedData = {
        ...data,
        status: editingDiscount.status === 'REJECTED' ? 'DRAFT' : editingDiscount.status,
      };
      updatePartnerDiscount(editingDiscount.id, updatedData);
    } else {
      // New discounts start as DRAFT
      createPartnerDiscount({
        ...data,
        partnerId,
        partnerName,
        scope: 'DELIVERY',
        status: 'DRAFT',
        isActive: false,
      });
    }
    loadData();
    handleCloseDrawer();
  };

  const handleSubmit = (id) => {
    if (window.confirm('할인을 제출하여 관리자 승인을 요청하시겠습니까?')) {
      submitPartnerDiscount(id);
      loadData();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(t('discounts.confirmDelete'))) {
      deletePartnerDiscount(id);
      loadData();
    }
  };

  const handleToggleActive = (id, isActive) => {
    togglePartnerDiscount(id, !isActive);
    loadData();
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

  if (!partnerId) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">{t('discounts.noPartnerContext')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('discounts.title')}</h1>
          <p className="text-gray-600 mt-1">{t('discounts.subtitle')}</p>
        </div>
        <button
          onClick={() => handleOpenDrawer()}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90"
        >
          {t('discounts.createDiscount')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">초안</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{kpiStats.draft}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">승인 대기</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{kpiStats.submitted}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">{t('discounts.activeDiscounts')}</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{kpiStats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">거부됨</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{kpiStats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="ALL">전체</option>
              <option value="DRAFT">초안</option>
              <option value="SUBMITTED">승인 대기</option>
              <option value="ACTIVE">{t('discounts.active')}</option>
              <option value="REJECTED">거부됨</option>
              <option value="EXPIRED">{t('discounts.expired')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('discounts.form.discountType')}</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="ALL">전체</option>
              <option value="PERCENT">{t('discounts.types.PERCENT')}</option>
              <option value="FIXED">{t('discounts.types.FIXED')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('discounts.form.relatedEntityType')}</label>
            <select
              value={filters.relatedEntityType}
              onChange={(e) => setFilters({ ...filters, relatedEntityType: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="ALL">전체</option>
              <option value="NONE">{t('discounts.entityTypes.NONE')}</option>
              <option value="SERVICE">{t('discounts.entityTypes.SERVICE')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.search')}</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder={t('common.search')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Discounts Grid (Card Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiscounts.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">아직 등록된 할인이 없습니다</h3>
              <p className="text-sm text-gray-600 mb-6">첫 할인 이벤트를 만들어 고객 유입을 늘려보세요</p>
              <button
                onClick={() => handleOpenDrawer()}
                className="px-6 py-3 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 font-semibold transition-colors"
              >
                할인 만들기
              </button>
            </div>
          </div>
        ) : (
          filteredDiscounts.map((discount) => (
            <div
              key={discount.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{discount.title}</h3>
                  {discount.description && (
                    <p className="text-sm text-gray-600 mb-2">{discount.description}</p>
                  )}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold">
                    {formatValue(discount.discountType, discount.value)} OFF
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  discount.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                  discount.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                  discount.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  discount.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {discount.status === 'DRAFT' ? '초안' :
                   discount.status === 'SUBMITTED' ? '승인 대기' :
                   discount.status === 'ACTIVE' ? '활성' :
                   discount.status === 'REJECTED' ? '거부됨' : discount.status || 'DRAFT'}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">기간:</span>
                  <span>{formatDate(discount.startAt)} ~ {formatDate(discount.endAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t('discounts.form.scope')}:</span>
                  <span>{t(`discounts.scopes.${discount.scope}`)}</span>
                </div>
                {discount.relatedEntityType !== 'NONE' && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t('discounts.form.relatedEntityType')}:</span>
                    <span>{t(`discounts.entityTypes.${discount.relatedEntityType}`)}</span>
                    {discount.relatedEntityId && <span className="text-xs">({discount.relatedEntityId})</span>}
                  </div>
                )}
                {discount.usageLimit && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">사용:</span>
                    <span>{discount.usedCount} / {discount.usageLimit}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {(!discount.status || discount.status === 'DRAFT') && (
                  <>
                    <button
                      onClick={() => handleOpenDrawer(discount)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {t('discounts.edit')}
                    </button>
                    <button
                      onClick={() => handleSubmit(discount.id)}
                      className="flex-1 px-3 py-2 text-sm bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90"
                    >
                      제출
                    </button>
                    <button
                      onClick={() => handleDelete(discount.id)}
                      className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      {t('discounts.delete')}
                    </button>
                  </>
                )}
                {discount.status === 'SUBMITTED' && (
                  <div className="w-full text-center text-sm text-blue-600 font-medium">
                    승인 대기중
                  </div>
                )}
                {discount.status === 'REJECTED' && (
                  <>
                    <button
                      onClick={() => handleOpenDrawer(discount)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      수정 후 재제출
                    </button>
                    {discount.adminNote && (
                      <div className="w-full text-xs text-red-600 mt-2">
                        거부 사유: {discount.adminNote}
                      </div>
                    )}
                  </>
                )}
                {discount.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleOpenDrawer(discount)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {t('discounts.view')}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Drawer */}
      {showDrawer && (
        <DiscountDrawer
          isOpen={showDrawer}
          onClose={handleCloseDrawer}
          onSave={handleSaveDiscount}
          discount={editingDiscount}
          mode="discount"
          partnerId={partnerId}
          scope="DELIVERY"
        />
      )}
    </div>
  );
};

export default BusinessDeliveryDiscountsPage;


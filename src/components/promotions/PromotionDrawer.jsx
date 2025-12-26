import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { getListingsByPartner } from '../../store/realEstateListingsStore';

const PromotionDrawer = ({ isOpen, onClose, onSave, promotion = null, partnerId = null, partnerType = 'REAL_ESTATE' }) => {
  const { t } = useI18n();
  const [form, setForm] = useState({
    requestType: 'HOME_BANNER',
    targetEntityType: 'NONE',
    targetEntityId: null,
    title: '',
    headline: '',
    subtext: '',
    startAt: '',
    endAt: '',
    budgetPlan: 'WEEKLY',
  });
  const [errors, setErrors] = useState({});
  const [availableListings, setAvailableListings] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  // Price calculation based on request type and budget plan
  const calculatePrice = (requestType, budgetPlan) => {
    const prices = {
      HOME_BANNER: { WEEKLY: 300000, MONTHLY: 900000 },
      FEATURED_LISTING: { WEEKLY: 100000, MONTHLY: 300000 },
      TOP_RANKING: { WEEKLY: 150000, MONTHLY: 450000 },
      RECOMMENDED_PARTNER: { WEEKLY: 80000, MONTHLY: 240000 },
    };
    return prices[requestType]?.[budgetPlan] || 0;
  };

  useEffect(() => {
    if (isOpen) {
      if (promotion) {
        setForm({
          requestType: promotion.requestType || 'HOME_BANNER',
          targetEntityType: promotion.targetEntityType || 'NONE',
          targetEntityId: promotion.targetEntityId || null,
          title: promotion.title || '',
          headline: promotion.creative?.headline || '',
          subtext: promotion.creative?.subtext || '',
          startAt: promotion.startAt ? promotion.startAt.split('T')[0] : '',
          endAt: promotion.endAt ? promotion.endAt.split('T')[0] : '',
          budgetPlan: promotion.budgetPlan || 'WEEKLY',
        });
      } else {
        setForm({
          requestType: 'HOME_BANNER',
          targetEntityType: 'NONE',
          targetEntityId: null,
          title: '',
          headline: '',
          subtext: '',
          startAt: '',
          endAt: '',
          budgetPlan: 'WEEKLY',
        });
      }
      setErrors({});

      // Load listings if Real Estate
      if (partnerType === 'REAL_ESTATE' && partnerId) {
        const listings = getListingsByPartner(partnerId);
        setAvailableListings(listings);
      }

      // Mock services for Delivery
      if (partnerType === 'DELIVERY') {
        setAvailableServices([
          { id: 'service-1', name: '일반 이사 서비스' },
          { id: 'service-2', name: '프리미엄 이사 서비스' },
          { id: 'service-3', name: '소형 이사 서비스' },
        ]);
      }
    }
  }, [isOpen, promotion, partnerId, partnerType]);

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = t('promotions.validation.titleRequired');
    if (!form.headline) newErrors.headline = t('promotions.validation.headlineRequired');
    if (form.startAt && form.endAt) {
      if (new Date(form.endAt) <= new Date(form.startAt)) {
        newErrors.endAt = t('promotions.validation.endAfterStart');
      }
    }
    if (form.targetEntityType !== 'NONE' && !form.targetEntityId) {
      newErrors.targetEntityId = t('promotions.validation.entityIdRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const price = calculatePrice(form.requestType, form.budgetPlan);
    const data = {
      requestType: form.requestType,
      targetEntityType: form.targetEntityType,
      targetEntityId: form.targetEntityType !== 'NONE' ? form.targetEntityId : null,
      title: form.title,
      creative: {
        headline: form.headline,
        subtext: form.subtext || undefined,
        imageUrl: null,
      },
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
      budgetPlan: form.budgetPlan,
      price,
    };

    onSave(data);
  };

  if (!isOpen) return null;

  const price = calculatePrice(form.requestType, form.budgetPlan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {promotion ? t('promotions.cta.edit') : t('promotions.cta.apply')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('promotions.form.requestType')} *
              </label>
              <select
                value={form.requestType}
                onChange={(e) => setForm({ ...form, requestType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="HOME_BANNER">{t('promotions.requestTypes.HOME_BANNER')}</option>
                <option value="FEATURED_LISTING">{t('promotions.requestTypes.FEATURED_LISTING')}</option>
                <option value="TOP_RANKING">{t('promotions.requestTypes.TOP_RANKING')}</option>
                <option value="RECOMMENDED_PARTNER">{t('promotions.requestTypes.RECOMMENDED_PARTNER')}</option>
              </select>
            </div>

            {/* Target Entity Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('promotions.form.targetEntityType')} *
              </label>
              <select
                value={form.targetEntityType}
                onChange={(e) => setForm({ ...form, targetEntityType: e.target.value, targetEntityId: null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="NONE">{t('promotions.entityTypes.NONE')}</option>
                {partnerType === 'REAL_ESTATE' && <option value="LISTING">{t('promotions.entityTypes.LISTING')}</option>}
                {partnerType === 'DELIVERY' && <option value="SERVICE">{t('promotions.entityTypes.SERVICE')}</option>}
              </select>
            </div>

            {/* Target Entity Selection */}
            {form.targetEntityType !== 'NONE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('promotions.form.targetEntityId')} *
                </label>
                <select
                  value={form.targetEntityId || ''}
                  onChange={(e) => setForm({ ...form, targetEntityId: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 ${errors.targetEntityId ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">선택하세요</option>
                  {form.targetEntityType === 'LISTING' &&
                    availableListings.map((listing) => (
                      <option key={listing.id} value={listing.id}>
                        {listing.title || listing.address || listing.id}
                      </option>
                    ))}
                  {form.targetEntityType === 'SERVICE' &&
                    availableServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                </select>
                {errors.targetEntityId && (
                  <p className="text-red-500 text-xs mt-1">{errors.targetEntityId}</p>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('promotions.form.title')} *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="프로모션 제목"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Headline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('promotions.form.headline')} *
              </label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 ${errors.headline ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="메인 헤드라인"
              />
              {errors.headline && <p className="text-red-500 text-xs mt-1">{errors.headline}</p>}
            </div>

            {/* Subtext */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('promotions.form.subtext')}
              </label>
              <input
                type="text"
                value={form.subtext}
                onChange={(e) => setForm({ ...form, subtext: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="서브텍스트 (선택사항)"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('promotions.form.startAt')} *
                </label>
                <input
                  type="date"
                  value={form.startAt}
                  onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 ${errors.startAt ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('promotions.form.endAt')} *
                </label>
                <input
                  type="date"
                  value={form.endAt}
                  onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 ${errors.endAt ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.endAt && <p className="text-red-500 text-xs mt-1">{errors.endAt}</p>}
              </div>
            </div>

            {/* Budget Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('promotions.form.budgetPlan')} *
              </label>
              <select
                value={form.budgetPlan}
                onChange={(e) => setForm({ ...form, budgetPlan: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="WEEKLY">{t('promotions.budgetPlans.WEEKLY')}</option>
                <option value="MONTHLY">{t('promotions.budgetPlans.MONTHLY')}</option>
              </select>
            </div>

            {/* Price Summary */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{t('promotions.form.price')}:</span>
                <span className="text-2xl font-bold text-indigo-600">₩{price.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {t('promotions.budgetPlans.' + form.budgetPlan)} 기준
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t('promotions.cta.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90"
              >
                {promotion?.status === 'DRAFT' ? t('promotions.cta.submit') : t('common.saveChanges')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDrawer;


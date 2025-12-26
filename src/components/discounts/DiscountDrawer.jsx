import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import { getListingsByPartner } from '../../store/realEstateListingsStore';

const DiscountDrawer = ({ isOpen, onClose, onSave, discount = null, mode = 'campaign', partnerId = null, scope = 'REAL_ESTATE' }) => {
  const { t } = useI18n();
  const { user } = useUnifiedAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    scope: scope,
    discountType: 'PERCENT',
    value: '',
    startAt: '',
    endAt: '',
    status: mode === 'campaign' ? 'DRAFT' : undefined,
    targetMode: mode === 'campaign' ? 'ALL' : undefined,
    partnerIds: [],
    categories: [],
    stacking: 'NONE',
    minAmount: '',
    maxDiscount: '',
    usageLimit: '',
    relatedEntityType: mode === 'discount' ? 'NONE' : undefined,
    relatedEntityId: mode === 'discount' ? null : undefined,
    listingId: mode === 'discount' ? null : undefined,
    listingTitle: mode === 'discount' ? null : undefined,
    isActive: mode === 'discount' ? true : undefined,
    partnerName: '',
  });
  const [errors, setErrors] = useState({});
  const [availableListings, setAvailableListings] = useState([]);

  // Load listings when drawer opens and scope is REAL_ESTATE
  useEffect(() => {
    if (isOpen && mode === 'discount' && scope === 'REAL_ESTATE' && user?.email) {
      try {
        const listings = getListingsByPartner(user.email);
        // Filter to only LIVE listings (and optionally PENDING)
        const eligibleListings = listings.filter((listing) => 
          listing.status === 'LIVE' || listing.status === 'PENDING'
        );
        setAvailableListings(eligibleListings);
      } catch (error) {
        console.warn('Error loading listings:', error);
        setAvailableListings([]);
      }
    } else {
      setAvailableListings([]);
    }
  }, [isOpen, mode, scope, user?.email]);

  useEffect(() => {
    if (discount) {
      setForm({
        title: discount.title || '',
        description: discount.description || '',
        scope: discount.scope || scope,
        discountType: discount.discountType || 'PERCENT',
        value: discount.value || '',
        startAt: discount.startAt ? discount.startAt.split('T')[0] : '',
        endAt: discount.endAt ? discount.endAt.split('T')[0] : '',
        status: discount.status,
        targetMode: discount.targetMode,
        partnerIds: discount.partnerIds || [],
        categories: discount.categories || [],
        stacking: discount.stacking || 'NONE',
        minAmount: discount.minAmount || '',
        maxDiscount: discount.maxDiscount || '',
        usageLimit: discount.usageLimit || '',
        relatedEntityType: discount.relatedEntityType || 'NONE',
        relatedEntityId: discount.relatedEntityId || discount.listingId || null,
        listingId: discount.listingId || discount.relatedEntityId || null,
        listingTitle: discount.listingTitle || null,
        isActive: discount.isActive !== undefined ? discount.isActive : true,
        partnerName: discount.partnerName || '',
      });
    } else {
      setForm({
        title: '',
        description: '',
        scope: scope,
        discountType: 'PERCENT',
        value: '',
        startAt: '',
        endAt: '',
        status: mode === 'campaign' ? 'DRAFT' : undefined,
        targetMode: mode === 'campaign' ? 'ALL' : undefined,
        partnerIds: [],
        categories: [],
        stacking: 'NONE',
        minAmount: '',
        maxDiscount: '',
        usageLimit: '',
        relatedEntityType: mode === 'discount' ? 'NONE' : undefined,
        relatedEntityId: mode === 'discount' ? null : undefined,
        listingId: mode === 'discount' ? null : undefined,
        listingTitle: mode === 'discount' ? null : undefined,
        isActive: mode === 'discount' ? true : undefined,
        partnerName: '',
      });
    }
    setErrors({});
  }, [discount, isOpen, mode, scope]);

  const validate = () => {
    const newErrors = {};

    if (!form.title) newErrors.title = t('discounts.form.title') + ' ' + t('discounts.form.required');
    if (!form.value || form.value <= 0) {
      newErrors.value = t('discounts.validation.valuePositive');
    }
    if (form.discountType === 'PERCENT') {
      const maxPercent = mode === 'campaign' ? 80 : 30;
      if (form.value > maxPercent) {
        newErrors.value = mode === 'campaign' ? t('discounts.validation.adminPercentMax') : t('discounts.validation.percentMax');
      }
    }
    if (form.startAt && form.endAt && new Date(form.endAt) <= new Date(form.startAt)) {
      newErrors.endAt = t('discounts.validation.endAfterStart');
    }
    if (form.relatedEntityType && form.relatedEntityType !== 'NONE' && !form.relatedEntityId && !form.listingId) {
      newErrors.listingId = t('discounts.validation.entityIdRequired') || '매물을 선택해주세요';
    }
    // For LISTING type, require listingId
    if (form.relatedEntityType === 'LISTING' && !form.listingId) {
      newErrors.listingId = '매물을 선택해주세요';
    }
    if (form.usageLimit && form.usageLimit < (discount?.usedCount || 0)) {
      newErrors.usageLimit = t('discounts.validation.usageLimitValid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // If LISTING type, ensure listingId and listingTitle are set
    if (form.relatedEntityType === 'LISTING' && form.listingId) {
      const selectedListing = availableListings.find(l => 
        l.id === form.listingId || l.id?.toString() === form.listingId?.toString()
      );
      if (selectedListing) {
        form.listingTitle = selectedListing.title || selectedListing.address || `Listing ${form.listingId}`;
        form.relatedEntityId = form.listingId; // Keep for backward compatibility
      }
    }

    const data = {
      ...form,
      value: Number(form.value),
      minAmount: form.minAmount ? Number(form.minAmount) : undefined,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      startAt: form.startAt ? `${form.startAt}T00:00:00` : new Date().toISOString(),
      endAt: form.endAt ? `${form.endAt}T23:59:59` : undefined,
    };

    if (mode === 'discount' && partnerId) {
      data.partnerId = partnerId;
    }

    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {discount ? t('discounts.edit') : (mode === 'campaign' ? t('discounts.createCampaign') : t('discounts.createDiscount'))}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('discounts.form.title')} *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('discounts.form.description')}
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('discounts.form.scope')} *
              </label>
              <select
                value={form.scope}
                onChange={(e) => setForm({ ...form, scope: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="REAL_ESTATE">{t('discounts.scopes.REAL_ESTATE')}</option>
                <option value="DELIVERY">{t('discounts.scopes.DELIVERY')}</option>
                {mode === 'campaign' && <option value="ALL">{t('discounts.scopes.ALL')}</option>}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('discounts.form.discountType')} *
              </label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="PERCENT">{t('discounts.types.PERCENT')}</option>
                <option value="FIXED">{t('discounts.types.FIXED')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('discounts.form.value')} *
            </label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.value ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
              step="0.01"
              required
            />
            {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('discounts.form.startAt')} *
              </label>
              <input
                type="date"
                value={form.startAt}
                onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('discounts.form.endAt')} *
              </label>
              <input
                type="date"
                value={form.endAt}
                onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 ${errors.endAt ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.endAt && <p className="text-red-500 text-xs mt-1">{errors.endAt}</p>}
            </div>
          </div>

          {mode === 'campaign' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('discounts.form.status')} *
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="DRAFT">{t('discounts.draft')}</option>
                  <option value="LIVE">{t('discounts.live')}</option>
                  <option value="PAUSED">{t('discounts.paused')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('discounts.form.targetMode')} *
                </label>
                <select
                  value={form.targetMode}
                  onChange={(e) => setForm({ ...form, targetMode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="ALL">{t('discounts.targetModes.ALL')}</option>
                  <option value="PARTNER_IDS">{t('discounts.targetModes.PARTNER_IDS')}</option>
                  <option value="CATEGORY">{t('discounts.targetModes.CATEGORY')}</option>
                </select>
              </div>

              {form.targetMode === 'PARTNER_IDS' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('discounts.form.partnerIds')} (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={form.partnerIds.join(', ')}
                    onChange={(e) => setForm({ ...form, partnerIds: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="partner-123, partner-456"
                  />
                </div>
              )}
            </>
          )}

          {mode === 'discount' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('discounts.form.relatedEntityType')} *
                </label>
                <select
                  value={form.relatedEntityType}
                  onChange={(e) => setForm({ ...form, relatedEntityType: e.target.value, relatedEntityId: e.target.value === 'NONE' ? null : form.relatedEntityId })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="NONE">{t('discounts.entityTypes.NONE')}</option>
                  <option value="LISTING">{t('discounts.entityTypes.LISTING')}</option>
                  <option value="SERVICE">{t('discounts.entityTypes.SERVICE')}</option>
                </select>
              </div>

              {form.relatedEntityType === 'LISTING' && scope === 'REAL_ESTATE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    적용 매물 *
                  </label>
                  {availableListings.length === 0 ? (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <p className="text-sm text-gray-600 mb-3">매물이 없습니다. 먼저 매물을 등록하세요.</p>
                      <a
                        href="/business/real-estate/listings"
                        className="text-sm text-dabang-primary hover:underline font-medium"
                      >
                        매물 등록하기 →
                      </a>
                    </div>
                  ) : (
                    <select
                      value={form.listingId || ''}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedListing = availableListings.find(l => 
                          l.id === selectedId || l.id?.toString() === selectedId?.toString()
                        );
                        setForm({ 
                          ...form, 
                          listingId: selectedId || null,
                          listingTitle: selectedListing?.title || selectedListing?.address || null,
                          relatedEntityId: selectedId || null, // Keep for backward compatibility
                        });
                      }}
                      className={`w-full border rounded-lg px-3 py-2 ${errors.listingId ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    >
                      <option value="">매물을 선택하세요</option>
                      {availableListings.map((listing) => {
                        const statusBadge = listing.status === 'LIVE' ? '🟢' : listing.status === 'PENDING' ? '🟡' : '⚪';
                        const priceSummary = listing.price || listing.originalPrice || '가격 미정';
                        const district = listing.address?.split(' ').slice(0, 2).join(' ') || listing.district || '';
                        return (
                          <option key={listing.id} value={listing.id}>
                            {statusBadge} {listing.title || listing.address || `Listing ${listing.id}`} · {district} · {priceSummary}
                          </option>
                        );
                      })}
                    </select>
                  )}
                  {errors.listingId && <p className="text-red-500 text-xs mt-1">{errors.listingId}</p>}
                </div>
              )}
              {form.relatedEntityType !== 'NONE' && form.relatedEntityType !== 'LISTING' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('discounts.form.relatedEntityId')} *
                  </label>
                  <input
                    type="text"
                    value={form.relatedEntityId || ''}
                    onChange={(e) => setForm({ ...form, relatedEntityId: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 ${errors.relatedEntityId ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.relatedEntityId && <p className="text-red-500 text-xs mt-1">{errors.relatedEntityId}</p>}
                </div>
              )}

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  {t('discounts.form.isActive')}
                </label>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('discounts.form.stacking')} *
            </label>
            <select
              value={form.stacking}
              onChange={(e) => setForm({ ...form, stacking: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="NONE">{t('discounts.stacking.NONE')}</option>
              <option value="ALLOW">{t('discounts.stacking.ALLOW')}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('discounts.form.minAmount')}
              </label>
              <input
                type="number"
                value={form.minAmount}
                onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('discounts.form.maxDiscount')}
              </label>
              <input
                type="number"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('discounts.form.usageLimit')}
            </label>
            <input
              type="number"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.usageLimit ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
            />
            {errors.usageLimit && <p className="text-red-500 text-xs mt-1">{errors.usageLimit}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90"
            >
              {t('common.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountDrawer;



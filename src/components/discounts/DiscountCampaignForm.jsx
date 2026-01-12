import React, { useState, useEffect, useMemo } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { DEFAULT_DISCOUNT_CAMPAIGN, validateDiscountCampaign } from '../../lib/types/discountCampaign';
import { getBusinessAccounts } from '../../store/businessAccountsStore';

/**
 * Shared Discount Campaign Form Component
 * Used by Admin, Real-Estate, and Delivery dashboards
 * 
 * @param {Object} props
 * @param {"create" | "edit"} props.mode - Form mode
 * @param {Partial<DiscountCampaign>} props.initialValue - Initial form values
 * @param {(payload: DiscountCampaign) => void} props.onSubmit - Submit handler
 * @param {() => void} props.onCancel - Cancel handler
 * @param {Object} [props.availableTargets] - Available targets for selection
 * @param {boolean} [props.showStatus] - Whether to show status field (default: true for admin)
 * @param {string} [props.defaultScope] - Default scope (if not in initialValue)
 */
const DiscountCampaignForm = ({
  mode = 'create',
  initialValue = {},
  onSubmit,
  onCancel,
  availableTargets = {},
  showStatus = true,
  defaultScope = 'REAL_ESTATE',
}) => {
  const [form, setForm] = useState(() => {
    const merged = {
      ...DEFAULT_DISCOUNT_CAMPAIGN,
      ...initialValue,
      owner: initialValue.owner || 'PLATFORM',
      scope: initialValue.scope || defaultScope,
      targeting: {
        ...DEFAULT_DISCOUNT_CAMPAIGN.targeting,
        ...(initialValue.targeting || {}),
      },
      rules: {
        ...DEFAULT_DISCOUNT_CAMPAIGN.rules,
        ...(initialValue.rules || {}),
      },
      // PLATFORM-specific
      targetMode: initialValue.targetMode || 'ALL_USERS',
      targetIds: initialValue.targetIds || [],
      // PARTNER-specific
      eligiblePartnerMode: initialValue.eligiblePartnerMode || undefined,
      partnerIds: initialValue.partnerIds || [],
    };
    
    // Convert date strings to date input format
    if (merged.startAt && merged.startAt.includes('T')) {
      merged.startAt = merged.startAt.split('T')[0];
    }
    if (merged.endAt && merged.endAt.includes('T')) {
      merged.endAt = merged.endAt.split('T')[0];
    }
    
    return merged;
  });

  const [errors, setErrors] = useState({});
  const [availablePartners, setAvailablePartners] = useState([]);

  // Load partners when scope changes and owner is PARTNER
  useEffect(() => {
    if (form.owner === 'PARTNER' && form.scope) {
      const allPartners = getBusinessAccounts();
      const roleFilter = form.scope === 'REAL_ESTATE' ? 'BUSINESS_REAL_ESTATE' : 'BUSINESS_DELIVERY';
      const filtered = allPartners.filter(
        (p) => p.role === roleFilter && p.status === 'ACTIVE'
      );
      setAvailablePartners(filtered);
    } else {
      setAvailablePartners([]);
    }
  }, [form.owner, form.scope]);

  // Update form when initialValue changes
  useEffect(() => {
    if (initialValue && Object.keys(initialValue).length > 0) {
      const merged = {
        ...DEFAULT_DISCOUNT_CAMPAIGN,
        ...initialValue,
        owner: initialValue.owner || 'PLATFORM',
        targeting: {
          ...DEFAULT_DISCOUNT_CAMPAIGN.targeting,
          ...(initialValue.targeting || {}),
        },
        rules: {
          ...DEFAULT_DISCOUNT_CAMPAIGN.rules,
          ...(initialValue.rules || {}),
        },
        targetMode: initialValue.targetMode || 'ALL_USERS',
        targetIds: initialValue.targetIds || [],
        eligiblePartnerMode: initialValue.eligiblePartnerMode || undefined,
        partnerIds: initialValue.partnerIds || [],
      };
      
      // Convert date strings to date input format
      if (merged.startAt && merged.startAt.includes('T')) {
        merged.startAt = merged.startAt.split('T')[0];
      }
      if (merged.endAt && merged.endAt.includes('T')) {
        merged.endAt = merged.endAt.split('T')[0];
      }
      
      setForm(merged);
      setErrors({});
    }
  }, [initialValue]);

  // Validate form
  const isFormValid = useMemo(() => {
    const validation = validateDiscountCampaign(form);
    setErrors(validation.errors);
    return validation.valid;
  }, [form]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setForm(prev => {
        const updated = {
          ...prev,
          [field]: value,
        };
        
        // Reset owner-specific fields when owner changes
        if (field === 'owner') {
          if (value === 'PLATFORM') {
            updated.eligiblePartnerMode = undefined;
            updated.partnerIds = [];
            updated.targetMode = 'ALL_USERS';
            updated.targetIds = [];
          } else if (value === 'PARTNER') {
            updated.targetMode = undefined;
            updated.targetIds = [];
            updated.eligiblePartnerMode = 'ALL_PARTNERS_IN_DOMAIN';
            updated.partnerIds = [];
          }
        }
        
        // Reset partner selection when mode changes
        if (field === 'eligiblePartnerMode' && value === 'ALL_PARTNERS_IN_DOMAIN') {
          updated.partnerIds = [];
        }
        
        return updated;
      });
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleTargetIdsChange = (value) => {
    // Handle comma-separated string or array
    const ids = typeof value === 'string' 
      ? value.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(value) ? value : [];
    handleChange('targeting.targetIds', ids);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateDiscountCampaign(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Prepare payload with proper date format
    const payload = {
      ...form,
      startAt: form.startAt ? `${form.startAt}T00:00:00` : new Date().toISOString(),
      endAt: form.endAt ? `${form.endAt}T23:59:59` : undefined,
      discountValue: Number(form.discountValue),
      rules: {
        ...form.rules,
        minimumAmount: form.rules.minimumAmount ? Number(form.rules.minimumAmount) : undefined,
        maximumDiscount: form.rules.maximumDiscount ? Number(form.rules.maximumDiscount) : undefined,
        usageLimitTotal: form.rules.usageLimitTotal ? Number(form.rules.usageLimitTotal) : undefined,
        usageLimitPerUser: form.rules.usageLimitPerUser ? Number(form.rules.usageLimitPerUser) : undefined,
      },
      // Include owner-specific fields
      targetMode: form.owner === 'PLATFORM' ? form.targetMode : undefined,
      targetIds: form.owner === 'PLATFORM' ? form.targetIds : undefined,
      eligiblePartnerMode: form.owner === 'PARTNER' ? form.eligiblePartnerMode : undefined,
      partnerIds: form.owner === 'PARTNER' ? form.partnerIds : undefined,
    };

    // Remove fundingAcknowledged from payload (it's just for UI)
    delete payload.fundingAcknowledged;

    onSubmit(payload);
  };

  const scopeOptions = [
    { value: 'REAL_ESTATE', label: '부동산' },
    { value: 'DELIVERY', label: '배송' },
  ];

  const discountTypeOptions = [
    { value: 'PERCENT', label: '퍼센트 할인' },
    { value: 'AMOUNT', label: '고정 금액 할인' },
  ];

  const statusOptions = [
    { value: 'DRAFT', label: '초안' },
    { value: 'ACTIVE', label: '활성' },
    { value: 'PAUSED', label: '일시정지' },
    { value: 'EXPIRED', label: '만료' },
  ];

  const targetModeOptions = [
    { value: 'ALL', label: '전체' },
    { value: 'CATEGORY', label: '카테고리' },
    { value: 'ITEM', label: '아이템' },
    { value: 'PARTNER', label: '파트너' },
    { value: 'USER_SEGMENT', label: '사용자 세그먼트' },
  ];

  const stackingOptions = [
    { value: 'NOT_ALLOWED', label: '불가' },
    { value: 'ALLOWED', label: '가능' },
  ];

  const ownerOptions = [
    { value: 'PLATFORM', label: '플랫폼 할인 (Platform Discount)' },
    { value: 'PARTNER', label: '파트너 할인 (Partner Discount)' },
  ];

  const targetModeOptionsPlatform = [
    { value: 'ALL_USERS', label: '전체 사용자' },
    { value: 'NEW_USERS_ONLY', label: '신규 사용자만' },
    { value: 'CATEGORY', label: '카테고리' },
    { value: 'SERVICE', label: '서비스' },
  ];

  const eligiblePartnerModeOptions = [
    { value: 'ALL_PARTNERS_IN_DOMAIN', label: '도메인 내 모든 파트너' },
    { value: 'SELECT_PARTNERS', label: '파트너 선택' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 0. Discount Owner (NEW - at the top) */}
      <div>
        <Select
          id="owner"
          label="할인 소유자 / 자금 조달"
          value={form.owner}
          onChange={(e) => handleChange('owner', e.target.value)}
          options={ownerOptions}
          required
          error={errors.owner}
        />
        {form.owner === 'PLATFORM' && (
          <p className="mt-1 text-sm text-gray-600">
            사용자 웹/앱에 직접 적용됩니다. 파트너 대시보드에는 표시되지 않습니다.
          </p>
        )}
        {form.owner === 'PARTNER' && (
          <p className="mt-1 text-sm text-gray-600">
            파트너가 대시보드에서 활성화해야 적용됩니다. 할인 비용은 파트너 정산에서 차감됩니다.
          </p>
        )}
      </div>

      {/* 1. Title */}
      <Input
        id="title"
        label="제목"
        value={form.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
        error={errors.title}
        placeholder="할인 캠페인 제목"
      />

      {/* 2. Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          설명
        </label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
          rows={3}
          placeholder="할인 캠페인 설명 (선택사항)"
        />
      </div>

      {/* 3. Scope */}
      <Select
        id="scope"
        label="범위"
        value={form.scope}
        onChange={(e) => handleChange('scope', e.target.value)}
        options={scopeOptions}
        required
        error={errors.scope}
      />

      {/* 4. Discount Type */}
      <Select
        id="discountType"
        label="할인 유형"
        value={form.discountType}
        onChange={(e) => handleChange('discountType', e.target.value)}
        options={discountTypeOptions}
        required
        error={errors.discountType}
      />

      {/* 5. Discount Value */}
      <Input
        id="discountValue"
        label="할인 금액"
        type="number"
        value={form.discountValue}
        onChange={(e) => handleChange('discountValue', e.target.value)}
        required
        error={errors.discountValue}
        min="0"
        step={form.discountType === 'PERCENT' ? '1' : '0.01'}
        placeholder={form.discountType === 'PERCENT' ? '10' : '10000'}
      />

      {/* 6. Start Date / End Date */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="startAt"
          label="시작일"
          type="date"
          value={form.startAt}
          onChange={(e) => handleChange('startAt', e.target.value)}
          required
          error={errors.startAt}
        />
        <Input
          id="endAt"
          label="종료일"
          type="date"
          value={form.endAt}
          onChange={(e) => handleChange('endAt', e.target.value)}
          required
          error={errors.endAt}
        />
      </div>

      {/* 7. Status */}
      {showStatus && (
        <Select
          id="status"
          label="상태"
          value={form.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          required
          error={errors.status}
        />
      )}

      {/* 8. Owner-Specific Fields */}
      {form.owner === 'PLATFORM' && (
        <>
          {/* Apply Target for PLATFORM */}
          <Select
            id="targetMode"
            label="적용 대상"
            value={form.targetMode || 'ALL_USERS'}
            onChange={(e) => handleChange('targetMode', e.target.value)}
            options={targetModeOptionsPlatform}
            required
            error={errors.targetMode}
          />

          {/* Target IDs for PLATFORM (when mode != ALL_USERS) */}
          {form.targetMode && form.targetMode !== 'ALL_USERS' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                타겟 선택 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={Array.isArray(form.targetIds) ? form.targetIds.join(', ') : ''}
                onChange={(e) => {
                  const ids = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  handleChange('targetIds', ids);
                }}
                className={`w-full border rounded-lg px-3 py-2 ${errors.targetIds ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent`}
                placeholder="쉼표로 구분하여 입력 (예: id1, id2, id3)"
                required
              />
              {errors.targetIds && <p className="text-red-500 text-xs mt-1">{errors.targetIds}</p>}
            </div>
          )}
        </>
      )}

      {form.owner === 'PARTNER' && (
        <>
          {/* Eligible Partners for PARTNER */}
          <Select
            id="eligiblePartnerMode"
            label="적용 가능한 파트너"
            value={form.eligiblePartnerMode || ''}
            onChange={(e) => handleChange('eligiblePartnerMode', e.target.value)}
            options={eligiblePartnerModeOptions}
            required
            error={errors.eligiblePartnerMode}
          />

          {/* Partner Multi-Select (when SELECT_PARTNERS) */}
          {form.eligiblePartnerMode === 'SELECT_PARTNERS' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                파트너 선택 <span className="text-red-500">*</span>
              </label>
              <select
                multiple
                value={form.partnerIds || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  handleChange('partnerIds', selected);
                }}
                className={`w-full border rounded-lg px-3 py-2 min-h-[120px] ${errors.partnerIds ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent`}
                required
              >
                {availablePartners.map((partner) => (
                  <option key={partner.email || partner.id} value={partner.email || partner.id}>
                    {partner.companyName || partner.email} ({partner.email})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Ctrl/Cmd 키를 누른 채로 여러 파트너를 선택할 수 있습니다.
              </p>
              {errors.partnerIds && <p className="text-red-500 text-xs mt-1">{errors.partnerIds}</p>}
            </div>
          )}

          {/* Partner Enable Mode Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>파트너 활성화 모드:</strong> 파트너가 대시보드에서 이 할인을 활성화해야 적용됩니다.
            </p>
          </div>

          {/* Funding Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.fundingAcknowledged || false}
                onChange={(e) => handleChange('fundingAcknowledged', e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-yellow-800">
                이 할인 비용이 파트너 정산에서 차감됨을 이해했습니다.
              </span>
            </label>
          </div>
        </>
      )}

      {/* Legacy Target Mode (for backward compatibility, only show if not using owner-specific fields) */}
      {!form.owner && (
        <>
          <Select
            id="targetMode"
            label="타겟 모드"
            value={form.targeting.targetMode}
            onChange={(e) => handleChange('targeting.targetMode', e.target.value)}
            options={targetModeOptions}
            required
            error={errors.targetIds}
          />

          {form.targeting.targetMode !== 'ALL' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                타겟 선택 {form.targeting.targetMode !== 'ALL' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={Array.isArray(form.targeting.targetIds) ? form.targeting.targetIds.join(', ') : ''}
                onChange={(e) => handleTargetIdsChange(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 ${errors.targetIds ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent`}
                placeholder="쉼표로 구분하여 입력 (예: id1, id2, id3)"
                required={form.targeting.targetMode !== 'ALL'}
              />
              {errors.targetIds && <p className="text-red-500 text-xs mt-1">{errors.targetIds}</p>}
            </div>
          )}
        </>
      )}

      {/* 10. Stacking */}
      <Select
        id="stacking"
        label="중복 적용"
        value={form.rules.stacking}
        onChange={(e) => handleChange('rules.stacking', e.target.value)}
        options={stackingOptions}
        required
        error={errors.stacking}
      />

      {/* 11. Minimum Amount */}
      <Input
        id="minimumAmount"
        label="최소 금액"
        type="number"
        value={form.rules.minimumAmount || ''}
        onChange={(e) => handleChange('rules.minimumAmount', e.target.value || undefined)}
        error={errors.minimumAmount}
        min="0"
        step="0.01"
        placeholder="최소 주문 금액 (선택사항)"
      />

      {/* 12. Maximum Discount */}
      <Input
        id="maximumDiscount"
        label="최대 할인 금액"
        type="number"
        value={form.rules.maximumDiscount || ''}
        onChange={(e) => handleChange('rules.maximumDiscount', e.target.value || undefined)}
        error={errors.maximumDiscount}
        min="0"
        step="0.01"
        placeholder="최대 할인 금액 (선택사항)"
      />

      {/* 13. Usage Limits */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="usageLimitTotal"
          label="총 사용 한도"
          type="number"
          value={form.rules.usageLimitTotal || ''}
          onChange={(e) => handleChange('rules.usageLimitTotal', e.target.value || undefined)}
          error={errors.usageLimitTotal}
          min="1"
          step="1"
          placeholder="전체 사용 횟수 (선택사항)"
        />
        <Input
          id="usageLimitPerUser"
          label="사용자당 사용 한도"
          type="number"
          value={form.rules.usageLimitPerUser || ''}
          onChange={(e) => handleChange('rules.usageLimitPerUser', e.target.value || undefined)}
          error={errors.usageLimitPerUser}
          min="1"
          step="1"
          placeholder="사용자당 사용 횟수 (선택사항)"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {mode === 'create' ? '생성' : '저장'}
        </button>
      </div>
    </form>
  );
};

export default DiscountCampaignForm;


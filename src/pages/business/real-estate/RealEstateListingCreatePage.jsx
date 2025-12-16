import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { addListing } from '../../../store/realEstateListingsStore';
import { addApproval } from '../../../store/approvalsStore';

const initialForm = {
  title: '',
  address: '',
  city: '',
  propertyType: '',
  price: '',
  deposit: '',
  monthly: '',
  area: '',
  rooms: '',
  bathrooms: '',
  floor: '',
  description: '',
  contactName: '',
  contactPhone: '',
};

const propertyTypes = [
  { label: '아파트', value: 'apartment' },
  { label: '주택', value: 'house' },
  { label: '오피스', value: 'office' },
];

const RealEstateListingCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useUnifiedAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const partnerEmail = user?.email || '';
  const createdBy = user?.name || partnerEmail || 'Partner';

  const validators = useMemo(
    () => ({
      title: (value) => value.trim() !== '',
      address: (value) => value.trim() !== '',
      city: (value) => value.trim() !== '',
      propertyType: (value) => value.trim() !== '',
      area: (value) => value.trim() !== '',
      rooms: (value) => value.trim() !== '',
      bathrooms: (value) => value.trim() !== '',
      floor: (value) => value.trim() !== '',
      description: (value) => value.trim() !== '',
      contactName: (value) => value.trim() !== '',
      contactPhone: (value) => value.trim() !== '',
    }),
    []
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    Object.entries(validators).forEach(([field, fn]) => {
      if (!fn(form[field] || '')) {
        nextErrors[field] = '필수 입력 항목입니다.';
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    const listingId = Date.now();
    const now = new Date().toISOString();

    // Create summary for approval meta
    const summary = `${form.title} - ${form.area}㎡ - ${form.price ? form.price + '원' : '가격 협의'}`;

    const listing = {
      id: listingId,
      createdAt: now,
      createdBy,
      partnerEmail,
      partnerId: partnerEmail,
      partnerName: user?.name || 'Real Estate Partner',
      status: 'PENDING',
      title: form.title,
      address: form.address,
      city: form.city,
      propertyType: form.propertyType,
      price: form.price,
      deposit: form.deposit,
      monthly: form.monthly,
      area: form.area,
      rooms: form.rooms,
      bathrooms: form.bathrooms,
      floor: form.floor,
      description: form.description,
      contactName: form.contactName,
      contactPhone: form.contactPhone,
      images: [],
    };

    // Save listing
    addListing(listing);

    // Create approval request
    const approval = {
      id: `approval-${listingId}`,
      type: 'REAL_ESTATE_LISTING_CREATE',
      entityId: String(listingId),
      entityType: 'LISTING',
      status: 'PENDING',
      submittedBy: partnerEmail || 'unknown',
      submittedAt: now,
      meta: {
        partnerId: partnerEmail,
        partnerName: user?.name || 'Real Estate Partner',
        summary: summary,
      },
    };

    // Save approval
    addApproval(approval);

    navigate('/business/real-estate/listings');
  };

  return (
    <div className="pb-16 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매물 등록</h1>
          <p className="text-gray-600 mt-1">등록 후 관리자가 승인하면 노출됩니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="예: 강남역 도보 5분, 신축 오피스텔"
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주소 *</label>
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="도로명 주소를 입력하세요"
              />
              {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">도시 / 구 *</label>
              <input
                name="city"
                value={form.city}
                onChange={onChange}
                className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="예: 서울시 강남구"
              />
              {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">매물 종류 *</label>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={onChange}
                className={`w-full border ${errors.propertyType ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              >
                <option value="">선택하세요</option>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.propertyType && <p className="text-sm text-red-600 mt-1">{errors.propertyType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
              <input
                name="price"
                value={form.price}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="매매가 또는 총액"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">보증금</label>
              <input
                name="deposit"
                value={form.deposit}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="월세/전세 보증금"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">월세 (선택)</label>
              <input
                name="monthly"
                value={form.monthly}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="월세 금액"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">면적 (㎡) *</label>
              <input
                name="area"
                value={form.area}
                onChange={onChange}
                className={`w-full border ${errors.area ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="예: 84.5"
              />
              {errors.area && <p className="text-sm text-red-600 mt-1">{errors.area}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">방 수 *</label>
              <input
                name="rooms"
                value={form.rooms}
                onChange={onChange}
                className={`w-full border ${errors.rooms ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="예: 3"
              />
              {errors.rooms && <p className="text-sm text-red-600 mt-1">{errors.rooms}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">욕실 수 *</label>
              <input
                name="bathrooms"
                value={form.bathrooms}
                onChange={onChange}
                className={`w-full border ${errors.bathrooms ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="예: 2"
              />
              {errors.bathrooms && <p className="text-sm text-red-600 mt-1">{errors.bathrooms}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">층수 *</label>
              <input
                name="floor"
                value={form.floor}
                onChange={onChange}
                className={`w-full border ${errors.floor ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="예: 5층"
              />
              {errors.floor && <p className="text-sm text-red-600 mt-1">{errors.floor}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상세 설명 *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              placeholder="매물 특징, 주변 환경, 관리비, 주차/엘리베이터 여부 등을 적어주세요."
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">담당자 이름 *</label>
              <input
                name="contactName"
                value={form.contactName}
                onChange={onChange}
                className={`w-full border ${errors.contactName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="담당자 이름"
              />
              {errors.contactName && <p className="text-sm text-red-600 mt-1">{errors.contactName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">담당자 연락처 *</label>
              <input
                name="contactPhone"
                value={form.contactPhone}
                onChange={onChange}
                className={`w-full border ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="010-1234-5678"
              />
              {errors.contactPhone && <p className="text-sm text-red-600 mt-1">{errors.contactPhone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이미지</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-sm text-gray-500 bg-gray-50">
              이미지 업로드 UI는 추후 연동됩니다. (현재는 플레이스홀더)
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/business/real-estate/listings')}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 disabled:opacity-70"
          >
            {submitting ? '등록 중...' : '매물 등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RealEstateListingCreatePage;


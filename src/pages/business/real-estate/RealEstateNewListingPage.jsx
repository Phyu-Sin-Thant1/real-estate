import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { getListingById, updateListing } from '../../../store/realEstateListingsStore';

const initialForm = {
  // Basic Information
  title: '',
  address: '',
  city: '',
  propertyType: '',
  transactionType: '',
  
  // Pricing
  price: '',
  deposit: '',
  monthly: '',
  maintenance: '',
  
  // Property Details
  area: '',
  rooms: '',
  bathrooms: '',
  floor: '',
  
  // Facilities (편의시설)
  amenities: [],
  
  // Contact Information
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  
  // Additional Details
  description: '',
  internalMemo: '',
  
  // Images
  images: [],
};

// Property types are now loaded from Common Codes
// Fallback to hardcoded values if common codes are not available
const defaultPropertyTypes = [
  { label: '아파트', value: 'apartment' },
  { label: '주택', value: 'house' },
  { label: '오피스텔', value: 'office' },
  { label: '원룸', value: 'studio' },
  { label: '투룸', value: 'two-room' },
  { label: '빌라', value: 'villa' },
];

const transactionTypes = [
  { label: '매매', value: '매매' },
  { label: '전세', value: '전세' },
  { label: '월세', value: '월세' },
];

const facilitiesOptions = [
  { id: 'parking', label: '주차', icon: '🅿️' },
  { id: 'elevator', label: '엘리베이터', icon: '🛗' },
  { id: 'security', label: '보안시설', icon: '🔒' },
  { id: 'internet', label: '인터넷', icon: '📶' },
  { id: 'airConditioning', label: '에어컨', icon: '❄️' },
  { id: 'heating', label: '난방', icon: '🔥' },
  { id: 'washingMachine', label: '세탁기', icon: '🔧' },
  { id: 'refrigerator', label: '냉장고', icon: '❄️' },
  { id: 'microwave', label: '전자레인지', icon: '🔔' },
  { id: 'gym', label: '헬스장', icon: '💪' },
  { id: 'pool', label: '수영장', icon: '🏊' },
  { id: 'concierge', label: '컨시어지', icon: '👔' },
  { id: 'pet', label: '반려동물 가능', icon: '🐾' },
  { id: 'balcony', label: '발코니/베란다', icon: '🌳' },
];

const RealEstateNewListingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUnifiedAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState(defaultPropertyTypes);
  
  // Progressive disclosure states
  const [showFacilities, setShowFacilities] = useState(false);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [otherFacility, setOtherFacility] = useState('');

  // Load property types from common codes
  useEffect(() => {
    try {
      const categories = getRealEstateCategoryOptions();
      if (categories.length > 0) {
        // Map numeric codes directly
        setPropertyTypes(categories.map(cat => ({
          label: cat.label,
          value: cat.value, // Use numeric code directly (e.g., "100-01")
        })));
      }
    } catch (error) {
      console.warn('Failed to load property types from common codes, using defaults', error);
    }
  }, []);

  // Load existing listing data for edit mode
  useEffect(() => {
    if (id) {
      setLoading(true);
      const existingListing = getListingById(id);
      if (existingListing) {
        // Map existing listing data to form structure
        const existingAmenities = existingListing.amenities || [];
        // Convert amenity labels to IDs if needed
        const amenityIds = existingAmenities.map(amenity => {
          const facility = facilitiesOptions.find(f => f.label === amenity || f.id === amenity);
          return facility ? facility.id : amenity;
        }).filter(Boolean);

        setForm({
          title: existingListing.title || existingListing.name || '',
          address: existingListing.address || '',
          city: existingListing.city || existingListing.region1 || '',
          propertyType: existingListing.propertyType || existingListing.type || '',
          transactionType: existingListing.transactionType || existingListing.dealType || '',
          
          // Extract price values from formatted priceDisplay or individual fields
          price: existingListing.salePrice || (existingListing.transactionType === '매매' ? (existingListing.price || '').replace(/[^0-9]/g, '') : ''),
          deposit: existingListing.deposit || '',
          monthly: existingListing.monthly || existingListing.monthlyRent || '',
          maintenance: existingListing.maintenance || existingListing.maintenanceFee || '',
          
          area: existingListing.area || existingListing.exclusiveArea || '',
          rooms: existingListing.rooms?.toString() || '',
          bathrooms: existingListing.bathrooms?.toString() || '',
          floor: existingListing.floor?.toString() || '',
          
          amenities: amenityIds,
          
          contactName: existingListing.contactName || existingListing.agent?.name || '',
          contactEmail: existingListing.contactEmail || existingListing.agent?.email || '',
          contactPhone: existingListing.contactPhone || existingListing.agent?.phone || '',
          
          description: existingListing.description || '',
          internalMemo: existingListing.internalMemo || '',
          
          images: existingListing.images || [],
        });

        // Auto-expand sections if they have data
        if (amenityIds.length > 0) setShowFacilities(true);
        if (existingListing.description || existingListing.internalMemo) setShowAdditionalDetails(true);
      }
      setLoading(false);
    }
  }, [id]);

  const validators = useMemo(
    () => ({
      title: (value) => value.trim() !== '',
      address: (value) => value.trim() !== '',
      city: (value) => value.trim() !== '',
      propertyType: (value) => value.trim() !== '',
      transactionType: (value) => value.trim() !== '',
      area: (value) => value.trim() !== '',
      rooms: (value) => value.trim() !== '',
      bathrooms: (value) => value.trim() !== '',
      floor: (value) => value.trim() !== '',
      description: (value) => value.trim() !== '',
      contactName: (value) => value.trim() !== '',
      contactPhone: (value) => value.trim() !== '',
      // Conditional pricing validation
      price: (value, transactionType) => {
        if (transactionType === '매매') {
          return value.trim() !== '';
        }
        return true;
      },
      deposit: (value, transactionType) => {
        if (transactionType === '전세' || transactionType === '월세') {
          return value.trim() !== '';
        }
        return true;
      },
      monthly: (value, transactionType) => {
        // Optional even for 월세
        return true;
      },
      contactEmail: (value) => {
        if (!value) return true; // Optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
    }),
    []
  );

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle facilities checkboxes
      if (name === 'facilities') {
        setForm((prev) => ({
          ...prev,
          amenities: checked
            ? [...prev.amenities, value]
            : prev.amenities.filter((a) => a !== value),
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleFacilityToggle = (facilityId) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(facilityId)
        ? prev.amenities.filter((a) => a !== facilityId)
        : [...prev.amenities, facilityId],
    }));
  };

  const handleAddOtherFacility = () => {
    if (otherFacility.trim() && !form.amenities.includes(otherFacility.trim())) {
      setForm((prev) => ({
        ...prev,
        amenities: [...prev.amenities, otherFacility.trim()],
      }));
      setOtherFacility('');
    }
  };

  const validate = () => {
    const nextErrors = {};
    
    // Basic required fields
    Object.entries(validators).forEach(([field, fn]) => {
      if (field === 'price' || field === 'deposit' || field === 'monthly') {
        // Conditional pricing validation
        if (!fn(form[field] || '', form.transactionType)) {
          nextErrors[field] = '필수 입력 항목입니다.';
        }
      } else if (field === 'contactEmail') {
        // Email format validation
        if (!fn(form[field] || '')) {
          nextErrors[field] = '올바른 이메일 형식을 입력해주세요.';
        }
      } else {
        if (!fn(form[field] || '')) {
          nextErrors[field] = '필수 입력 항목입니다.';
        }
      }
    });
    
    // Phone format validation (basic)
    if (form.contactPhone && !/^[0-9-]+$/.test(form.contactPhone)) {
      nextErrors.contactPhone = '올바른 전화번호 형식을 입력해주세요.';
    }
    
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e, saveAsDraft = false) => {
    e.preventDefault();
    if (submitting) return;
    
    if (!saveAsDraft && !validate()) return;

    setSubmitting(true);
    const now = new Date().toISOString();

    // Format price display based on transaction type
    let priceDisplay = '';
    if (form.transactionType === '매매') {
      priceDisplay = form.price ? `${form.price}원` : '가격 협의';
    } else if (form.transactionType === '전세') {
      priceDisplay = form.deposit ? `보증금 ${form.deposit}원` : '보증금 협의';
    } else if (form.transactionType === '월세') {
      const depositStr = form.deposit ? `보증금 ${form.deposit}원` : '';
      const monthlyStr = form.monthly ? `월세 ${form.monthly}원` : '';
      priceDisplay = [depositStr, monthlyStr].filter(Boolean).join(' · ') || '가격 협의';
    }

    // Map amenities IDs to display labels
    const amenitiesDisplay = form.amenities.map((amenityId) => {
      const facility = facilitiesOptions.find((f) => f.id === amenityId);
      return facility ? facility.label : amenityId;
    });

    const listingPatch = {
      title: form.title,
      address: form.address,
      city: form.city,
      region1: form.city.split(' ')[0] || form.city,
      region2: form.city.split(' ')[1] || '',
      region3: form.address,
      propertyType: form.propertyType,
      transactionType: form.transactionType,
      dealType: form.transactionType,
      price: priceDisplay,
      salePrice: form.transactionType === '매매' ? form.price : '',
      deposit: form.deposit || '',
      monthly: form.monthly || '',
      maintenance: form.maintenance || '',
      area: form.area,
      rooms: parseInt(form.rooms) || 0,
      bathrooms: parseInt(form.bathrooms) || 0,
      floor: form.floor,
      description: form.description,
      amenities: amenitiesDisplay,
      agent: {
        name: form.contactName,
        phone: form.contactPhone,
        email: form.contactEmail || '',
      },
      contactName: form.contactName,
      contactEmail: form.contactEmail || '',
      contactPhone: form.contactPhone,
      internalMemo: form.internalMemo || '',
      images: form.images || [],
      updatedAt: now,
    };

    // Update listing
    updateListing(id, listingPatch);

    setSubmitting(false);
    navigate('/business/real-estate/listings');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="pb-16 space-y-6">
      {/* Header Zone */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매물 수정</h1>
          <p className="text-gray-600 mt-1">
            매물 정보를 수정한 후 저장하면 변경사항이 반영됩니다.
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* A. Basic Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매물명 <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주소 <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                도시 / 구 <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매물 종류 <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                거래 유형 <span className="text-red-500">*</span>
              </label>
              <select
                name="transactionType"
                value={form.transactionType}
                onChange={onChange}
                className={`w-full border ${errors.transactionType ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              >
                <option value="">선택하세요</option>
                {transactionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.transactionType && <p className="text-sm text-red-600 mt-1">{errors.transactionType}</p>}
            </div>
          </div>
        </div>

        {/* B. Pricing & Contract Info Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">가격 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.transactionType === '매매' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  매매가 <span className="text-red-500">*</span>
                </label>
                <input
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                  placeholder="예: 500000000"
                />
                {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
              </div>
            )}

            {(form.transactionType === '전세' || form.transactionType === '월세') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  보증금 <span className="text-red-500">*</span>
                </label>
                <input
                  name="deposit"
                  value={form.deposit}
                  onChange={onChange}
                  className={`w-full border ${errors.deposit ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                  placeholder="예: 50000000"
                />
                {errors.deposit && <p className="text-sm text-red-600 mt-1">{errors.deposit}</p>}
              </div>
            )}

            {form.transactionType === '월세' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  월세 <span className="text-gray-500 text-xs">(선택)</span>
                </label>
                <input
                  name="monthly"
                  value={form.monthly}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  placeholder="예: 800000"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                관리비 <span className="text-gray-500 text-xs">(선택)</span>
              </label>
              <input
                name="maintenance"
                value={form.maintenance}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="예: 150000"
              />
              <p className="text-xs text-gray-500 mt-1">월 관리비를 입력하세요</p>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">매물 상세 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                면적 (㎡) <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                방 수 <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                욕실 수 <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                층수 <span className="text-red-500">*</span>
              </label>
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
        </div>

        {/* C. Facilities Section - Collapsible */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <button
            type="button"
            onClick={() => setShowFacilities(!showFacilities)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">편의시설</h2>
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform ${showFacilities ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFacilities && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                매물에 포함된 편의시설을 선택하세요. (선택 사항)
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {facilitiesOptions.map((facility) => (
                  <label
                    key={facility.id}
                    className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(facility.id)}
                      onChange={() => handleFacilityToggle(facility.id)}
                      className="h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
                    />
                    <span className="text-sm">{facility.icon}</span>
                    <span className="text-sm text-gray-700">{facility.label}</span>
                  </label>
                ))}
              </div>

              {/* Other facility input */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <input
                  type="text"
                  value={otherFacility}
                  onChange={(e) => setOtherFacility(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOtherFacility())}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  placeholder="기타 편의시설 (예: 옥상정원, 스파)"
                />
                <button
                  type="button"
                  onClick={handleAddOtherFacility}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  추가
                </button>
              </div>

              {/* Selected facilities display */}
              {form.amenities.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-2">선택된 편의시설:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.amenities.map((amenityId) => {
                      const facility = facilitiesOptions.find((f) => f.id === amenityId);
                      const label = facility ? facility.label : amenityId;
                      return (
                        <span
                          key={amenityId}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* D. Contact Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">연락처 정보</h2>
          <p className="text-xs text-gray-500 mb-4">
            이 정보는 매물 상세 페이지에 표시됩니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                담당자 이름 <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                담당자 이메일 <span className="text-gray-500 text-xs">(선택)</span>
              </label>
              <input
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={onChange}
                className={`w-full border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="email@example.com"
              />
              {errors.contactEmail && <p className="text-sm text-red-600 mt-1">{errors.contactEmail}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                담당자 연락처 <span className="text-red-500">*</span>
              </label>
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
        </div>

        {/* E. Additional Details Section - Collapsible */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <button
            type="button"
            onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">추가 정보</h2>
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform ${showAdditionalDetails ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdditionalDetails && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상세 설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={4}
                  className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                  placeholder="매물 특징, 주변 환경, 주차/엘리베이터 여부 등을 상세히 적어주세요."
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내부 메모 <span className="text-gray-500 text-xs">(파트너 전용)</span>
                </label>
                <textarea
                  name="internalMemo"
                  value={form.internalMemo}
                  onChange={onChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  placeholder="파트너만 볼 수 있는 메모입니다. 고객에게는 노출되지 않습니다."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이미지</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-sm text-gray-500 bg-gray-50 text-center">
                  이미지 업로드 UI는 추후 연동됩니다.
                  <p className="text-xs text-gray-400 mt-2">(현재는 플레이스홀더)</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/business/real-estate/listings')}
            className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={submitting}
            className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-70"
          >
            임시저장
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-dabang-primary hover:bg-dabang-primary/90 transition-colors disabled:opacity-70 shadow-sm"
          >
            {submitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RealEstateNewListingPage;

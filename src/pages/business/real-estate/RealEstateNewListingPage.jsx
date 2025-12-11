import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useListings } from '../../../context/ListingsContext';

const RealEstateNewListingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const { addListing, updateListing, getListingById } = useListings();
  
  const isEditMode = !!id;
  
  // Property types
  const propertyTypes = ['원룸', '투룸', '아파트', '오피스텔', '빌라'];
  
  // Transaction types
  const transactionTypes = ['매매', '전세', '월세'];
  
  // Status options
  const statusOptions = ['노출중', '비노출', '거래완료'];
  
  // Regions (시/도)
  const provinces = ['서울특별시', '경기도', '인천광역시', '부산광역시', '대구광역시', '광주광역시', '대전광역시', '울산광역시'];
  
  // Districts (시/군/구) - simplified for Seoul
  const districts = ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'];
  
  // Directions
  const directions = ['동향', '서향', '남향', '북향', '남동향', '남서향', '북동향', '북서향'];
  
  // Additional options
  const additionalOptions = [
    { id: 'elevator', label: '엘리베이터' },
    { id: 'parking', label: '주차 가능' },
    { id: 'pet', label: '반려동물 가능' },
    { id: 'balcony', label: '발코니/베란다' },
    { id: 'aircon', label: '에어컨' },
    { id: 'washer', label: '세탁기' },
    { id: 'refrigerator', label: '냉장고' },
    { id: 'bed', label: '침대' },
    { id: 'desk', label: '책상' },
    { id: 'closet', label: '옷장' },
    { id: 'microwave', label: '전자레인지' },
    { id: 'gas', label: '가스레인지' },
    { id: 'induction', label: '인덕션' },
    { id: 'tv', label: 'TV' },
    { id: 'internet', label: '인터넷' }
  ];

  const [formData, setFormData] = useState({
    // Basic Information
    title: '', // 매물명
    propertyType: '', // Property type (아파트 / 오피스텔 / 원룸 / 빌라 …)
    transactionType: '', // 거래 유형 (매매 / 전세 / 월세)
    status: '', // Status (노출중 / 비노출 / 거래완료)
    
    // Address
    province: '', // 시/도
    district: '', // 시/군/구
    detailedAddress: '', // 상세 주소
    
    // Price Information
    salePrice: '', // 매매가
    deposit: '', // 보증금
    monthlyRent: '', // 월세
    maintenanceFee: '', // 관리비
    
    // Area Information
    exclusiveArea: '', // 전용면적
    supplyArea: '', // 공급면적
    
    // Building Information
    floor: '', // 층
    totalFloors: '', // 총 층수
    rooms: '', // 방 수
    bathrooms: '', // 화장실 수
    parkingAvailable: false, // 주차 가능 여부
    
    // Additional Details
    completionYear: '', // 준공년도
    direction: '', // 방향
    description: '', // 설명
    
    // Additional Options (checkbox list)
    options: [],
    
    // Images
    thumbnail: null, // 썸네일 이미지
    images: [] // 여러 사진
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState({
    thumbnail: null,
    images: []
  });

  // Load existing listing data for edit mode
  useEffect(() => {
    if (isEditMode) {
      const existingListing = getListingById(id);
      if (existingListing) {
        setFormData({
          title: existingListing.title || '',
          propertyType: existingListing.type || '',
          transactionType: existingListing.transactionType || '',
          status: existingListing.status || '',
          province: existingListing.province || '',
          district: existingListing.district || '',
          detailedAddress: existingListing.address || '',
          salePrice: existingListing.salePrice || '',
          deposit: existingListing.deposit || '',
          monthlyRent: existingListing.monthlyRent || '',
          maintenanceFee: existingListing.maintenanceFee || '',
          exclusiveArea: existingListing.exclusiveArea || '',
          supplyArea: existingListing.supplyArea || '',
          floor: existingListing.floor || '',
          totalFloors: existingListing.totalFloors || '',
          rooms: existingListing.rooms || '',
          bathrooms: existingListing.bathrooms || '',
          parkingAvailable: existingListing.parkingAvailable || false,
          completionYear: existingListing.completionYear || '',
          direction: existingListing.direction || '',
          description: existingListing.description || '',
          options: existingListing.options || [],
          thumbnail: null,
          images: []
        });
        
        // Set up image previews if they exist
        if (existingListing.thumbnail) {
          setImagePreviews(prev => ({ ...prev, thumbnail: existingListing.thumbnail }));
        }
      }
    }
  }, [id, isEditMode, getListingById]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleOptionChange = (optionId) => {
    setFormData(prev => {
      const options = [...prev.options];
      const index = options.indexOf(optionId);
      
      if (index === -1) {
        options.push(optionId);
      } else {
        options.splice(index, 1);
      }
      
      return { ...prev, options };
    });
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, thumbnail: file }));
        setImagePreviews(prev => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = [];
      const newFiles = [];
      
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews[index] = reader.result;
          newFiles[index] = file;
          
          // When all files are processed, update state
          if (newPreviews.length === files.length && newFiles.length === files.length) {
            setFormData(prev => ({ ...prev, images: newFiles }));
            setImagePreviews(prev => ({ ...prev, images: newPreviews }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = '매물명을 입력해주세요';
    }
    
    if (!formData.propertyType) {
      newErrors.propertyType = '매물 종류를 선택해주세요';
    }
    
    if (!formData.transactionType) {
      newErrors.transactionType = '거래 유형을 선택해주세요';
    }
    
    if (!formData.status) {
      newErrors.status = '상태를 선택해주세요';
    }
    
    if (!formData.province) {
      newErrors.province = '시/도를 선택해주세요';
    }
    
    if (!formData.district) {
      newErrors.district = '시/군/구를 선택해주세요';
    }
    
    if (!formData.detailedAddress.trim()) {
      newErrors.detailedAddress = '상세 주소를 입력해주세요';
    }
    
    // Price validation based on transaction type
    if (formData.transactionType === '매매') {
      if (!formData.salePrice) {
        newErrors.salePrice = '매매가를 입력해주세요';
      }
    } else if (formData.transactionType === '전세') {
      if (!formData.deposit) {
        newErrors.deposit = '보증금을 입력해주세요';
      }
    } else if (formData.transactionType === '월세') {
      if (!formData.deposit && !formData.monthlyRent) {
        newErrors.deposit = '보증금 또는 월세를 입력해주세요';
        newErrors.monthlyRent = '보증금 또는 월세를 입력해주세요';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const listingData = {
          ...formData,
          // Format the address for display
          region: `${formData.province} ${formData.district}`,
          address: `${formData.province} ${formData.district} ${formData.detailedAddress}`,
          // Format the price for display
          price: formData.transactionType === '매매' 
            ? `${formData.salePrice}원`
            : formData.transactionType === '전세' 
              ? `보증금 ${formData.deposit}원`
              : `보증금 ${formData.deposit}원 / 월 ${formData.monthlyRent}원`,
          // Add timestamp
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        if (isEditMode) {
          updateListing(parseInt(id), listingData);
          alert('매물 정보가 수정되었습니다.');
        } else {
          addListing(listingData);
          alert('새 매물이 등록되었습니다.');
        }
        
        // Navigate back to listings page
        navigate('/business/real-estate/listings');
      } catch (error) {
        console.error('Error saving listing:', error);
        alert('매물 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/business/real-estate/listings');
  };

  return (
    <div className="pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? '매물 수정' : '새 매물 등록'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Listing Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매물명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="예: 강남 아파트 A동 101호"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매물 종류 <span className="text-red-500">*</span>
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className={`w-full border ${errors.propertyType ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              >
                <option value="">선택하세요</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.propertyType && (
                <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>
              )}
            </div>
            
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                거래 유형 <span className="text-red-500">*</span>
              </label>
              <select
                name="transactionType"
                value={formData.transactionType}
                onChange={handleInputChange}
                className={`w-full border ${errors.transactionType ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              >
                <option value="">선택하세요</option>
                {transactionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.transactionType && (
                <p className="mt-1 text-sm text-red-600">{errors.transactionType}</p>
              )}
            </div>
            
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상태 <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              >
                <option value="">선택하세요</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">주소 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시/도 <span className="text-red-500">*</span>
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className={`w-full border ${errors.province ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              >
                <option value="">선택하세요</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
              {errors.province && (
                <p className="mt-1 text-sm text-red-600">{errors.province}</p>
              )}
            </div>
            
            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시/군/구 <span className="text-red-500">*</span>
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className={`w-full border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              >
                <option value="">선택하세요</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && (
                <p className="mt-1 text-sm text-red-600">{errors.district}</p>
              )}
            </div>
            
            {/* Detailed Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상세 주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="detailedAddress"
                value={formData.detailedAddress}
                onChange={handleInputChange}
                className={`w-full border ${errors.detailedAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                placeholder="예: 역삼동 123-45"
              />
              {errors.detailedAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.detailedAddress}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Price Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">가격 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sale Price (매매가) */}
            {(formData.transactionType === '매매' || !formData.transactionType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  매매가 {formData.transactionType === '매매' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.salePrice ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                  placeholder="예: 300000000"
                />
                {errors.salePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.salePrice}</p>
                )}
              </div>
            )}
            
            {/* Deposit (보증금) */}
            {(formData.transactionType === '전세' || formData.transactionType === '월세' || !formData.transactionType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  보증금 {['전세', '월세'].includes(formData.transactionType) && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.deposit ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                  placeholder="예: 50000000"
                />
                {errors.deposit && (
                  <p className="mt-1 text-sm text-red-600">{errors.deposit}</p>
                )}
              </div>
            )}
            
            {/* Monthly Rent (월세) */}
            {(formData.transactionType === '월세' || !formData.transactionType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  월세 {formData.transactionType === '월세' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.monthlyRent ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                  placeholder="예: 1500000"
                />
                {errors.monthlyRent && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyRent}</p>
                )}
              </div>
            )}
            
            {/* Maintenance Fee (관리비) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                관리비
              </label>
              <input
                type="text"
                name="maintenanceFee"
                value={formData.maintenanceFee}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="예: 100000"
              />
            </div>
          </div>
        </div>
        
        {/* Area Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">면적 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exclusive Area (전용면적) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전용면적 (㎡)
              </label>
              <input
                type="text"
                name="exclusiveArea"
                value={formData.exclusiveArea}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="예: 84.5"
              />
            </div>
            
            {/* Supply Area (공급면적) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                공급면적 (㎡)
              </label>
              <input
                type="text"
                name="supplyArea"
                value={formData.supplyArea}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="예: 102.3"
              />
            </div>
          </div>
        </div>
        
        {/* Building Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">건물 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Floor (층) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                층
              </label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="예: 5"
              />
            </div>
            
            {/* Total Floors (총 층수) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                총 층수
              </label>
              <input
                type="text"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="예: 20"
              />
            </div>
            
            {/* Rooms (방 수) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                방 수
              </label>
              <input
                type="text"
                name="rooms"
                value={formData.rooms}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="예: 3"
              />
            </div>
            
            {/* Bathrooms (화장실 수) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                화장실 수
              </label>
              <input
                type="text"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="예: 2"
              />
            </div>
            
            {/* Parking Available (주차 가능 여부) */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="parkingAvailable"
                checked={formData.parkingAvailable}
                onChange={handleInputChange}
                className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
              />
              <label className="ml-2 block text-sm text-gray-700">
                주차 가능
              </label>
            </div>
          </div>
        </div>
        
        {/* Additional Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">추가 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Completion Year (준공년도) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                준공년도
              </label>
              <input
                type="text"
                name="completionYear"
                value={formData.completionYear}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="예: 2015"
              />
            </div>
            
            {/* Direction (방향) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                방향
              </label>
              <select
                name="direction"
                value={formData.direction}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              >
                <option value="">선택하세요</option>
                {directions.map(direction => (
                  <option key={direction} value={direction}>{direction}</option>
                ))}
              </select>
            </div>
            
            {/* Additional Options (checkbox list) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                추가 옵션
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {additionalOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={formData.options.includes(option.id)}
                      onChange={() => handleOptionChange(option.id)}
                      className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                    />
                    <label htmlFor={option.id} className="ml-2 block text-sm text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Description (설명) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="매물에 대한 상세 설명을 입력하세요"
              />
            </div>
          </div>
        </div>
        
        {/* Image Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">이미지</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                썸네일 이미지
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {imagePreviews.thumbnail ? (
                    <img 
                      src={imagePreviews.thumbnail} 
                      alt="Thumbnail preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">썸네일 업로드</span></p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".png,.jpg,.jpeg"
                    onChange={handleThumbnailUpload}
                  />
                </label>
              </div>
            </div>
            
            {/* Multiple Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매물 사진들
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {imagePreviews.images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 p-2 w-full h-full">
                      {imagePreviews.images.map((preview, index) => (
                        <img 
                          key={index}
                          src={preview} 
                          alt={`Preview ${index}`} 
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">사진들 업로드</span></p>
                      <p className="text-xs text-gray-500">PNG, JPG (여러 장 선택 가능, MAX. 10MB each)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".png,.jpg,.jpeg"
                    onChange={handleImagesUpload}
                    multiple
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sticky Footer Actions */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary"
            >
              {isEditMode ? '매물 수정' : '매물 등록'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RealEstateNewListingPage;
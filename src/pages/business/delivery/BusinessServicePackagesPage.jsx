import React, { useState, useEffect } from 'react';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { 
  getPackagesByAgency, 
  createPackage, 
  updatePackage, 
  deletePackage,
  togglePackageStatus 
} from '../../../store/servicePackagesStore';
import { getActiveCategories, validatePackagePrice } from '../../../store/categoriesStore';
import { deliveryServiceTypes } from '../../../mock/deliveryServices';
import Modal from '../../../components/common/Modal';
import Tooltip from '../../../components/common/Tooltip';

const BusinessServicePackagesPage = () => {
  const { user } = useUnifiedAuth();
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceError, setPriceError] = useState('');
  const [totalAddOnPrice, setTotalAddOnPrice] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [agencyId, setAgencyId] = useState('moving-agency-1');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nameKo: '',
    description: '',
    descriptionKo: '',
    price: '',
    categoryId: '',
    maxFloors: '',
    maxWeight: '',
    maxDistance: '',
    addOns: [
      { id: 'extra-floors', name: 'Extra Floors', nameKo: '추가 층', price: '', unit: 'per floor', unitKo: '층당', enabled: false },
      { id: 'large-items', name: 'Large Items', nameKo: '대형 물품', price: '', unit: 'per item', unitKo: '개당', enabled: false },
      { id: 'fragile-handling', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', price: '', unit: 'per item', unitKo: '개당', enabled: false }
    ],
    features: [''],
    isActive: true
  });

  useEffect(() => {
    if (user?.email) {
      // In a real app, get agency ID from user profile
      const defaultAgencyId = 'moving-agency-1';
      setAgencyId(defaultAgencyId);
      loadPackages(defaultAgencyId);
    }
    // Load categories
    const activeCategories = getActiveCategories();
    setCategories(activeCategories);
  }, [user?.email]);

  const loadPackages = (agencyId) => {
    const agencyPackages = getPackagesByAgency(agencyId);
    setPackages(agencyPackages);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      nameKo: '',
      description: '',
      descriptionKo: '',
      price: '',
      categoryId: '',
      maxFloors: '',
      maxWeight: '',
      maxDistance: '',
      addOns: [
        { name: 'Extra Floors', nameKo: '추가 층', price: '', unit: 'per floor', unitKo: '층당' },
        { name: 'Large Items', nameKo: '대형 물품', price: '', unit: 'per item', unitKo: '개당' },
        { name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', price: '', unit: 'per item', unitKo: '개당' }
      ],
      features: [''],
      isActive: true
    });
    setSelectedPackage(null);
    setSelectedCategory(null);
    setPriceError('');
    setIsCreateModalOpen(true);
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    const categoryId = pkg.categoryId || pkg.serviceType; // Fallback to serviceType for backward compatibility
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category);
    setFormData({
      name: pkg.name,
      nameKo: pkg.nameKo || '',
      description: pkg.description,
      descriptionKo: pkg.descriptionKo || '',
      price: pkg.price,
      categoryId: categoryId,
      maxFloors: pkg.limitations?.maxFloors || '',
      maxWeight: pkg.limitations?.maxWeight || '',
      maxDistance: pkg.limitations?.maxDistance || '',
      addOns: (pkg.addOns || [
        { id: 'extra-floors', name: 'Extra Floors', nameKo: '추가 층', price: '', unit: 'per floor', unitKo: '층당', enabled: false },
        { id: 'large-items', name: 'Large Items', nameKo: '대형 물품', price: '', unit: 'per item', unitKo: '개당', enabled: false },
        { id: 'fragile-handling', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', price: '', unit: 'per item', unitKo: '개당', enabled: false }
      ]).map(addon => ({ ...addon, enabled: addon.enabled !== undefined ? addon.enabled : true })),
      features: pkg.features || [''],
      isActive: pkg.isActive !== false
    });
    setPriceError('');
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('이 패키지를 삭제하시겠습니까?')) {
      deletePackage(id);
      loadPackages(agencyId);
    }
  };

  const handleToggleStatus = (id) => {
    togglePackageStatus(id);
    loadPackages(agencyId);
  };

  const handleCategoryChange = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category);
    setFormData({
      ...formData,
      categoryId: categoryId,
      // Pre-fill limitations from category defaults
      maxFloors: category?.defaultLimitations?.maxFloors || '',
      maxWeight: category?.defaultLimitations?.maxWeight || '',
      maxDistance: category?.defaultLimitations?.maxDistance || '',
      // Pre-fill add-ons from category defaults
      addOns: category?.allowedAddOns?.map(addon => ({
        name: addon.name,
        nameKo: addon.nameKo,
        price: addon.defaultPrice || '',
        unit: addon.unit,
        unitKo: addon.unitKo
      })) || formData.addOns
    });
    setPriceError('');
  };

  const handlePriceChange = (price) => {
    setFormData({ ...formData, price });
    if (formData.categoryId && price) {
      const validation = validatePackagePrice(formData.categoryId, parseInt(price));
      if (!validation.valid) {
        setPriceError(validation.message);
      } else {
        setPriceError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    const price = parseInt(formData.price);
    const validation = validatePackagePrice(formData.categoryId, price);
    if (!validation.valid) {
      setPriceError(validation.message);
      return;
    }

    const category = categories.find(c => c.id === formData.categoryId);
    
    const packageData = {
      agencyId,
      name: formData.name,
      nameKo: formData.nameKo,
      description: formData.description,
      descriptionKo: formData.descriptionKo,
      price: price,
      categoryId: formData.categoryId,
      serviceType: category?.id || formData.categoryId, // Keep serviceType for backward compatibility
      limitations: {
        maxFloors: parseInt(formData.maxFloors),
        maxWeight: parseInt(formData.maxWeight),
        maxDistance: parseInt(formData.maxDistance),
        description: `Up to ${formData.maxFloors} floors, ${formData.maxWeight}kg`
      },
      addOns: formData.addOns.map((addon, index) => ({
        id: `addon-${index + 1}`,
        name: addon.name,
        nameKo: addon.nameKo,
        price: parseInt(addon.price) || 0,
        unit: addon.unit,
        unitKo: addon.unitKo
      })),
      features: formData.features.filter(f => f.trim() !== ''),
      isActive: formData.isActive
    };

    if (selectedPackage) {
      updatePackage(selectedPackage.id, packageData);
    } else {
      createPackage(packageData);
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setPriceError('');
    loadPackages(agencyId);
  };

  const updateAddOn = (index, field, value) => {
    const newAddOns = [...formData.addOns];
    newAddOns[index] = { ...newAddOns[index], [field]: value };
    setFormData({ ...formData, addOns: newAddOns });
    calculateTotalAddOnPrice(newAddOns);
  };

  const toggleAddOn = (index) => {
    const newAddOns = [...formData.addOns];
    newAddOns[index] = { ...newAddOns[index], enabled: !(newAddOns[index].enabled || false) };
    setFormData({ ...formData, addOns: newAddOns });
    calculateTotalAddOnPrice(newAddOns);
  };

  const calculateTotalAddOnPrice = (addOns) => {
    const total = addOns
      .filter(addon => addon.enabled)
      .reduce((sum, addon) => sum + (parseInt(addon.price) || 0), 0);
    setTotalAddOnPrice(total);
  };

  useEffect(() => {
    calculateTotalAddOnPrice(formData.addOns);
  }, [formData.addOns]);

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">서비스 패키지 관리</h1>
          <p className="text-gray-600 mt-1">서비스 패키지를 생성하고 관리하세요</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
        >
          + 새 패키지 생성
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">전체 패키지</div>
          <div className="text-3xl font-bold text-gray-900">{packages.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">활성 패키지</div>
          <div className="text-3xl font-bold text-green-600">
            {packages.filter(p => p.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">비활성 패키지</div>
          <div className="text-3xl font-bold text-gray-400">
            {packages.filter(p => !p.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">평균 가격</div>
          <div className="text-3xl font-bold text-orange-600">
            ₩{packages.length > 0 
              ? Math.round(packages.reduce((sum, p) => sum + p.price, 0) / packages.length).toLocaleString()
              : 0}
          </div>
        </div>
      </div>

      {/* Packages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">패키지명</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">서비스 유형</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">가격</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">제한사항</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">상태</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{pkg.nameKo || pkg.name}</div>
                    <div className="text-sm text-gray-500">{pkg.descriptionKo || pkg.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {deliveryServiceTypes.find(t => t.id === pkg.serviceType)?.nameKo || pkg.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">₩{pkg.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pkg.limitations?.maxFloors}층, {pkg.limitations?.maxWeight}kg
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(pkg.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pkg.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {pkg.isActive ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {packages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            패키지가 없습니다. 새 패키지를 생성해주세요.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={selectedPackage ? '패키지 수정' : '새 패키지 생성'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: General Package Information */}
          <div className="space-y-5">
            <div className="pb-3 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">일반 패키지 정보</h3>
              <p className="text-sm text-gray-500 mt-1">패키지의 기본 정보를 입력하세요</p>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">패키지명 (영문) *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
                  placeholder="예: Home Delivery"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">패키지명 (한글) *</label>
                <input
                  type="text"
                  value={formData.nameKo}
                  onChange={(e) => setFormData({ ...formData, nameKo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
                  placeholder="예: 홈 배송"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">설명 (영문) *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md resize-none"
                  rows="3"
                  placeholder="Package description in English"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">설명 (한글) *</label>
                <textarea
                  value={formData.descriptionKo}
                  onChange={(e) => setFormData({ ...formData, descriptionKo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md resize-none"
                  rows="3"
                  placeholder="패키지 설명을 입력하세요"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Service Category and Price */}
          <div className="space-y-5 pt-6 border-t border-gray-200">
            <div className="pb-3 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">서비스 카테고리 및 가격</h3>
              <p className="text-sm text-gray-500 mt-1">카테고리를 선택하고 가격을 설정하세요</p>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">서비스 카테고리 *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md bg-white"
                  required
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameKo || category.name} (₩{category.priceRange.min.toLocaleString()} ~ ₩{category.priceRange.max.toLocaleString()})
                    </option>
                  ))}
                </select>
                {selectedCategory && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <span className="font-semibold">기본 가격:</span> ₩{selectedCategory.basePrice.toLocaleString()} | 
                      <span className="font-semibold"> 가격 범위:</span> ₩{selectedCategory.priceRange.min.toLocaleString()} ~ ₩{selectedCategory.priceRange.max.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">기본 가격 (₩) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all shadow-sm hover:shadow-md ${
                    priceError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                  }`}
                  placeholder="예: 120000"
                  required
                />
                {formData.price && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">기본 가격:</span>
                      <span className="font-bold text-gray-900">₩{parseInt(formData.price || 0).toLocaleString()}</span>
                    </div>
                    {totalAddOnPrice > 0 && (
                      <div className="flex items-center justify-between text-sm pt-1 border-t border-gray-200">
                        <span className="text-gray-600">추가 옵션:</span>
                        <span className="font-semibold text-orange-600">+₩{totalAddOnPrice.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-base font-bold mt-2 pt-2 border-t-2 border-gray-300">
                      <span className="text-gray-700">총 가격:</span>
                      <span className="text-orange-600">₩{(parseInt(formData.price || 0) + totalAddOnPrice).toLocaleString()}</span>
                    </div>
                  </div>
                )}
                {priceError && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {priceError}
                  </p>
                )}
                {selectedCategory && !priceError && formData.price && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    가격이 유효 범위 내에 있습니다
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Service Limits */}
          <div className="space-y-5 pt-6 border-t border-gray-200">
            <div className="pb-3 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">서비스 제한사항</h3>
              <p className="text-sm text-gray-500 mt-1">서비스의 최대 한도를 설정하세요</p>
            </div>
            
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">최대 층수 *</label>
                <input
                  type="number"
                  value={formData.maxFloors}
                  onChange={(e) => setFormData({ ...formData, maxFloors: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
                  placeholder="예: 2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">최대 무게 (kg) *</label>
                <input
                  type="number"
                  value={formData.maxWeight}
                  onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
                  placeholder="예: 300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">최대 거리 (km) *</label>
                <input
                  type="number"
                  value={formData.maxDistance}
                  onChange={(e) => setFormData({ ...formData, maxDistance: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
                  placeholder="예: 40"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Add-ons (Optional) */}
          <div className="space-y-5 pt-6 border-t border-gray-200">
            <div className="pb-3 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">추가 옵션 (선택사항)</h3>
              <p className="text-sm text-gray-500 mt-1">고객이 선택할 수 있는 추가 옵션을 설정하세요</p>
            </div>
            
            <div className="space-y-4">
              {formData.addOns.map((addon, index) => (
                <div key={index} className={`p-5 rounded-xl border-2 transition-all ${
                  addon.enabled 
                    ? 'border-orange-300 bg-orange-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center pt-1">
                      <input
                        type="checkbox"
                        id={`addon-${index}`}
                        checked={addon.enabled || false}
                        onChange={() => toggleAddOn(index)}
                        className="w-5 h-5 text-orange-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          addon.enabled ? 'bg-orange-100' : 'bg-gray-100'
                        }`}>
                          {addon.id === 'extra-floors' && (
                            <svg className={`w-7 h-7 ${addon.enabled ? 'text-orange-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          )}
                          {addon.id === 'large-items' && (
                            <svg className={`w-7 h-7 ${addon.enabled ? 'text-orange-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          )}
                          {addon.id === 'fragile-handling' && (
                            <svg className={`w-7 h-7 ${addon.enabled ? 'text-orange-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <label htmlFor={`addon-${index}`} className="text-base font-semibold text-gray-900 cursor-pointer">
                              {addon.nameKo || addon.name}
                            </label>
                            <Tooltip content={`${addon.nameKo || addon.name} - ${addon.id === 'extra-floors' ? '서비스에 추가 층을 더할 수 있습니다' : addon.id === 'large-items' ? '대형 물품에 대한 추가 처리를 제공합니다' : '깨지기 쉬운 물품에 대한 특별 처리를 제공합니다'}`}>
                              <button type="button" className="text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </Tooltip>
                          </div>
                          {addon.enabled && (
                            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-orange-200 shadow-sm">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {addon.id === 'extra-floors' ? '추가 층수 가격 (₩)' : addon.id === 'large-items' ? '대형 물품 가격 (₩)' : '깨지기 쉬운 물품 가격 (₩)'}
                                  </label>
                                  <input
                                    type="number"
                                    value={addon.price}
                                    onChange={(e) => updateAddOn(index, 'price', e.target.value)}
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                    placeholder="예: 20000"
                                  />
                                  {addon.price && (
                                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      {addon.unitKo || 'per item'}당 ₩{parseInt(addon.price || 0).toLocaleString()}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">단위</label>
                                  <input
                                    type="text"
                                    value={addon.unitKo}
                                    onChange={(e) => updateAddOn(index, 'unitKo', e.target.value)}
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                    placeholder="예: 층당, 개당"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Real-time Price Summary for Add-ons */}
              {totalAddOnPrice > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-5m-5 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">추가 옵션 총 가격:</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">+₩{totalAddOnPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Special Features / Instructions */}
          <div className="space-y-5 pt-6 border-t border-gray-200">
            <div className="pb-3 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">특별 기능 / 지시사항</h3>
              <p className="text-sm text-gray-500 mt-1">패키지의 추가 특징이나 특별 지시사항을 입력하세요</p>
            </div>
            
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="특징 입력 (예: 실시간 추적, 보험 포함, 깨지기 쉬운 물품 주의)"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm hover:shadow-md"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm hover:shadow-md border-2 border-red-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all shadow-sm hover:shadow-md border-2 border-gray-200 hover:border-gray-300 font-medium"
              >
                + 특징 추가
              </button>
            </div>
          </div>

          {/* Section 6: Activate Package */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <label htmlFor="isActive" className="text-base font-bold text-gray-900 cursor-pointer">
                    패키지 활성화
                  </label>
                  <p className="text-sm text-gray-600 mt-0.5">활성화된 패키지만 고객에게 표시됩니다</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold shadow-sm hover:shadow-md"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {selectedPackage ? '패키지 수정' : '패키지 생성'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BusinessServicePackagesPage;


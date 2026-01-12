import React, { useState, useEffect } from 'react';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getCategoryById
} from '../../store/categoriesStore';
import { getPackagesByAgency } from '../../store/servicePackagesStore';
import Modal from '../../components/common/Modal';

const AdminCategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [packageCounts, setPackageCounts] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nameKo: '',
    description: '',
    descriptionKo: '',
    basePrice: '',
    minPrice: '',
    maxPrice: '',
    maxFloors: '',
    maxWeight: '',
    maxDistance: '',
    addOns: [
      { id: 'extra-floors', name: 'Extra Floors', nameKo: '추가 층', defaultPrice: '', unit: 'per floor', unitKo: '층당' },
      { id: 'large-items', name: 'Large Items', nameKo: '대형 물품', defaultPrice: '', unit: 'per item', unitKo: '개당' },
      { id: 'fragile-handling', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', defaultPrice: '', unit: 'per item', unitKo: '개당' }
    ],
    isActive: true
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Load package counts for each category
    const counts = {};
    categories.forEach(cat => {
      // Get all packages and count those matching this category
      // For now, we'll use a simple approach - in production, packages should have categoryId
      const allPackages = [];
      ['moving-agency-1', 'moving-agency-2', 'moving-agency-3', 'moving-agency-4'].forEach(agencyId => {
        try {
          const packages = getPackagesByAgency(agencyId);
          allPackages.push(...packages);
        } catch (e) {
          // Ignore errors
        }
      });
      // Count packages that match category service type (temporary solution)
      counts[cat.id] = allPackages.filter(pkg => pkg.serviceType === cat.id || pkg.categoryId === cat.id).length;
    });
    setPackageCounts(counts);
  }, [categories]);

  const loadCategories = () => {
    const allCategories = getAllCategories();
    setCategories(allCategories);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      nameKo: '',
      description: '',
      descriptionKo: '',
      basePrice: '',
      minPrice: '',
      maxPrice: '',
      maxFloors: '',
      maxWeight: '',
      maxDistance: '',
      addOns: [
        { id: 'extra-floors', name: 'Extra Floors', nameKo: '추가 층', defaultPrice: '', unit: 'per floor', unitKo: '층당' },
        { id: 'large-items', name: 'Large Items', nameKo: '대형 물품', defaultPrice: '', unit: 'per item', unitKo: '개당' },
        { id: 'fragile-handling', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', defaultPrice: '', unit: 'per item', unitKo: '개당' }
      ],
      isActive: true
    });
    setSelectedCategory(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      nameKo: category.nameKo || '',
      description: category.description,
      descriptionKo: category.descriptionKo || '',
      basePrice: category.basePrice,
      minPrice: category.priceRange?.min || '',
      maxPrice: category.priceRange?.max || '',
      maxFloors: category.defaultLimitations?.maxFloors || '',
      maxWeight: category.defaultLimitations?.maxWeight || '',
      maxDistance: category.defaultLimitations?.maxDistance || '',
      addOns: category.allowedAddOns || [
        { id: 'extra-floors', name: 'Extra Floors', nameKo: '추가 층', defaultPrice: '', unit: 'per floor', unitKo: '층당' },
        { id: 'large-items', name: 'Large Items', nameKo: '대형 물품', defaultPrice: '', unit: 'per item', unitKo: '개당' },
        { id: 'fragile-handling', name: 'Fragile Handling', nameKo: '깨지기 쉬운 물품 처리', defaultPrice: '', unit: 'per item', unitKo: '개당' }
      ],
      isActive: category.isActive !== false
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('이 카테고리를 삭제하시겠습니까? 관련된 패키지도 함께 삭제될 수 있습니다.')) {
      deleteCategory(id);
      loadCategories();
    }
  };

  const handleToggleStatus = (id) => {
    toggleCategoryStatus(id);
    loadCategories();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryData = {
      name: formData.name,
      nameKo: formData.nameKo,
      description: formData.description,
      descriptionKo: formData.descriptionKo,
      basePrice: parseInt(formData.basePrice),
      priceRange: {
        min: parseInt(formData.minPrice),
        max: parseInt(formData.maxPrice)
      },
      defaultLimitations: {
        maxFloors: parseInt(formData.maxFloors),
        maxWeight: parseInt(formData.maxWeight),
        maxDistance: parseInt(formData.maxDistance),
        description: `Up to ${formData.maxFloors} floors, ${formData.maxWeight}kg`
      },
      allowedAddOns: formData.addOns.map(addon => ({
        id: addon.id,
        name: addon.name,
        nameKo: addon.nameKo,
        defaultPrice: parseInt(addon.defaultPrice) || 0,
        unit: addon.unit,
        unitKo: addon.unitKo
      })),
      isActive: formData.isActive
    };

    if (selectedCategory) {
      updateCategory(selectedCategory.id, categoryData);
    } else {
      createCategory(categoryData);
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    loadCategories();
  };

  const updateAddOn = (index, field, value) => {
    const newAddOns = [...formData.addOns];
    newAddOns[index] = { ...newAddOns[index], [field]: value };
    setFormData({ ...formData, addOns: newAddOns });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">서비스 카테고리 관리</h1>
          <p className="text-gray-600 mt-1">배송 서비스 카테고리를 생성하고 관리하세요</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
        >
          + 새 카테고리 생성
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">전체 카테고리</div>
          <div className="text-3xl font-bold text-gray-900">{categories.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">활성 카테고리</div>
          <div className="text-3xl font-bold text-green-600">
            {categories.filter(c => c.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">총 패키지 수</div>
          <div className="text-3xl font-bold text-blue-600">
            {Object.values(packageCounts).reduce((sum, count) => sum + count, 0)}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">평균 기본 가격</div>
          <div className="text-3xl font-bold text-indigo-600">
            ₩{categories.length > 0
              ? Math.round(categories.reduce((sum, c) => sum + c.basePrice, 0) / categories.length).toLocaleString()
              : 0}
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">카테고리명</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">기본 가격</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">가격 범위</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">서비스 제한</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">패키지 수</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">상태</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{category.nameKo || category.name}</div>
                    <div className="text-sm text-gray-500">{category.descriptionKo || category.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">₩{category.basePrice.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ₩{category.priceRange.min.toLocaleString()} ~ ₩{category.priceRange.max.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {category.defaultLimitations.maxFloors}층, {category.defaultLimitations.maxWeight}kg
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {packageCounts[category.id] || 0}개
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(category.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        category.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {category.isActive ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            카테고리가 없습니다. 새 카테고리를 생성해주세요.
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
        title={selectedCategory ? '카테고리 수정' : '새 카테고리 생성'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리명 (영문)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리명 (한글)</label>
              <input
                type="text"
                value={formData.nameKo}
                onChange={(e) => setFormData({ ...formData, nameKo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">설명 (영문)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">설명 (한글)</label>
              <textarea
                value={formData.descriptionKo}
                onChange={(e) => setFormData({ ...formData, descriptionKo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">가격 설정</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">기본 가격 (₩)</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">최소 가격 (₩)</label>
                <input
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">최대 가격 (₩)</label>
                <input
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * 업체는 이 범위 내에서 패키지 가격을 설정할 수 있습니다.
            </p>
          </div>

          {/* Limitations */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 서비스 제한사항</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">최대 층수</label>
                <input
                  type="number"
                  value={formData.maxFloors}
                  onChange={(e) => setFormData({ ...formData, maxFloors: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">최대 무게 (kg)</label>
                <input
                  type="number"
                  value={formData.maxWeight}
                  onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">최대 거리 (km)</label>
                <input
                  type="number"
                  value={formData.maxDistance}
                  onChange={(e) => setFormData({ ...formData, maxDistance: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">허용된 추가 옵션</h3>
            {formData.addOns.map((addon, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  value={addon.name}
                  onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                  placeholder="옵션명 (영문)"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={addon.nameKo}
                  onChange={(e) => updateAddOn(index, 'nameKo', e.target.value)}
                  placeholder="옵션명 (한글)"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={addon.defaultPrice}
                  onChange={(e) => updateAddOn(index, 'defaultPrice', e.target.value)}
                  placeholder="기본 가격"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={addon.unitKo}
                  onChange={(e) => updateAddOn(index, 'unitKo', e.target.value)}
                  placeholder="단위 (예: 층당)"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              활성화
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
            >
              {selectedCategory ? '수정' : '생성'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategoryManagementPage;








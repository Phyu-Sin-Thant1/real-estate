import React from 'react';

const CategorySidebar = ({ onFilterChange }) => {
  const dealTypes = ['매매', '전세', '월세'];
  const propertyTypes = ['아파트', '빌라', '오피스텔', '원룸', '투룸'];
  const regions = ['강남구', '서초구', '용산구', '마포구', '송파구', '영등포구'];
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">필터</h2>
        
        {/* Deal Type Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">거래 유형</h3>
          <div className="space-y-2">
            {dealTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
                  onChange={(e) => onFilterChange('dealType', type, e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-600">{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Property Type Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">매물 종류</h3>
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
                  onChange={(e) => onFilterChange('propertyType', type, e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-600">{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Region Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">지역</h3>
          <div className="space-y-2">
            {regions.map((region) => (
              <label key={region} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
                  onChange={(e) => onFilterChange('region', region, e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-600">{region}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button className="w-full btn-outline">
          필터 초기화
        </button>
      </div>
    </div>
  );
};

export default CategorySidebar;
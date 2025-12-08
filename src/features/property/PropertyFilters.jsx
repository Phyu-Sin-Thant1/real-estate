import React, { useState } from 'react';
import FilterChip from '../../components/common/FilterChip';

const PropertyFilters = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  
  const dealTypes = ['매매', '전세', '월세'];
  const propertyTypes = ['아파트', '빌라', '오피스텔', '원룸', '투룸'];
  const regions = ['강남구', '서초구', '용산구', '마포구', '송파구', '영등포구'];
  
  const handleFilterToggle = (filter) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">거래 유형</h3>
          <div className="flex flex-wrap gap-2">
            {dealTypes.map((type) => (
              <FilterChip
                key={type}
                label={type}
                active={activeFilters.includes(type)}
                onClick={() => handleFilterToggle(type)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">매물 종류</h3>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <FilterChip
                key={type}
                label={type}
                active={activeFilters.includes(type)}
                onClick={() => handleFilterToggle(type)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">지역</h3>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <FilterChip
                key={region}
                label={region}
                active={activeFilters.includes(region)}
                onClick={() => handleFilterToggle(region)}
              />
            ))}
          </div>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <button 
              onClick={() => {
                setActiveFilters([]);
                onFilterChange && onFilterChange([]);
              }}
              className="text-sm text-gray-500 hover:text-dabang-primary"
            >
              모든 필터 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;
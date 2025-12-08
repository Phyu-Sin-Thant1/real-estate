import React, { useState } from 'react';
import FilterChip from '../../components/common/FilterChip';

const CategoryFilterBar = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  
  const filterOptions = [
    '매매', '전세', '월세', '원룸', '투룸', 
    '아파트', '빌라', '오피스텔', '신축', 
    '강남역', '홍대입구역', '잠실역', '이태원역',
    '강남구', '마포구', '송파구', '용산구'
  ];
  
  const handleFilterToggle = (filter) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };
  
  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {filterOptions.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeFilters.includes(filter)}
              onClick={() => handleFilterToggle(filter)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilterBar;
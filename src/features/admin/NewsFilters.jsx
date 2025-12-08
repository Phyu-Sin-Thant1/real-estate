import React from 'react';
import FilterChip from '../../components/common/FilterChip';

const NewsFilters = ({ categories, statuses, selectedCategory, selectedStatus, onCategoryChange, onStatusChange }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3">
        <span className="text-sm font-medium text-gray-700 self-center">카테고리:</span>
        {categories.map((category) => (
          <FilterChip
            key={category}
            label={category}
            active={selectedCategory === category}
            onClick={() => onCategoryChange(selectedCategory === category ? '' : category)}
          />
        ))}
      </div>
      
      <div className="flex flex-wrap gap-3 mt-3">
        <span className="text-sm font-medium text-gray-700 self-center">상태:</span>
        {statuses.map((status) => (
          <FilterChip
            key={status}
            label={status}
            active={selectedStatus === status}
            onClick={() => onStatusChange(selectedStatus === status ? '' : status)}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsFilters;
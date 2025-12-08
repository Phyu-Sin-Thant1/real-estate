import React from 'react';

const CategoryHeader = ({ categoryName, propertyCount }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {categoryName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              총 {propertyCount}개의 매물이 있습니다
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-outline flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span>정렬</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;
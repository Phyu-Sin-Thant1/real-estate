import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties, onFavorite, onViewDetails }) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏡</div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">매물을 찾을 수 없습니다</h3>
        <p className="text-gray-500">다른 조건으로 검색해 보세요</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onFavorite={onFavorite}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default PropertyList;
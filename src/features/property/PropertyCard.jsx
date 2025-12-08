import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const PropertyCard = ({ property, onFavorite, onViewDetails }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <button 
          onClick={() => onFavorite && onFavorite(property.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-sm"
        >
          <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <div className="absolute bottom-3 left-3">
          <Badge variant="primary">{property.type}</Badge>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{property.title}</h3>
          <p className="text-sm text-gray-500 truncate">{property.location}</p>
        </div>
        
        <div className="mb-3">
          <span className="text-xl font-bold text-dabang-accent">{property.price}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">크기</p>
            <p className="text-sm font-medium">{property.size}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">방</p>
            <p className="text-sm font-medium">{property.rooms}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">층</p>
            <p className="text-sm font-medium">{property.floor}</p>
          </div>
        </div>
        
        <button 
          onClick={() => onViewDetails && onViewDetails(property)}
          className="w-full btn-primary text-sm"
        >
          상세보기
        </button>
      </div>
    </Card>
  );
};

export default PropertyCard;
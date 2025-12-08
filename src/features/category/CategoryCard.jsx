import React from 'react';
import Card from '../../components/ui/Card';

const CategoryCard = ({ property }) => {
  return (
    <Card className="mb-4">
      <div className="p-5">
        {/* Property Image */}
        <div className="relative h-48 overflow-hidden rounded-lg mb-4">
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <button className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-sm">
              <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Property Info */}
        <div className="mb-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {property.title}
            </h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {property.type}
            </span>
          </div>
          
          <div className="mb-2">
            <span className="text-xl font-bold text-dabang-accent">
              {property.price}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>
        </div>
        
        {/* Property Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-lg">📏</span>
            <div>
              <span className="text-gray-500">크기</span>
              <p className="font-medium text-gray-800">{property.size}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-lg">🚪</span>
            <div>
              <span className="text-gray-500">방</span>
              <p className="font-medium text-gray-800">{property.rooms}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-lg">🏢</span>
            <div>
              <span className="text-gray-500">층</span>
              <p className="font-medium text-gray-800">{property.floor}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-lg" style={{ color: '#00BCD4' }}>💰</span>
            <div>
              <span className="text-gray-500">관리비</span>
              <p className="font-medium" style={{ color: '#00BCD4' }}>
                {property.maintenance || '관리비 정보 없음'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 btn-primary text-sm">
            상세보기
          </button>
          <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;
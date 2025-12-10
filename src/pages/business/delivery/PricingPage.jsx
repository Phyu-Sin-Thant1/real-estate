import React, { useState } from 'react';

const PricingPage = () => {
  const [pricing, setPricing] = useState({
    basePrice: 100000,
    distancePerKm: 5000,
    itemsPerBox: 20000,
    floorPerLevel: 10000,
    elevatorDiscount: 0.1,
  });

  const handleChange = (field, value) => {
    setPricing(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">요금 설정</h1>
        <p className="text-gray-600 mt-1">이사/배송 서비스 요금을 설정하세요</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">기본 요금 설정</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기본 요금 (원)
            </label>
            <input
              type="number"
              value={pricing.basePrice}
              onChange={(e) => handleChange('basePrice', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">모든 이사/배송에 적용되는 기본 요금입니다</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              거리당 추가 요금 (원/km)
            </label>
            <input
              type="number"
              value={pricing.distancePerKm}
              onChange={(e) => handleChange('distancePerKm', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">1km당 추가되는 요금입니다</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              박스당 요금 (원/박스)
            </label>
            <input
              type="number"
              value={pricing.itemsPerBox}
              onChange={(e) => handleChange('itemsPerBox', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">짐의 양에 따라 추가되는 요금입니다</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              층당 추가 요금 (원/층)
            </label>
            <input
              type="number"
              value={pricing.floorPerLevel}
              onChange={(e) => handleChange('floorPerLevel', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">층수에 따라 추가되는 요금입니다</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              엘리베이터 할인율 (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={pricing.elevatorDiscount * 100}
              onChange={(e) => handleChange('elevatorDiscount', e.target.value / 100)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">엘리베이터가 있을 경우 적용되는 할인율입니다</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="px-6 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors font-medium">
            요금 설정 저장
          </button>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">요금 계산 예시</h2>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">거리: 10km, 박스: 5개, 층수: 3층 (엘리베이터 있음)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">기본 요금:</span>
            <span className="font-medium">{pricing.basePrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">거리 요금 (10km):</span>
            <span className="font-medium">{(pricing.distancePerKm * 10).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">박스 요금 (5개):</span>
            <span className="font-medium">{(pricing.itemsPerBox * 5).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">층수 요금 (3층):</span>
            <span className="font-medium">{(pricing.floorPerLevel * 3).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">엘리베이터 할인:</span>
            <span className="font-medium text-green-600">
              -{((pricing.basePrice + pricing.distancePerKm * 10 + pricing.itemsPerBox * 5 + pricing.floorPerLevel * 3) * pricing.elevatorDiscount).toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-300">
            <span className="font-semibold text-gray-900">총 예상 요금:</span>
            <span className="font-bold text-dabang-primary text-lg">
              {Math.round((pricing.basePrice + pricing.distancePerKm * 10 + pricing.itemsPerBox * 5 + pricing.floorPerLevel * 3) * (1 - pricing.elevatorDiscount)).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;


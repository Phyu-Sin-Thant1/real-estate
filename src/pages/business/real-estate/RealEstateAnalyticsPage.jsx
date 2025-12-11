import React from 'react';
import { 
  monthlyRevenue, 
  monthlyContracts, 
  transactionTypeRatio, 
  topRegions 
} from '../../../mock/realEstateData';

const RealEstateAnalyticsPage = () => {
  // Find max value for scaling bars
  const maxRevenue = Math.max(...monthlyRevenue.map(item => item.revenue));
  const maxContracts = Math.max(...monthlyContracts.map(item => item.count));
  const maxRegionCount = Math.max(...topRegions.map(item => item.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">정산 / 통계</h1>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 매출</h2>
        <div className="space-y-4">
          {monthlyRevenue.map((item) => (
            <div key={item.month} className="flex items-center">
              <div className="w-16 text-sm text-gray-600">{item.month}</div>
              <div className="flex-1 ml-4">
                <div className="flex items-center">
                  <div 
                    className="h-8 bg-dabang-primary rounded-md flex items-center justify-end pr-2"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {item.revenue.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contracts Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 계약 수</h2>
        <div className="space-y-4">
          {monthlyContracts.map((item) => (
            <div key={item.month} className="flex items-center">
              <div className="w-16 text-sm text-gray-600">{item.month}</div>
              <div className="flex-1 ml-4">
                <div className="flex items-center">
                  <div 
                    className="h-8 bg-green-500 rounded-md flex items-center justify-end pr-2"
                    style={{ width: `${(item.count / maxContracts) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {item.count}건
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Type Ratio */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">거래 유형 비율</h2>
        <div className="space-y-4">
          {transactionTypeRatio.map((item) => (
            <div key={item.type} className="flex items-center">
              <div className="w-24 text-sm text-gray-600">{item.type}</div>
              <div className="flex-1 ml-4">
                <div className="flex items-center">
                  <div 
                    className="h-6 bg-blue-400 rounded-md"
                    style={{ width: `${item.percentage}%` }}
                  >
                    {item.percentage > 20 && (
                      <span className="text-xs text-white font-medium pl-2">
                        {item.percentage}%
                      </span>
                    )}
                  </div>
                  {item.percentage <= 20 && (
                    <span className="text-xs text-gray-600 font-medium ml-2">
                      {item.percentage}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Regions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">지역별 계약 건수 TOP 5</h2>
        <div className="space-y-4">
          {topRegions.map((item, index) => (
            <div key={item.region} className="flex items-center">
              <div className="w-8 text-sm text-gray-600">#{index + 1}</div>
              <div className="w-24 text-sm text-gray-900">{item.region}</div>
              <div className="flex-1 ml-4">
                <div className="flex items-center">
                  <div 
                    className="h-6 bg-purple-400 rounded-md flex items-center justify-end pr-2"
                    style={{ width: `${(item.count / maxRegionCount) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {item.count}건
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealEstateAnalyticsPage;
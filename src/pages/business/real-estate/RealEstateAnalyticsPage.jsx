import React, { useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { getListingsByPartner } from '../../../store/realEstateListingsStore';

const RealEstateAnalyticsPage = () => {
  const { user } = useUnifiedAuth();
  
  // Get partner's listings
  const partnerListings = useMemo(() => {
    if (!user?.email) return [];
    return getListingsByPartner(user.email);
  }, [user?.email]);

  // Calculate analytics from partner's actual data
  const formattedRevenueData = useMemo(() => {
    // Empty data - would calculate from actual contracts/revenue
    return [];
  }, [partnerListings]);
  
  const formattedContractsData = useMemo(() => {
    // Empty data - would calculate from actual contracts
    return [];
  }, [partnerListings]);
  
  const transactionTypeRatio = useMemo(() => {
    // Calculate from partner's listings
    const counts = { 매매: 0, 전세: 0, 월세: 0 };
    partnerListings.forEach(listing => {
      if (listing.transactionType === '매매') counts.매매++;
      else if (listing.transactionType === '전세') counts.전세++;
      else if (listing.transactionType === '월세') counts.월세++;
    });
    const total = counts.매매 + counts.전세 + counts.월세;
    if (total === 0) return [];
    return [
      { type: '매매', percentage: Math.round((counts.매매 / total) * 100) },
      { type: '전세', percentage: Math.round((counts.전세 / total) * 100) },
      { type: '월세', percentage: Math.round((counts.월세 / total) * 100) },
    ];
  }, [partnerListings]);
  
  const topRegions = useMemo(() => {
    // Calculate from partner's listings
    const regionCounts = {};
    partnerListings.forEach(listing => {
      const region = listing.city || listing.address?.split(' ')[0] || '기타';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
    return Object.entries(regionCounts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [partnerListings]);
  
  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
  
  const hasData = partnerListings.length > 0;
  
  // Custom tooltip for revenue chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            매출: <span className="font-medium">{payload[0].value.toLocaleString()}원</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip for contracts chart
  const ContractsTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-green-600">
            계약 수: <span className="font-medium">{payload[0].value}건</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">정산 / 통계</h1>
      </div>

      {!hasData ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">통계 데이터가 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">매물을 등록하고 거래를 시작하면 통계가 표시됩니다.</p>
        </div>
      ) : (
        <>
          {/* Revenue Chart - Line Chart */}
          {formattedRevenueData.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 매출 추이</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formattedRevenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="매출 (원)"
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 매출 추이</h2>
              <div className="h-80 flex items-center justify-center text-gray-500">
                매출 데이터가 없습니다
              </div>
            </div>
          )}

          {/* Contracts Chart - Bar Chart */}
          {formattedContractsData.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 계약 수</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formattedContractsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<ContractsTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="계약 수 (건)"
                      radius={[4, 4, 0, 0]}
                    >
                      {formattedContractsData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill="#10B981" 
                          stroke="#059669" 
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 계약 수</h2>
              <div className="h-80 flex items-center justify-center text-gray-500">
                계약 데이터가 없습니다
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Type Ratio - Pie Chart */}
            {transactionTypeRatio.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">거래 유형 비율</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transactionTypeRatio}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                        nameKey="type"
                      >
                        {transactionTypeRatio.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, '비율']}
                        labelFormatter={(value) => `${value}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">거래 유형 비율</h2>
                <div className="h-80 flex items-center justify-center text-gray-500">
                  거래 유형 데이터가 없습니다
                </div>
              </div>
            )}

            {/* Top Regions - Horizontal Bar Chart */}
            {topRegions.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">지역별 계약 건수 TOP 5</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={topRegions}
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number" 
                        stroke="#6b7280" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        dataKey="region" 
                        type="category" 
                        stroke="#6b7280" 
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}건`, '계약 수']}
                        labelFormatter={(value) => `${value}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        name="계약 수 (건)"
                        radius={[0, 4, 4, 0]}
                      >
                        {topRegions.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill="#8B5CF6" 
                            stroke="#7C3AED" 
                            strokeWidth={1}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">지역별 계약 건수 TOP 5</h2>
                <div className="h-80 flex items-center justify-center text-gray-500">
                  지역별 데이터가 없습니다
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RealEstateAnalyticsPage;
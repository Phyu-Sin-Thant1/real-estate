import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  monthlyRevenue, 
  monthlyContracts, 
  transactionTypeRatio, 
  topRegions 
} from '../../../mock/realEstateData';

const RealEstateAnalyticsPage = () => {
  // Format revenue data for charts
  const formattedRevenueData = monthlyRevenue.map(item => ({
    ...item,
    revenueFormatted: `${(item.revenue / 1000000).toFixed(1)}M`
  }));
  
  // Format contracts data for charts
  const formattedContractsData = monthlyContracts.map(item => ({
    ...item,
    name: item.month
  }));
  
  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
  
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

      {/* Revenue Chart - Line Chart */}
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

      {/* Contracts Chart - Bar Chart */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Type Ratio - Pie Chart */}
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

        {/* Top Regions - Horizontal Bar Chart */}
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
      </div>
    </div>
  );
};

export default RealEstateAnalyticsPage;
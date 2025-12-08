import React from 'react';
import Card from '../../components/ui/Card';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-2xl">{stat.emoji}</div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                {stat.delta && (
                  <p className={`ml-2 text-sm font-medium ${stat.tone === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.delta}
                  </p>
                )}
              </div>
              {stat.description && (
                <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
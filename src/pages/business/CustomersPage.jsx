import React from 'react';

const CustomersPage = () => {
  const customers = [
    { id: 1, name: '김철수', email: 'kim@example.com', phone: '010-1234-5678', status: 'active', lastContact: '2024-01-10' },
    { id: 2, name: '이영희', email: 'lee@example.com', phone: '010-2345-6789', status: 'active', lastContact: '2024-01-12' },
    { id: 3, name: '박민수', email: 'park@example.com', phone: '010-3456-7890', status: 'inactive', lastContact: '2023-12-20' },
    { id: 4, name: '정수진', email: 'jung@example.com', phone: '010-4567-8901', status: 'active', lastContact: '2024-01-14' },
    { id: 5, name: '최동현', email: 'choi@example.com', phone: '010-5678-9012', status: 'pending', lastContact: '2024-01-13' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
          <p className="text-gray-600 mt-1">고객 정보를 관리하고 연락하세요</p>
        </div>
        <button className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors text-sm font-medium">
          새 고객 추가
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  최근 연락
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : customer.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {customer.status === 'active' ? '활성' : customer.status === 'pending' ? '대기' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.lastContact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-dabang-primary hover:text-dabang-primary/80 mr-3">
                      보기
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      편집
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;


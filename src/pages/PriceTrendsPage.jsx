import React, { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const PriceTrendsPage = () => {
  const [region, setRegion] = useState('전체')
  const [propertyType, setPropertyType] = useState('아파트')
  const [period, setPeriod] = useState('3개월')

  // Mock data for the table
  const marketData = [
    { id: 1, region: '서울 강남구', averagePrice: '15억 2000만', monthlyChange: '+2.3%', yearlyChange: '+5.7%', volume: '1,240', lastUpdated: '2023.11.15' },
    { id: 2, region: '서울 서초구', averagePrice: '12억 8000만', monthlyChange: '+1.8%', yearlyChange: '+4.2%', volume: '980', lastUpdated: '2023.11.15' },
    { id: 3, region: '서울 송파구', averagePrice: '9억 5000만', monthlyChange: '+0.9%', yearlyChange: '+3.1%', volume: '1,560', lastUpdated: '2023.11.15' },
    { id: 4, region: '경기 성남시', averagePrice: '7억 3000만', monthlyChange: '+1.2%', yearlyChange: '+2.8%', volume: '2,100', lastUpdated: '2023.11.15' },
    { id: 5, region: '경기 수원시', averagePrice: '6억 8000만', monthlyChange: '+0.7%', yearlyChange: '+2.1%', volume: '1,850', lastUpdated: '2023.11.15' },
    { id: 6, region: '인천 남동구', averagePrice: '5억 2000만', monthlyChange: '+0.5%', yearlyChange: '+1.9%', volume: '1,320', lastUpdated: '2023.11.15' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top label */}
        <div className="text-xs uppercase tracking-wide text-indigo-500 mb-2">시세</div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">부동산 시세 한눈에 보기</h1>
        
        {/* Subtitle */}
        <p className="text-gray-600 mb-8">지역별 아파트 평균 시세와 거래량 변화를 확인해보세요.</p>
        
        {/* Filters row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
            <select 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent cursor-pointer"
            >
              <option value="전체">전체</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매물 종류</label>
            <select 
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent cursor-pointer"
            >
              <option value="아파트">아파트</option>
              <option value="오피스텔">오피스텔</option>
              <option value="빌라">빌라</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">기간</label>
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent cursor-pointer"
            >
              <option value="3개월">3개월</option>
              <option value="6개월">6개월</option>
              <option value="1년">1년</option>
            </select>
          </div>
        </div>
        
        {/* Main content section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Left: Chart area */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-6 h-[260px] flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">시세 추이 차트</div>
                <p className="text-gray-600">(추후 연동 예정)</p>
              </div>
            </div>
          </div>
          
          {/* Right: Stat cards */}
          <div className="lg:w-1/3 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">현재 평균 시세</h3>
              <p className="text-2xl font-bold text-gray-900">12억 5000만 원</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">전월 대비</h3>
              <p className="text-2xl font-bold text-green-600">+1.5%</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">전년 대비</h3>
              <p className="text-2xl font-bold text-green-600">+4.8%</p>
            </div>
          </div>
        </div>
        
        {/* Bottom table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">지역별 시세 요약</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지역</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평균가</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전월 대비</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">거래량</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">업데이트</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {marketData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.region}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.averagePrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{item.monthlyChange}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.volume}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default PriceTrendsPage
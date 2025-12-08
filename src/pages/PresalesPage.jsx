import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const PresalesPage = () => {
  const [filters, setFilters] = useState({
    constructionStage: '',
    completionDate: '',
    developer: ''
  })

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">분양/신축</h1>
            <p className="text-gray-600">새로운 아파트, 복합단지, 미래 개발 프로젝트를 확인하세요</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">필터</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  건설 단계
                </label>
                <select
                  name="constructionStage"
                  value={filters.constructionStage}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                >
                  <option value="">전체</option>
                  <option value="planning">계획중</option>
                  <option value="construction">공사중</option>
                  <option value="presale">분양중</option>
                  <option value="completion">완공예정</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  완공 예정일
                </label>
                <select
                  name="completionDate"
                  value={filters.completionDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                >
                  <option value="">전체</option>
                  <option value="2024">2024년</option>
                  <option value="2025">2025년</option>
                  <option value="2026">2026년</option>
                  <option value="2027">2027년 이후</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  건설사
                </label>
                <select
                  name="developer"
                  value={filters.developer}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                >
                  <option value="">전체</option>
                  <option value="samsung">삼성물산</option>
                  <option value="hyundai">현대건설</option>
                  <option value="gs">GS건설</option>
                  <option value="daelim">대림산업</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">🏗️</span>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      분양중
                    </span>
                    <span className="text-sm text-gray-500">2025년 완공</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    신축 프로젝트 {item}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    서울시 강남구 • 삼성물산
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">분양가</p>
                      <p className="text-xl font-bold text-dabang-primary">
                        ₩{((item + 5) * 100000).toLocaleString()}
                      </p>
                    </div>
                    <button className="bg-dabang-primary hover:bg-dabang-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default PresalesPage
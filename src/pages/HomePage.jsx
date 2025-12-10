import React from 'react'
import Header from '../components/layout/Header'
import SearchHero from '../features/home/SearchHero'
import ServiceGrid from '../features/home/ServiceGrid'
import MarketFeed from '../features/home/MarketFeed'
import Footer from '../components/layout/Footer'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const handleBusinessDashboardClick = () => {
    navigate('/admin') // TODO: later change to '/business/dashboard' or '/business/login'
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SearchHero />
      <ServiceGrid />
      <MarketFeed />
      
      {/* Business Partner Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">부동산 / 이사 비즈니스 파트너를 위한 대시보드</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              TOFU 파트너 센터에서 매물과 이사 신청을 한 곳에서 관리해 보세요.
            </p>
            <button
              onClick={handleBusinessDashboardClick}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 shadow-sm"
            >
              비즈니스 파트너 센터 바로가기
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

export default HomePage
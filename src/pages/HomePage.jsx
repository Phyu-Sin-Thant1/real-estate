import React, { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import SearchHero from '../features/home/SearchHero'
import ServiceGrid from '../features/home/ServiceGrid'
import MarketFeed from '../features/home/MarketFeed'
import Footer from '../components/layout/Footer'
import { useNavigate } from 'react-router-dom'
import { getActiveBannersByPlacement } from '../store/bannersStore'

const HomePage = () => {
  const navigate = useNavigate()
  const [topBanners, setTopBanners] = useState([])
  const [sidebarBanners, setSidebarBanners] = useState([])
  const [bottomBanners, setBottomBanners] = useState([])

  useEffect(() => {
    setTopBanners(getActiveBannersByPlacement('HOME_TOP'))
    setSidebarBanners(getActiveBannersByPlacement('HOME_SIDEBAR'))
    setBottomBanners(getActiveBannersByPlacement('HOME_BOTTOM'))
  }, [])

  const handleBusinessDashboardClick = () => {
    navigate('/admin') // TODO: later change to '/business/dashboard' or '/business/login'
  }

  const handleBannerClick = (banner) => {
    if (banner.linkUrl) {
      window.open(banner.linkUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Top Banners */}
      {topBanners.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-4 overflow-x-auto">
              {topBanners.map((banner) => (
                <div
                  key={banner.id}
                  onClick={() => handleBannerClick(banner)}
                  className={`flex-shrink-0 ${banner.linkUrl ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <SearchHero />
            <ServiceGrid />
            <MarketFeed />
          </div>
          
          {/* Sidebar with Banners */}
          <div className="lg:col-span-1">
            {sidebarBanners.length > 0 && (
              <div className="space-y-4 sticky top-4">
                {sidebarBanners.map((banner) => (
                  <div
                    key={banner.id}
                    onClick={() => handleBannerClick(banner)}
                    className={`${banner.linkUrl ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                  >
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Banners */}
      {bottomBanners.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-4 overflow-x-auto">
              {bottomBanners.map((banner) => (
                <div
                  key={banner.id}
                  onClick={() => handleBannerClick(banner)}
                  className={`flex-shrink-0 ${banner.linkUrl ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
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
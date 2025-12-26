import React, { useState } from 'react'
import Header from '../components/layout/Header'
import EnhancedSearchHero from '../features/home/EnhancedSearchHero'
import ServiceGrid from '../features/home/ServiceGrid'
import Footer from '../components/layout/Footer'
import SectionHeader from '../components/home/SectionHeader'
import ListingCard from '../components/home/ListingCard'
import NewsPanel from '../components/home/NewsPanel'
import TrustBand from '../components/home/TrustBand'
import ReviewSection from '../components/home/ReviewSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import ScrollToTop from '../components/home/ScrollToTop'
import SectionDivider from '../components/home/SectionDivider'
import FinalCTA from '../components/home/FinalCTA'
import AnnouncementBanner from '../components/home/AnnouncementBanner'
import EventSection from '../components/home/EventSection'
import PromotionBanner from '../components/promotions/PromotionBanner'
import { useNavigate } from 'react-router-dom'
import {
  trendingListings,
  movingMetrics,
  partnerBenefits,
  platformKPIs,
  marketNews,
  marketSignals,
  reviews,
  events,
} from '../mock/homeMockData'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const HomePage = () => {
  const navigate = useNavigate()
  const [likedProperties, setLikedProperties] = useState(new Set())

  const toggleLike = (id) => {
    setLikedProperties(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const listingFilters = ['전체', '아파트', '원룸', '오피스텔', '분양']

  const featuredListings = trendingListings
    .filter((listing, index, self) => index === self.findIndex(l => l.id === listing.id))
    .slice(0, 12)
    .map((item, idx) => ({
      ...item,
      type: listingFilters[(idx % (listingFilters.length - 1)) + 1], // distribute types excluding '전체'
      priceText: item.price,
      areaText: item.area,
      imageUrl: item.image,
    }))

  const [activeFilter, setActiveFilter] = useState('전체')

  const filteredListings = activeFilter === '전체'
    ? featuredListings
    : featuredListings.filter((item) => item.type === activeFilter)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <AnnouncementBanner />
      <PromotionBanner />
      <Header />
      
      <main className="space-y-16 md:space-y-20">
        {/* 1) HERO */}
        <EnhancedSearchHero />

        {/* 2) TRUST METRICS (Premium Trust Band) */}
        <TrustBand kpis={platformKPIs} />

        {/* 2.5) WHY CHOOSE US */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 md:py-16 bg-gradient-to-b from-white via-indigo-50/20 to-white">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
            <SectionHeader
              title="왜 TOFU를 선택해야 할까요?"
              subtitle="신뢰할 수 있는 서비스와 투명한 거래로 더 나은 부동산 경험을 제공합니다"
              badge="핵심 가치"
              badgeColor="indigo"
              className="text-center"
            />
            <WhyChooseUs />
      </div>
        </section>

        {/* 3) QUICK CATEGORY GRID */}
        <section className="py-12 md:py-16">
      <ServiceGrid />
        </section>

        {/* 3.5) EVENTS & PROMOTIONS */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 md:py-16 bg-gradient-to-b from-white via-slate-50/30 to-white">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
            <SectionHeader
              title="진행 중인 이벤트"
              subtitle="특별한 혜택과 프로모션을 놓치지 마세요"
              badge="이벤트"
              badgeColor="purple"
              className="text-center"
            />
            <EventSection events={events} />
          </div>
        </section>

        {/* 4) FEATURED LISTINGS */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 md:py-16 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden">
          {/* Premium Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234F46E5' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
          
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <SectionHeader
                title="인기 매물"
                subtitle="지금 가장 많이 조회되는 매물"
                badge="인기 매물"
                badgeColor="indigo"
                className="mb-0"
              />
              <div className="flex flex-wrap gap-2.5">
                {listingFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                      activeFilter === filter
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 shadow-lg shadow-indigo-500/30 scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredListings.map((listing, idx) => (
                <div
                  key={listing.id}
                  className="transform transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <ListingCard
                    listing={listing}
                    isLiked={likedProperties.has(listing.id)}
                    onToggleLike={toggleLike}
                    onClick={() => navigate(`/property/${listing.id}`)}
                  />
                </div>
              ))}
      </div>

            <div className="flex justify-end mt-8">
              <Button
                variant="outline"
                onClick={() => navigate('/category/all')}
                className="h-12 px-6 rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 font-semibold transition-all shadow-sm hover:shadow-md"
              >
                전체 보기 →
              </Button>
            </div>
          </div>
        </section>

        {/* 5) MOVING SERVICE PROMO */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 md:py-16">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto mb-10 md:mb-12">
            <div className="text-center">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-200/60 mb-4 shadow-md">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 animate-pulse shadow-lg" />
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                  이사 서비스
                </p>
      </div>
      
              {/* Premium Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 text-center tracking-tight mb-3 leading-tight">
                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                  이사 서비스
                </span>
              </h2>
              
              {/* Decorative Line */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-300" />
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-300" />
              </div>
            </div>
          </div>
          <div 
            className="max-w-7xl 2xl:max-w-[1600px] mx-auto rounded-2xl border-2 border-orange-200/50 bg-gradient-to-br from-orange-50/30 via-white to-amber-50/20 shadow-2xl overflow-hidden relative"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97316' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5 pointer-events-none" />
            
            <div className="relative p-8 md:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column: Service Info */}
                <div className="space-y-6">
                  {/* Header with badge */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/50 border border-orange-200/50 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">이사 서비스</p>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                      안전하고 빠른 이사
                    </h2>
                    <p className="text-base md:text-lg text-slate-600">
                      빠른 견적과 검증된 기사, 실시간 상태로 안심 이사
                    </p>
                  </div>

                  {/* Premium Feature List */}
                  <ul className="space-y-4">
                    {[
                      { label: '빠른 견적', icon: '⚡', color: 'from-blue-500 to-blue-600' },
                      { label: '검증된 기사', icon: '✓', color: 'from-emerald-500 to-emerald-600' },
                      { label: '실시간 상태', icon: '📱', color: 'from-purple-500 to-purple-600' },
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-4 group">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-xl">{item.icon}</span>
                        </div>
                        <span className="text-base md:text-lg font-semibold text-slate-800">{item.label}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Premium Metrics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    {[
                      { 
                        label: '평균 응답 시간', 
                        value: movingMetrics.avgResponse, 
                        color: 'blue',
                        iconColor: 'from-blue-500 to-blue-600',
                        borderColor: 'border-blue-200',
                        bg: 'from-blue-50/80 to-white',
                        icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )
                      },
                      { 
                        label: '평균 평점', 
                        value: movingMetrics.avgRating, 
                        color: 'emerald',
                        iconColor: 'from-emerald-500 to-emerald-600',
                        borderColor: 'border-emerald-200',
                        bg: 'from-emerald-50/80 to-white',
                        icon: (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )
                      },
                      { 
                        label: '완료된 이사', 
                        value: movingMetrics.completedJobs, 
                        unit: '건',
                        color: 'orange',
                        iconColor: 'from-orange-500 to-orange-600',
                        borderColor: 'border-orange-200',
                        bg: 'from-orange-50/80 to-white',
                        icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )
                      },
                    ].map((metric, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl border-2 ${metric.borderColor} bg-gradient-to-br ${metric.bg} p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden group`}
                      >
                        {/* Decorative gradient corner */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${metric.iconColor} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
                        
                        {/* Icon */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${metric.iconColor} text-white shadow-md mb-3 relative z-10 group-hover:scale-110 transition-transform`}>
                          {metric.icon}
                        </div>
                        
                        {/* Label */}
                        <p className="text-xs font-medium text-slate-600 mb-2 relative z-10">{metric.label}</p>
                        
                        {/* Value */}
                        <div className="flex items-baseline gap-1 relative z-10">
                          <p className="text-xl md:text-2xl font-bold text-slate-900">{metric.value}</p>
                          {metric.unit && (
                            <span className="text-xs text-slate-600 font-medium ml-1">{metric.unit}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
      </div>

                {/* Right Column: Quote Form */}
                <div className="relative">
                  <div 
                    className="rounded-2xl border-2 border-orange-200/50 bg-gradient-to-br from-white to-slate-50/50 shadow-xl p-6 md:p-8 space-y-5 relative overflow-hidden"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F97316' fill-opacity='0.02'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2.5H0v-2h20V9.5H0v-2h20V5H0v-2h20V0h2v3h18v2H22v2.5h18v2H22v2.5h18v2H22v2.5h18v2H22v2.5h18v2H22v2.5h18v2H22v2.5h18v2H22v2.5h18v2H22V40h-2v-3H0v-2h20v-2.5H0v-2h20v-2.5H0v-2h20v-2.5H0v-2h20v-2.5H0v-2h20v-2.5H0v-2h20v-2.5H0v-2h20V20.5z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  >
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">간편 견적 요청</h3>
      </div>
      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="absolute -top-2 left-3 px-2 bg-white text-xs font-medium text-slate-600">출발지</label>
                          <input 
                            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white/80 hover:bg-white" 
                            placeholder="출발 주소 입력"
                          />
                        </div>
                        <div className="relative">
                          <label className="absolute -top-2 left-3 px-2 bg-white text-xs font-medium text-slate-600">도착지</label>
                          <input 
                            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white/80 hover:bg-white" 
                            placeholder="도착 주소 입력"
                          />
                        </div>
                        <div className="relative">
                          <label className="absolute -top-2 left-3 px-2 bg-white text-xs font-medium text-slate-600">이사 날짜</label>
                          <input 
                            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white/80 hover:bg-white" 
                            placeholder="날짜 선택"
                          />
                        </div>
                        <div className="relative">
                          <label className="absolute -top-2 left-3 px-2 bg-white text-xs font-medium text-slate-600">연락처</label>
                          <input 
                            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white/80 hover:bg-white" 
                            placeholder="연락처 입력"
                          />
                        </div>
      </div>
      
                      <Button
                        variant="primary"
                        className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-2"
                        onClick={() => navigate('/moving')}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          견적 받기
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6) PARTNER CONVERSION SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 md:py-16">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
            <SectionHeader
              title="파트너로 함께하세요"
              subtitle="부동산 또는 이사/배송 파트너로 등록하고 더 많은 고객을 만나보세요"
              badge="파트너 프로그램"
              badgeColor="purple"
              className="text-center"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
              <div 
                className="relative rounded-2xl border-2 border-blue-200/50 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden group"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">부동산 중개 파트너</h3>
                  </div>
                  <ul className="space-y-3 mb-8 text-slate-700">
                    {partnerBenefits.realEstate.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-base">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="primary" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all" 
                    onClick={() => navigate('/partner/apply?type=realEstate')}
                  >
                    파트너 신청
                  </Button>
                </div>
      </div>

              <div 
                className="relative rounded-2xl border-2 border-orange-200/50 bg-gradient-to-br from-orange-50/30 via-white to-amber-50/20 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden group"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97316' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">이사/배송 파트너</h3>
                  </div>
                  <ul className="space-y-3 mb-8 text-slate-700">
                    {partnerBenefits.moving.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-base">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="secondary" 
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all" 
                    onClick={() => navigate('/partner/apply?type=delivery')}
                  >
                    파트너 신청
                  </Button>
                </div>
              </div>
          </div>
        </div>
        </section>

        {/* 7) CUSTOMER REVIEWS */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 md:py-16 bg-gradient-to-b from-white via-slate-50/30 to-white">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
            <SectionHeader
              title="고객 후기"
              subtitle="실제 이용 고객들의 생생한 후기를 확인하세요"
              badge="고객 후기"
              badgeColor="emerald"
              className="text-center"
            />
            
            {/* Premium Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-10 p-6 rounded-2xl border-2 border-emerald-100/50 bg-gradient-to-br from-emerald-50/30 via-white to-slate-50/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">4.8</p>
                  <p className="text-xs text-slate-600 font-medium">평균 평점</p>
                </div>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">12,345+</p>
                  <p className="text-xs text-slate-600 font-medium">총 리뷰 수</p>
                </div>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">98%</p>
                  <p className="text-xs text-slate-600 font-medium">만족도</p>
                </div>
              </div>
      </div>
      
            <ReviewSection reviews={reviews} />

            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                onClick={() => navigate('/reviews')}
                className="h-12 px-8 rounded-xl border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 font-semibold transition-all shadow-sm hover:shadow-md"
              >
                모든 후기 보기 →
              </Button>
          </div>
        </div>
      </section>
      
        {/* 8) NEWS / MARKET INSIGHTS */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 md:py-16 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
            <SectionHeader
              title="오늘의 부동산 인사이트"
              subtitle="시장 흐름을 한눈에 확인하세요"
              badge="시장 인사이트"
              badgeColor="blue"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
              <NewsPanel
                news={marketNews.slice(0, 4)}
                onViewAll={() => navigate('/news')}
              />
              <div className="grid grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 xl:gap-6">
                {marketSignals.slice(0, 4).map((signal) => (
                  <div
                    key={signal.id}
                    className="relative rounded-xl border-2 border-slate-200/50 bg-gradient-to-br from-white to-slate-50/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden group"
                  >
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${
                      signal.trend === 'up' ? 'from-green-400/10 to-emerald-400/10' : 'from-red-400/10 to-rose-400/10'
                    } rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
                    <div className="relative z-10">
                      <p className="text-xs font-medium text-slate-500 mb-2">{signal.title}</p>
                      <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                        <span className="text-xl font-bold text-slate-900">{signal.value}</span>
                        <span
                          className={`text-sm font-bold ${
                            signal.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {signal.change}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{signal.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </section>
      
        {/* 9) FINAL CTA SECTION */}
        <FinalCTA
          onGetStarted={() => navigate('/register')}
          onSignUp={(email) => {
            console.log('Newsletter signup:', email)
            // Add your newsletter signup logic here
          }}
        />
      </main>

      {/* 10) FOOTER */}
      <Footer />

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}

export default HomePage

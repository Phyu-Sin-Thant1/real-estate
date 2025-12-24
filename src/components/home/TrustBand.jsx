import React from 'react'
import { useI18n } from '../../context/I18nContext'

const TrustBand = ({ kpis = [] }) => {
  const { t, lang } = useI18n()

  // Localized copy - supports i18n
  const copy = {
    ko: {
      label: '신뢰 지표',
      title: '지금 TOFU에서는',
      subtitle: '검증된 파트너와 실제 거래 데이터로 더 안전하게 선택하세요.',
      hint: '최근 30일 기준',
    },
    en: {
      label: 'Trust Metrics',
      title: 'On TOFU Now',
      subtitle: 'Choose safely with verified partners and real transaction data.',
      hint: 'Last 30 days',
    },
  }

  const text = copy[lang] || copy.ko

  // Get card styling based on index/type
  const getCardStyle = (kpi, idx) => {
    const styles = [
      {
        // Blue theme for 매물
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        iconColor: 'text-white',
        cardBg: 'bg-gradient-to-br from-blue-50/50 to-white',
        borderColor: 'border-blue-200/60',
        hoverBorder: 'hover:border-blue-300/80',
        valueColor: 'text-blue-700',
        accentColor: 'text-blue-600',
      },
      {
        // Green theme for 파트너
        iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        iconColor: 'text-white',
        cardBg: 'bg-gradient-to-br from-emerald-50/50 to-white',
        borderColor: 'border-emerald-200/60',
        hoverBorder: 'hover:border-emerald-300/80',
        valueColor: 'text-emerald-700',
        accentColor: 'text-emerald-600',
      },
      {
        // Orange theme for 거래
        iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
        iconColor: 'text-white',
        cardBg: 'bg-gradient-to-br from-orange-50/50 to-white',
        borderColor: 'border-orange-200/60',
        hoverBorder: 'hover:border-orange-300/80',
        valueColor: 'text-orange-700',
        accentColor: 'text-orange-600',
      },
    ]
    return styles[idx % styles.length]
  }

  // Icon mapping for metrics with premium styling
  const getIcon = (label, iconColor) => {
    if (label.includes('매물') || label.includes('Property')) {
      return (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    }
    if (label.includes('파트너') || label.includes('Partner')) {
      return (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
    if (label.includes('거래') || label.includes('Transaction')) {
      return (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
    return null
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Premium Trust Band Container */}
        <div 
          className="relative rounded-3xl border-2 border-indigo-200/60 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50/50 shadow-2xl overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-indigo-500/5 to-orange-500/8 pointer-events-none" />
          
          {/* Animated background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          
          {/* Content */}
          <div className="relative p-8 md:p-10 lg:p-12">
            {/* Section Header */}
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-50 border-2 border-indigo-200/60 mb-4 shadow-md">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 animate-pulse shadow-lg" />
                <p className="text-xs md:text-sm font-bold text-indigo-700 uppercase tracking-wider">
                  {text.label}
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                {text.title}
              </h2>
              <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {text.subtitle}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {kpis.map((kpi, idx) => {
                const style = getCardStyle(kpi, idx)
                return (
                  <div
                    key={idx}
                    className={`group relative rounded-2xl border-2 ${style.borderColor} ${style.cardBg} backdrop-blur-sm p-6 md:p-8 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl ${style.hoverBorder} overflow-hidden`}
                  >
                    {/* Decorative gradient corner - enhanced */}
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${style.iconBg} opacity-8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-15 transition-opacity duration-500`} />
                    
                    {/* Animated glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.iconBg} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
                    
                    {/* Icon - larger and more prominent */}
                    <div className={`relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 ${style.iconBg} ${style.iconColor} rounded-2xl mb-5 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm" />
                      <div className="relative z-10">
                        {getIcon(kpi.label, style.iconColor)}
                      </div>
                    </div>

                    {/* Value - much larger and bolder */}
                    <div className="mb-3 relative z-10">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-4xl md:text-5xl lg:text-6xl font-extrabold ${style.valueColor} tracking-tight leading-none`}>
                          {kpi.value}
                        </span>
                        {kpi.unit && (
                          <span className={`text-lg md:text-xl ${style.accentColor} font-bold mb-1`}>
                            {kpi.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Label - enhanced */}
                    <p className={`text-base md:text-lg font-bold ${style.accentColor} mb-3 relative z-10`}>
                      {kpi.label}
                    </p>

                    {/* Hint - with icon */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 relative z-10">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{text.hint}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustBand


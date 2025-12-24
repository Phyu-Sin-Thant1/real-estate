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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    }
    if (label.includes('파트너') || label.includes('Partner')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
    if (label.includes('거래') || label.includes('Transaction')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
    return null
  }

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Premium Trust Band Container */}
        <div 
          className="relative rounded-2xl border border-indigo-200/40 bg-gradient-to-br from-indigo-50/30 via-white to-slate-50 shadow-lg overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-orange-500/5 pointer-events-none" />
          
          {/* Content */}
          <div className="relative p-6 md:p-8 lg:p-10">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/50 border border-indigo-200/50 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-xs md:text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                  {text.label}
                </p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                {text.title}
              </h2>
              <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
                {text.subtitle}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {kpis.map((kpi, idx) => {
                const style = getCardStyle(kpi, idx)
                return (
                  <div
                    key={idx}
                    className={`group relative rounded-xl border-2 ${style.borderColor} ${style.cardBg} backdrop-blur-sm p-5 md:p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${style.hoverBorder} overflow-hidden`}
                  >
                    {/* Decorative gradient corner */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${style.iconBg} opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
                    
                    {/* Icon */}
                    <div className={`relative flex items-center justify-center w-14 h-14 ${style.iconBg} ${style.iconColor} rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {getIcon(kpi.label, style.iconColor)}
                    </div>

                    {/* Value */}
                    <div className="mb-2 relative z-10">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl md:text-4xl font-bold ${style.valueColor} tracking-tight`}>
                          {kpi.value}
                        </span>
                        {kpi.unit && (
                          <span className={`text-base md:text-lg ${style.accentColor} font-semibold`}>
                            {kpi.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Label */}
                    <p className={`text-sm md:text-base font-semibold ${style.accentColor} mb-2 relative z-10`}>
                      {kpi.label}
                    </p>

                    {/* Hint */}
                    <p className="text-xs text-slate-400 relative z-10">
                      {text.hint}
                    </p>
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


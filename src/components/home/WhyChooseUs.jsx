import React from 'react'

const WhyChooseUs = () => {
  const features = [
    {
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '안전한 거래',
      description: '검증된 파트너와의 신뢰할 수 있는 거래 보장',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50/50 to-white',
      borderColor: 'border-blue-200',
    },
    {
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '빠른 응답',
      description: '평균 2.5시간 이내 고객 문의 응답',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50/50 to-white',
      borderColor: 'border-emerald-200',
    },
    {
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: '투명한 정보',
      description: '실시간 시세와 정확한 매물 정보 제공',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50/50 to-white',
      borderColor: 'border-purple-200',
    },
    {
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '합리적 가격',
      description: '최저 수수료와 투명한 가격 정책',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50/50 to-white',
      borderColor: 'border-orange-200',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className={`relative rounded-2xl border-2 ${feature.borderColor} bg-gradient-to-br ${feature.bgColor} p-7 md:p-8 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl overflow-hidden group cursor-pointer`}
        >
          {/* Decorative gradient corner - enhanced */}
          <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${feature.color} opacity-8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-15 transition-opacity duration-500`} />
          
          {/* Animated glow effect on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
          
          {/* Icon - larger and more prominent */}
          <div className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 z-10`}>
            {/* Icon glow effect */}
            <div className="absolute inset-0 bg-white/30 rounded-2xl blur-md group-hover:blur-lg transition-all" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
              {feature.icon}
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-3 leading-tight">
              {feature.title}
            </h3>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Bottom accent line */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl`} />
        </div>
      ))}
    </div>
  )
}

export default WhyChooseUs


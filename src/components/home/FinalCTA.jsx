import React, { useState } from 'react'
import Button from '../ui/Button'

const FinalCTA = ({ onGetStarted, onSignUp }) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      onSignUp?.(email)
      setEmail('')
    }
  }

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Background with gradient - matching hero section */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B163F] via-[#1A237E] to-[#1D2E7A]" />
      
      {/* Radial highlight - matching hero section */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent pointer-events-none" 
           style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
      
      {/* Subtle noise overlay - matching hero section */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <p className="text-sm font-bold text-white uppercase tracking-wider">
              시작하기
            </p>
          </div>
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            지금 시작하세요
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            TOFU와 함께 더 나은 부동산 경험을 시작하세요. 신규 회원 가입 시 특별 혜택을 드립니다.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button
              onClick={onGetStarted}
              className="h-14 px-8 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                무료로 시작하기
              </span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="h-14 px-8 border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              매물 둘러보기
            </Button>
          </div>
          
          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 px-5 py-4 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
              />
              <Button
                type="submit"
                className="h-14 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 whitespace-nowrap"
              >
                알림 받기
              </Button>
            </form>
            <p className="text-sm text-white/70 mt-3">
              최신 매물 정보와 특별 할인 소식을 이메일로 받아보세요
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA


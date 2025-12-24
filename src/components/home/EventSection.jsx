import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

const EventSection = ({ events = [] }) => {
  const navigate = useNavigate()

  const getEventTypeColor = (type) => {
    const colors = {
      '특가': 'from-red-500 to-red-600',
      '신규': 'from-blue-500 to-blue-600',
      '이벤트': 'from-purple-500 to-purple-600',
      '프로모션': 'from-orange-500 to-orange-600',
      '할인': 'from-emerald-500 to-emerald-600',
    }
    return colors[type] || 'from-indigo-500 to-indigo-600'
  }

  const getEventTypeBg = (type) => {
    const colors = {
      '특가': 'bg-red-50/50 border-red-200/50',
      '신규': 'bg-blue-50/50 border-blue-200/50',
      '이벤트': 'bg-purple-50/50 border-purple-200/50',
      '프로모션': 'bg-orange-50/50 border-orange-200/50',
      '할인': 'bg-emerald-50/50 border-emerald-200/50',
    }
    return colors[type] || 'bg-indigo-50/50 border-indigo-200/50'
  }

  if (events.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {events.map((event, idx) => (
        <div
          key={event.id}
          onClick={() => event.link && navigate(event.link)}
          className="group relative rounded-3xl border-2 border-slate-200/60 bg-gradient-to-br from-white via-slate-50/40 to-white overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:border-indigo-200/80"
        >
          {/* Decorative gradient corner - enhanced */}
          <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${getEventTypeColor(event.tag)} opacity-8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-15 transition-opacity duration-500`} />
          
          {/* Animated glow effect on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getEventTypeColor(event.tag)} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
          
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Event Type Badge - enhanced */}
            <div className={`absolute top-5 left-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 backdrop-blur-md shadow-xl ${getEventTypeBg(event.tag)}`}>
              <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${getEventTypeColor(event.tag)} animate-pulse shadow-lg`} />
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{event.tag}</span>
            </div>

            {/* Discount Badge - enhanced */}
            {event.discount && (
              <div className="absolute top-5 right-5 w-20 h-20 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm" />
                <div className="text-center relative z-10">
                  <span className="text-white font-extrabold text-2xl leading-none block">{event.discount}</span>
                  <span className="text-white/90 font-bold text-sm">%</span>
                </div>
                {/* Animated ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
              </div>
            )}
          </div>

          {/* Content - enhanced */}
          <div className="p-7 md:p-8 relative z-10">
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
              {event.title}
            </h3>
            <p className="text-sm md:text-base text-slate-600 mb-5 line-clamp-2 leading-relaxed">
              {event.subtitle}
            </p>
            
            {/* Event Details - enhanced */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-gradient-to-br from-slate-50/50 to-white border border-slate-100">
              {event.date && (
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-semibold">{event.date}</span>
                </div>
              )}
              {event.remaining && (
                <div className="flex items-center gap-2.5 text-sm text-red-600 font-bold">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>{event.remaining}</span>
                </div>
              )}
            </div>

            {/* CTA Button - enhanced */}
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation()
                if (event.link) navigate(event.link)
              }}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 text-white font-extrabold text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                {event.cta || '자세히 보기'}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
          </div>

          {/* Bottom accent line */}
          <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getEventTypeColor(event.tag)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        </div>
      ))}
    </div>
  )
}

export default EventSection


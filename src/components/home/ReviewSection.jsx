import React from 'react'
import Card from '../ui/Card'

const ReviewSection = ({ reviews = [] }) => {
  const StarIcon = ({ filled = false }) => (
    <svg
      className={`w-5 h-5 ${filled ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )

  const getServiceTypeColor = (serviceType) => {
    if (serviceType.includes('부동산')) {
      return 'from-blue-500 to-blue-600'
    }
    return 'from-orange-500 to-orange-600'
  }

  const getServiceTypeBg = (serviceType) => {
    if (serviceType.includes('부동산')) {
      return 'bg-blue-50/50 border-blue-200/50'
    }
    return 'bg-orange-50/50 border-orange-200/50'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <Card
          key={review.id}
          variant="default"
          className="relative rounded-2xl border-2 border-slate-100 bg-gradient-to-br from-white to-slate-50/30 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden group"
        >
          {/* Decorative gradient corner */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getServiceTypeColor(review.serviceType)} opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`} />
          
          <div className="relative z-10">
            {/* Header: User Info & Rating */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  {review.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full border-2 border-white flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{review.userName}</h4>
                    {review.verified && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                        인증
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(review.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < review.rating} />
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-700">{review.rating}.0</span>
            </div>

            {/* Service Type Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-4 ${getServiceTypeBg(review.serviceType)}`}>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${getServiceTypeColor(review.serviceType)}`} />
              <span className="text-xs font-semibold text-slate-700">{review.serviceType}</span>
            </div>

            {/* Location */}
            {review.location && (
              <div className="flex items-center gap-1.5 mb-4 text-sm text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{review.location}</span>
              </div>
            )}

            {/* Review Comment */}
            <div className="relative">
              <p className="text-sm text-slate-700 leading-relaxed line-clamp-4 mb-4 italic">
                {review.comment}
              </p>
            </div>

            {/* Decorative quote mark */}
            <div className="absolute top-4 right-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <svg className="w-20 h-20 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ReviewSection


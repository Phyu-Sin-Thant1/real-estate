import React from 'react'
import Card from '../ui/Card'

const ListingCard = ({ listing, isLiked, onToggleLike, onClick }) => {
  return (
    <Card 
      variant="default" 
      className="overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl border-2 border-slate-100"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {listing.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-sm ${
                tag === '신규' ? 'bg-red-500/90 text-white' :
                tag === '인기' ? 'bg-orange-500/90 text-white' :
                'bg-blue-500/90 text-white'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleLike(listing.id)
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isLiked
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:scale-110'
            }`}
          >
            <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-1 text-base">{listing.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{listing.address}</p>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-bold text-dabang-primary">{listing.price}</p>
            <p className="text-xs text-gray-500 mt-0.5">{listing.priceType}</p>
          </div>
          <span className="text-sm text-gray-600 font-medium">{listing.area}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {listing.views} 조회
          </span>
        </div>
      </div>
    </Card>
  )
}

export default ListingCard

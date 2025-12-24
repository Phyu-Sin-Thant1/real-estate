import React from 'react'
import Card from '../ui/Card'

const NewsPanel = ({ news, onViewAll }) => {
  return (
    <Card variant="default" className="h-full rounded-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">오늘의 부동산 소식</h3>
          <button 
            onClick={onViewAll}
            className="text-sm font-medium text-dabang-primary hover:text-blue-700 transition-colors"
          >
            전체 보기
          </button>
        </div>
        
        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1.5 group-hover:text-dabang-primary transition-colors line-clamp-2 text-sm">
                  {item.headline}
                </h4>
                <p className="text-xs text-gray-500">{item.timeAgo}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1 group-hover:text-dabang-primary group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default NewsPanel


import React from 'react'

const SectionDivider = ({ className = '' }) => {
  return (
    <div className={`relative py-8 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200"></div>
      </div>
      <div className="relative flex justify-center">
        <div className="bg-white px-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionDivider


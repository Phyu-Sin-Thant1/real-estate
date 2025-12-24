import React from 'react'

const SectionHeader = ({ title, subtitle, className = '', badge, badgeColor = 'indigo' }) => {
  const badgeColors = {
    indigo: 'bg-indigo-100/50 border-indigo-200/50 text-indigo-700',
    blue: 'bg-blue-100/50 border-blue-200/50 text-blue-700',
    purple: 'bg-purple-100/50 border-purple-200/50 text-purple-700',
    orange: 'bg-orange-100/50 border-orange-200/50 text-orange-700',
    emerald: 'bg-emerald-100/50 border-emerald-200/50 text-emerald-700',
  }

  const pulseColors = {
    indigo: 'bg-indigo-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    emerald: 'bg-emerald-500',
  }

  return (
    <div className={`mb-8 md:mb-12 ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 ${badgeColors[badgeColor]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${pulseColors[badgeColor]} animate-pulse`} />
          <p className="text-xs font-semibold uppercase tracking-wider">
            {badge}
          </p>
        </div>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeader

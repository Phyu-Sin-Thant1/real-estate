import React from 'react'

const KpiBand = ({ kpis = [] }) => {
  return (
    <div className="rounded-2xl border border-black/5 bg-white bg-gradient-to-b from-white to-slate-50 shadow-sm p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-black/5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 py-3 px-1 sm:px-3 hover:bg-slate-50 transition-colors cursor-default"
          >
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-slate-500 mb-1">{kpi.label}</p>
              <div className="flex items-baseline">
                <span className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
                  {kpi.value}
                </span>
                <span className="ml-1 text-sm text-slate-500 font-medium">{kpi.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KpiBand


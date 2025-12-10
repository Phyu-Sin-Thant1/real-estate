import React from 'react';

const CalendarPage = () => {
  const events = [
    { id: 1, title: '고객 상담', date: '2024-01-15', time: '10:00', type: 'meeting' },
    { id: 2, title: '매물 방문', date: '2024-01-15', time: '14:00', type: 'viewing' },
    { id: 3, title: '계약 체결', date: '2024-01-16', time: '11:00', type: 'deal' },
    { id: 4, title: '이사 작업', date: '2024-01-17', time: '09:00', type: 'job' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">일정</h1>
        <p className="text-gray-600 mt-1">예정된 일정을 관리하세요</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">이번 주 일정</h2>
          <button className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors text-sm font-medium">
            새 일정 추가
          </button>
        </div>

        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dabang-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-dabang-primary font-semibold">
                    {event.date.split('-')[2]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {event.type}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;


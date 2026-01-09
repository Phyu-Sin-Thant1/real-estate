import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';

const LeadDetailsModal = ({ lead, isOpen, onClose, onStatusChange, availableStatuses }) => {
  const [localStatus, setLocalStatus] = useState(lead?.status || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lead?.status) {
      setLocalStatus(lead.status);
    }
  }, [lead?.status]);

  if (!isOpen || !lead) return null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '새 문의':
        return 'bg-blue-100 text-blue-800';
      case '연락 완료':
        return 'bg-green-100 text-green-800';
      case '예약 완료':
        return 'bg-purple-100 text-purple-800';
      case '보류':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusSelect = (newStatus) => {
    setLocalStatus(newStatus);
  };

  const handleSave = async () => {
    if (localStatus === lead.status) {
      // No changes to save
      return;
    }

    setIsSaving(true);
    try {
      if (onStatusChange) {
        onStatusChange(lead.id, localStatus);
      }
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsavedChanges = localStatus !== lead.status;

  // Filter out '전체' from available statuses for the dropdown
  const statusOptions = availableStatuses?.filter(status => status !== '전체') || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-300 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-white via-white to-gray-50/50 border-b border-gray-200/80 backdrop-blur-xl">
          <div className="px-8 pt-7 pb-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 truncate leading-tight">
                  문의 상세 정보
                </h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(localStatus)}`}
                  >
                    {localStatus}
                  </span>
                  <span className="text-xs text-gray-500">
                    {lead.inquiryType || '일반문의'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50/80 to-purple-50/60 rounded-2xl border border-blue-200/60 shadow-md p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">고객 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">고객명</div>
                <div className="text-lg font-bold text-gray-900">
                  {lead.customerName || '미입력'}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">연락처</div>
                <div className="text-lg font-bold text-gray-900">
                  {lead.phone || '미입력'}
                </div>
              </div>
            </div>
          </div>

          {/* Property Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">관심 매물</h3>
            <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50/80 to-cyan-50/60 rounded-xl border border-emerald-200/60">
              <div className="text-sm font-semibold text-gray-600 mb-1">매물명</div>
              <div className="text-lg font-bold text-gray-900">
                {lead.propertyName || '미입력'}
              </div>
            </div>
          </div>

          {/* Inquiry Details Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">문의 정보</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">접수일</div>
                  <div className="text-sm font-medium text-gray-900">
                    {lead.createdAt || '미입력'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">문의 타입</div>
                  <div className="text-sm font-medium text-gray-900">
                    {lead.inquiryType || '미입력'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Control Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">문의 상태</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-2">
                  현재 상태
                </label>
                <select
                  id="status-select"
                  value={localStatus}
                  onChange={(e) => handleStatusSelect(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent transition-all"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              {hasUnsavedChanges && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800 font-medium">
                    상태가 변경되었습니다. 저장 버튼을 클릭하여 변경사항을 저장하세요.
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                문의 상태를 변경한 후 저장 버튼을 클릭하면 목록 화면에도 반영됩니다. 상태는 문의 처리 진행 상황을 추적하는 데 사용됩니다.
              </p>
            </div>
          </div>

          {/* Memo Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">메모</h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60">
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {lead.memo || '메모가 없습니다.'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200/80 bg-gray-50/50 px-8 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-all ${
                hasUnsavedChanges && !isSaving
                  ? 'bg-dabang-primary hover:bg-dabang-primary/90 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  저장 중...
                </span>
              ) : (
                '저장'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;


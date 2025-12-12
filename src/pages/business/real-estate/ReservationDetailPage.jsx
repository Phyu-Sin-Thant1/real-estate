import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReservations, RESERVATION_STATUS, RESERVATION_STATUS_LABELS, RESERVATION_STATUS_COLORS } from '../../../context/ReservationsContext';

const ReservationDetailPage = () => {
  const navigate = useNavigate();
  const { reservationId } = useParams();
  const { reservations, updateReservationStatus, addReservationReply, updateReservationFields } = useReservations();
  
  const reservation = reservations.find(r => r.id === reservationId);
  
  const [selectedStatus, setSelectedStatus] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [agentNote, setAgentNote] = useState(reservation?.agentNote || '');
  
  // Quick reply templates
  const replyTemplates = [
    '방문 예약이 확정되었습니다.',
    '방문 가능 시간을 알려주세요.',
    '예약이 취소되었습니다.'
  ];
  
  if (!reservation) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">예약 정보를 찾을 수 없습니다</h2>
        <p className="text-gray-500 mb-6">존재하지 않거나 삭제된 예약입니다.</p>
        <button
          onClick={() => navigate('/business/real-estate/reservations')}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }
  
  // Handle status change
  const handleStatusChange = (status) => {
    updateReservationStatus(reservationId, status);
    setSelectedStatus('');
  };
  
  // Handle reply submission
  const handleReplySubmit = (e) => {
    e.preventDefault();
    
    if (!replyMessage.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    
    // If a status is selected, update both status and reply
    if (selectedStatus) {
      addReservationReply(reservationId, replyMessage, selectedStatus);
    } else {
      // Just add the reply
      addReservationReply(reservationId, replyMessage);
    }
    
    setReplyMessage('');
    setSelectedStatus('');
  };
  
  // Handle agent note save
  const handleAgentNoteSave = () => {
    updateReservationFields(reservationId, { agentNote });
  };
  
  // Apply template to reply message
  const applyTemplate = (template) => {
    setReplyMessage(template);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/business/real-estate/reservations')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로
        </button>
        
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 mr-4">예약 상세</h1>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${RESERVATION_STATUS_COLORS[reservation.status]}`}>
            {RESERVATION_STATUS_LABELS[reservation.status]}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Info */}
        <div className="space-y-6">
          {/* Reservation Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">예약 정보</h2>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="w-32 text-sm font-medium text-gray-500">방문일시</div>
                <div className="text-sm">
                  <div>{reservation.appointmentDate}</div>
                  <div className="text-gray-500">{reservation.appointmentTime}</div>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-32 text-sm font-medium text-gray-500">접수일</div>
                <div className="text-sm text-gray-900">{reservation.createdAt}</div>
              </div>
              
              <div className="flex">
                <div className="w-32 text-sm font-medium text-gray-500">상태</div>
                <div className="text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${RESERVATION_STATUS_COLORS[reservation.status]}`}>
                    {RESERVATION_STATUS_LABELS[reservation.status]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">고객 정보</h2>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="w-32 text-sm font-medium text-gray-500">이름</div>
                <div className="text-sm text-gray-900">{reservation.customerName}</div>
              </div>
              
              <div className="flex">
                <div className="w-32 text-sm font-medium text-gray-500">연락처</div>
                <div className="text-sm text-gray-900">{reservation.customerPhone}</div>
              </div>
              
              {reservation.customerEmail && (
                <div className="flex">
                  <div className="w-32 text-sm font-medium text-gray-500">이메일</div>
                  <div className="text-sm text-gray-900">{reservation.customerEmail}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Property Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">매물 정보</h2>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="w-32 text-sm font-medium text-gray-500">매물명</div>
                <div className="text-sm text-gray-900">{reservation.listingTitle}</div>
              </div>
              
              <div className="flex">
                <div className="w-32 text-sm font-medium text-gray-500">주소</div>
                <div className="text-sm text-gray-900">{reservation.listingAddress}</div>
              </div>
            </div>
          </div>
          
          {/* Customer Request */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">고객 요청 메시지</h2>
            <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg">
              {reservation.requestMessage || '요청 메시지가 없습니다.'}
            </div>
          </div>
        </div>
        
        {/* Right Panel - Actions */}
        <div className="space-y-6">
          {/* Status Change */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">상태 변경</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleStatusChange(RESERVATION_STATUS.CONFIRMED)}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm font-medium"
              >
                예약 확정
              </button>
              <button
                onClick={() => handleStatusChange(RESERVATION_STATUS.RESCHEDULE_REQUESTED)}
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-sm font-medium"
              >
                일정 조율
              </button>
              <button
                onClick={() => handleStatusChange(RESERVATION_STATUS.COMPLETED)}
                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 text-sm font-medium"
              >
                방문 완료
              </button>
              <button
                onClick={() => handleStatusChange(RESERVATION_STATUS.CANCELED)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                취소
              </button>
            </div>
          </div>
          
          {/* Reply Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">답변하기</h2>
            
            <form onSubmit={handleReplySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">상태 선택 (선택)</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                >
                  <option value="">상태를 선택하세요</option>
                  {Object.entries(RESERVATION_STATUS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {RESERVATION_STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  고객에게 보낼 답변을 입력하세요…
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  placeholder="고객에게 보낼 답변을 입력하세요…"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {replyTemplates.map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 text-sm font-medium"
                >
                  보내기
                </button>
              </div>
            </form>
          </div>
          
          {/* Agent Internal Note */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">내부 메모</h2>
            
            <div className="mb-4">
              <textarea
                value={agentNote}
                onChange={(e) => setAgentNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="내부용 메모를 입력하세요…"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleAgentNoteSave}
                className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 text-sm font-medium"
              >
                저장
              </button>
            </div>
          </div>
          
          {/* History */}
          {reservation.replyHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">답변 내역</h2>
              
              <div className="space-y-4">
                {reservation.replyHistory.map((reply, index) => (
                  <div key={index} className="border-l-4 border-dabang-primary pl-4 py-1">
                    <div className="flex justify-between text-sm">
                      <div className="font-medium text-gray-900">{reply.by}</div>
                      <div className="text-gray-500">
                        {new Date(reply.at).toLocaleString('ko-KR')}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">{reply.message}</div>
                    {reply.nextStatus && (
                      <div className="text-xs text-gray-500 mt-1">
                        상태 변경: {RESERVATION_STATUS_LABELS[reservation.status]} → {RESERVATION_STATUS_LABELS[reply.nextStatus]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailPage;
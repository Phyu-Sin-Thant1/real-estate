import React, { useState, useEffect } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { getTicketMessages, addTicketMessage, updateTicket } from '../../store/supportTicketsStore';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';

const TicketDetailDrawer = ({ isOpen, onClose, ticket, onUpdate }) => {
  const { user } = useUnifiedAuth();
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [status, setStatus] = useState(ticket?.status || 'OPEN');
  const [priority, setPriority] = useState(ticket?.priority || 'NORMAL');
  const [assigneeId, setAssigneeId] = useState(ticket?.assigneeId || '');

  // Mock admin users
  const adminUsers = [
    { id: 'admin-1', name: '김지원' },
    { id: 'admin-2', name: '이지원' },
    { id: 'admin-3', name: '최지원' }
  ];

  useEffect(() => {
    if (isOpen && ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority);
      setAssigneeId(ticket.assigneeId || '');
      loadMessages();
    }
  }, [isOpen, ticket]);

  const loadMessages = () => {
    if (!ticket) return;
    const ticketMessages = getTicketMessages(ticket.id);
    // Sort by createdAt descending (newest first)
    setMessages(ticketMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    updateTicket(ticket.id, { status: newStatus });
    onUpdate?.();
  };

  const handlePriorityChange = async (newPriority) => {
    setPriority(newPriority);
    updateTicket(ticket.id, { priority: newPriority });
    onUpdate?.();
  };

  const handleAssigneeChange = async (newAssigneeId) => {
    setAssigneeId(newAssigneeId);
    const assignee = adminUsers.find(a => a.id === newAssigneeId);
    updateTicket(ticket.id, { 
      assigneeId: newAssigneeId || null,
      assigneeName: assignee?.name || null
    });
    onUpdate?.();
  };

  const handleReply = async () => {
    if (!replyText.trim() || replyText.trim().length < 5) {
      return;
    }

    setIsReplying(true);
    try {
      const message = {
        id: `msg-${Date.now()}`,
        ticketId: ticket.id,
        authorType: 'ADMIN',
        authorName: user?.name || 'Admin',
        body: replyText.trim(),
        attachments: [],
        createdAt: new Date().toISOString(),
        isInternal: false
      };

      addTicketMessage(message);
      
      // Auto-update status: if OPEN, set to IN_PROGRESS; if WAITING_USER, set to IN_PROGRESS
      let newStatus = status;
      if (status === 'OPEN' || status === 'WAITING_USER') {
        newStatus = 'IN_PROGRESS';
        setStatus(newStatus);
        updateTicket(ticket.id, { status: newStatus });
      }

      setReplyText('');
      loadMessages();
      onUpdate?.();
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const handleAddInternalNote = async () => {
    if (!internalNoteText.trim() || internalNoteText.trim().length < 5) {
      return;
    }

    setIsAddingNote(true);
    try {
      const message = {
        id: `msg-${Date.now()}`,
        ticketId: ticket.id,
        authorType: 'ADMIN',
        authorName: user?.name || 'Admin',
        body: internalNoteText.trim(),
        attachments: [],
        createdAt: new Date().toISOString(),
        isInternal: true
      };

      addTicketMessage(message);
      setInternalNoteText('');
      loadMessages();
      onUpdate?.();
    } catch (error) {
      console.error('Error adding internal note:', error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const getDomainLabel = (domain) => {
    const labels = {
      DELIVERY: '딜리버리',
      REAL_ESTATE: '부동산',
      PAYMENT: '결제',
      ACCOUNT: '계정',
      BUG_REPORT: '버그 신고',
      ETC: '기타'
    };
    return labels[domain] || domain;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="danger">미처리</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">처리중</Badge>;
      case 'WAITING_USER':
        return <Badge variant="warning">사용자 응답 대기</Badge>;
      case 'RESOLVED':
        return <Badge variant="success">완료</Badge>;
      case 'CLOSED':
        return <Badge>닫힘</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="danger">긴급</Badge>;
      case 'HIGH':
        return <Badge variant="warning">높음</Badge>;
      case 'NORMAL':
        return <Badge variant="default">보통</Badge>;
      case 'LOW':
        return <Badge>낮음</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">티켓 #{ticket.id}</h2>
                {getStatusBadge(status)}
                {getPriorityBadge(priority)}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{getDomainLabel(ticket.domain)}</span>
                {ticket.serviceContext && <span>• {ticket.serviceContext === 'MOVING' ? 'Moving Service' : 'Delivery'}</span>}
                <span>• {ticket.category}</span>
                {ticket.isComplaint && <Badge variant="danger" size="small">불만</Badge>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">사용자 정보</h3>
              <div className="text-sm text-gray-900">
                {ticket.userName && <div>이름: {ticket.userName}</div>}
                {ticket.userEmail && <div>이메일: {ticket.userEmail}</div>}
              </div>
            </div>

            {/* Reference Info */}
            {ticket.referenceType && ticket.referenceId && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">관련 참조</h3>
                <div className="text-sm text-gray-900">
                  <div>유형: {ticket.referenceType}</div>
                  <div>ID: {ticket.referenceId}</div>
                </div>
              </div>
            )}

            {/* Original Message */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">원본 메시지</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{ticket.message}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">첨부 파일</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ticket.attachments.map((att, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-2">
                      {att.type?.startsWith('image/') ? (
                        <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">이미지</span>
                        </div>
                      ) : (
                        <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-600 truncate">{att.name}</div>
                      <a href={att.url} className="text-xs text-blue-600 hover:underline">다운로드</a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Thread */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">대화 내역</h3>
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-500">아직 대화가 없습니다.</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-lg p-4 ${
                        msg.isInternal
                          ? 'bg-yellow-50 border border-yellow-200'
                          : msg.authorType === 'ADMIN'
                          ? 'bg-blue-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {msg.authorName || (msg.authorType === 'ADMIN' ? '관리자' : '사용자')}
                          </span>
                          {msg.isInternal && (
                            <Badge variant="warning" size="small">내부 메모</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{msg.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
            {/* Status, Priority, Assignee */}
            <div className="grid grid-cols-3 gap-4">
              <Select
                id="status"
                label="상태"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={[
                  { value: 'OPEN', label: '미처리' },
                  { value: 'IN_PROGRESS', label: '처리중' },
                  { value: 'WAITING_USER', label: '사용자 응답 대기' },
                  { value: 'RESOLVED', label: '완료' },
                  { value: 'CLOSED', label: '닫힘' }
                ]}
              />
              <Select
                id="priority"
                label="우선순위"
                value={priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                options={[
                  { value: 'LOW', label: '낮음' },
                  { value: 'NORMAL', label: '보통' },
                  { value: 'HIGH', label: '높음' },
                  { value: 'URGENT', label: '긴급' }
                ]}
              />
              <Select
                id="assignee"
                label="담당자"
                value={assigneeId}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                options={[
                  { value: '', label: '미할당' },
                  ...adminUsers.map(u => ({ value: u.id, label: u.name }))
                ]}
              />
            </div>

            {/* Reply to User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">사용자에게 답변</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="답변을 입력하세요 (최소 5자)"
              />
              <div className="mt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleReply}
                  disabled={!replyText.trim() || replyText.trim().length < 5 || isReplying}
                >
                  {isReplying ? '전송 중...' : '답변 전송'}
                </Button>
              </div>
            </div>

            {/* Internal Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">내부 메모</label>
              <textarea
                value={internalNoteText}
                onChange={(e) => setInternalNoteText(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="내부 메모를 입력하세요 (최소 5자)"
              />
              <div className="mt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="small"
                  onClick={handleAddInternalNote}
                  disabled={!internalNoteText.trim() || internalNoteText.trim().length < 5 || isAddingNote}
                >
                  {isAddingNote ? '저장 중...' : '메모 추가'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailDrawer;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLeadById, updateLead } from '../../mock/realEstateData';

const InquiryDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [status, setStatus] = useState('');
  const [memo, setMemo] = useState('');
  const [answer, setAnswer] = useState('');

  // Get status badge color
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

  useEffect(() => {
    // Fetch lead data
    const fetchedLead = getLeadById(id);
    if (fetchedLead) {
      setLead(fetchedLead);
      setStatus(fetchedLead.status);
      setMemo(fetchedLead.memo || '');
      setAnswer(fetchedLead.answer || '');
    } else {
      // If lead not found, redirect to leads list
      navigate('/business/real-estate/leads');
    }
  }, [id, navigate]);

  const handleSave = () => {
    // Update lead data (prototype only)
    updateLead(id, { status, memo, answer });
    
    // Show success message
    alert("저장되었습니다.");
    
    // Navigate back to leads list
    navigate("/business/real-estate/leads");
  };

  if (!lead) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate("/business/real-estate/leads")}
          className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center"
        >
          ← 목록으로
        </button>
        <h1 className="text-2xl font-bold text-gray-900">문의 상세</h1>
        <p className="text-gray-600 mt-1">웹사이트에서 접수된 문의 정보와 응답을 관리합니다.</p>
      </div>

      <div className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
          <h2 className="text-lg font-semibold">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">접수일</label>
              <p className="mt-1">{lead.createdAt}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">상태</label>
              <div className="mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(status)}`}>
                  {status}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">문의 유형</label>
              <p className="mt-1">{lead.inquiryType}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">관심 매물</label>
              <p className="mt-1">{lead.propertyName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">고객명</label>
              <p className="mt-1">{lead.customerName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">연락처</label>
              <p className="mt-1">{lead.phone}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">이메일</label>
              <p className="mt-1">{lead.email || '-'}</p>
            </div>
          </div>
        </div>

        {/* Customer Inquiry Content Card */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">고객 문의 내용</h2>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
            {lead.message || '문의 내용이 없습니다.'}
          </div>
        </div>

        {/* Consultation Memo and Response Card */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">상담 메모 및 응답</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상담 메모
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="상담 내용을 메모해두세요. (내부용)"
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                고객에게 전달할 답변
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="고객에게 안내할 답변을 작성해주세요."
                rows="4"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Inquiry Status Change Card */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">문의 상태</h2>
          <p className="text-sm text-gray-600 mb-4">문의 진행 상황을 선택하세요.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {['새 문의', '연락 완료', '예약 완료', '보류'].map((statusOption) => (
              <label key={statusOption} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === statusOption}
                  onChange={() => setStatus(statusOption)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(statusOption)}`}>
                  {statusOption}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/business/real-estate/leads")}
            className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            목록으로
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getContractById } from '../../../mock/realEstateData';

const RealEstateContractDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [localActivityHistory, setLocalActivityHistory] = useState([]);

  useEffect(() => {
    const fetchedContract = getContractById(id);
    if (fetchedContract) {
      setContract(fetchedContract);
      setLocalActivityHistory([...fetchedContract.activityHistory]);
    } else {
      // Handle contract not found
      navigate('/business/real-estate/contracts');
    }
  }, [id, navigate]);

  if (!contract) {
    return <div>Loading...</div>;
  }

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '진행중':
        return 'bg-blue-100 text-blue-800';
      case '완료':
        return 'bg-green-100 text-green-800';
      case '취소':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    const updatedContract = { ...contract, status: newStatus };
    setContract(updatedContract);
    
    // Add activity entry
    const newActivity = {
      id: localActivityHistory.length + 1,
      timestamp: new Date().toISOString(),
      actor: '현재 사용자',
      message: `계약 상태가 "${newStatus}"로 변경됨`
    };
    
    setLocalActivityHistory(prev => [...prev, newActivity]);
  };

  // Handle adding a new note
  const handleAddNote = () => {
    if (newNote.trim()) {
      const newActivity = {
        id: localActivityHistory.length + 1,
        timestamp: new Date().toISOString(),
        actor: '현재 사용자',
        message: newNote
      };
      
      setLocalActivityHistory(prev => [...prev, newActivity]);
      setNewNote('');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/business/real-estate/contracts')}
            className="text-dabang-primary hover:text-dabang-primary/80 flex items-center mr-4"
          >
            ← 계약 목록으로
          </button>
          <h1 className="text-2xl font-bold text-gray-900">계약 상세</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => navigate(`/business/real-estate/contracts/${id}/edit`)}
            className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
          >
            계약 수정
          </button>
          <div className="flex gap-1">
            <button 
              onClick={() => handleStatusChange('진행중')}
              className={`px-3 py-2 text-sm rounded-lg ${contract.status === '진행중' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              진행중
            </button>
            <button 
              onClick={() => handleStatusChange('완료')}
              className={`px-3 py-2 text-sm rounded-lg ${contract.status === '완료' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              완료
            </button>
            <button 
              onClick={() => handleStatusChange('취소')}
              className={`px-3 py-2 text-sm rounded-lg ${contract.status === '취소' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              취소
            </button>
          </div>
        </div>
      </div>

      {/* Status Pill */}
      <div className="flex items-center">
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(contract.status)}`}>
          {contract.status}
        </span>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">계약 요약</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-gray-600">매물</p>
            <p className="font-medium">{contract.listing.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">고객</p>
            <p className="font-medium">{contract.customer.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">계약 유형</p>
            <p className="font-medium">{contract.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">계약일</p>
            <p className="font-medium">{formatDate(contract.contractDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">입주일</p>
            <p className="font-medium">{contract.moveInDate ? formatDate(contract.moveInDate) : '-'}</p>
          </div>
        </div>
      </div>

      {/* Customer Information Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">고객 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">고객명</p>
            <p className="font-medium">{contract.customer.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">연락처</p>
            <p className="font-medium">{contract.customer.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">이메일</p>
            <p className="font-medium">{contract.customer.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">고객 유형</p>
            <p className="font-medium">{contract.customer.type}</p>
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <p className="text-sm text-gray-600">메모</p>
            <p className="font-medium">{contract.customer.memo || '-'}</p>
          </div>
        </div>
      </div>

      {/* Property Information Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">매물 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">매물명</p>
            <p className="font-medium">{contract.listing.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">매물 유형</p>
            <p className="font-medium">{contract.listing.type}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">주소</p>
            <p className="font-medium">{contract.listing.address}</p>
          </div>
        </div>
      </div>

      {/* Contract Information Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">계약 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">계약 유형</p>
            <p className="font-medium">{contract.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">계약 ID</p>
            <p className="font-medium">#{contract.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">계약일</p>
            <p className="font-medium">{formatDate(contract.contractDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">입주일</p>
            <p className="font-medium">{contract.moveInDate ? formatDate(contract.moveInDate) : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">계약 기간</p>
            <p className="font-medium">{contract.term || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">담당자</p>
            <p className="font-medium">{contract.createdBy || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">상태</p>
            <p className="font-medium">{contract.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">최종 수정</p>
            <p className="font-medium">{formatDate(contract.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Price/Payment Information Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">금액 / 결제 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contract.type === '매매' && (
            <>
              <div>
                <p className="text-sm text-gray-600">매매가격</p>
                <p className="font-medium">{formatCurrency(contract.salePrice)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">수수료</p>
                <p className="font-medium">{formatCurrency(contract.commission)}</p>
              </div>
            </>
          )}
          {(contract.type === '전세' || contract.type === '월세') && (
            <>
              <div>
                <p className="text-sm text-gray-600">보증금</p>
                <p className="font-medium">{contract.deposit ? formatCurrency(contract.deposit) : '-'}</p>
              </div>
              {contract.type === '월세' && (
                <div>
                  <p className="text-sm text-gray-600">월세</p>
                  <p className="font-medium">{contract.monthlyRent ? formatCurrency(contract.monthlyRent) : '-'}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">수수료</p>
                <p className="font-medium">{contract.commission ? formatCurrency(contract.commission) : '-'}</p>
              </div>
            </>
          )}
          <div className="md:col-span-2 lg:col-span-4">
            <p className="text-sm text-gray-600">결제 관련 메모</p>
            <p className="font-medium">{contract.notes || '-'}</p>
          </div>
        </div>
      </div>

      {/* Activity History Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">활동 내역</h2>
        <div className="space-y-4">
          {localActivityHistory.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-dabang-primary"></div>
                {activity.id !== localActivityHistory[localActivityHistory.length - 1].id && (
                  <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{formatDate(activity.timestamp)} by {activity.actor}</p>
              </div>
            </div>
          ))}
          
          {/* Add New Note */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="새로운 메모를 입력하세요..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              rows={3}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
              >
                메모 추가
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">첨부 파일</h2>
        {contract.attachments && contract.attachments.length > 0 ? (
          <div className="space-y-3">
            {contract.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{attachment.name}</p>
                  <p className="text-sm text-gray-500">{attachment.size} • {formatDate(attachment.uploadDate)}</p>
                </div>
                <button className="px-3 py-1 text-sm text-dabang-primary hover:text-dabang-primary/80 border border-dabang-primary rounded">
                  보기/다운로드
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">첨부된 파일이 없습니다.</p>
        )}
        <div className="mt-4">
          <button className="px-4 py-2 border border-dashed border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            파일 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealEstateContractDetailPage;
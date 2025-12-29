import React, { useEffect, useMemo, useState } from 'react';
import { getAllReviews, updateReviewStatus, addReplyToReview } from '../../store/reviewsStore';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';

const AdminReviewsPage = () => {
  const { user } = useUnifiedAuth();
  const [reviews, setReviews] = useState([]);
  const [filterEntityType, setFilterEntityType] = useState('ALL');
  const [filterRating, setFilterRating] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedReview, setExpandedReview] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    setReviews(getAllReviews());
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const entityMatch = filterEntityType === 'ALL' || review.entityType === filterEntityType;
      const ratingMatch = filterRating === 'ALL' || review.rating === Number(filterRating);
      const statusMatch = filterStatus === 'ALL' || review.status === filterStatus;
      return entityMatch && ratingMatch && statusMatch;
    });
  }, [reviews, filterEntityType, filterRating, filterStatus]);

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    updateReviewStatus(id, newStatus);
    setReviews(getAllReviews());
  };

  const handleReplySubmit = (reviewId) => {
    if (!replyText.trim()) {
      alert('답글 내용을 입력해주세요.');
      return;
    }

    addReplyToReview(
      reviewId,
      replyText,
      user?.email || 'admin@tofu.com',
      user?.name || '관리자'
    );
    
    setReviews(getAllReviews());
    setReplyText('');
    setReplyingTo(null);
  };

  const getStatusBadge = (status) => {
    return status === 'ACTIVE' ? (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        노출중
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
        숨김
      </span>
    );
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getEntityTypeLabel = (type) => {
    switch (type) {
      case 'REAL_ESTATE_LISTING': return '부동산 매물';
      case 'DELIVERY_ORDER': return '배송 주문';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
        <p className="text-gray-600 mt-1">사용자 리뷰를 관리하고 모더레이션합니다.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">전체 리뷰</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">노출중</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {reviews.filter((r) => r.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">숨김</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {reviews.filter((r) => r.status === 'HIDDEN').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">평균 평점</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {reviews.length > 0
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : '0.0'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">엔티티 유형</label>
            <select
              value={filterEntityType}
              onChange={(e) => setFilterEntityType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="ALL">전체</option>
              <option value="REAL_ESTATE_LISTING">부동산 매물</option>
              <option value="DELIVERY_ORDER">배송 주문</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">평점</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="ALL">전체</option>
              <option value="5">5점</option>
              <option value="4">4점</option>
              <option value="3">3점</option>
              <option value="2">2점</option>
              <option value="1">1점</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="ALL">전체</option>
              <option value="ACTIVE">노출중</option>
              <option value="HIDDEN">숨김</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  평점
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  리뷰 내용
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  파트너
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    리뷰가 없습니다
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-yellow-600">
                        {getRatingStars(review.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {review.comment || '내용 없음'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getEntityTypeLabel(review.entityType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.partnerName || review.partnerEmail || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.userName || review.userEmail || '익명'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(review.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString('ko-KR')
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {expandedReview === review.id ? '접기' : '상세'}
                        </button>
                        <button
                          onClick={() => handleToggleStatus(review.id, review.status)}
                          className={`${
                            review.status === 'ACTIVE'
                              ? 'text-red-600 hover:text-red-800'
                              : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {review.status === 'ACTIVE' ? '숨기기' : '복원'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Review Details Modal */}
      {expandedReview && (() => {
        const review = reviews.find(r => r.id === expandedReview);
        if (!review) return null;
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">리뷰 상세</h2>
                  <button
                    onClick={() => setExpandedReview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Review Content */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-lg">{getRatingStars(review.rating)}</div>
                    <span className="text-sm font-medium text-gray-900">
                      {review.userName || review.userEmail || '익명'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString('ko-KR')
                        : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{review.comment || '내용 없음'}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">유형: {getEntityTypeLabel(review.entityType)}</span>
                    <span className="text-xs text-gray-500">파트너: {review.partnerName || review.partnerEmail}</span>
                    {getStatusBadge(review.status)}
                  </div>
                </div>

                {/* Replies Section */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">답글</h3>
                  {review.replies && review.replies.length > 0 ? (
                    <div className="space-y-3">
                      {review.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-dabang-primary">
                              {reply.repliedByName || reply.repliedBy || '파트너'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {reply.createdAt
                                ? new Date(reply.createdAt).toLocaleDateString('ko-KR')
                                : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">아직 답글이 없습니다.</p>
                  )}
                </div>

                {/* Reply Input */}
                {replyingTo === review.id ? (
                  <div className="border-t border-gray-200 pt-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="답글을 입력하세요..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary text-sm"
                    />
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleReplySubmit(review.id)}
                        className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
                      >
                        답글 등록
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-4">
                    <button
                      onClick={() => setReplyingTo(review.id)}
                      className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 text-sm font-medium"
                    >
                      답글 작성
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AdminReviewsPage;


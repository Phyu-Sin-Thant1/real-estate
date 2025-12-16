import React, { useEffect, useMemo, useState } from 'react';
import { getAllReviews, updateReviewStatus } from '../../store/reviewsStore';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filterEntityType, setFilterEntityType] = useState('ALL');
  const [filterRating, setFilterRating] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;


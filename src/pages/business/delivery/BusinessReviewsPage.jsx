import React, { useEffect, useState } from 'react';
import { getReviewsByPartner, addReplyToReview, getAllReviews } from '../../../store/reviewsStore';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';

const BusinessReviewsPage = () => {
  const { user } = useUnifiedAuth();
  const [reviews, setReviews] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (user?.email) {
      const partnerReviews = getReviewsByPartner(user.email);
      // Sort by createdAt (newest first)
      const sorted = partnerReviews.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setReviews(sorted);
    }
  }, [user?.email]);

  const handleReplySubmit = (reviewId) => {
    if (!replyText.trim()) {
      alert('답글 내용을 입력해주세요.');
      return;
    }

    addReplyToReview(
      reviewId,
      replyText,
      user?.email || '',
      user?.name || user?.email || '파트너'
    );
    
    // Refresh reviews
    const partnerReviews = getReviewsByPartner(user?.email);
    const sorted = partnerReviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setReviews(sorted);
    
    setReplyText('');
    setReplyingTo(null);
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">리뷰</h1>
        <p className="text-gray-600 mt-1">고객이 작성한 리뷰를 확인하세요.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">전체 리뷰</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">평균 평점</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {reviews.length > 0
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : '0.0'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">5점 리뷰</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {reviews.filter((r) => r.rating === 5).length}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {reviews.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">리뷰가 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">아직 고객 리뷰가 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
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
                    <p className="mt-2 text-sm text-gray-700">{review.comment || '내용 없음'}</p>
                    {review.entityType === 'DELIVERY_ORDER' && review.entityId && (
                      <p className="mt-2 text-xs text-gray-500">
                        주문 ID: {review.entityId}
                      </p>
                    )}

                    {/* Replies Section */}
                    {review.replies && review.replies.length > 0 && (
                      <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
                        {review.replies.map((reply) => (
                          <div key={reply.id} className="mt-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-dabang-primary">
                                {reply.repliedByName || reply.repliedBy || '파트너'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {reply.createdAt
                                  ? new Date(reply.createdAt).toLocaleDateString('ko-KR')
                                  : ''}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === review.id ? (
                      <div className="mt-4 ml-4 pl-4 border-l-2 border-dabang-primary">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="답글을 입력하세요..."
                          rows={3}
                          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary text-sm"
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
                      <button
                        onClick={() => setReplyingTo(review.id)}
                        className="mt-3 text-sm text-dabang-primary hover:text-dabang-primary/80 font-medium"
                      >
                        답글 작성
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessReviewsPage;


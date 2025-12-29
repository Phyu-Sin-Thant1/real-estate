// Reviews store - manages user reviews for listings/orders
const STORAGE_KEY = 'tofu-reviews';

const safeRead = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.warn('Failed to parse localStorage value', e);
    return fallback;
  }
};

const safeWrite = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to write localStorage value', e);
  }
};

/**
 * Initialize with mock data if empty
 */
const initializeMockData = () => {
  const existing = safeRead(STORAGE_KEY, []);
  if (existing.length === 0) {
    const now = new Date();
    const getDateFromToday = (days) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString();
    };

    const mockReviews = [
      // Delivery Order Reviews
      {
        id: 'review-1',
        rating: 5,
        comment: '정말 빠르고 안전하게 배송해주셔서 감사합니다! 기사분도 친절하시고 시간 약속도 정확히 지켜주셨어요. 다음에도 꼭 이용하겠습니다.',
        entityType: 'DELIVERY_ORDER',
        entityId: 'ORD-20251210-001',
        partnerEmail: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        userEmail: 'customer1@example.com',
        userName: '김철수',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-2)
      },
      {
        id: 'review-2',
        rating: 4,
        comment: '전반적으로 만족스러웠습니다. 다만 포장이 조금 더 신경 쓰였으면 좋겠어요. 그래도 시간은 정확했고 기사분도 친절하셨습니다.',
        entityType: 'DELIVERY_ORDER',
        entityId: 'ORD-20251208-006',
        partnerEmail: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        userEmail: 'customer2@example.com',
        userName: '이영희',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-5)
      },
      {
        id: 'review-3',
        rating: 5,
        comment: '완벽합니다! 가격도 합리적이고 서비스도 훌륭했어요. 특히 가구 운반할 때 조심스럽게 다뤄주셔서 감사합니다.',
        entityType: 'DELIVERY_ORDER',
        entityId: 'ORD-20251205-002',
        partnerEmail: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        userEmail: 'customer3@example.com',
        userName: '박민수',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-7)
      },
      {
        id: 'review-4',
        rating: 3,
        comment: '배송은 잘 됐지만 약속 시간보다 30분 정도 늦었어요. 그래도 물건은 무사히 도착했습니다.',
        entityType: 'DELIVERY_ORDER',
        entityId: 'ORD-20251201-007',
        partnerEmail: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        userEmail: 'customer4@example.com',
        userName: '최지은',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-10)
      },
      {
        id: 'review-5',
        rating: 5,
        comment: '이사 서비스 최고예요! 기사분들이 정말 전문적이고 친절하셨습니다. 다음 이사도 여기서 이용할 예정입니다.',
        entityType: 'DELIVERY_ORDER',
        entityId: 'ORD-20251128-003',
        partnerEmail: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        userEmail: 'customer5@example.com',
        userName: '정하늘',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-12)
      },
      {
        id: 'review-6',
        rating: 4,
        comment: '좋은 서비스였습니다. 다만 견적서에 명시되지 않은 추가 비용이 있어서 조금 아쉬웠어요.',
        entityType: 'DELIVERY_ORDER',
        entityId: 'ORD-20251124-008',
        partnerEmail: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        userEmail: 'customer6@example.com',
        userName: '한바다',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-15)
      },
      {
        id: 'review-7',
        rating: 2,
        comment: '물건이 약간 손상되었습니다. 연락했을 때는 빠르게 처리해주셨지만 처음부터 조심스럽게 다뤘으면 좋았을 것 같아요.',
        entityType: 'DELIVERY_ORDER',
        entityId: 'ORD-20251120-004',
        partnerEmail: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        userEmail: 'customer7@example.com',
        userName: '오솔지',
        status: 'HIDDEN',
        createdAt: getDateFromToday(-18)
      },
      {
        id: 'review-8',
        rating: 5,
        comment: '정말 만족스러운 서비스였습니다! 빠른 응답, 정확한 시간, 친절한 서비스 모두 완벽했어요. 강력 추천합니다!',
        entityType: 'DELIVERY_ORDER',
        entityId: 'ORD-20251117-009',
        partnerEmail: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        userEmail: 'customer8@example.com',
        userName: '윤샛별',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-20)
      },
      {
        id: 'review-9',
        rating: 4,
        comment: '전반적으로 좋았습니다. 다만 주말 배송이라 조금 비싸긴 했지만 서비스 품질은 만족스러웠어요.',
        entityType: 'DELIVERY_ORDER',
        entityId: 'ORD-20251112-005',
        partnerEmail: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        userEmail: 'customer9@example.com',
        userName: '임하루',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-22)
      },
      {
        id: 'review-10',
        rating: 5,
        comment: '완벽한 서비스! 기사분이 정말 세심하게 포장해주시고 운반도 안전하게 해주셨어요. 감사합니다!',
        entityType: 'DELIVERY_ORDER',
        entityId: 'ORD-20251110-010',
        partnerEmail: 'delivery@tofu.com',
        partnerName: 'Fast Delivery Co.',
        userEmail: 'customer10@example.com',
        userName: '서해린',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-25)
      },
      // Real Estate Listing Reviews
      {
        id: 'review-11',
        rating: 5,
        comment: '매물 정보가 정확하고 중개 과정이 투명해서 좋았습니다. 담당자분도 친절하시고 전문적이셨어요.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: 'prop-1',
        partnerEmail: 'seoulrealestate@tofu.com',
        partnerName: 'Seoul Real Estate Co.',
        userEmail: 'buyer1@example.com',
        userName: '남가람',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-3)
      },
      {
        id: 'review-12',
        rating: 4,
        comment: '좋은 매물을 소개해주셔서 감사합니다. 다만 계약 과정에서 약간의 지연이 있었지만 전반적으로 만족스러웠어요.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: 'prop-2',
        partnerEmail: 'seoulrealestate@tofu.com',
        partnerName: 'Seoul Real Estate Co.',
        userEmail: 'buyer2@example.com',
        userName: '도빛나',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-6)
      },
      {
        id: 'review-13',
        rating: 5,
        comment: '정말 신뢰할 수 있는 중개사무소입니다. 매물 설명도 자세하고, 계약 조건도 명확하게 설명해주셨어요.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: 'prop-3',
        partnerEmail: 'seoulrealestate@tofu.com',
        partnerName: 'Seoul Real Estate Co.',
        userEmail: 'buyer3@example.com',
        userName: '배하영',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-8)
      },
      {
        id: 'review-14',
        rating: 3,
        comment: '매물은 괜찮았지만 중개 수수료가 조금 비싸다고 느껴졌어요. 그래도 서비스는 나쁘지 않았습니다.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: 'prop-4',
        partnerEmail: 'incheonproperties@tofu.com',
        partnerName: 'Incheon Properties Ltd.',
        userEmail: 'buyer4@example.com',
        userName: '강민지',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-11)
      },
      {
        id: 'review-15',
        rating: 5,
        comment: '완벽한 서비스였습니다! 원하는 조건의 매물을 빠르게 찾아주시고, 계약까지 원활하게 진행해주셨어요.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: 'prop-5',
        partnerEmail: 'incheonproperties@tofu.com',
        partnerName: 'Incheon Properties Ltd.',
        userEmail: 'buyer5@example.com',
        userName: '송지우',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-14)
      },
      {
        id: 'review-16',
        rating: 4,
        comment: '친절하고 전문적인 서비스였습니다. 다만 매물 사진이 실제와 조금 달랐지만 전반적으로는 만족스러웠어요.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: 'prop-6',
        partnerEmail: 'incheonproperties@tofu.com',
        partnerName: 'Incheon Properties Ltd.',
        userEmail: 'buyer6@example.com',
        userName: '유서연',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-16)
      },
      {
        id: 'review-17',
        rating: 5,
        comment: '정말 추천합니다! 담당자분이 정말 친절하시고, 매물 정보도 정확했어요. 다음에도 여기서 찾을 예정입니다.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: 'prop-7',
        partnerEmail: 'seoulrealestate@tofu.com',
        partnerName: 'Seoul Real Estate Co.',
        userEmail: 'buyer7@example.com',
        userName: '조민준',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-19)
      },
      {
        id: 'review-18',
        rating: 2,
        comment: '약속 시간에 늦으시고, 매물 설명도 부정확했어요. 개선이 필요할 것 같습니다.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: 'prop-8',
        partnerEmail: 'incheonproperties@tofu.com',
        partnerName: 'Incheon Properties Ltd.',
        userEmail: 'buyer8@example.com',
        userName: '황수빈',
        status: 'HIDDEN',
        createdAt: getDateFromToday(-21)
      },
      {
        id: 'review-19',
        rating: 5,
        comment: '최고의 서비스입니다! 빠른 응답, 정확한 정보, 친절한 상담 모두 완벽했어요. 감사합니다!',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: 'prop-9',
        partnerEmail: 'seoulrealestate@tofu.com',
        partnerName: 'Seoul Real Estate Co.',
        userEmail: 'buyer9@example.com',
        userName: '문예준',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-24)
      },
      {
        id: 'review-20',
        rating: 4,
        comment: '좋은 경험이었습니다. 다만 계약서 작성 시 조금 더 자세한 설명이 있었으면 좋았을 것 같아요.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: 'prop-10',
        partnerEmail: 'seoulrealestate@tofu.com',
        partnerName: 'Seoul Real Estate Co.',
        userEmail: 'buyer10@example.com',
        userName: '신다은',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-27)
      },
      // More Real Estate Reviews with replies
      {
        id: 'review-21',
        rating: 5,
        comment: '강남구 역삼동 아파트 매매 완료했습니다. 담당자분이 정말 친절하시고 전문적이셨어요. 매물 정보도 정확했고, 계약 과정도 원활했습니다.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: '1',
        partnerEmail: 'seoulrealestate@tofu.com',
        partnerName: 'Seoul Real Estate Co.',
        userEmail: 'kim.chulsoo@example.com',
        userName: '김철수',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-1),
        replies: [
          {
            id: 'reply-21-1',
            text: '감사합니다! 좋은 집에서 행복하게 사시길 바랍니다. 추가로 도움이 필요하시면 언제든 연락주세요.',
            repliedBy: 'seoulrealestate@tofu.com',
            repliedByName: 'Seoul Real Estate Co.',
            createdAt: getDateFromToday(-1)
          }
        ]
      },
      {
        id: 'review-22',
        rating: 4,
        comment: '서초구 오피스텔 전세 계약했습니다. 다만 사진과 실제 매물이 조금 달랐지만, 담당자분이 친절하게 설명해주셔서 만족스러웠어요.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: '2',
        partnerEmail: 'seoulrealestate@tofu.com',
        partnerName: 'Seoul Real Estate Co.',
        userEmail: 'lee.younghee@example.com',
        userName: '이영희',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-4)
      },
      {
        id: 'review-23',
        rating: 5,
        comment: '인천 남동구 아파트 매매 완료! 송도 지역 매물을 잘 알고 계셔서 좋은 집을 찾을 수 있었어요. 감사합니다!',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: '6',
        partnerEmail: 'incheonproperties@tofu.com',
        partnerName: 'Incheon Properties Ltd.',
        userEmail: 'han.miyoung@example.com',
        userName: '한미영',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-5),
        replies: [
          {
            id: 'reply-23-1',
            text: '감사합니다! 송도는 정말 좋은 지역이에요. 입주 후에도 편안하게 지내시길 바랍니다.',
            repliedBy: 'incheonproperties@tofu.com',
            repliedByName: 'Incheon Properties Ltd.',
            createdAt: getDateFromToday(-4)
          }
        ]
      },
      {
        id: 'review-24',
        rating: 5,
        comment: '송도 프리미엄 아파트 전세 계약했습니다. 담당자분이 정말 세심하게 도와주셔서 빠르게 계약할 수 있었어요. 완벽합니다!',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: '7',
        partnerEmail: 'incheonproperties@tofu.com',
        partnerName: 'Incheon Properties Ltd.',
        userEmail: 'yoon.taeho@example.com',
        userName: '윤태호',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-8)
      },
      {
        id: 'review-25',
        rating: 4,
        comment: '광주 북구 아파트 매매했습니다. 지역 정보를 잘 알려주셔서 좋았어요. 다만 계약서 작성이 조금 복잡했지만 전반적으로 만족합니다.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: '10',
        partnerEmail: 'gwangjuhomes@tofu.com',
        partnerName: 'Gwangju Homes Realty',
        userEmail: 'lim.seoyeon@example.com',
        userName: '임서연',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-9),
        replies: [
          {
            id: 'reply-25-1',
            text: '계약서 관련해서는 다음에는 더 자세히 설명드리겠습니다. 좋은 집에서 행복하게 사시길 바랍니다!',
            repliedBy: 'gwangjuhomes@tofu.com',
            repliedByName: 'Gwangju Homes Realty',
            createdAt: getDateFromToday(-8)
          }
        ]
      },
      {
        id: 'review-26',
        rating: 5,
        comment: '서구 투룸 전세 계약 완료! 담당자분이 정말 친절하시고, 원하는 조건의 매물을 빠르게 찾아주셨어요. 강력 추천합니다!',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: '11',
        partnerEmail: 'gwangjuhomes@tofu.com',
        partnerName: 'Gwangju Homes Realty',
        userEmail: 'cho.hyunwoo@example.com',
        userName: '조현우',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-10)
      },
      {
        id: 'review-27',
        rating: 5,
        comment: '강남구 논현동 빌라 매매 완료했습니다. 프리미엄 매물이라 신중하게 결정했는데, 담당자분이 정말 전문적으로 도와주셨어요.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: '13',
        partnerEmail: 'realestate@tofu.com',
        partnerName: 'Real Estate Partner',
        userEmail: 'oh.jihun@example.com',
        userName: '오지훈',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-12),
        replies: [
          {
            id: 'reply-27-1',
            text: '프리미엄 매물은 신중한 결정이 필요하죠. 좋은 선택이셨습니다. 입주 축하드립니다!',
            repliedBy: 'realestate@tofu.com',
            repliedByName: 'Real Estate Partner',
            createdAt: getDateFromToday(-11)
          }
        ]
      },
      {
        id: 'review-28',
        rating: 4,
        comment: '서초구 반포동 아파트 전세 계약했습니다. 좋은 매물이었고, 담당자분도 친절하셨어요. 다만 약속 시간에 조금 늦으셨지만 전반적으로 만족합니다.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: '14',
        partnerEmail: 'realestate@tofu.com',
        partnerName: 'Real Estate Partner',
        userEmail: 'shin.yuna@example.com',
        userName: '신유나',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-7)
      },
      {
        id: 'review-29',
        rating: 3,
        comment: '부평구 원룸을 찾았는데, 매물 정보가 실제와 조금 달랐어요. 그래도 담당자분이 성실하게 도와주셔서 다른 매물을 찾을 수 있었습니다.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: '8',
        partnerEmail: 'incheonproperties@tofu.com',
        partnerName: 'Incheon Properties Ltd.',
        userEmail: 'kang.jieun@example.com',
        userName: '강지은',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-13)
      },
      {
        id: 'review-30',
        rating: 5,
        comment: '남구 주택 매매 완료! 정원이 있는 집을 찾고 있었는데, 정말 마음에 드는 집을 찾았어요. 담당자분이 정말 친절하게 상담해주셨습니다.',
        entityType: 'REAL_ESTATE_LISTING',
        entityId: '12',
        partnerEmail: 'gwangjuhomes@tofu.com',
        partnerName: 'Gwangju Homes Realty',
        userEmail: 'bae.soobin@example.com',
        userName: '배수빈',
        status: 'ACTIVE',
        createdAt: getDateFromToday(-16),
        replies: [
          {
            id: 'reply-30-1',
            text: '정원이 있는 집에서 편안하게 지내시길 바랍니다. 좋은 집을 찾으셔서 다행이에요!',
            repliedBy: 'gwangjuhomes@tofu.com',
            repliedByName: 'Gwangju Homes Realty',
            createdAt: getDateFromToday(-15)
          }
        ]
      }
    ];

    safeWrite(STORAGE_KEY, mockReviews);
    return mockReviews;
  }
  return existing;
};

/**
 * Load all reviews
 * @returns {Array} Array of review objects
 */
export const loadReviews = () => {
  return initializeMockData();
};

/**
 * Add a new review
 * @param {Object} review - Review object
 * @returns {Array} Updated reviews array
 */
export const addReview = (review) => {
  const reviews = loadReviews();
  const newReview = {
    id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    ...review,
  };
  const nextReviews = [newReview, ...reviews];
  safeWrite(STORAGE_KEY, nextReviews);
  return nextReviews;
};

/**
 * Get reviews filtered by partner email
 * @param {string} email - Partner email
 * @returns {Array} Filtered reviews array
 */
export const getReviewsByPartner = (email) => {
  const reviews = loadReviews();
  return reviews.filter((review) => review.partnerEmail === email);
};

/**
 * Get all reviews (for admin)
 * @returns {Array} All reviews array
 */
export const getAllReviews = () => {
  return loadReviews();
};

/**
 * Update review status
 * @param {string} id - Review ID
 * @param {string} status - New status (ACTIVE, HIDDEN)
 * @returns {Array} Updated reviews array
 */
export const updateReviewStatus = (id, status) => {
  const reviews = loadReviews();
  const nextReviews = reviews.map((review) =>
    review.id === id ? { ...review, status, updatedAt: new Date().toISOString() } : review
  );
  safeWrite(STORAGE_KEY, nextReviews);
  return nextReviews;
};

/**
 * Get review by ID
 * @param {string} id - Review ID
 * @returns {Object|null} Review object or null
 */
export const getReviewById = (id) => {
  const reviews = loadReviews();
  return reviews.find((review) => review.id === id) || null;
};

/**
 * Add a reply to a review
 * @param {string} reviewId - Review ID
 * @param {string} replyText - Reply text
 * @param {string} repliedBy - Email of the person replying (partner email)
 * @param {string} repliedByName - Name of the person replying (partner name)
 * @returns {Array} Updated reviews array
 */
export const addReplyToReview = (reviewId, replyText, repliedBy, repliedByName) => {
  const reviews = loadReviews();
  const reply = {
    id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: replyText,
    repliedBy,
    repliedByName,
    createdAt: new Date().toISOString()
  };
  
  const nextReviews = reviews.map((review) =>
    review.id === reviewId
      ? {
          ...review,
          replies: [...(review.replies || []), reply],
          updatedAt: new Date().toISOString()
        }
      : review
  );
  
  safeWrite(STORAGE_KEY, nextReviews);
  return nextReviews;
};

/**
 * Update a reply
 * @param {string} reviewId - Review ID
 * @param {string} replyId - Reply ID
 * @param {string} replyText - Updated reply text
 * @returns {Array} Updated reviews array
 */
export const updateReply = (reviewId, replyId, replyText) => {
  const reviews = loadReviews();
  const nextReviews = reviews.map((review) => {
    if (review.id === reviewId) {
      return {
        ...review,
        replies: (review.replies || []).map((reply) =>
          reply.id === replyId
            ? { ...reply, text: replyText, updatedAt: new Date().toISOString() }
            : reply
        ),
        updatedAt: new Date().toISOString()
      };
    }
    return review;
  });
  
  safeWrite(STORAGE_KEY, nextReviews);
  return nextReviews;
};

/**
 * Delete a reply
 * @param {string} reviewId - Review ID
 * @param {string} replyId - Reply ID
 * @returns {Array} Updated reviews array
 */
export const deleteReply = (reviewId, replyId) => {
  const reviews = loadReviews();
  const nextReviews = reviews.map((review) => {
    if (review.id === reviewId) {
      return {
        ...review,
        replies: (review.replies || []).filter((reply) => reply.id !== replyId),
        updatedAt: new Date().toISOString()
      };
    }
    return review;
  });
  
  safeWrite(STORAGE_KEY, nextReviews);
  return nextReviews;
};


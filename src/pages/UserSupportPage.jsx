import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { createTicket } from '../store/supportTicketsStore';
import { userOrders } from '../mock/userOrders';
import { supportListings } from '../mock/realEstateData';

const issueTypes = ['Delivery', 'Real Estate', 'Account', 'Other'];

const UserSupportPage = () => {
  const { isAuthenticated, isUser, user } = useUnifiedAuth();
  const navigate = useNavigate();
  const [type, setType] = useState(issueTypes[0]);
  const [message, setMessage] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedListingId, setSelectedListingId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated || !isUser) {
    navigate('/login', { replace: true, state: { from: '/support' } });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const isDelivery = type === 'Delivery';
    const isRealEstate = type === 'Real Estate';
    if (!message.trim()) {
      setError('메시지를 입력해주세요.');
      return;
    }
    if (isDelivery && !selectedOrderId) {
      setError('관련 주문을 선택해주세요.');
      return;
    }
    if (isRealEstate && !selectedListingId) {
      setError('관련 매물을 선택해주세요.');
      return;
    }
    setError('');
    setSubmitting(true);

    const now = new Date().toISOString();
    let relatedEntityType = 'NONE';
    let relatedEntityId = null;
    let partnerId = null;
    let partnerName = null;
    let subject = '';

    if (isDelivery) {
      const order = userOrders.find((o) => o.id === selectedOrderId);
      if (order) {
        relatedEntityType = 'DELIVERY_ORDER';
        relatedEntityId = order.id;
        partnerId = order.partnerId || null;
        partnerName = order.partnerName || null;
        subject = `[Delivery] ${order.orderNo} issue`;
      }
    } else if (isRealEstate) {
      const listing = supportListings.find((l) => l.id === selectedListingId);
      if (listing) {
        relatedEntityType = 'REAL_ESTATE_LISTING';
        relatedEntityId = listing.id;
        partnerId = listing.partnerId || null;
        partnerName = listing.partnerName || null;
        subject = `[Real-Estate] Listing ${listing.id} issue`;
      }
    }

    const ticket = {
      id: `ticket-${Date.now()}`,
      createdBy: user?.email || 'unknown',
      role: 'USER',
      issueType: type === 'Real Estate' ? 'REAL_ESTATE' : type.toUpperCase(),
      relatedEntityType,
      relatedEntityId,
      partnerId,
      partnerName,
      subject,
      message,
      status: 'OPEN',
      createdAt: now,
      internalNotes: []
    };

    createTicket(ticket);
    navigate('/mypage/support', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">지원 / 문의</h1>
              <p className="text-gray-600 mt-1">문의하실 유형과 내용을 작성해주세요.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이슈 유형</label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setSelectedOrderId('');
                    setSelectedListingId('');
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                >
                  {issueTypes.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {type === 'Delivery' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">관련 주문 선택</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  >
                    <option value="">선택하세요</option>
                    {userOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.orderNo} / {order.pickup} → {order.destination} / {order.date}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {type === 'Real Estate' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">관련 매물 선택</label>
                  <select
                    value={selectedListingId}
                    onChange={(e) => setSelectedListingId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  >
                    <option value="">선택하세요</option>
                    {supportListings.map((listing) => (
                      <option key={listing.id} value={listing.id}>
                        {listing.title} / {listing.location} / {listing.price}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">메시지</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  placeholder="문의 내용을 입력해주세요."
                />
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 disabled:opacity-70"
                >
                  {submitting ? '제출 중...' : '제출'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserSupportPage;


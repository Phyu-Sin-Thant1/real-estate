import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { getTicketsByUser } from '../store/supportTicketsStore';

const MySupportTicketsPage = () => {
  const { isAuthenticated, isUser, user } = useUnifiedAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (user?.email) {
      setTickets(getTicketsByUser(user.email));
    }
  }, []);

  const myTickets = tickets;

  if (!isAuthenticated || !isUser) {
    navigate('/login', { replace: true, state: { from: '/mypage/support' } });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">내 지원 티켓</h1>
            <p className="text-gray-600 mt-1">관리자 응답은 상태로 확인할 수 있습니다.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이슈 유형</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관련</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">파트너</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myTickets.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-sm text-gray-500">
                      제출된 티켓이 없습니다. <button className="text-dabang-primary" onClick={() => navigate('/support')}>지원하기</button>
                    </td>
                  </tr>
                )}
                {myTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{ticket.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{ticket.issueType || 'OTHER'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ticket.relatedEntityType === 'DELIVERY_ORDER' && ticket.relatedEntityId && (
                        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                          배송: {ticket.relatedEntityId}
                        </span>
                      )}
                      {ticket.relatedEntityType === 'REAL_ESTATE_LISTING' && ticket.relatedEntityId && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          매물: {ticket.relatedEntityId}
                        </span>
                      )}
                      {(!ticket.relatedEntityType || ticket.relatedEntityType === 'NONE') && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          없음
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{ticket.partnerName || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MySupportTicketsPage;


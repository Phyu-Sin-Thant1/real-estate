import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { newsData } from "../mock/newsData";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import classnames from 'classnames';

const CommunityLandingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'news' || tabParam === 'chat' || tabParam === 'reviews' || tabParam === 'tips') {
      return tabParam;
    }
    return 'news';
  });

  // Update activeTab when URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'news' || tabParam === 'chat' || tabParam === 'reviews' || tabParam === 'tips') {
      setActiveTab(tabParam);
    } else {
      setActiveTab('news');
    }
  }, [searchParams]);

  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}일 전`;
    return `${Math.floor(diffInDays / 30)}달 전`;
  };

  // Tab configuration
  const tabs = [
    { key: 'news', label: '지역 뉴스' },
    { key: 'chat', label: '커뮤니티 채팅' },
    { key: 'reviews', label: '리뷰' },
    { key: 'tips', label: '로컬 팁' }
  ];

  // News Tab Content
  const NewsTab = () => (
    <div className="space-y-4">
      {newsData.map((news) => (
        <div
          key={news.id}
          onClick={() => navigate(`/news/${news.id}`)}
          className="flex items-start p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-dabang-primary/10 flex items-center justify-center mr-4 mt-1">
            <svg className="w-5 h-5 text-dabang-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 mb-1 hover:text-dabang-primary transition-colors truncate">
              {news.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
            <div className="flex items-center text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded mr-2">{news.category}</span>
              <span>{formatRelativeTime(news.createdAt)}</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-gray-400 ml-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );

  const ChatTab = () => (
    <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">커뮤니티 채팅</h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        이웃과 실시간으로 소통하고, 지역 정보를 공유하세요. 곧 출시될 커뮤니티 채팅 기능을 통해 더 활기찬 동네 생활을 경험해보세요.
      </p>
      <button
        onClick={() => navigate("/community/chat")}
        className="bg-dabang-primary hover:bg-dabang-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        채팅 둘러보기
      </button>
    </div>
  );

  const ReviewsTab = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">동네 리뷰</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="font-medium text-gray-900 mr-2">김OO</div>
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
            </div>
            <p className="text-gray-600">
              이 지역은 교통이 정말 편리하고, 주변 편의시설도 잘 갖춰져 있어서 생활하기에 좋아요. 특히 지하철역까지 도보로 5분이면 도착합니다.
            </p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button
          onClick={() => navigate("/community/reviews")}
          className="bg-dabang-primary hover:bg-dabang-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          리뷰 더 보기
        </button>
      </div>
    </div>
  );

  const TipsTab = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">로컬 팁</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">주말엔 이곳에서!</h3>
            <p className="text-gray-600">
              주말에 가볼 만한 숨은 명소를 소개합니다. 조용한 분위기와 맛있는 카페가 있는 이곳은 혼잡한 시내를 벗어나 힐링하기에 perfect합니다.
            </p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button
          onClick={() => navigate("/community/tips")}
          className="bg-dabang-primary hover:bg-dabang-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          로컬 팁 더 보기
        </button>
      </div>
    </div>
  );

  // Render active tab content
  let tabContent;
  switch (activeTab) {
    case 'news':
      tabContent = <NewsTab />;
      break;
    case 'chat':
      tabContent = <ChatTab />;
      break;
    case 'reviews':
      tabContent = <ReviewsTab />;
      break;
    case 'tips':
      tabContent = <TipsTab />;
      break;
    default:
      tabContent = <NewsTab />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-10">
          {/* Hero section */}
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-indigo-500 mb-2">커뮤니티</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">우리 동네 이야기</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              이웃과 함께하는 생활의 모든 이야기를 만나보세요. 지역 뉴스, 생활 팁, 리뷰까지 한곳에서 확인할 수 있습니다.
            </p>
          </div>

          {/* Tab bar */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2 rounded-full bg-gray-100 p-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabClick(tab.key)}
                  className={classnames(
                    "px-4 py-2 rounded-full text-sm font-medium transition",
                    activeTab === tab.key
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "bg-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content area */}
          <section className="mt-8 mx-auto max-w-5xl space-y-4">
            {tabContent}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityLandingPage;
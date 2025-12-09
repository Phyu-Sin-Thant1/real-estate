import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { newsData } from '../mock/newsData';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const NewsListPage = () => {
  const navigate = useNavigate();
  
  // Sort news by createdAt in descending order (newest first)
  const sortedNews = [...newsData].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Format date to relative time (hardcoded for mock data)
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">부동산 뉴스</h1>
            <button 
              onClick={() => navigate('/community?tab=news')}
              className="text-dabang-primary hover:text-dabang-primary/80 font-medium"
            >
              ← 커뮤니티로 돌아가기
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {sortedNews.map((news, index) => (
              <Link 
                key={news.id} 
                to={`/news/${news.id}`}
                className={`flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  index < sortedNews.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-dabang-primary/10 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-dabang-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                
                <div className="flex-grow min-w-0">
                  <h2 className="text-base font-medium text-gray-900 truncate">{news.title}</h2>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">{formatRelativeTime(news.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsListPage;
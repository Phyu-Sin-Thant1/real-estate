import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { newsData } from '../mock/newsData';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the news article by ID
  const newsArticle = newsData.find(article => article.id === id);
  
  // Get 3 random related articles (excluding the current one)
  const relatedArticles = [...newsData]
    .filter(article => article.id !== id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBackToNews = () => {
    // Navigate to community news tab
    navigate("/community?tab=news", { replace: false });
  };

  if (!newsArticle) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">존재하지 않는 뉴스입니다.</h1>
              <button 
                type="button"
                onClick={handleBackToNews}
                className="text-dabang-primary hover:underline"
              >
                ← 뉴스 목록으로
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button 
            type="button"
            onClick={handleBackToNews}
            className="inline-flex items-center text-dabang-primary hover:underline mb-6"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뉴스 목록으로
          </button>
          
          <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-dabang-primary/10 text-dabang-primary text-sm font-medium rounded-full">
                  {newsArticle.category}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(newsArticle.createdAt)}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                {newsArticle.title}
              </h1>
              
              <div className="prose max-w-none">
                {newsArticle.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
          
          {/* Related News Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">관련 뉴스</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {relatedArticles.map((article, index) => (
                  <div 
                    key={article.id} 
                    onClick={() => navigate(`/news/${article.id}`)}
                    className={`flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      index < relatedArticles.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-dabang-primary/10 flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-dabang-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="text-base font-medium text-gray-900 truncate">{article.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{article.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsDetailPage;
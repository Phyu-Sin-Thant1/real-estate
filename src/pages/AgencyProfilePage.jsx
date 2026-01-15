import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgencyById } from '../mock/agencies';
import { mockProperties } from '../mock/properties';
import { getServicesByAgency, deliveryServiceTypes } from '../mock/deliveryServices';
import { getBusinessAccounts } from '../store/businessAccountsStore';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ListingCard from '../components/home/ListingCard';
import Modal from '../components/common/Modal';
import VerifiedBadge from '../components/common/VerifiedBadge';

const AgencyProfilePage = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [agency, setAgency] = useState(null);
  const [listings, setListings] = useState([]);
  const [services, setServices] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    pickupAddress: '',
    deliveryAddress: '',
    serviceDate: '',
    message: ''
  });
  const [likedProperties, setLikedProperties] = useState(new Set());
  const [isVerified, setIsVerified] = useState(false);

  const agencyType = type || 'real-estate';

  useEffect(() => {
    const agencyData = getAgencyById(id, agencyType === 'real-estate' ? 'realEstate' : 'moving');
    
    if (!agencyData) {
      // Agency not found, could redirect or show error
      return;
    }
    
    setAgency(agencyData);
    
    // For delivery agencies, check verification status from business accounts
    if (agencyType === 'moving') {
      const businessAccounts = getBusinessAccounts();
      // Try to find matching business account by company name or email
      const matchingAccount = businessAccounts.find(
        acc => acc.role === 'BUSINESS_DELIVERY' && 
        (acc.companyName === agencyData.name || 
         acc.email?.toLowerCase().includes(agencyData.name.toLowerCase()) ||
         agencyData.name.toLowerCase().includes(acc.companyName?.toLowerCase()))
      );
      
      if (matchingAccount) {
        setIsVerified(matchingAccount.isVerified || false);
      } else {
        // Fallback to agency.verified if no business account match
        setIsVerified(agencyData.verified || false);
      }
    } else {
      // For real estate, use agency.verified
      setIsVerified(agencyData.verified || false);
    }
    
    // Get listings for this agency
    if (agencyType === 'real-estate') {
      const agencyListings = mockProperties.filter(prop => prop.agencyId === id);
      setListings(agencyListings);
    } else {
      // Get services for moving agency
      const agencyServices = getServicesByAgency(id);
      setServices(agencyServices);
      setListings([]);
    }
  }, [id, agencyType]);

  const handleToggleLike = (propertyId) => {
    setLikedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the contact form data
    alert('문의가 접수되었습니다. 담당자가 곧 연락드리겠습니다.');
    setIsContactModalOpen(false);
    setContactForm({ name: '', phone: '', email: '', message: '' });
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewAllListings = () => {
    // Navigate to category page with agency filter
    navigate(`/category/all?agency=${id}`);
  };

  const handleRequestService = (service) => {
    setSelectedService(service);
    setIsQuoteModalOpen(true);
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    alert('견적 요청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.');
    setIsQuoteModalOpen(false);
    setQuoteForm({
      name: '',
      phone: '',
      email: '',
      pickupAddress: '',
      deliveryAddress: '',
      serviceDate: '',
      message: ''
    });
  };

  const handleQuoteFormChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!agency) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agency not found</h2>
              <p className="text-gray-600 mb-6">죄송합니다. 해당 중개사를 찾을 수 없습니다.</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 font-medium transition-colors"
              >
                Back to home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button 
                  onClick={() => navigate('/')} 
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-dabang-primary"
                >
                  홈
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">중개사 프로필</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Agency Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Agency Logo */}
              <div className="flex-shrink-0">
                <img 
                  src={agency.logo} 
                  alt={agency.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                />
              </div>
              
              {/* Agency Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{agency.name}</h1>
                  {/* Show verified badge for delivery agencies */}
                  {agencyType === 'moving' && (
                    <VerifiedBadge isVerified={isVerified} size="md" />
                  )}
                  {/* Legacy verified badge for real estate (if needed) */}
                  {agencyType === 'real-estate' && agency.verified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      인증됨
                    </span>
                  )}
                </div>
                
                {agency.description && (
                  <p className="text-gray-600 mb-4">{agency.description}</p>
                )}
                
                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{agency.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{agency.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{agency.address}</span>
                  </div>
                </div>
              </div>
              
              {/* Contact Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-6 py-3 bg-dabang-primary hover:bg-dabang-primary/90 text-white rounded-lg font-medium transition-colors"
                >
                  문의하기
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          {agencyType === 'real-estate' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-dabang-primary mb-1">
                  {agency.totalListings || 0}
                </div>
                <div className="text-sm text-gray-600">총 매물</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {agency.activeListings || 0}
                </div>
                <div className="text-sm text-gray-600">노출중</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {agency.soldListings || 0}
                </div>
                <div className="text-sm text-gray-600">매매 완료</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {agency.rentedListings || 0}
                </div>
                <div className="text-sm text-gray-600">임대 완료</div>
              </div>
            </div>
          )}

          {/* Stats Section for Moving Agencies */}
          {agencyType === 'moving' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-dabang-primary mb-1">
                  {agency.totalServices || 0}
                </div>
                <div className="text-sm text-gray-600">총 서비스</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {agency.completedServices || 0}
                </div>
                <div className="text-sm text-gray-600">완료된 서비스</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {agency.activeServices || 0}
                </div>
                <div className="text-sm text-gray-600">진행중</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {agency.rating || 0}
                </div>
                <div className="text-sm text-gray-600">평균 평점</div>
              </div>
            </div>
          )}

          {/* Listings Section */}
          {agencyType === 'real-estate' && listings.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">매물 목록</h2>
                <button
                  onClick={handleViewAllListings}
                  className="text-dabang-primary hover:text-dabang-primary/80 font-medium"
                >
                  전체 보기 →
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.slice(0, 8).map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={{
                      ...listing,
                      image: listing.images?.[0] || listing.image,
                      address: listing.address || listing.location,
                      views: listing.views || 0
                    }}
                    isLiked={likedProperties.has(listing.id)}
                    onToggleLike={handleToggleLike}
                    onClick={() => navigate(`/property/${listing.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Services Section for Moving Agencies */}
          {agencyType === 'moving' && services.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Available Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => {
                  const serviceType = deliveryServiceTypes.find(st => st.id === service.serviceType);
                  return (
                    <div
                      key={service.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      {serviceType && (
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${serviceType.color} flex items-center justify-center text-2xl mb-4`}>
                          {serviceType.icon}
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                      <div className="text-2xl font-bold text-dabang-primary mb-2">{service.price}</div>
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{service.estimatedTime}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRequestService(service)}
                          className="flex-1 px-4 py-2 bg-dabang-primary hover:bg-dabang-primary/90 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          Get Quote
                        </button>
                        <button
                          onClick={() => navigate(`/service/${service.id}`)}
                          className="px-4 py-2 border border-dabang-primary text-dabang-primary rounded-lg hover:bg-dabang-primary/10 font-medium transition-colors text-sm"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {agencyType === 'real-estate' && listings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">등록된 매물이 없습니다</h3>
              <p className="text-gray-500">이 중개사는 아직 매물을 등록하지 않았습니다.</p>
            </div>
          )}

          {/* Empty State for Moving Agencies */}
          {agencyType === 'moving' && services.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">등록된 서비스가 없습니다</h3>
              <p className="text-gray-500">이 배송 업체는 아직 서비스를 등록하지 않았습니다.</p>
            </div>
          )}
        </div>
      </main>

      {/* Contact Modal */}
      <Modal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)}
        title="중개사 문의하기"
      >
        <form onSubmit={handleContactSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={contactForm.name}
                onChange={handleContactFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="이름을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={contactForm.phone}
                onChange={handleContactFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="연락처를 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={contactForm.email}
                onChange={handleContactFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="이메일을 입력하세요 (선택)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                문의 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleContactFormChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="문의 내용을 입력하세요"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsContactModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
            >
              제출
            </button>
          </div>
        </form>
      </Modal>

      {/* Quote Request Modal for Moving Agencies */}
      <Modal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)}
        title={selectedService ? `Request Quote: ${selectedService.name}` : 'Request Quote'}
      >
        <form onSubmit={handleQuoteSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={quoteForm.name}
                onChange={handleQuoteFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={quoteForm.phone}
                onChange={handleQuoteFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="Your phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={quoteForm.email}
                onChange={handleQuoteFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="Your email (optional)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pickupAddress"
                value={quoteForm.pickupAddress}
                onChange={handleQuoteFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="Pickup address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="deliveryAddress"
                value={quoteForm.deliveryAddress}
                onChange={handleQuoteFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="Delivery address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Service Date
              </label>
              <input
                type="date"
                name="serviceDate"
                value={quoteForm.serviceDate}
                onChange={handleQuoteFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="message"
                value={quoteForm.message}
                onChange={handleQuoteFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="Any additional information or special requirements"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
            >
              Request Quote
            </button>
          </div>
        </form>
      </Modal>
      
      <Footer />
    </div>
  );
};

export default AgencyProfilePage;


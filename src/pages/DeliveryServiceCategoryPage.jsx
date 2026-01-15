import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getServiceTypeById, getServicesByTypeAndAgency, deliveryServices, deliveryServiceTypes } from '../mock/deliveryServices';
import { getAllAgencies } from '../mock/agencies';
import { getAgencyVerificationStatus, getVerifiedAgencies } from '../lib/helpers/agencyVerification';
import VerifiedBadge from '../components/common/VerifiedBadge';
import Modal from '../components/common/Modal';

const DeliveryServiceCategoryPage = () => {
  const { serviceTypeId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedAgency, setSelectedAgency] = useState(searchParams.get('agency') || '');
  const [verifiedAgenciesOnly, setVerifiedAgenciesOnly] = useState(searchParams.get('verifiedOnly') === 'true');
  const [showAllServices, setShowAllServices] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    pickupAddress: '',
    deliveryAddress: '',
    serviceDate: '',
    message: ''
  });

  const serviceType = getServiceTypeById(serviceTypeId);
  const agencies = getAllAgencies('moving');
  const filteredAgencies = verifiedAgenciesOnly 
    ? getVerifiedAgencies(agencies)
    : agencies;

  // Get services - either all services or filtered by type
  const filteredServices = showAllServices 
    ? (selectedAgency ? deliveryServices.filter(s => s.agencyId === selectedAgency) : deliveryServices)
    : getServicesByTypeAndAgency(serviceTypeId, selectedAgency || undefined);
  
  const services = verifiedAgenciesOnly
    ? filteredServices.filter(s => {
        const agency = agencies.find(a => a.id === s.agencyId);
        return getAgencyVerificationStatus(agency);
      })
    : filteredServices;

  useEffect(() => {
    const agencyParam = searchParams.get('agency');
    if (agencyParam) {
      setSelectedAgency(agencyParam);
    }
    const verifiedParam = searchParams.get('verifiedOnly');
    if (verifiedParam === 'true') {
      setVerifiedAgenciesOnly(true);
    }
  }, [searchParams]);

  const handleAgencyChange = (agencyId) => {
    setSelectedAgency(agencyId);
    const params = new URLSearchParams(searchParams);
    if (agencyId) {
      params.set('agency', agencyId);
    } else {
      params.delete('agency');
    }
    setSearchParams(params);
  };

  const handleVerifiedToggle = (checked) => {
    setVerifiedAgenciesOnly(checked);
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set('verifiedOnly', 'true');
    } else {
      params.delete('verifiedOnly');
    }
    setSearchParams(params);
  };

  const handleRequestService = (service) => {
    setSelectedService(service);
    setIsQuoteModalOpen(true);
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the quote request
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

  if (!serviceType) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h2>
              <p className="text-gray-600 mb-6">죄송합니다. 해당 서비스를 찾을 수 없습니다.</p>
              <button
                onClick={() => navigate('/delivery-services')}
                className="px-6 py-3 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 font-medium transition-colors"
              >
                Back to services
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2 md:space-x-4">
              <li className="inline-flex items-center">
                <button 
                  onClick={() => navigate('/delivery-services')} 
                  className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-dabang-primary transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  배송 서비스
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-2 text-sm font-semibold text-gray-700 md:ml-3">{serviceType.name}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Premium Header Section */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-dabang-primary/5 via-transparent to-indigo-500/5 blur-3xl rounded-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <div className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${serviceType.color} flex items-center justify-center text-5xl shadow-2xl shadow-black/10`}>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
                  <span className="relative z-10 filter drop-shadow-lg">{serviceType.icon}</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                    {serviceType.name}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                    {serviceType.shortDescription}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Verified Partners</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Premium Service</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Agency Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-dabang-primary to-indigo-600 rounded-full"></div>
              Filter by Agency
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <select
                  value={selectedAgency}
                  onChange={(e) => handleAgencyChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent cursor-pointer w-full"
                >
                  <option value="">All Agencies</option>
                  {filteredAgencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name} {agency.verified && '✓'}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedAgenciesOnly}
                  onChange={(e) => handleVerifiedToggle(e.target.checked)}
                  className="w-4 h-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                />
                <span className="text-sm text-gray-700">Verified Agencies Only</span>
              </label>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {showAllServices ? 'All Delivery Services' : 'Available Services'}
                  {selectedAgency && (
                    <span className="text-base font-normal text-gray-600 ml-2">
                      ({agencies.find(a => a.id === selectedAgency)?.name})
                    </span>
                  )}
                </h2>
                {showAllServices && (
                  <p className="text-sm text-gray-500 mt-1">
                    Showing all services from all categories
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{services.length} services available</span>
                <button
                  onClick={() => setShowAllServices(!showAllServices)}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg ${
                    showAllServices
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                      : 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white hover:from-dabang-primary/90 hover:to-indigo-600/90 shadow-dabang-primary/30 hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {showAllServices ? 'Show Category Only' : 'Show All Services'}
                </button>
              </div>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No services found</h3>
                <p className="text-gray-500">Try selecting a different agency or service type.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const agency = agencies.find(a => a.id === service.agencyId);
                  const serviceTypeInfo = deliveryServiceTypes.find(st => st.id === service.serviceType);
                  return (
                    <div
                      key={service.id}
                      className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
                      onClick={() => navigate(`/service/${service.id}`)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Premium Background Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${serviceTypeInfo?.color || 'from-blue-400 to-blue-600'} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {showAllServices && serviceTypeInfo && (
                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r ${serviceTypeInfo.color} text-white shadow-lg`}>
                                  {serviceTypeInfo.name}
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-dabang-primary transition-colors duration-300 leading-tight">
                              {service.name}
                            </h3>
                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="text-3xl font-extrabold bg-gradient-to-r from-dabang-primary to-indigo-600 bg-clip-text text-transparent">
                                {service.price}
                              </span>
                            </div>
                          </div>
                          {agency && (
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <img 
                                  src={agency.logo} 
                                  alt={agency.name}
                                  className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200 shadow-md group-hover:border-dabang-primary transition-colors duration-300"
                                />
                                <div className="absolute -top-1 -right-1">
                                  <VerifiedBadge 
                                    isVerified={getAgencyVerificationStatus(agency)} 
                                    size="sm" 
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-2">{service.description}</p>
                        
                        {/* Premium Service Limits Summary */}
                        {service.limitations && (
                          <div className="mb-5 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-xl shadow-sm">
                            <div className="flex items-start gap-2 mb-2">
                              <svg className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-yellow-900 mb-1">Service Limits:</p>
                                <div className="text-xs text-yellow-800 space-y-0.5">
                                  {service.limitations.maxFloors && (
                                    <p>• Up to {service.limitations.maxFloors} floors</p>
                                  )}
                                  {service.limitations.maxWeight && (
                                    <p>• Up to {service.limitations.maxWeight}kg</p>
                                  )}
                                  {service.limitations.maxDistance && service.limitations.maxDistance > 0 && (
                                    <p>• Within {service.limitations.maxDistance}km</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-amber-900 mb-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{service.estimatedTime}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {service.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="px-3 py-1.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg text-xs font-medium shadow-sm border border-gray-200">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-3 mb-3">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/checkout/${service.id}`);
                              }}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-300 text-sm shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-105 relative z-10"
                            >
                              Buy Now
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/service/${service.id}?action=request`);
                              }}
                              className="flex-1 px-4 py-2.5 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 rounded-xl font-semibold transition-all duration-300 text-sm hover:scale-105 relative z-10"
                            >
                              Request Service
                            </button>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/service/${service.id}`);
                            }}
                            className="w-full px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 font-medium transition-all duration-300 text-sm group"
                          >
                            <span className="flex items-center justify-center gap-2">
                              View Details
                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </button>
                        </div>
                        
                        {/* Decorative Corner */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${serviceTypeInfo?.color || 'from-blue-400 to-blue-600'} opacity-0 group-hover:opacity-5 rounded-bl-full transition-opacity duration-500`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quote Request Modal */}
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

export default DeliveryServiceCategoryPage;


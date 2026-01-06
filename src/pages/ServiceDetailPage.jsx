import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getServiceById, deliveryServiceTypes } from '../mock/deliveryServices';
import { getAgencyById } from '../mock/agencies';
import Modal from '../components/common/Modal';
import Tooltip from '../components/common/Tooltip';
import { createQuoteRequest } from '../store/quoteRequestsStore';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [agency, setAgency] = useState(null);
  const [serviceType, setServiceType] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isExtraOptionsModalOpen, setIsExtraOptionsModalOpen] = useState(false);
  const [isLimitationsExpanded, setIsLimitationsExpanded] = useState(false);
  const [extraOptions, setExtraOptions] = useState({
    extraFloors: 0,
    largeItems: 0,
    itemWeight: '', // Weight/volume of items exceeding limit
    fragileHandling: 0,
    additionalRequests: ''
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

  useEffect(() => {
    const serviceData = getServiceById(serviceId);
    
    if (!serviceData) {
      return;
    }
    
    setService(serviceData);
    
    // Get agency information
    if (serviceData.agencyId) {
      const agencyData = getAgencyById(serviceData.agencyId, 'moving');
      setAgency(agencyData);
    }
    
    // Get service type information
    if (serviceData.serviceType) {
      const typeData = deliveryServiceTypes.find(st => st.id === serviceData.serviceType);
      setServiceType(typeData);
    }

    // Set limitations collapsed by default (especially on mobile)
    const isMobile = window.innerWidth < 768;
    setIsLimitationsExpanded(false); // Always start collapsed, user can expand
    
    // Check if user came from "Request Service" button
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'request') {
      setIsExtraOptionsModalOpen(true);
    }
  }, [serviceId]);

  const handleQuoteFormChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    
    // Calculate total price
    const totalPrice = calculateTotalPrice();
    
    // Format extra options text
    const extraOptionsText = Object.entries(extraOptions)
      .filter(([key, value]) => {
        if (key === 'additionalRequests' || key === 'itemWeight') {
          return value && value.toString().trim().length > 0;
        }
        return value > 0;
      })
      .map(([key, value]) => {
        if (key === 'additionalRequests') {
          return `Additional Requests: ${value}`;
        }
        if (key === 'itemWeight') {
          return `Item Weight/Volume: ${value}`;
        }
        const option = service.extraOptions?.[key];
        return option ? `${option.label}: ${value} ${option.unit}` : '';
      })
      .filter(Boolean)
      .join('\n');
    
    const message = extraOptionsText 
      ? `Additional Options:\n${extraOptionsText}\n\n${quoteForm.message || ''}`
      : quoteForm.message;
    
    // Create quote request
    const quoteRequest = createQuoteRequest({
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.serviceType,
      agencyId: service.agencyId,
      agencyName: agency?.name || 'Unknown Agency',
      
      // Customer information
      customerName: quoteForm.name,
      customerPhone: quoteForm.phone,
      customerEmail: quoteForm.email,
      
      // Service details
      pickupAddress: quoteForm.pickupAddress,
      deliveryAddress: quoteForm.deliveryAddress,
      preferredDate: quoteForm.serviceDate,
      customerMessage: message,
      
      // Pricing
      basePrice: service.minPrice,
      totalPrice: totalPrice,
      priceBreakdown: {
        basePrice: service.minPrice,
        extraFloors: extraOptions.extraFloors > 0 
          ? extraOptions.extraFloors * (service.extraOptions?.extraFloors?.price || 0)
          : 0,
        largeItems: extraOptions.largeItems > 0
          ? extraOptions.largeItems * (service.extraOptions?.largeItems?.price || 0)
          : 0,
        fragileHandling: extraOptions.fragileHandling > 0
          ? extraOptions.fragileHandling * (service.extraOptions?.fragileHandling?.price || 0)
          : 0
      },
      
      // Extra options details
      extraOptions: {
        extraFloors: extraOptions.extraFloors,
        largeItems: extraOptions.largeItems,
        itemWeight: extraOptions.itemWeight,
        fragileHandling: extraOptions.fragileHandling,
        additionalRequests: extraOptions.additionalRequests
      },
      
      // Service limitations
      serviceLimitations: service.limitations || null
    });
    
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
    setExtraOptions({
      extraFloors: 0,
      largeItems: 0,
      itemWeight: '',
      fragileHandling: 0,
      additionalRequests: ''
    });
  };

  const calculateTotalPrice = () => {
    if (!service || !service.extraOptions) return service?.minPrice || 0;
    
    let total = service.minPrice;
    if (service.extraOptions.extraFloors) {
      total += extraOptions.extraFloors * service.extraOptions.extraFloors.price;
    }
    if (service.extraOptions.largeItems) {
      total += extraOptions.largeItems * service.extraOptions.largeItems.price;
    }
    if (service.extraOptions.fragileHandling) {
      total += extraOptions.fragileHandling * service.extraOptions.fragileHandling.price;
    }
    return total;
  };

  const formatPrice = (price) => {
    if (price >= 10000) {
      return `₩${(price / 10000).toFixed(0)}만`;
    }
    return `₩${price.toLocaleString()}`;
  };

  const handleExtraOptionChange = (optionKey, value) => {
    setExtraOptions(prev => ({
      ...prev,
      [optionKey]: optionKey === 'itemWeight' || optionKey === 'additionalRequests' 
        ? value 
        : Math.max(0, parseInt(value) || 0)
    }));
  };

  const hasExtraOptions = () => {
    return Object.entries(extraOptions).some(([key, value]) => {
      if (key === 'additionalRequests' || key === 'itemWeight') {
        return value && value.toString().trim().length > 0;
      }
      return value > 0;
    });
  };

  const getTotalPriceDisplay = () => {
    const total = calculateTotalPrice();
    if (hasExtraOptions()) {
      return `${formatPrice(total)} (기본 ${service.price} + 추가 옵션)`;
    }
    return service.price;
  };

  if (!service) {
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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button 
                  onClick={() => navigate('/delivery-services')} 
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-dabang-primary"
                >
                  배송 서비스
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  {serviceType && (
                    <button 
                      onClick={() => navigate(`/delivery-services/${service.serviceType}`)} 
                      className="ml-1 text-sm font-medium text-gray-700 hover:text-dabang-primary md:ml-2"
                    >
                      {serviceType.name}
                    </button>
                  )}
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{service.name}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Service Detail Header Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
            {/* Service Name */}
            <div className="flex items-start gap-4 mb-6">
              {serviceType && (
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${serviceType.color} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
                  {serviceType.icon}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{service.name}</h1>
                
                {/* Agency Information */}
                {agency && (
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={agency.logo} 
                      alt={agency.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Provided by</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/agency/moving/${agency.id}`)}
                          className="text-base font-semibold text-gray-900 hover:text-dabang-primary transition-colors"
                        >
                          {agency.name}
                        </button>
                        {agency.verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Starting from</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-dabang-primary">{getTotalPriceDisplay()}</p>
                {hasExtraOptions() && (
                  <button
                    onClick={() => setIsExtraOptionsModalOpen(true)}
                    className="text-sm text-dabang-primary hover:text-dabang-primary/80 underline"
                  >
                    수정
                  </button>
                )}
              </div>
              {hasExtraOptions() && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-900 font-medium">추가 옵션이 포함된 최종 가격입니다</p>
                </div>
              )}
            </div>

            {/* Service Description */}
            <div className="mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">{service.description}</p>
            </div>

            {/* Service Limitations Section */}
            {service.limitations && (
              <div className="mb-6">
                <button
                  onClick={() => setIsLimitationsExpanded(!isLimitationsExpanded)}
                  className="w-full flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors touch-manipulation"
                  aria-expanded={isLimitationsExpanded}
                  aria-label="Toggle service limitations details"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <svg className="w-5 h-5 text-yellow-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-semibold text-yellow-900 text-sm md:text-base">Service Limitations</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-yellow-700 transition-transform flex-shrink-0 ${isLimitationsExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isLimitationsExpanded && (
                  <div className="mt-3 p-4 md:p-5 bg-yellow-50 border border-yellow-200 rounded-lg transition-all duration-300 ease-in-out">
                    <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">{service.limitations.description}</p>
                    <div className="space-y-3 text-sm text-gray-600">
                      {service.limitations.maxFloors && (
                        <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <svg className="w-5 h-5 text-yellow-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="truncate">Maximum Floors: <strong className="text-gray-900">{service.limitations.maxFloors} floors</strong></span>
                          </div>
                          <Tooltip 
                            content="Extra floors are counted when moving items to or from floors beyond the included limit. Each additional floor incurs a fee of ₩20,000 per floor."
                            position="top"
                          >
                            <button 
                              className="text-yellow-700 hover:text-yellow-900 p-1.5 rounded-full hover:bg-yellow-100 transition-colors flex-shrink-0 touch-manipulation"
                              aria-label="What counts as extra floors?"
                            >
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      )}
                      {service.limitations.maxWeight && (
                        <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <svg className="w-5 h-5 text-yellow-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span className="truncate">Maximum Weight: <strong className="text-gray-900">{service.limitations.maxWeight}kg</strong></span>
                          </div>
                          <Tooltip 
                            content="This weight limit applies to the total weight of all items. Items exceeding this limit are considered 'large items' and incur additional fees of ₩30,000 per item."
                            position="top"
                          >
                            <button 
                              className="text-yellow-700 hover:text-yellow-900 p-1.5 rounded-full hover:bg-yellow-100 transition-colors flex-shrink-0 touch-manipulation"
                              aria-label="What counts as exceeding weight limit?"
                            >
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      )}
                      {service.limitations.maxDistance && (
                        <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <svg className="w-5 h-5 text-yellow-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">Maximum Distance: <strong className="text-gray-900">{service.limitations.maxDistance}km</strong> <span className="text-gray-500 text-xs">(local service)</span></span>
                          </div>
                          <Tooltip 
                            content="This service covers local deliveries within the specified distance. Longer distances may require a different service package or additional fees."
                            position="top"
                          >
                            <button 
                              className="text-yellow-700 hover:text-yellow-900 p-1.5 rounded-full hover:bg-yellow-100 transition-colors flex-shrink-0 touch-manipulation"
                              aria-label="What is the distance limit?"
                            >
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    <p className="mt-4 text-sm md:text-base text-yellow-800 font-medium bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                      ⚠️ Additional floors or items exceeding these limits will incur extra fees.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Add Extra Options Button */}
            {service.extraOptions && (
              <div className="mb-6">
                <button
                  onClick={() => setIsExtraOptionsModalOpen(true)}
                  className="w-full px-6 py-3.5 border-2 border-dashed border-dabang-primary text-dabang-primary rounded-lg font-medium hover:bg-dabang-primary/10 transition-all hover:border-solid hover:shadow-md flex items-center justify-center gap-2 touch-manipulation text-sm md:text-base"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-center">Add extra options or requirements (e.g., more floors, larger items)</span>
                  {hasExtraOptions() && (
                    <span className="ml-2 px-2.5 py-1 bg-dabang-primary text-white rounded-full text-xs font-semibold whitespace-nowrap">
                      {Object.entries(extraOptions).filter(([k, v]) => 
                        k === 'additionalRequests' || k === 'itemWeight' 
                          ? v && v.toString().trim().length > 0 
                          : v > 0
                      ).length} added
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Service Timeline */}
            <div className="flex items-center gap-2 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">Estimated Service Time</p>
                <p className="text-base font-semibold text-blue-700">{service.estimatedTime}</p>
              </div>
            </div>

            {/* Service Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Features</h3>
              <div className="flex flex-wrap gap-3">
                {service.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-dabang-primary/10 to-indigo-50 border border-dabang-primary/20 text-dabang-primary rounded-full text-sm font-medium hover:from-dabang-primary/20 hover:to-indigo-100 transition-colors cursor-pointer"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              {hasExtraOptions() && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-900">Total Price (with extra options):</span>
                    <span className="text-2xl font-bold text-green-700">{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(`/checkout/${service.id}`)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-300 text-base shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-105"
                >
                  Buy Now {hasExtraOptions() && `(${formatPrice(calculateTotalPrice())})`}
                </button>
                <button
                  onClick={() => setIsExtraOptionsModalOpen(true)}
                  className="flex-1 px-6 py-3 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 rounded-xl font-semibold transition-all duration-300 text-base hover:scale-105"
                >
                  Request Service
                </button>
                {agency && (
                  <button
                    onClick={() => navigate(`/agency/moving/${agency.id}`)}
                    className="px-6 py-3 border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-300 text-base"
                  >
                    View Agency
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
            <div className="space-y-3">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Agency Contact Section */}
          {agency && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About {agency.name}</h2>
              {agency.description && (
                <p className="text-gray-700 mb-4">{agency.description}</p>
              )}
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
                {agency.rating && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{agency.rating}</span>
                    <span>({agency.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Extra Options Modal */}
      <Modal 
        isOpen={isExtraOptionsModalOpen} 
        onClose={() => setIsExtraOptionsModalOpen(false)}
        title="Add Extra Options"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Add additional requirements that exceed the standard service package limits.
          </p>

          {/* Extra Options Form */}
          {service.extraOptions && (
            <div className="space-y-4">
              {/* Extra Floors */}
              {service.extraOptions.extraFloors && (
                <div className="p-4 border border-gray-200 rounded-lg bg-orange-50/30">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {service.extraOptions.extraFloors.label}
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex-1 w-full">
                      <input
                        type="number"
                        min="0"
                        value={extraOptions.extraFloors}
                        onChange={(e) => handleExtraOptionChange('extraFloors', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary text-base touch-manipulation"
                        placeholder="0"
                      />
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      {service.extraOptions.extraFloors.unit}
                    </div>
                    {extraOptions.extraFloors > 0 && (
                      <div className="text-sm font-semibold text-dabang-primary whitespace-nowrap">
                        +{formatPrice(extraOptions.extraFloors * service.extraOptions.extraFloors.price)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Standard service includes up to {service.limitations?.maxFloors || 3} floors. Additional floors: {formatPrice(service.extraOptions.extraFloors.price)} per floor.
                  </p>
                </div>
              )}

              {/* Large Items */}
              {service.extraOptions.largeItems && (
                <div className="p-4 border border-gray-200 rounded-lg bg-blue-50/30">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {service.extraOptions.largeItems.label}
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex-1 w-full">
                      <input
                        type="number"
                        min="0"
                        value={extraOptions.largeItems}
                        onChange={(e) => handleExtraOptionChange('largeItems', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary text-base touch-manipulation"
                        placeholder="0"
                      />
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      {service.extraOptions.largeItems.unit}
                    </div>
                    {extraOptions.largeItems > 0 && (
                      <div className="text-sm font-semibold text-dabang-primary whitespace-nowrap">
                        +{formatPrice(extraOptions.largeItems * service.extraOptions.largeItems.price)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Items exceeding {service.limitations?.maxWeight || 500}kg
                  </p>
                </div>
              )}

              {/* Weight/Volume of Items */}
              {service.limitations?.maxWeight && (
                <div className="p-4 border border-gray-200 rounded-lg bg-green-50/30">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight/Volume of Items
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={extraOptions.itemWeight}
                          onChange={(e) => handleExtraOptionChange('itemWeight', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary text-base touch-manipulation"
                          placeholder="Enter weight (kg) or volume (m³)"
                        />
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        kg or m³
                      </div>
                    </div>
                    {extraOptions.itemWeight && extraOptions.itemWeight.trim().length > 0 && (
                      <div className="p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-xs text-blue-900">
                          <strong>Note:</strong> Items exceeding {service.limitations.maxWeight}kg will be charged as large items ({formatPrice(service.extraOptions?.largeItems?.price || 30000)} per item).
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the total weight or volume of items that exceed the standard limit of {service.limitations.maxWeight}kg
                  </p>
                </div>
              )}

              {/* Fragile Handling */}
              {service.extraOptions.fragileHandling && (
                <div className="p-4 border border-gray-200 rounded-lg bg-purple-50/30">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {service.extraOptions.fragileHandling.label}
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex-1 w-full">
                      <input
                        type="number"
                        min="0"
                        value={extraOptions.fragileHandling}
                        onChange={(e) => handleExtraOptionChange('fragileHandling', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary text-base touch-manipulation"
                        placeholder="0"
                      />
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      {service.extraOptions.fragileHandling.unit}
                    </div>
                    {extraOptions.fragileHandling > 0 && (
                      <div className="text-sm font-semibold text-dabang-primary whitespace-nowrap">
                        +{formatPrice(extraOptions.fragileHandling * service.extraOptions.fragileHandling.price)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Special handling for fragile items (glass, artwork, electronics). Price: {formatPrice(service.extraOptions.fragileHandling.price)} per item.
                  </p>
                </div>
              )}

              {/* Additional Requests / Custom Requirements */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requests or Special Requirements
                </label>
                <textarea
                  rows={4}
                  value={extraOptions.additionalRequests}
                  onChange={(e) => setExtraOptions(prev => ({
                    ...prev,
                    additionalRequests: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary resize-none"
                  placeholder="Enter any special requests, fragile items, packing requirements, or other custom needs..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Describe any special handling requirements or custom requests
                </p>
              </div>
            </div>
          )}

          {/* Real-Time Price Summary */}
          <div className="p-4 md:p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-dabang-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Price Calculator
            </h3>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Base Price:</span>
                <span className="text-sm font-medium text-gray-900">{service.price}</span>
              </div>
              {hasExtraOptions() && (
                <>
                  {Object.entries(extraOptions).map(([key, value]) => {
                    if (key === 'additionalRequests' || key === 'itemWeight') {
                      if (key === 'itemWeight' && value && value.toString().trim().length > 0) {
                        return (
                          <div key={key} className="flex justify-between items-center text-xs text-gray-500 italic">
                            <span>Weight/Volume info:</span>
                            <span>{value}</span>
                          </div>
                        );
                      }
                      return null;
                    }
                    if (value === 0 || !service.extraOptions?.[key]) return null;
                    const option = service.extraOptions[key];
                    return (
                      <div key={key} className="flex justify-between items-center transition-all duration-200">
                        <span className="text-sm text-gray-600">
                          {option.label} (×{value}):
                        </span>
                        <span className="text-sm font-semibold text-dabang-primary">
                          +{formatPrice(value * option.price)}
                        </span>
                      </div>
                    );
                  })}
                  {extraOptions.additionalRequests && extraOptions.additionalRequests.trim().length > 0 && (
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs text-blue-900 font-medium">✓ Custom requests included</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="border-t-2 border-gray-300 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold text-gray-900">Total Price:</span>
                <span className={`text-xl md:text-2xl font-bold transition-all duration-300 ${
                  hasExtraOptions() ? 'text-dabang-primary scale-105' : 'text-gray-900'
                }`}>
                  {formatPrice(calculateTotalPrice())}
                </span>
              </div>
              {hasExtraOptions() && (
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formatPrice(service.minPrice)} + 추가 옵션
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setExtraOptions({
                  extraFloors: 0,
                  largeItems: 0,
                  itemWeight: '',
                  fragileHandling: 0,
                  additionalRequests: ''
                });
              }}
              className="px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 touch-manipulation"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => setIsExtraOptionsModalOpen(false)}
              className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 shadow-md hover:shadow-lg transition-all touch-manipulation"
            >
              Apply Options {hasExtraOptions() && `(${formatPrice(calculateTotalPrice())})`}
            </button>
          </div>
        </div>
      </Modal>

      {/* Quote Request Modal */}
      <Modal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)}
        title={`Request Quote: ${service.name}`}
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

export default ServiceDetailPage;


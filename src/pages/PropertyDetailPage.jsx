import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, getSimilarProperties } from '../mock/properties';
import { getAgencyById } from '../mock/agencies';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { useReservations } from '../context/ReservationsContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BannerSlotV2 from '../components/banners/BannerSlotV2';
import { useFavorites } from '../hooks/useFavorites';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Modal from '../components/common/Modal';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper function to load inquiries from localStorage
const loadInquiriesFromStorage = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('tofu_inquiries_v1');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to parse inquiries from localStorage', error);
    return [];
  }
};

// Helper function to save inquiries to localStorage
const saveInquiriesToStorage = (inquiries) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tofu_inquiries_v1', JSON.stringify(inquiries));
  } catch (error) {
    console.warn('Failed to save inquiries to localStorage', error);
  }
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUnifiedAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addReservation } = useReservations();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [agency, setAgency] = useState(null);
  const [isContactAgencyModalOpen, setIsContactAgencyModalOpen] = useState(false);
  const [contactAgencyForm, setContactAgencyForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });  
  // Reservation form state
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    visitDate: '',
    timeSlot: '',
    visitors: '',
    memo: ''
  });
  
  // Inquiry form state
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    message: ''
  });

  useEffect(() => {
    // Get property by ID
    const propertyData = getPropertyById(id)
    
    // Check if property is available (노출중)
    if (propertyData && propertyData.status !== '노출중') {
      // Redirect to home page if property is not available
      navigate('/')
      return
    }
    
    // Handle case where property is not found
    if (!propertyData) {
      setProperty(null);
      setSimilarProperties([]);
      return;
    }
    
    // Set property with safe defaults for missing fields
    const propertyWithDefaults = {
      ...propertyData,
      images: Array.isArray(propertyData.images) ? propertyData.images : [],
      amenities: Array.isArray(propertyData.amenities) ? propertyData.amenities : [],
      agent: propertyData.agent || { name: '', phone: '', email: '' }
    };
    
    setProperty(propertyWithDefaults);
    
    // Get agency information if agencyId exists
    if (propertyData.agencyId) {
      const agencyData = getAgencyById(propertyData.agencyId, 'realEstate');
      setAgency(agencyData);
    }
    
    // Get similar properties
    const similar = getSimilarProperties(propertyData.id, 4);
    setSimilarProperties(Array.isArray(similar) ? similar : []);
    
    // Set first image as active if images exist
    setActiveImageIndex(0);
    
    // Set map loaded state
    setMapLoaded(true);
  }, [id, navigate]);

  const handleContactAgent = () => {
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login')
      return
    }
    // Open inquiry modal instead of showing alert
    setIsInquiryModalOpen(true);
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login')
      return
    }
    toggleFavorite(property.id)
  }

  const handleShare = () => {
    // In a real app, this would trigger native sharing functionality
    navigator.clipboard.writeText(window.location.href)
    alert('링크가 복사되었습니다.')
  }

  const handleImageClick = (index) => {
    setActiveImageIndex(index)
  }

  // 방문 예약 handlers
  const handleOpenReservationModal = () => {
    setIsReservationModalOpen(true);
  };

  const handleCloseReservationModal = () => {
    setIsReservationModalOpen(false);
    // Reset form
    setReservationForm({
      name: user?.name || '',
      phone: '',
      email: user?.email || '',
      visitDate: '',
      timeSlot: '',
      visitors: '',
      memo: ''
    });
  };

  const handleReservationFormChange = (e) => {
    const { name, value } = e.target;
    setReservationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!reservationForm.name || !reservationForm.phone || !reservationForm.visitDate || 
        !reservationForm.timeSlot || !reservationForm.visitors) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    // Create reservation using the context
    const reservationData = {
      appointmentDate: reservationForm.visitDate,
      appointmentTime: reservationForm.timeSlot,
      customerName: reservationForm.name,
      customerPhone: reservationForm.phone,
      customerEmail: reservationForm.email,
      listingId: property.id,
      listingTitle: property.title,
      listingAddress: `${property.region1} ${property.region2} ${property.region3}`,
      requestMessage: reservationForm.memo,
    };
    
    addReservation(reservationData);
    
    // Show success message
    alert('방문 예약 요청이 접수되었습니다.');
    
    // Close modal
    handleCloseReservationModal();
  };
  
  // Inquiry form handlers
  const handleCloseInquiryModal = () => {
    setIsInquiryModalOpen(false);
    // Reset form
    setInquiryForm({
      name: user?.name || '',
      phone: '',
      email: user?.email || '',
      message: ''
    });
  };
  
  const handleInquiryFormChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!inquiryForm.name || !inquiryForm.phone || !inquiryForm.message) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    // Create inquiry object
    const inquiryData = {
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: inquiryForm.name,
      phone: inquiryForm.phone,
      email: inquiryForm.email,
      message: inquiryForm.message,
      propertyId: property.id,
      propertyTitle: property.title
    };
    
    // Save to localStorage
    const currentInquiries = loadInquiriesFromStorage();
    saveInquiriesToStorage([...currentInquiries, inquiryData]);
    
    // Close inquiry modal and show success modal
    handleCloseInquiryModal();
    setIsSuccessModalOpen(true);
  };
  
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const handleContactAgencySubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the contact form data
    alert('문의가 접수되었습니다. 담당자가 곧 연락드리겠습니다.');
    setIsContactAgencyModalOpen(false);
    setContactAgencyForm({ name: '', phone: '', email: '', message: '' });
  };

  const handleContactAgencyFormChange = (e) => {
    const { name, value } = e.target;
    setContactAgencyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgencyNameClick = () => {
    if (agency) {
      navigate(`/agency/real-estate/${agency.id}`);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
              <p className="text-gray-600 mb-6">죄송합니다. 해당 매물을 찾을 수 없습니다.</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 font-medium transition-colors"
              >
                Back to list
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
                  <button 
                    onClick={() => navigate(-1)} 
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-dabang-primary md:ml-2"
                  >
                    목록으로
                  </button>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">매물 상세</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details - Left Column */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative">
                  <img 
                    src={property.images[activeImageIndex]} 
                    alt={property.title}
                    className="w-full h-96 object-cover"
                  />
                  <button 
                    onClick={handleToggleFavorite}
                    className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                  >
                    <svg 
                      className={`w-6 h-6 ${isFavorite(property.id) ? 'text-red-500' : 'text-gray-600'}`} 
                      fill={isFavorite(property.id) ? 'currentColor' : 'none'} 
                      stroke='currentColor' 
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                    </svg>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="absolute top-4 right-20 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
                
                {/* Thumbnail Images */}
                <div className="flex p-4 space-x-4 overflow-x-auto">
                  {(Array.isArray(property.images) ? property.images : []).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 ${activeImageIndex === index ? 'border-dabang-primary' : 'border-gray-200'}`}
                    >
                      <img 
                        src={image} 
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Property Info */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.region1} {property.region2} {property.region3}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-dabang-primary">{property.price}</div>
                    <div className="text-sm text-gray-500">{property.dealType}</div>
                  </div>
                </div>
                
                {/* Listed by Agency Section */}
                {agency && (
                  <div className="py-4 border-t border-b border-gray-200 my-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Agency Logo */}
                        <div className="flex-shrink-0">
                          <img 
                            src={agency.logo} 
                            alt={agency.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                        </div>
                        
                        {/* Agency Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={handleAgencyNameClick}
                              className="text-lg font-bold text-gray-900 hover:text-dabang-primary transition-colors cursor-pointer"
                            >
                              {agency.name}
                            </button>
                            {agency.verified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                인증됨
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">등록 중개사</p>
                        </div>
                      </div>
                      
                      {/* Contact Agency Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => setIsContactAgencyModalOpen(true)}
                          className="px-4 py-2 bg-dabang-primary hover:bg-dabang-primary/90 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          중개사 문의
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200 my-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">면적</div>
                    <div className="font-medium">{property.area}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">층수</div>
                    <div className="font-medium">{property.floor}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">방/욕실</div>
                    <div className="font-medium">{property.rooms}방 {property.bathrooms}욕</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">관리비</div>
                    <div className="font-medium">{property.maintenance}</div>
                  </div>
                </div>
                
                <div className="py-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">상세 설명</h3>
                  <p className="text-gray-700">{property.description}</p>
                </div>
                
                <div className="py-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">편의시설</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(property.amenities) ? property.amenities : []).map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Map */}
              {mapLoaded && property.latitude && property.longitude && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">위치</h2>
                  <div className="h-80 rounded-lg overflow-hidden">
                    <MapContainer 
                      center={[property.latitude, property.longitude]} 
                      zoom={15} 
                      style={{ height: '100%', width: '100%' }}
                      zoomControl={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[property.latitude, property.longitude]}>
                        <Popup>
                          {property.title}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              )}
            </div>
            
            {/* Agent Info - Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Sidebar Banner */}
              <BannerSlotV2 pageScope="PROPERTY_DETAIL" slot="SIDEBAR" domain="REAL_ESTATE" />
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-dabang-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl text-dabang-primary font-bold">
                      {(property.agent && property.agent.name) ? property.agent.name.charAt(0) : '?'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{(property.agent && property.agent.name) || 'Unknown Agent'}</h3>
                  <p className="text-gray-600 text-sm">전문 중개사</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{(property.agent && property.agent.phone) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{(property.agent && property.agent.email) || 'N/A'}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleContactAgent}
                  className="w-full bg-dabang-primary hover:bg-dabang-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-3"
                >
                  문의하기
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-50">
                    카톡 상담
                  </button>
                  <button 
                    onClick={handleOpenReservationModal}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-50"
                  >
                    방문 예약
                  </button>
                </div>
              </div>

              {/* Similar Properties */}
              {similarProperties.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">비슷한 매물</h2>
                  <div className="space-y-4">
                    {similarProperties.slice(0, 3).map((similarProperty) => (
                      // Only show similar properties that are 노출중
                      similarProperty.status === '노출중' && (
                        <div 
                          key={similarProperty.id}
                          onClick={() => navigate(`/property/${similarProperty.id}`)}
                          className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-dabang-primary cursor-pointer transition-colors"
                        >
                          <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                            <img 
                              src={(Array.isArray(similarProperty.images) && similarProperty.images[0]) || 'https://via.placeholder.com/150'} 
                              alt={similarProperty.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{similarProperty.title}</h3>
                            <p className="text-dabang-primary font-medium text-sm mt-1">{similarProperty.price}</p>
                            <p className="text-gray-500 text-xs mt-1">{similarProperty.area} · {similarProperty.dealType}</p>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Page Bottom Banner */}
          <div className="mt-8">
            <BannerSlotV2 pageScope="PROPERTY_DETAIL" slot="PAGE_BOTTOM" domain="REAL_ESTATE" />
          </div>
        </div>
      </main>
      
      {/* 방문 예약 Modal */}
      {isReservationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">방문 예약</h3>
                <button 
                  onClick={handleCloseReservationModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleReservationSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={reservationForm.name}
                      onChange={handleReservationFormChange}
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
                      value={reservationForm.phone}
                      onChange={handleReservationFormChange}
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
                      value={reservationForm.email}
                      onChange={handleReservationFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      placeholder="이메일을 입력하세요 (선택)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      희망 방문일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="visitDate"
                      value={reservationForm.visitDate}
                      onChange={handleReservationFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      희망 시간대 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="timeSlot"
                      value={reservationForm.timeSlot}
                      onChange={handleReservationFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    >
                      <option value="">시간대를 선택하세요</option>
                      <option value="오전">오전</option>
                      <option value="오후">오후</option>
                      <option value="저녁">저녁</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      방문 인원 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="visitors"
                      value={reservationForm.visitors}
                      onChange={handleReservationFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    >
                      <option value="">인원을 선택하세요</option>
                      <option value="1">1명</option>
                      <option value="2">2명</option>
                      <option value="3">3명</option>
                      <option value="4">4명</option>
                      <option value="5">5명 이상</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      메모
                    </label>
                    <textarea
                      name="memo"
                      value={reservationForm.memo}
                      onChange={handleReservationFormChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      placeholder="요청사항이나 추가 메모를 입력하세요"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseReservationModal}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
                  >
                    예약하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Inquiry Modal */}
      <Modal 
        isOpen={isInquiryModalOpen} 
        onClose={handleCloseInquiryModal}
        title="문의하기"
      >
        <form onSubmit={handleInquirySubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={inquiryForm.name}
                onChange={handleInquiryFormChange}
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
                value={inquiryForm.phone}
                onChange={handleInquiryFormChange}
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
                value={inquiryForm.email}
                onChange={handleInquiryFormChange}
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
                value={inquiryForm.message}
                onChange={handleInquiryFormChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="문의 내용을 입력하세요"
              />
            </div>
            
            {/* Hidden fields for property info */}
            <input type="hidden" name="propertyId" value={property.id} />
            <input type="hidden" name="propertyTitle" value={property.title} />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleCloseInquiryModal}
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
      
      {/* Success Modal */}
      <Modal 
        isOpen={isSuccessModalOpen} 
        onClose={handleCloseSuccessModal}
        title="문의 완료"
      >
        <div className="text-center py-4">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-gray-700 mb-6">
            문의가 접수되었습니다. 담당자가 곧 연락드리겠습니다.
          </p>
          <button
            onClick={handleCloseSuccessModal}
            className="px-6 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 font-medium"
          >
            확인
          </button>
        </div>
      </Modal>
      
      {/* Contact Agency Modal */}
      <Modal 
        isOpen={isContactAgencyModalOpen} 
        onClose={() => setIsContactAgencyModalOpen(false)}
        title="중개사 문의하기"
      >
        <form onSubmit={handleContactAgencySubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={contactAgencyForm.name}
                onChange={handleContactAgencyFormChange}
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
                value={contactAgencyForm.phone}
                onChange={handleContactAgencyFormChange}
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
                value={contactAgencyForm.email}
                onChange={handleContactAgencyFormChange}
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
                value={contactAgencyForm.message}
                onChange={handleContactAgencyFormChange}
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
              onClick={() => setIsContactAgencyModalOpen(false)}
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
      
      <Footer />
    </div>
  )
}

export default PropertyDetailPage
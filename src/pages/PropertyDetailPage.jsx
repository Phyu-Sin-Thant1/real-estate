import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useUnifiedAuth } from '../context/UnifiedAuthContext'
import { getPropertyById, getSimilarProperties } from '../mock/properties'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useFavorites } from '../hooks/useFavorites'
import InquiryModal from '../features/inquiry/InquiryModal'

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const PropertyDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useUnifiedAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [property, setProperty] = useState(null)
  const [similarProperties, setSimilarProperties] = useState([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isInquiryOpen, setInquiryOpen] = useState(false)

  useEffect(() => {
    // Get property by ID
    const propertyData = getPropertyById(id)
    
    // Check if property is available (노출중)
    if (propertyData && propertyData.status !== '노출중') {
      // Redirect to home page if property is not available
      navigate('/')
      return
    }
    
    setProperty(propertyData)
    
    // Get similar properties
    const similar = getSimilarProperties(propertyData.id, 4)
    setSimilarProperties(similar)
    
    // Set first image as active
    setActiveImageIndex(0)
    
    // Set map loaded state
    setMapLoaded(true)
  }, [id, navigate])

  const handleContactAgent = () => {
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login')
      return
    }
    // Open inquiry modal instead of showing alert
    setInquiryOpen(true)
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

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dabang-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">매물 정보를 불러오는 중...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
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
                  {property.images.map((image, index) => (
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

              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.address}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {property.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {property.dealType}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-end mb-2">
                    <span className="text-3xl font-bold text-dabang-primary">{property.price}</span>
                    {property.originalPrice && (
                      <span className="ml-3 text-lg text-gray-500 line-through">{property.originalPrice}</span>
                    )}
                    {property.discount && (
                      <span className="ml-3 px-2 py-1 bg-red-100 text-red-600 rounded text-sm font-medium">
                        {property.discount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Info Grid */}
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">면적</p>
                      <p className="font-medium">{property.area}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">방/욕실</p>
                      <p className="font-medium">{property.rooms}개/{property.bathrooms}개</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">층수</p>
                      <p className="font-medium">{property.floor}층</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">방향</p>
                      <p className="font-medium">{property.direction}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">준공년도</p>
                      <p className="font-medium">{property.builtYear}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">거래유형</p>
                      <p className="font-medium">{property.dealType}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Description */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">상세 설명</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Options & Facilities */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">옵션 & 시설</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">옵션</h3>
                    <ul className="space-y-2">
                      {property.options.map((option, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">주변 편의시설</h3>
                    <ul className="space-y-2">
                      {property.facilities.map((facility, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{facility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">위치</h2>
                <div className="h-80 rounded-lg overflow-hidden">
                  {mapLoaded && (
                    <MapContainer 
                      center={property.coordinates} 
                      zoom={15} 
                      style={{ height: '100%', width: '100%' }}
                      className="rounded-lg"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={property.coordinates}>
                        <Popup>
                          {property.title}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Agent Info - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">담당 공인중개사</h2>
                
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-dabang-primary/10 flex items-center justify-center mr-4">
                    <span className="text-xl text-dabang-primary font-bold">
                      {property.agent.name?.[0]?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{property.agent.name}</h3>
                    <p className="text-gray-600 text-sm">{property.agent.company}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{property.agent.email}</span>
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
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-50">
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
                              src={similarProperty.images[0]} 
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
        </div>
      </main>
      
      {/* Inquiry Modal */}
      <InquiryModal 
        isOpen={isInquiryOpen}
        onClose={() => setInquiryOpen(false)}
        listing={property ? {
          id: property.id,
          title: property.title,
          address: property.address
        } : null}
      />
      
      <Footer />
    </div>
  )
}

export default PropertyDetailPage
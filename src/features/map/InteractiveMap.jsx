// Enhanced Interactive Map Component - Korean Portal Style
import React, { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom Korean Portal Price Marker
const createPriceMarker = (property) => {
  const priceText = property.price
  
  // Korean Portal Color Scheme
  const getAccentColor = (type) => {
    switch(type) {
      case '월세': return '#00BCD4' // Soft Teal for Monthly Rent
      case '전세': 
      case '매매': return '#1A237E' // Deep Royal Blue for Jeonse/Sale
      default: return '#FF6F00' // Vibrant Orange for special listings
    }
  }
  
  const accentColor = getAccentColor(property.type)
  
  const htmlContent = `
    <div class="korean-price-marker" style="
      background-color: ${accentColor};
      color: white;
      font-weight: 700;
      padding: 8px 12px;
      border-radius: 20px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      font-size: 14px;
      font-family: 'Pretendard', system-ui, -apple-system, sans-serif;
      border: 2px solid white;
      text-align: center;
      min-width: 60px;
    ">
      ${priceText}
    </div>
  `
  
  return L.divIcon({
    className: 'custom-price-marker',
    html: htmlContent,
    iconSize: [80, 36],
    iconAnchor: [40, 36],
    popupAnchor: [0, -36]
  })
}

// Map event handler component with error handling
const MapEventHandler = ({ onMapMove, onZoomChange }) => {
  const map = useMapEvents({
    moveend: () => {
      try {
        const center = map.getCenter()
        const zoom = map.getZoom()
        const bounds = map.getBounds()
        onMapMove && onMapMove({ center, zoom, bounds })
      } catch (error) {
        console.warn('Map move event error:', error)
      }
    },
    zoomend: () => {
      try {
        const zoom = map.getZoom()
        onZoomChange && onZoomChange(zoom)
      } catch (error) {
        console.warn('Map zoom event error:', error)
      }
    }
  })
  
  return null
}

// Zoom control component
const ZoomControls = ({ onZoomIn, onZoomOut }) => {
  const map = useMap()
  
  useEffect(() => {
    // Remove default zoom control safely
    if (map && map.zoomControl) {
      try {
        map.zoomControl.remove()
      } catch (error) {
        console.warn('Zoom control already removed or not available:', error)
      }
    }
  }, [map])
  
  return null
}

const InteractiveMap = ({ 
  center = [37.5665, 126.9780], // Seoul coordinates
  zoom = 13,
  properties = [],
  onMapMove,
  onZoomChange,
  onPropertyClick,
  className = ""
}) => {
  const mapRef = useRef()

  const handleZoomIn = () => {
    if (mapRef.current) {
      try {
        const currentZoom = mapRef.current.getZoom()
        mapRef.current.setZoom(Math.min(currentZoom + 1, 18))
      } catch (error) {
        console.warn('Zoom in error:', error)
      }
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      try {
        const currentZoom = mapRef.current.getZoom()
        mapRef.current.setZoom(Math.max(currentZoom - 1, 3))
      } catch (error) {
        console.warn('Zoom out error:', error)
      }
    }
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        ref={mapRef}
        zoomControl={false}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance
        }}
      >
        {/* Premium CARTO Positron Tile Layer - Korean Portal Aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
          minZoom={1}
          subdomains="abcd"
        />
        
        {/* Korean Portal Style Property Markers with Premium Styling */}
        {properties && properties.length > 0 && properties.map((property) => {
          if (!property.id || !property.coordinates || !Array.isArray(property.coordinates)) {
            return null
          }
          
          return (
            <Marker
              key={property.id}
              position={property.coordinates}
              icon={createPriceMarker(property)}
              eventHandlers={{
                click: () => {
                  onPropertyClick && onPropertyClick(property)
                }
              }}
            >
              <Popup className="korean-portal-popup">
                <div className="p-4 min-w-[280px] max-w-[320px]">
                  {/* Property Image */}
                  {property.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Title and Type Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 text-base leading-tight flex-1 pr-2">
                      {property.title || 'Property'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      property.type === '월세' ? 'bg-teal-100 text-teal-700' :
                      property.type === '전세' ? 'bg-blue-100 text-blue-700' :
                      property.type === '매매' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {property.type || 'Type'}
                    </span>
                  </div>
                  
                  {/* Prominent Price Display */}
                  <div className="mb-3">
                    <span className="text-2xl font-bold" style={{ 
                      color: property.type === '월세' ? '#00BCD4' : '#1A237E' 
                    }}>
                      {property.price || 'Price not available'}
                    </span>
                  </div>
                  
                  {/* Location with Korean Styling */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    📍 {property.location || 'Location not available'}
                  </p>
                  
                  {/* Property Details Grid */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">📏</span>
                        <span className="text-gray-600">{property.size || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🚪</span>
                        <span className="text-gray-600">{property.rooms || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🏢</span>
                        <span className="text-gray-600">{property.floor || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">💰</span>
                        <span className="text-green-600 font-medium text-xs">
                          {property.maintenance || '관리비 정보 없음'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Korean Portal CTA Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm">
                    자세히 보기
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
        
        <MapEventHandler onMapMove={onMapMove} onZoomChange={onZoomChange} />
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </MapContainer>
    </div>
  )
}

export default InteractiveMap
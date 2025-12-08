export const getRegionName = (coordinates) => {
  if (!coordinates || coordinates.length !== 2) {
    return '지역 정보 없음';
  }
  
  const [lat, lng] = coordinates;
  
  // This is a simplified implementation
  // In a real application, you would use a geocoding service
  // or a local database of regions and their boundaries
  
  // Rough bounding boxes for Seoul districts (simplified)
  const seoulRegions = {
    '강남구': { minLat: 37.48, maxLat: 37.52, minLng: 127.02, maxLng: 127.08 },
    '서초구': { minLat: 37.46, maxLat: 37.50, minLng: 126.98, maxLng: 127.03 },
    '용산구': { minLat: 37.52, maxLat: 37.56, minLng: 126.95, maxLng: 127.01 },
    '마포구': { minLat: 37.54, maxLat: 37.58, minLng: 126.89, maxLng: 126.95 },
    '송파구': { minLat: 37.49, maxLat: 37.53, minLng: 127.08, maxLng: 127.14 },
    '영등포구': { minLat: 37.50, maxLat: 37.54, minLng: 126.88, maxLng: 126.94 },
    '종로구': { minLat: 37.56, maxLat: 37.60, minLng: 126.97, maxLng: 127.03 },
    '중구': { minLat: 37.54, maxLat: 37.58, minLng: 126.97, maxLng: 127.03 },
    '성동구': { minLat: 37.54, maxLat: 37.58, minLng: 127.03, maxLng: 127.09 }
  };
  
  for (const [region, bounds] of Object.entries(seoulRegions)) {
    if (lat >= bounds.minLat && lat <= bounds.maxLat &&
        lng >= bounds.minLng && lng <= bounds.maxLng) {
      return region;
    }
  }
  
  return '서울특별시';
};
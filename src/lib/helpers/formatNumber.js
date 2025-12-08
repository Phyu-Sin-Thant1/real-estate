export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatArea = (areaInPyong) => {
  if (!areaInPyong) return '정보 없음';
  
  // Convert pyong to square meters (1 pyong ≈ 3.3058 sqm)
  const squareMeters = areaInPyong * 3.3058;
  
  return `${areaInPyong}평 (${squareMeters.toFixed(1)}㎡)`;
};
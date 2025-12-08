export const MAP_STYLES = {
  CARTO_POSITRON: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    minZoom: 1,
    subdomains: 'abcd'
  },
  
  CARTO_DARK_MATTER: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetMap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    minZoom: 1,
    subdomains: 'abcd'
  },
  
  OPEN_STREET_MAP: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 1,
    subdomains: 'abc'
  }
};

export const MARKER_COLORS = {
  MONTHLY: '#00BCD4', // Soft Teal
  JEONSE: '#1A237E',  // Deep Royal Blue
  SALE: '#1A237E',    // Deep Royal Blue
  DEFAULT: '#FF6F00'  // Vibrant Orange
};

export const MAP_ZOOM_LEVELS = {
  CITY: 10,
  DISTRICT: 13,
  NEIGHBORHOOD: 15,
  STREET: 17,
  BUILDING: 19
};
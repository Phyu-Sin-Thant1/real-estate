import React from 'react';
import { useMap } from 'react-leaflet';

const ZoomControls = ({ onZoomIn, onZoomOut }) => {
  const map = useMap();
  
  // Remove default zoom control safely
  React.useEffect(() => {
    if (map && map.zoomControl) {
      try {
        map.zoomControl.remove();
      } catch (error) {
        console.warn('Zoom control already removed or not available:', error);
      }
    }
  }, [map]);
  
  return null;
};

export default ZoomControls;
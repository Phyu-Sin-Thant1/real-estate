import React from 'react';
import { useMapEvents } from 'react-leaflet';

const MapEventHandler = ({ onMapMove, onZoomChange }) => {
  const map = useMapEvents({
    moveend: () => {
      try {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        onMapMove && onMapMove({ center, zoom, bounds });
      } catch (error) {
        console.warn('Map move event error:', error);
      }
    },
    zoomend: () => {
      try {
        const zoom = map.getZoom();
        onZoomChange && onZoomChange(zoom);
      } catch (error) {
        console.warn('Map zoom event error:', error);
      }
    }
  });
  
  return null;
};

export default MapEventHandler;
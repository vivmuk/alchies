import React, { useEffect, useRef } from 'react';
import { getGoogleMapsApiUrl } from '../utils/maps';

interface MapDisplayProps {
  address: string;
  latitude?: number;
  longitude?: number;
  title?: string;
  height?: string;
  zoom?: number;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  address,
  latitude,
  longitude,
  title,
  height = '200px',
  zoom = 15,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  
  useEffect(() => {
    if (!address && (!latitude || !longitude)) return;
    
    // Load Google Maps API if not already loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = getGoogleMapsApiUrl();
      script.async = true;
      script.defer = true;
      
      script.onload = () => initializeMap();
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, [address, latitude, longitude]);
  
  const initializeMap = () => {
    if (!mapRef.current) return;
    
    const createMap = (center: { lat: number; lng: number }) => {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      
      // Add marker
      new window.google.maps.Marker({
        position: center,
        map: googleMapRef.current,
        title: title || address
      });
    };
    
    try {
      // If we have coordinates, use them directly
      if (latitude && longitude) {
        createMap({ lat: latitude, lng: longitude });
      } else {
        // Otherwise, geocode the address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            createMap({ lat: location.lat(), lng: location.lng() });
          } else {
            console.error('Geocode was not successful:', status);
          }
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };
  
  // Function to open Google Maps directions
  const openGoogleMapsDirections = () => {
    let url = 'https://www.google.com/maps/dir/?api=1';
    
    if (latitude && longitude) {
      url += `&destination=${latitude},${longitude}`;
    } else {
      url += `&destination=${encodeURIComponent(address)}`;
    }
    
    window.open(url, '_blank');
  };
  
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} style={{ height, width: '100%' }}></div>
      <div className="absolute bottom-2 right-2">
        <button 
          onClick={openGoogleMapsDirections}
          className="bg-white text-primary hover:bg-gray-100 p-2 rounded-full shadow-md flex items-center justify-center"
          aria-label="Get directions"
          title="Get directions"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapDisplay; 
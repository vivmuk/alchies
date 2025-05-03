import React, { useState, useEffect, useRef } from 'react';
import { getGoogleMapsApiUrl } from '../utils/maps';

interface LocationSearchProps {
  initialValue?: string;
  onLocationSelect: (locationData: LocationData) => void;
  placeholder?: string;
}

export interface LocationData {
  address: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  initialValue = '', 
  onLocationSelect,
  placeholder = 'Enter a location' 
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  
  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeAutocomplete();
    } else {
      // Load Google Maps API if not already loaded
      const script = document.createElement('script');
      script.src = getGoogleMapsApiUrl(['places']);
      script.async = true;
      script.defer = true;
      
      script.onload = () => initializeAutocomplete();
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);
  
  const initializeAutocomplete = () => {
    if (!inputRef.current) return;
    
    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment', 'geocode'],
        fields: ['place_id', 'formatted_address', 'name', 'geometry']
      });
      
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  };
  
  const handlePlaceSelect = () => {
    try {
      const place = autocompleteRef.current.getPlace();
      
      if (!place.geometry) {
        console.log('No details available for input: ' + place.name);
        return;
      }
      
      const locationData: LocationData = {
        address: place.formatted_address || place.name,
        placeId: place.place_id,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng()
      };
      
      setInputValue(locationData.address);
      onLocationSelect(locationData);
    } catch (error) {
      console.error('Error selecting place:', error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        className="w-full rounded-lg pl-10 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default LocationSearch; 
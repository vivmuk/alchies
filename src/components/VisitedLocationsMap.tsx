import React, { useEffect, useRef, useState } from 'react';
import { Event } from '../features/events/eventsSlice';
import { getGoogleMapsApiUrl } from '../utils/maps';

interface VisitedLocationsMapProps {
  events: Event[];
  height?: string;
  onEventSelect?: (eventId: string) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

interface MapLocation {
  id: string;
  title: string;
  location: string;
  date: string;
  position: {
    lat: number;
    lng: number;
  };
}

const VisitedLocationsMap: React.FC<VisitedLocationsMapProps> = ({
  events,
  height = '400px',
  onEventSelect,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Process events to get map locations
  useEffect(() => {
    const getLocations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Filter out events without location details
        const eventsWithLocation = events.filter(event => 
          event.locationDetails?.latitude && event.locationDetails?.longitude
        );
        
        // Get geocoded locations for events that don't have coordinates
        const eventsNeedingGeocoding = events.filter(event => 
          event.location && 
          (!event.locationDetails?.latitude || !event.locationDetails?.longitude)
        );
        
        let geocodedLocations: MapLocation[] = [];
        
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          
          // Geocode locations (limit to 5 at a time to avoid rate limits)
          const batch = eventsNeedingGeocoding.slice(0, 5);
          
          const geocodePromises = batch.map(event => 
            new Promise<MapLocation | null>((resolve) => {
              geocoder.geocode({ address: event.location }, (results: any, status: any) => {
                if (status === 'OK' && results[0]) {
                  const location = results[0].geometry.location;
                  resolve({
                    id: event.id,
                    title: event.title,
                    location: event.location,
                    date: event.date,
                    position: {
                      lat: location.lat(),
                      lng: location.lng()
                    }
                  });
                } else {
                  console.warn(`Geocoding failed for "${event.location}": ${status}`);
                  resolve(null);
                }
              });
            })
          );
          
          const results = await Promise.all(geocodePromises);
          geocodedLocations = results.filter(Boolean) as MapLocation[];
        }
        
        // Combine events with coordinates and geocoded events
        const locations: MapLocation[] = [
          ...eventsWithLocation.map(event => ({
            id: event.id,
            title: event.title,
            location: event.location,
            date: event.date,
            position: {
              lat: event.locationDetails!.latitude!,
              lng: event.locationDetails!.longitude!
            }
          })),
          ...geocodedLocations
        ];
        
        setMapLocations(locations);
      } catch (err) {
        console.error('Error processing map locations:', err);
        setError('Failed to load map locations');
      } finally {
        setIsLoading(false);
      }
    };
    
    getLocations();
  }, [events]);
  
  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || mapLocations.length === 0) return;
    
    const loadMap = async () => {
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
    };
    
    loadMap();
  }, [mapLocations]);
  
  const initializeMap = () => {
    if (!mapRef.current || mapLocations.length === 0) return;
    
    try {
      // Create map centered on the average of all locations
      const bounds = new window.google.maps.LatLngBounds();
      mapLocations.forEach(location => {
        bounds.extend(location.position);
      });
      
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 3,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      
      // Add markers
      mapLocations.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: location.position,
          map: googleMapRef.current,
          title: location.title,
          animation: window.google.maps.Animation.DROP
        });
        
        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${location.title}</h3>
              <p class="text-sm">${location.location}</p>
              <p class="text-xs text-gray-500">${new Date(location.date).toLocaleDateString()}</p>
              ${onEventSelect ? '<button class="view-event-btn mt-2 text-sm text-blue-600">View Event</button>' : ''}
            </div>
          `
        });
        
        // Add click listener to marker
        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, marker);
        });
        
        // Add click listener to View Event button
        if (onEventSelect) {
          window.google.maps.event.addListener(infoWindow, 'domready', () => {
            document.querySelector('.view-event-btn')?.addEventListener('click', () => {
              onEventSelect(location.id);
            });
          });
        }
      });
      
      // Fit map to bounds
      googleMapRef.current.fitBounds(bounds);
      
      // Adjust zoom if there's only one location
      if (mapLocations.length === 1) {
        googleMapRef.current.setZoom(14);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map');
    }
  };
  
  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300" style={{ height }}>
          <p>{error}</p>
        </div>
      )}
      
      {!isLoading && !error && mapLocations.length === 0 && (
        <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300" style={{ height }}>
          <p>No locations found</p>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        style={{ height, display: isLoading || error || mapLocations.length === 0 ? 'none' : 'block' }}
      ></div>
    </div>
  );
};

export default VisitedLocationsMap; 
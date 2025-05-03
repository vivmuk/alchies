/**
 * Maps API utilities
 */

// Use the environment variable if available, otherwise fall back to the hardcoded key
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyD1XDKVAkOQnPV81UwIyg0-buEObK12vuY';

export const getGoogleMapsApiUrl = (libraries: string[] = []): string => {
  const librariesParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
  return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}${librariesParam}`;
}; 
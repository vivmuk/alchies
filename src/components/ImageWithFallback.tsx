import React, { useState, useEffect } from 'react';

// Default fallback images if the primary image fails to load
const fallbackImages = [
  'https://images.unsplash.com/photo-1523837157348-ffbdaccfc7de?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&h=600&fit=crop&q=80'
];

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  
  // Choose a random fallback image if none is provided
  const defaultFallback = fallbackSrc || 
    fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  
  // Reset error state and preload image when src changes
  useEffect(() => {
    if (!src) {
      setError(true);
      setCurrentSrc(defaultFallback);
      return;
    }
    
    setError(false);
    setLoaded(false);
    setCurrentSrc(src);
    
    // Preload the image
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setLoaded(true);
    };
    
    img.onerror = () => {
      console.log(`Image preload error for: ${src}`);
      setError(true);
      setCurrentSrc(defaultFallback);
      
      // Preload fallback image
      const fallbackImg = new Image();
      fallbackImg.src = defaultFallback;
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, defaultFallback]);
  
  // Handle image load errors
  const handleError = () => {
    console.log(`Image load error for: ${currentSrc}`);
    if (!error) {
      setError(true);
      setCurrentSrc(defaultFallback);
    }
  };
  
  // Handle image load success
  const handleLoad = () => {
    setLoaded(true);
  };
  
  // Show a loading state if the image is still loading
  const showLoadingState = !loaded && !error;
  
  return (
    <div className={`relative ${className}`}>
      {showLoadingState && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
      )}
      <img
        src={error ? defaultFallback : currentSrc}
        alt={alt}
        className={`w-full h-full object-cover ${showLoadingState ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default ImageWithFallback; 
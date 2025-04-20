import React, { useState } from 'react';

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
  
  // Choose a random fallback image if none is provided
  const defaultFallback = fallbackSrc || 
    fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  
  // Use the fallback if there was an error or no source was provided
  const imageSrc = (!src || error) ? defaultFallback : src;
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default ImageWithFallback; 
import React, { useEffect, useRef, useState } from 'react';
import { getOptimalImageFormat } from '@/lib/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean; // For critical images
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const format = getOptimalImageFormat();
    
    // Generate optimized image URL based on format
    const optimizedSrc = src.replace(/\.(png|jpg|jpeg)$/i, `.${format}`);
    
    if (priority) {
      // Preload critical images
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedSrc;
      
      if (format === 'webp') {
        link.type = 'image/webp';
      } else if (format === 'avif') {
        link.type = 'image/avif';
      } else {
        link.type = 'image/png';
      }
      
      document.head.appendChild(link);
    }
    
    setImageSrc(optimizedSrc);
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // Fallback to original image if optimized format fails
    setImageSrc(src);
  };

  if (priority) {
    return (
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="eager"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

export default OptimizedImage;

/**
 * Performance optimization utilities and Web Vitals monitoring
 */

// Web Vitals monitoring
export interface WebVitals {
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  inp: number; // Interaction to Next Paint
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

// Image format support detection
export const supportedFormats = {
  webp: (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })(),
  avif: (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  })()
};

// Get optimal image format
export const getOptimalImageFormat = (): 'webp' | 'avif' | 'png' => {
  if (supportedFormats.avif) return 'avif';
  if (supportedFormats.webp) return 'webp';
  return 'png';
};

// Lazy loading observer
export const createLazyLoader = () => {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  return imageObserver;
};

// Web Vitals measurement
export const measureWebVitals = (): void => {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      const lcp = lastEntry.startTime;
      console.log('[Web Vitals] LCP:', lcp);
      
      // Track LCP event
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'web_vitals', {
          custom_map: {
            dimension1: 'LCP'
          },
          value: Math.round(lcp)
        });
      }
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    console.log('[Web Vitals] CLS:', clsValue);
    
    // Track CLS event
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'web_vitals', {
        custom_map: {
          dimension2: 'CLS'
        },
        value: Math.round(clsValue * 1000)
      });
    }
  }).observe({ entryTypes: ['layout-shift'] });

  // Interaction to Next Paint (INP)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.entryType === 'first-input') {
        const inp = (entry as any).processingStart - entry.startTime;
        console.log('[Web Vitals] INP:', inp);
        
        // Track INP event
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'web_vitals', {
            custom_map: {
              dimension3: 'INP'
            },
            value: Math.round(inp)
          });
        }
      }
    }
  }).observe({ entryTypes: ['first-input'] });
};

// Performance optimizations
export const optimizeImages = (): void => {
  const images = document.querySelectorAll('img[data-src]');
  const lazyLoader = createLazyLoader();
  
  images.forEach(img => {
    lazyLoader.observe(img);
  });
};

// Preload critical resources
export const preloadCriticalResources = (): void => {
  const criticalResources = [
    '/futur-explore/fonts/inter-var.woff2',
    '/futur-explore/images/hero-illustration.webp'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.woff2')) {
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
    } else if (resource.endsWith('.webp')) {
      link.as = 'image';
      link.type = 'image/webp';
    }
    
    document.head.appendChild(link);
  });
};

// Initialize performance optimizations
export const initPerformanceOptimizations = (): void => {
  // Measure Web Vitals
  if (import.meta.env.PROD) {
    measureWebVitals();
  }

  // Optimize images
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeImages);
  } else {
    optimizeImages();
  }

  // Preload critical resources
  preloadCriticalResources();

  console.log('[Performance] Optimizations initialized');
};

// Performance monitoring utilities
export const performanceUtils = {
  // Mark performance checkpoints
  mark: (name: string) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  },

  // Measure time between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measures = performance.getEntriesByName(name);
        if (measures.length > 0) {
          const duration = measures[measures.length - 1].duration;
          console.log(`[Performance] ${name}: ${duration}ms`);
          return duration;
        }
      } catch (error) {
        console.warn(`[Performance] Failed to measure ${name}:`, error);
      }
    }
    return 0;
  },

  // Get current memory usage (if available)
  getMemoryUsage: () => {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  }
};

// Declare global types for Google Analytics
declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: any) => void;
  }
}

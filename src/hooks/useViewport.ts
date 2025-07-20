
import { useState, useEffect } from 'react';

export type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export interface ViewportInfo {
  size: ViewportSize;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

export const useViewport = (): ViewportInfo => {
  const [viewport, setViewport] = useState<ViewportInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        size: 'desktop',
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        orientation: 'landscape'
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const size: ViewportSize = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    
    return {
      size,
      width,
      height,
      isMobile: size === 'mobile',
      isTablet: size === 'tablet',
      isDesktop: size === 'desktop',
      orientation: width > height ? 'landscape' : 'portrait'
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const size: ViewportSize = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
      
      setViewport({
        size,
        width,
        height,
        isMobile: size === 'mobile',
        isTablet: size === 'tablet',
        isDesktop: size === 'desktop',
        orientation: width > height ? 'landscape' : 'portrait'
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

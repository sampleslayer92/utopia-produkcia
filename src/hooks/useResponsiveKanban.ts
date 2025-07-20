
import { useCallback, useState } from 'react';
import { useViewport } from './useViewport';

export interface ResponsiveKanbanConfig {
  columnsPerView: number;
  cardSpacing: number;
  columnSpacing: number;
  enableSnap: boolean;
  enableVirtualization: boolean;
  touchSensitivity: number;
}

export const useResponsiveKanban = () => {
  const viewport = useViewport();
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);

  const config: ResponsiveKanbanConfig = {
    columnsPerView: viewport.isMobile ? 1 : viewport.isTablet ? 2 : 0, // 0 means show all
    cardSpacing: viewport.isMobile ? 8 : 12,
    columnSpacing: viewport.isMobile ? 12 : viewport.isTablet ? 16 : 24,
    enableSnap: viewport.isMobile,
    enableVirtualization: viewport.isMobile,
    touchSensitivity: viewport.isMobile ? 8 : 12
  };

  const navigateToColumn = useCallback((index: number) => {
    setActiveColumnIndex(index);
  }, []);

  const getColumnWidth = useCallback((totalColumns: number) => {
    if (viewport.isDesktop) return 320; // Fixed width for desktop
    if (viewport.isTablet) return viewport.width * 0.45; // 45% width for tablet
    return viewport.width - 24; // Full width minus padding for mobile
  }, [viewport]);

  const getVisibleColumns = useCallback((totalColumns: number) => {
    if (config.columnsPerView === 0) return totalColumns;
    return Math.min(config.columnsPerView, totalColumns);
  }, [config.columnsPerView]);

  return {
    viewport,
    config,
    activeColumnIndex,
    navigateToColumn,
    getColumnWidth,
    getVisibleColumns
  };
};

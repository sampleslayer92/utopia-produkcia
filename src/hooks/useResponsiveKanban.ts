
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

  // Enhanced responsive configuration
  const config: ResponsiveKanbanConfig = {
    columnsPerView: getColumnsPerView(),
    cardSpacing: getCardSpacing(),
    columnSpacing: getColumnSpacing(),
    enableSnap: viewport.isMobile,
    enableVirtualization: viewport.isMobile || viewport.width <= 1366,
    touchSensitivity: viewport.isMobile ? 8 : 12
  };

  function getColumnsPerView() {
    if (viewport.isMobile) return 1;
    if (viewport.isTablet) return 2;
    if (viewport.width <= 1366) return 3;
    if (viewport.width <= 1440) return 4;
    return 0; // Show all columns
  }

  function getCardSpacing() {
    if (viewport.width <= 1366) return 6;
    if (viewport.isMobile) return 8;
    return 12;
  }

  function getColumnSpacing() {
    if (viewport.width <= 1366) return 8;
    if (viewport.isMobile) return 12;
    if (viewport.isTablet) return 16;
    return 24;
  }

  const navigateToColumn = useCallback((index: number) => {
    setActiveColumnIndex(index);
  }, []);

  const getColumnWidth = useCallback((totalColumns: number) => {
    if (viewport.isDesktop) {
      if (viewport.width <= 1366) return 280; // Smaller columns for small screens
      if (viewport.width <= 1440) return 300;
      return 320; // Standard width for larger screens
    }
    if (viewport.isTablet) return viewport.width * 0.45;
    return viewport.width - 24; // Full width minus padding for mobile
  }, [viewport]);

  const getVisibleColumns = useCallback((totalColumns: number) => {
    if (config.columnsPerView === 0) return totalColumns;
    return Math.min(config.columnsPerView, totalColumns);
  }, [config.columnsPerView]);

  const getOptimalColumnCount = useCallback(() => {
    if (viewport.width <= 1366) return 3;
    if (viewport.width <= 1440) return 4;
    if (viewport.width <= 1920) return 5;
    return 6;
  }, [viewport.width]);

  return {
    viewport,
    config,
    activeColumnIndex,
    navigateToColumn,
    getColumnWidth,
    getVisibleColumns,
    getOptimalColumnCount
  };
};

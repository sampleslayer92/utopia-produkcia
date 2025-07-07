import { useRef, useEffect } from 'react';

interface DragToScrollOptions {
  disabled?: boolean;
}

export const useDragToScroll = (options: DragToScrollOptions = {}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const { disabled = false } = options;

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || disabled) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Prevent if target has drag attributes (from dnd-kit)
      const target = e.target as HTMLElement;
      if (target.closest('[data-rbd-drag-handle-context-id]') || 
          target.closest('[draggable="true"]') ||
          target.hasAttribute('data-rbd-drag-handle-dragging-id')) {
        return;
      }

      isDragging.current = true;
      startX.current = e.pageX - element.offsetLeft;
      scrollLeft.current = element.scrollLeft;
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX.current) * 2; // Scroll speed multiplier
      element.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      element.style.cursor = 'grab';
      element.style.userSelect = 'auto';
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
      element.style.cursor = 'grab';
      element.style.userSelect = 'auto';
    };

    // Mouse wheel horizontal scrolling
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        element.scrollLeft += e.deltaY;
      }
    };

    // Smart touch handling - avoid conflicts with DnD Kit
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      
      // Skip if target is draggable or part of DnD system
      if (target.closest('[data-rbd-drag-handle-context-id]') || 
          target.closest('[draggable="true"]') ||
          target.hasAttribute('data-rbd-drag-handle-dragging-id') ||
          target.closest('.kanban-card')) {
        return;
      }

      isDragging.current = true;
      startX.current = e.touches[0].pageX - element.offsetLeft;
      scrollLeft.current = element.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      
      const x = e.touches[0].pageX - element.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      element.scrollLeft = scrollLeft.current - walk;
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    // Add event listeners with passive options for better performance
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Set initial cursor
    element.style.cursor = 'grab';

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled]);

  return scrollRef;
};
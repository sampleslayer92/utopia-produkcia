
import React, { useRef, useEffect, useState } from 'react';
import { Button, ButtonProps } from './button';

interface MagneticButtonProps extends ButtonProps {
  magneticStrength?: number;
  children: React.ReactNode;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  magneticStrength = 0.3, 
  children, 
  className = '', 
  ...props 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * magneticStrength;
      const deltaY = (e.clientY - centerY) * magneticStrength;
      
      setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [magneticStrength, isHovered]);

  return (
    <Button
      ref={buttonRef}
      className={`transition-transform duration-300 ease-out transform-gpu ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MagneticButton;

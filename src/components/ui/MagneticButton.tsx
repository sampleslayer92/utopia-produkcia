
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const MagneticButton = ({ children, onClick, variant = "default", size = "lg", className = "" }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 100;
      
      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        const translateX = (x / distance) * force * 20;
        const translateY = (y / distance) * force * 20;
        
        button.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
      } else {
        button.style.transform = 'translate(0px, 0px) scale(1)';
      }
    };

    const handleMouseLeave = () => {
      button.style.transform = 'translate(0px, 0px) scale(1)';
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Button
      ref={buttonRef}
      onClick={onClick}
      variant={variant}
      size={size}
      className={`
        transition-all duration-300 ease-out
        backdrop-blur-xl bg-white/10 border-white/20
        hover:bg-white/20 hover:border-white/30
        shadow-2xl hover:shadow-3xl
        ${className}
      `}
      style={{
        transition: 'transform 0.1s ease-out, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      {children}
    </Button>
  );
};

export default MagneticButton;

import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'lime' | 'yellow' | 'gray';
  showValue?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const sizeMap = {
  sm: { size: 60, strokeWidth: 4, fontSize: 'text-xs' },
  md: { size: 80, strokeWidth: 6, fontSize: 'text-sm' },
  lg: { size: 120, strokeWidth: 8, fontSize: 'text-lg' }
};

const colorMap = {
  primary: { stroke: 'stroke-primary', color: 'text-primary' },
  lime: { stroke: 'stroke-lime-500', color: 'text-lime-500' },
  yellow: { stroke: 'stroke-yellow-500', color: 'text-yellow-500' },
  gray: { stroke: 'stroke-slate-400', color: 'text-slate-400' }
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 'md',
  color = 'primary',
  showValue = true,
  className,
  children
}) => {
  const { size: dimensions, strokeWidth, fontSize } = sizeMap[size];
  const { stroke, color: textColor } = colorMap[color];
  
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const radius = (dimensions - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={dimensions}
        height={dimensions}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(stroke, 'transition-all duration-500 ease-in-out')}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <span className={cn('font-semibold', fontSize, textColor)}>
            {Math.round(normalizedValue)}%
          </span>
        ))}
      </div>
    </div>
  );
};
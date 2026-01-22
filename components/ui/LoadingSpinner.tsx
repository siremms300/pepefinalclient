// Desktop/pepefinal/frontend/components/ui/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'text-blue-600',
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div className={`animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${sizeClasses[size]} ${color}`} style={{ animationDuration: '1s' }}>
          <span className="sr-only">Loading...</span>
        </div>
        
        {/* Optional inner dot for better visibility */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`rounded-full bg-current ${size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
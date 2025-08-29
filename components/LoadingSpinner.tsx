'use client';

import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'medium', 
  text = '加载中...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* 主要加载动画 */}
      <div className="relative">
        {/* 外圈旋转环 */}
        <div className={`${sizeClasses[size]} border-4 border-gaming-purple/20 border-t-gaming-purple rounded-full animate-spin`} />
        
        {/* 内圈反向旋转环 */}
        <div className={`absolute inset-2 border-2 border-gaming-cyan/20 border-b-gaming-cyan rounded-full animate-spin`} 
             style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        
        {/* 中心点脉冲 */}
        <div className="absolute inset-1/2 w-2 h-2 -ml-1 -mt-1 bg-gaming-green rounded-full animate-pulse" />
      </div>

      {/* 加载文本 */}
      {text && (
        <div className="text-center">
          <p className={`${textSizeClasses[size]} text-gray-300 font-medium animate-pulse`}>
            {text}
          </p>
          {/* 动态点点点 */}
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-1 h-1 bg-gaming-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-gaming-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-gaming-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
});

export default LoadingSpinner;

'use client';

import { useState, useRef, MouseEvent, ReactNode } from 'react';

interface RippleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'gaming';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export default function RippleButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'medium',
  disabled = false
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const variantClasses = {
    primary: 'bg-gradient-to-r from-gaming-cyan to-gaming-purple hover:from-gaming-cyan/80 hover:to-gaming-purple/80 text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white',
    gaming: 'bg-gradient-to-r from-gaming-purple via-gaming-cyan to-gaming-green hover:from-gaming-purple/80 hover:via-gaming-cyan/80 hover:to-gaming-green/80 text-white'
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-6 py-2.5 text-base',
    large: 'px-8 py-3.5 text-lg'
  };

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    // 移除波纹效果
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    // 执行点击事件
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden rounded-lg font-semibold
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={createRipple}
      disabled={disabled}
    >
      {/* 按钮内容 */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {children}
      </span>

      {/* 波纹效果 */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animationDuration: '600ms'
          }}
        />
      ))}

      {/* 发光效果 */}
      <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
           style={{
             background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
             transform: 'translateX(-100%)',
             animation: 'shimmer 2s infinite'
           }} />
    </button>
  );
}

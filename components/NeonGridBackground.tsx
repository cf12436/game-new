'use client';

import { useEffect, useRef } from 'react';

export default function NeonGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      timeRef.current += 0.016;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 网格参数
      const gridSize = 50;
      const lineWidth = 1;
      const glowIntensity = Math.sin(timeRef.current * 2) * 0.3 + 0.7;

      // 绘制垂直线
      for (let x = 0; x <= canvas.width; x += gridSize) {
        const opacity = 0.1 + Math.sin(timeRef.current + x * 0.01) * 0.05;
        
        ctx.save();
        ctx.globalAlpha = opacity * glowIntensity;
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.restore();
      }

      // 绘制水平线
      for (let y = 0; y <= canvas.height; y += gridSize) {
        const opacity = 0.1 + Math.sin(timeRef.current + y * 0.01) * 0.05;
        
        ctx.save();
        ctx.globalAlpha = opacity * glowIntensity;
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        ctx.restore();
      }

      // 绘制交点发光效果
      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          const distance = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) + 
            Math.pow(y - canvas.height / 2, 2)
          );
          
          const pulsePhase = timeRef.current * 3 - distance * 0.01;
          const pulse = Math.sin(pulsePhase) * 0.5 + 0.5;
          
          if (Math.random() > 0.98) { // 随机闪烁
            ctx.save();
            ctx.globalAlpha = pulse * 0.6;
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 20;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
}

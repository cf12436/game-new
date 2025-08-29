'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  angle: number;
  rotationSpeed: number;
  pulsePhase: number;
}

interface GeometricShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'triangle' | 'square' | 'hexagon';
  color: string;
  opacity: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const shapesRef = useRef<GeometricShape[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 创建增强粒子
    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.3,
          color: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6'][Math.floor(Math.random() * 6)],
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }

      particlesRef.current = particles;
    };

    // 创建几何图形
    const createShapes = () => {
      const shapes: GeometricShape[] = [];
      const shapeCount = Math.min(8, Math.floor(canvas.width / 300));

      for (let i = 0; i < shapeCount; i++) {
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 60 + 30,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          type: ['triangle', 'square', 'hexagon'][Math.floor(Math.random() * 3)] as 'triangle' | 'square' | 'hexagon',
          color: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)],
          opacity: Math.random() * 0.1 + 0.05
        });
      }

      shapesRef.current = shapes;
    };

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
      createShapes();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 绘制几何图形
    const drawShape = (shape: GeometricShape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = shape.opacity;
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = shape.color;
      ctx.shadowBlur = 10;

      ctx.beginPath();

      switch (shape.type) {
        case 'triangle':
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.closePath();
          break;
        case 'square':
          ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          break;
        case 'hexagon':
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * shape.size / 2;
            const y = Math.sin(angle) * shape.size / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          break;
      }

      ctx.stroke();
      ctx.restore();
    };

    // 动画循环
    const animate = () => {
      timeRef.current += 0.016; // 约60fps

      // 创建动态渐变背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );

      const hue1 = (timeRef.current * 10) % 360;
      const hue2 = (timeRef.current * 15 + 120) % 360;

      gradient.addColorStop(0, `hsla(${hue1}, 70%, 20%, 0.1)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 60%, 15%, 0.05)`);
      gradient.addColorStop(1, 'hsla(240, 50%, 10%, 0.02)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制几何图形
      shapesRef.current.forEach(shape => {
        shape.rotation += shape.rotationSpeed;
        shape.x += Math.sin(timeRef.current * 0.5) * 0.2;
        shape.y += Math.cos(timeRef.current * 0.3) * 0.15;

        // 边界检测
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

        drawShape(shape);
      });

      // 更新和绘制粒子
      particlesRef.current.forEach((particle, index) => {
        // 更新位置和旋转
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.angle += particle.rotationSpeed;
        particle.pulsePhase += 0.05;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // 脉冲效果
        const pulseSize = particle.size + Math.sin(particle.pulsePhase) * 0.5;
        const pulseOpacity = particle.opacity + Math.sin(particle.pulsePhase) * 0.1;

        // 绘制粒子发光效果
        ctx.save();
        ctx.globalAlpha = pulseOpacity * 0.3;
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 绘制粒子核心
        ctx.save();
        ctx.globalAlpha = pulseOpacity;
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 绘制增强连接线
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.3;

            // 创建渐变线条
            const lineGradient = ctx.createLinearGradient(
              particle.x, particle.y,
              otherParticle.x, otherParticle.y
            );
            lineGradient.addColorStop(0, particle.color);
            lineGradient.addColorStop(1, otherParticle.color);

            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = 1;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

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
      style={{ background: 'transparent' }}
    />
  );
}

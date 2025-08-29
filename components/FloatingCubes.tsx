'use client';

import { useEffect, useRef } from 'react';

interface Cube {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  size: number;
  color: string;
  opacity: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  rotationSpeedX: number;
  rotationSpeedY: number;
  rotationSpeedZ: number;
}

export default function FloatingCubes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const cubesRef = useRef<Cube[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const createCubes = () => {
      const cubes: Cube[] = [];
      const cubeCount = Math.min(15, Math.floor(canvas.width / 200));

      for (let i = 0; i < cubeCount; i++) {
        cubes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 500 + 100,
          rotationX: Math.random() * Math.PI * 2,
          rotationY: Math.random() * Math.PI * 2,
          rotationZ: Math.random() * Math.PI * 2,
          size: Math.random() * 40 + 20,
          color: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)],
          opacity: Math.random() * 0.3 + 0.1,
          velocityX: (Math.random() - 0.5) * 0.5,
          velocityY: (Math.random() - 0.5) * 0.5,
          velocityZ: (Math.random() - 0.5) * 0.3,
          rotationSpeedX: (Math.random() - 0.5) * 0.02,
          rotationSpeedY: (Math.random() - 0.5) * 0.02,
          rotationSpeedZ: (Math.random() - 0.5) * 0.02,
        });
      }

      cubesRef.current = cubes;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createCubes();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const project3D = (x: number, y: number, z: number) => {
      const perspective = 800;
      const scale = perspective / (perspective + z);
      return {
        x: canvas.width / 2 + (x - canvas.width / 2) * scale,
        y: canvas.height / 2 + (y - canvas.height / 2) * scale,
        scale
      };
    };

    const rotatePoint = (x: number, y: number, z: number, rx: number, ry: number, rz: number) => {
      // 绕X轴旋转
      let newY = y * Math.cos(rx) - z * Math.sin(rx);
      let newZ = y * Math.sin(rx) + z * Math.cos(rx);
      y = newY;
      z = newZ;

      // 绕Y轴旋转
      let newX = x * Math.cos(ry) + z * Math.sin(ry);
      newZ = -x * Math.sin(ry) + z * Math.cos(ry);
      x = newX;
      z = newZ;

      // 绕Z轴旋转
      newX = x * Math.cos(rz) - y * Math.sin(rz);
      newY = x * Math.sin(rz) + y * Math.cos(rz);
      x = newX;
      y = newY;

      return { x, y, z };
    };

    const drawCube = (cube: Cube) => {
      const size = cube.size;
      const halfSize = size / 2;

      // 立方体的8个顶点
      const vertices = [
        { x: -halfSize, y: -halfSize, z: -halfSize },
        { x: halfSize, y: -halfSize, z: -halfSize },
        { x: halfSize, y: halfSize, z: -halfSize },
        { x: -halfSize, y: halfSize, z: -halfSize },
        { x: -halfSize, y: -halfSize, z: halfSize },
        { x: halfSize, y: -halfSize, z: halfSize },
        { x: halfSize, y: halfSize, z: halfSize },
        { x: -halfSize, y: halfSize, z: halfSize },
      ];

      // 旋转顶点
      const rotatedVertices = vertices.map(vertex => {
        const rotated = rotatePoint(
          vertex.x, vertex.y, vertex.z,
          cube.rotationX, cube.rotationY, cube.rotationZ
        );
        return {
          x: rotated.x + cube.x,
          y: rotated.y + cube.y,
          z: rotated.z + cube.z
        };
      });

      // 投影到2D
      const projectedVertices = rotatedVertices.map(vertex => 
        project3D(vertex.x, vertex.y, vertex.z)
      );

      // 立方体的面（按Z深度排序）
      const faces = [
        { indices: [0, 1, 2, 3], color: cube.color, alpha: cube.opacity * 0.6 }, // 前面
        { indices: [4, 7, 6, 5], color: cube.color, alpha: cube.opacity * 0.4 }, // 后面
        { indices: [0, 4, 5, 1], color: cube.color, alpha: cube.opacity * 0.5 }, // 底面
        { indices: [2, 6, 7, 3], color: cube.color, alpha: cube.opacity * 0.5 }, // 顶面
        { indices: [0, 3, 7, 4], color: cube.color, alpha: cube.opacity * 0.3 }, // 左面
        { indices: [1, 5, 6, 2], color: cube.color, alpha: cube.opacity * 0.3 }, // 右面
      ];

      // 绘制面
      faces.forEach(face => {
        ctx.save();
        ctx.globalAlpha = face.alpha;
        ctx.fillStyle = face.color;
        ctx.strokeStyle = face.color;
        ctx.lineWidth = 1;
        ctx.shadowColor = face.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        const firstVertex = projectedVertices[face.indices[0]];
        ctx.moveTo(firstVertex.x, firstVertex.y);

        for (let i = 1; i < face.indices.length; i++) {
          const vertex = projectedVertices[face.indices[i]];
          ctx.lineTo(vertex.x, vertex.y);
        }
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    };

    const animate = () => {
      timeRef.current += 0.016;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cubesRef.current.forEach(cube => {
        // 更新位置
        cube.x += cube.velocityX;
        cube.y += cube.velocityY;
        cube.z += cube.velocityZ;

        // 更新旋转
        cube.rotationX += cube.rotationSpeedX;
        cube.rotationY += cube.rotationSpeedY;
        cube.rotationZ += cube.rotationSpeedZ;

        // 边界检测
        if (cube.x < -cube.size || cube.x > canvas.width + cube.size) {
          cube.velocityX *= -1;
        }
        if (cube.y < -cube.size || cube.y > canvas.height + cube.size) {
          cube.velocityY *= -1;
        }
        if (cube.z < 50 || cube.z > 600) {
          cube.velocityZ *= -1;
        }

        // 脉冲效果
        cube.opacity = 0.1 + Math.sin(timeRef.current * 2 + cube.x * 0.01) * 0.1;

        drawCube(cube);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    createCubes();
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

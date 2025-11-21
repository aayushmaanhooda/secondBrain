import React, { useEffect, useRef } from 'react';

const Galaxy = ({
  mouseRepulsion = true,
  mouseInteraction = true,
  density = 1.5,
  glowIntensity = 0.5,
  saturation = 0.8,
  hueShift = 240,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;

    const mouse = { x: null, y: null };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.angle = Math.random() * Math.PI * 2;
        // Spread particles across the entire screen, not just a center circle
        // Using a larger multiplier and mixing spiral with random scatter
        this.radius = Math.random() * Math.max(width, height) * 0.8; 
        this.size = Math.random() * 2 + 0.5;
        this.speed = (0.02 / (this.radius / 100 + 0.1)) * (Math.random() * 0.5 + 0.5);
        this.color = `hsl(${Math.random() * 60 + hueShift}, ${saturation * 100}%, ${Math.random() * 50 + 50}%)`;
        this.opacity = Math.random() * 0.8 + 0.2;
        
        // Spiral offset
        this.spiralOffset = this.radius * 2; 
      }

      update() {
        this.angle += this.speed * 0.1;
        
        // Calculate position based on spiral
        // x = r * cos(theta)
        // y = r * sin(theta)
        // Add spiral twist: theta + r * factor
        const currentAngle = this.angle + this.radius * 0.01;
        
        let x = width / 2 + Math.cos(currentAngle) * this.radius;
        let y = height / 2 + Math.sin(currentAngle) * this.radius;

        // Mouse interaction
        if (mouseInteraction && mouse.x != null) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;

          if (distance < maxDist) {
            const force = (maxDist - distance) / maxDist;
            const angle = Math.atan2(dy, dx);
            
            if (mouseRepulsion) {
              x -= Math.cos(angle) * force * 50;
              y -= Math.sin(angle) * force * 50;
            } else {
              x += Math.cos(angle) * force * 20;
              y += Math.sin(angle) * force * 20;
            }
          }
        }

        this.x = x;
        this.y = y;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity * glowIntensity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      const particleCount = Math.floor(1000 * density);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      // Trail effect
      ctx.fillStyle = 'rgba(15, 15, 19, 0.2)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseRepulsion, mouseInteraction, density, glowIntensity, saturation, hueShift]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        background: '#0f0f13',
        display: 'block'
      }} 
    />
  );
};

export default Galaxy;

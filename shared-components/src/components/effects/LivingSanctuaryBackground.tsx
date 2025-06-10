import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface LivingSanctuaryBackgroundProps {
  /** Content to display over the background */
  children?: React.ReactNode;
  /** Enable mouse interaction effects */
  interactive?: boolean;
  /** Color scheme for the sanctuary background */
  colorScheme?: 'sanctuary' | 'forest' | 'ocean' | 'sunset' | 'aurora';
  /** Animation speed multiplier */
  animationSpeed?: number;
  /** Additional CSS classes */
  className?: string;
  /** Enable reduced motion for accessibility */
  reducedMotion?: boolean;
  /** Opacity of the background layers */
  opacity?: number;
}

interface MousePosition {
  x: number;
  y: number;
}

const COLOR_SCHEMES = {
  sanctuary: {
    primary: 'from-purple-600/20 via-blue-600/20 to-indigo-600/20',
    secondary: 'from-purple-400/30 via-pink-400/30 to-purple-600/30',
    accent: 'from-blue-400/25 via-cyan-400/25 to-blue-500/25',
    interactive: 'from-purple-500/40 via-pink-500/40 to-purple-700/40',
    overlay: 'from-indigo-900/10 via-purple-900/10 to-blue-900/10'
  },
  forest: {
    primary: 'from-green-600/20 via-emerald-600/20 to-teal-600/20',
    secondary: 'from-green-400/30 via-lime-400/30 to-green-600/30',
    accent: 'from-emerald-400/25 via-teal-400/25 to-green-500/25',
    interactive: 'from-green-500/40 via-emerald-500/40 to-teal-700/40',
    overlay: 'from-green-900/10 via-emerald-900/10 to-teal-900/10'
  },
  ocean: {
    primary: 'from-blue-600/20 via-cyan-600/20 to-teal-600/20',
    secondary: 'from-blue-400/30 via-cyan-400/30 to-blue-600/30',
    accent: 'from-cyan-400/25 via-blue-400/25 to-teal-500/25',
    interactive: 'from-blue-500/40 via-cyan-500/40 to-teal-700/40',
    overlay: 'from-blue-900/10 via-cyan-900/10 to-teal-900/10'
  },
  sunset: {
    primary: 'from-orange-600/20 via-red-600/20 to-pink-600/20',
    secondary: 'from-orange-400/30 via-red-400/30 to-pink-600/30',
    accent: 'from-yellow-400/25 via-orange-400/25 to-red-500/25',
    interactive: 'from-orange-500/40 via-red-500/40 to-pink-700/40',
    overlay: 'from-orange-900/10 via-red-900/10 to-pink-900/10'
  },
  aurora: {
    primary: 'from-green-600/20 via-blue-600/20 to-purple-600/20',
    secondary: 'from-green-400/30 via-blue-400/30 to-purple-600/30',
    accent: 'from-cyan-400/25 via-green-400/25 to-blue-500/25',
    interactive: 'from-green-500/40 via-blue-500/40 to-purple-700/40',
    overlay: 'from-green-900/10 via-blue-900/10 to-purple-900/10'
  }
} as const;

export const LivingSanctuaryBackground: React.FC<LivingSanctuaryBackgroundProps> = ({
  children,
  interactive = true,
  colorScheme = 'sanctuary',
  animationSpeed = 1,
  className,
  reducedMotion = false,
  opacity = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  const colors = COLOR_SCHEMES[colorScheme];

  useEffect(() => {
    if (!interactive || reducedMotion) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (event.clientX - rect.left) / rect.width,
          y: (event.clientY - rect.top) / rect.height
        });
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0.5, y: 0.5 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive, reducedMotion]);

  const animationDuration = reducedMotion ? 0 : 20 / animationSpeed;
  const interactiveDuration = reducedMotion ? 0 : 0.3;

  return (
    <div
      ref={containerRef}
      className={cn("relative min-h-screen overflow-hidden", className)}
      style={{ opacity }}
    >
      {/* Base gradient layer */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          colors.primary
        )}
        animate={reducedMotion ? {} : {
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
      />

      {/* Secondary flowing layer */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-tl opacity-80 mix-blend-overlay",
          colors.secondary
        )}
        animate={reducedMotion ? {} : {
          backgroundPosition: ['100% 100%', '0% 0%', '100% 100%']
        }}
        transition={{
          duration: animationDuration * 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '250% 250%'
        }}
      />

      {/* Accent layer with rotation */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-60 mix-blend-soft-light",
          colors.accent
        )}
        animate={reducedMotion ? {} : {
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: animationDuration * 2,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '300% 300%',
          transformOrigin: 'center'
        }}
      />

      {/* Interactive mouse-following layer */}
      {interactive && (
        <motion.div
          className={cn(
            "absolute w-96 h-96 rounded-full opacity-0 mix-blend-overlay blur-3xl",
            colors.interactive
          )}
          animate={{
            opacity: isHovering ? 0.6 : 0,
            x: mousePosition.x * (containerRef.current?.clientWidth || 0) - 192,
            y: mousePosition.y * (containerRef.current?.clientHeight || 0) - 192,
          }}
          transition={{
            opacity: { duration: interactiveDuration },
            x: { duration: interactiveDuration, ease: "easeOut" },
            y: { duration: interactiveDuration, ease: "easeOut" }
          }}
          style={{
            background: `radial-gradient(circle, ${colors.interactive.replace('from-', '').replace('via-', ', ').replace('to-', ', ')})`
          }}
        />
      )}

      {/* Overlay for content readability */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-b opacity-50",
          colors.overlay
        )}
        animate={reducedMotion ? {} : {
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: animationDuration * 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Safari compatibility blur layer */}
      <div className="absolute inset-0 backdrop-blur-[0.5px] opacity-30" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
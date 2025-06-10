import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Sparkles, TreePine, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ImmersiveLoaderProps {
  /** Loading message to display */
  message?: string;
  /** Current loading progress (0-100) */
  progress?: number;
  /** Duration for each loading phase in milliseconds */
  phaseDuration?: number;
  /** Whether to show the Mama Bear climbing animation */
  showBearClimbing?: boolean;
  /** Whether to show rocket launching effects */
  showRocketLaunch?: boolean;
  /** Whether to show floating honey particles */
  showHoneyParticles?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when loading completes */
  onComplete?: () => void;
  /** Enable reduced motion for accessibility */
  reducedMotion?: boolean;
}

type LoadingPhase = 'initializing' | 'climbing' | 'launching' | 'completed';

const FloatingParticles: React.FC<{ count: number; reducedMotion?: boolean }> = ({ 
  count, 
  reducedMotion = false 
}) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-60"
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: window.innerHeight + 10,
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={reducedMotion ? {} : {
          y: -10,
          x: Math.random() * window.innerWidth,
          opacity: [0.6, 1, 0],
          scale: [0.5, 1, 0.3]
        }}
        transition={{
          duration: reducedMotion ? 0 : Math.random() * 3 + 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeOut"
        }}
      />
    ))}
  </div>
);

const TreeSilhouette: React.FC<{ position: 'left' | 'right'; reducedMotion?: boolean }> = ({ 
  position, 
  reducedMotion = false 
}) => (
  <motion.div
    className={cn(
      "absolute bottom-0 text-green-900/30",
      position === 'left' ? 'left-8' : 'right-8'
    )}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: reducedMotion ? 0 : 1, delay: 0.5 }}
  >
    <TreePine size={120} />
  </motion.div>
);

const MamaBearClimbing: React.FC<{ phase: LoadingPhase; reducedMotion?: boolean }> = ({ 
  phase, 
  reducedMotion = false 
}) => (
  <AnimatePresence>
    {(phase === 'climbing' || phase === 'completed') && (
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2"
        initial={{ bottom: '10%', opacity: 0 }}
        animate={{ 
          bottom: phase === 'completed' ? '60%' : '40%', 
          opacity: 1 
        }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: reducedMotion ? 0 : 2, 
          ease: "easeInOut" 
        }}
      >
        <motion.div
          animate={reducedMotion ? {} : {
            rotate: [-2, 2, -2],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: reducedMotion ? 0 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Custom Mama Bear using available icons */}
          <div className="relative">
            {/* Bear body */}
            <Heart size={48} className="text-amber-700 drop-shadow-lg fill-current" />
            {/* Bear ears */}
            <div className="absolute -top-2 left-2 w-3 h-3 bg-amber-700 rounded-full"></div>
            <div className="absolute -top-2 right-2 w-3 h-3 bg-amber-700 rounded-full"></div>
            {/* Bear eyes */}
            <div className="absolute top-3 left-4 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-3 right-4 w-1 h-1 bg-black rounded-full"></div>
          </div>
        </motion.div>
        {/* Honey drip effect */}
        <motion.div
          className="absolute -bottom-2 left-1/2 w-1 h-4 bg-amber-400 rounded-full transform -translate-x-1/2"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ 
            duration: reducedMotion ? 0 : 0.5, 
            delay: 1 
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

const RocketLaunch: React.FC<{ phase: LoadingPhase; reducedMotion?: boolean }> = ({ 
  phase, 
  reducedMotion = false 
}) => (
  <AnimatePresence>
    {phase === 'launching' && (
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2"
        initial={{ bottom: '20%', opacity: 0 }}
        animate={{ bottom: '100%', opacity: [0, 1, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: reducedMotion ? 0 : 3, 
          ease: "easeOut" 
        }}
      >
        <motion.div
          animate={reducedMotion ? {} : {
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Rocket size={36} className="text-blue-600" />
        </motion.div>
        {/* Flame trail */}
        <motion.div
          className="absolute top-full left-1/2 w-2 h-8 transform -translate-x-1/2"
          style={{
            background: 'linear-gradient(to bottom, #ff6b35, #f7931e, transparent)'
          }}
          animate={reducedMotion ? {} : {
            scaleY: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

export const ImmersiveLoader: React.FC<ImmersiveLoaderProps> = ({
  message = "Loading your sanctuary...",
  progress = 0,
  phaseDuration = 3000,
  showBearClimbing = true,
  showRocketLaunch = true,
  showHoneyParticles = true,
  className,
  onComplete,
  reducedMotion = false
}) => {
  const [currentPhase, setCurrentPhase] = useState<LoadingPhase>('initializing');
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const phases: LoadingPhase[] = ['initializing', 'climbing', 'launching', 'completed'];
    let phaseIndex = 0;
    
    const progressInterval = setInterval(() => {
      setDisplayProgress(prev => {
        const newProgress = Math.min(prev + 1, 100);
        
        // Update phase based on progress
        if (newProgress >= 25 && phaseIndex === 0) {
          phaseIndex = 1;
          setCurrentPhase('climbing');
        } else if (newProgress >= 70 && phaseIndex === 1) {
          phaseIndex = 2;
          setCurrentPhase('launching');
        } else if (newProgress >= 100 && phaseIndex === 2) {
          phaseIndex = 3;
          setCurrentPhase('completed');
          setTimeout(() => onComplete?.(), 1000);
        }
        
        return newProgress;
      });
    }, phaseDuration / 100);

    return () => clearInterval(progressInterval);
  }, [phaseDuration, onComplete]);

  const getPhaseMessage = (phase: LoadingPhase) => {
    switch (phase) {
      case 'initializing':
        return "Initializing sanctuary...";
      case 'climbing':
        return "Mama Bear is gathering honey...";
      case 'launching':
        return "Launching into the sanctuary...";
      case 'completed':
        return "Welcome to your sanctuary!";
      default:
        return message;
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20",
      "flex items-center justify-center z-50 backdrop-blur-sm",
      className
    )}>
      {/* Background trees */}
      <TreeSilhouette position="left" reducedMotion={reducedMotion} />
      <TreeSilhouette position="right" reducedMotion={reducedMotion} />
      
      {/* Floating honey particles */}
      {showHoneyParticles && (
        <FloatingParticles count={12} reducedMotion={reducedMotion} />
      )}
      
      {/* Main loading content */}
      <div className="relative text-center space-y-8 max-w-md mx-auto px-6">
        {/* Mama Bear climbing animation */}
        {showBearClimbing && (
          <MamaBearClimbing phase={currentPhase} reducedMotion={reducedMotion} />
        )}
        
        {/* Rocket launch animation */}
        {showRocketLaunch && (
          <RocketLaunch phase={currentPhase} reducedMotion={reducedMotion} />
        )}
        
        {/* Progress indicator */}
        <div className="space-y-4">
          <motion.div
            className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 via-purple-500 to-blue-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${displayProgress}%` }}
              transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
            />
          </motion.div>
          
          {/* Progress percentage */}
          <motion.div
            className="text-white/80 font-medium"
            animate={reducedMotion ? {} : {
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: reducedMotion ? 0 : 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {displayProgress}%
          </motion.div>
        </div>
        
        {/* Loading message with sparkles */}
        <motion.div
          className="flex items-center justify-center space-x-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, delay: 0.2 }}
        >
          <motion.div
            animate={reducedMotion ? {} : {
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: reducedMotion ? 0 : 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="text-amber-400" size={20} />
          </motion.div>
          
          <motion.span
            className="text-white text-lg font-medium"
            key={currentPhase} // Re-animate on phase change
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
          >
            {getPhaseMessage(currentPhase)}
          </motion.span>
          
          <motion.div
            animate={reducedMotion ? {} : {
              rotate: [360, 180, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: reducedMotion ? 0 : 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="text-purple-400" size={20} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  MessageSquare, 
  Bell, 
  Settings, 
  HelpCircle, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

/**
 * @component AgentPresenceBar
 * @description Persistent agent presence indicator for the Sanctuary UI. Shows agent status,
 * quick actions, and notifications. Features smooth animations and accessibility support.
 * @prop {AgentStatus} [initialStatus="online"] - Initial status of the agent
 * @prop {string} [avatarSrc] - URL of the agent's avatar image
 * @prop {string} [agentName="Mama Bear"] - Display name of the agent
 * @prop {string} [className] - Additional CSS classes
 */

type AgentStatus = "online" | "busy" | "away" | "offline";

interface StatusConfig {
  color: string;
  label: string;
  description: string;
}

const statusConfigs: Record<AgentStatus, StatusConfig> = {
  online: {
    color: "bg-emerald-500",
    label: "Online",
    description: "Mama Bear is available and ready to help"
  },
  busy: {
    color: "bg-amber-500",
    label: "Busy",
    description: "Mama Bear is currently working on a task"
  },
  away: {
    color: "bg-blue-500",
    label: "Away",
    description: "Mama Bear is temporarily away"
  },
  offline: {
    color: "bg-gray-500",
    label: "Offline",
    description: "Mama Bear is currently offline"
  }
};

interface AgentPresenceBarProps {
  initialStatus?: AgentStatus;
  avatarSrc?: string;
  agentName?: string;
  className?: string;
}

export function AgentPresenceBar({
  initialStatus = "online",
  avatarSrc = "https://github.com/shadcn.png",
  agentName = "Mama Bear",
  className = "",
}: AgentPresenceBarProps) {
  const [status, setStatus] = useState<AgentStatus>(initialStatus);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVolumeOff, setIsVolumeOff] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(3);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVolume = () => setIsVolumeOff(!isVolumeOff);

  const statusConfig = statusConfigs[status];

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div 
        className={`fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-t border-border/50 flex items-center px-4 z-40 ${className}`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarImage src={avatarSrc} alt={agentName} />
              <AvatarFallback>{agentName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span 
              className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-background ${statusConfig.color}`}
              aria-label={`Status: ${statusConfig.label}`}
            />
          </div>
          
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">{agentName}</p>
            <p className="text-xs text-muted-foreground">{statusConfig.label}</p>
          </div>
        </div>

        <div className="flex-1 flex justify-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                className="p-2 rounded-full hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isMuted ? "Unmute microphone" : "Mute microphone"}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                className="p-2 rounded-full hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors"
                onClick={toggleVolume}
                aria-label={isVolumeOff ? "Unmute sound" : "Mute sound"}
              >
                {isVolumeOff ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isVolumeOff ? "Unmute sound" : "Mute sound"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                className="relative p-2 rounded-full hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                <MessageSquare size={18} />
                {unreadCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Messages</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                className="p-2 rounded-full hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Settings"
              >
                <Settings size={18} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
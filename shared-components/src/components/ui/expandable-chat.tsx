"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { X, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type ChatPosition = "bottom-right" | "bottom-left";
export type ChatSize = "sm" | "md" | "lg" | "xl" | "full";

const chatConfig = {
  dimensions: {
    sm: "sm:max-w-sm sm:max-h-[500px]",
    md: "sm:max-w-md sm:max-h-[600px]",
    lg: "sm:max-w-lg sm:max-h-[700px]",
    xl: "sm:max-w-xl sm:max-h-[800px]",
    full: "sm:w-full sm:h-full",
  },
  positions: {
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
  },
  chatPositions: {
    "bottom-right": "sm:bottom-[calc(100%+10px)] sm:right-0",
    "bottom-left": "sm:bottom-[calc(100%+10px)] sm:left-0",
  },
  states: {
    open: "pointer-events-auto opacity-100 visible scale-100 translate-y-0",
    closed:
      "pointer-events-none opacity-0 invisible scale-100 sm:translate-y-5",
  },
};

interface ExpandableChatProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: ChatPosition;
  size?: ChatSize;
  icon?: React.ReactNode;
  reducedMotion?: boolean;
  neurodivergentMode?: boolean;
  theme?: 'light' | 'dark' | 'system';
}

const ExpandableChat: React.FC<ExpandableChatProps> = ({
  className,
  position = "bottom-right",
  size = "md",
  icon,
  children,
  reducedMotion = false,
  neurodivergentMode = false,
  theme = 'system',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  // Motion configuration for accessibility
  const motionConfig = reducedMotion 
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.1 }
      }
    : {
        initial: { opacity: 0, scale: 0.8, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: 20 },
        transition: { 
          type: "spring", 
          stiffness: neurodivergentMode ? 200 : 400,
          damping: neurodivergentMode ? 25 : 20 
        }
      };

  return (
    <div
      className={cn(`fixed ${chatConfig.positions[position]} z-50`, className)}
      {...props}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            {...motionConfig}
            className={cn(
              "absolute flex flex-col bg-background border rounded-lg shadow-xl",
              chatConfig.dimensions[size],
              chatConfig.chatPositions[position]
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      
      <ExpandableChatToggle
        icon={icon}
        isOpen={isOpen}
        toggleChat={toggleChat}
        reducedMotion={reducedMotion}
        neurodivergentMode={neurodivergentMode}
      />
    </div>
  );
};

ExpandableChat.displayName = "ExpandableChat";

const ExpandableChatHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex items-center justify-between p-4 border-b", className)}
    {...props}
  />
);

ExpandableChatHeader.displayName = "ExpandableChatHeader";

const ExpandableChatBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("flex-grow overflow-y-auto", className)} {...props} />;

ExpandableChatBody.displayName = "ExpandableChatBody";

const ExpandableChatFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("border-t p-4", className)} {...props} />;

ExpandableChatFooter.displayName = "ExpandableChatFooter";

interface ExpandableChatToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  isOpen: boolean;
  toggleChat: () => void;
  reducedMotion?: boolean;
  neurodivergentMode?: boolean;
}

const ExpandableChatToggle: React.FC<ExpandableChatToggleProps> = ({
  className,
  icon,
  isOpen,
  toggleChat,
  reducedMotion = false,
  neurodivergentMode = false,
  ...props
}) => {
  const buttonVariants = neurodivergentMode 
    ? "default" 
    : "default";
    
  const buttonSize = neurodivergentMode ? "lg" : "default";

  return (
    <Button
      variant={buttonVariants}
      size={buttonSize}
      onClick={toggleChat}
      className={cn(
        "w-14 h-14 rounded-full shadow-md flex items-center justify-center transition-all duration-300",
        !reducedMotion && "hover:shadow-lg hover:shadow-black/30",
        neurodivergentMode && "ring-2 ring-primary/20 hover:ring-primary/40",
        className,
      )}
      {...props}
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          icon || <MessageCircle className="h-6 w-6" />
        )}
      </motion.div>
    </Button>
  );
};

ExpandableChatToggle.displayName = "ExpandableChatToggle";

export {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
};

export type { ExpandableChatProps };

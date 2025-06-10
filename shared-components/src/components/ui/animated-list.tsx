"use client";

import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  reducedMotion?: boolean;
  neurodivergentMode?: boolean;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 1000, reducedMotion = false, neurodivergentMode = false }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = React.Children.toArray(children);

    // Adjust delay for neurodivergent mode (slower transitions)
    const adjustedDelay = neurodivergentMode ? delay * 1.5 : delay;

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
      }, adjustedDelay);

      return () => clearInterval(interval);
    }, [childrenArray.length, adjustedDelay]);

    const itemsToShow = useMemo(
      () => childrenArray.slice(0, index + 1).reverse(),
      [index, childrenArray]
    );

    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem 
              key={(item as ReactElement).key}
              reducedMotion={reducedMotion}
            >
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";

export interface AnimatedListItemProps {
  children: React.ReactNode;
  reducedMotion?: boolean;
}

export function AnimatedListItem({ 
  children, 
  reducedMotion = false 
}: AnimatedListItemProps) {
  const animations = reducedMotion 
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.1 },
      }
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1, originY: 0 },
        exit: { scale: 0, opacity: 0 },
        transition: { type: "spring", stiffness: 350, damping: 40 },
      };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}

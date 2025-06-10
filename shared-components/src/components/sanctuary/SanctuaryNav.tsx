"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import Link from "next/link";
import { Home, Sparkles, Palette, Headphones, Users, MessageSquare, Settings } from "lucide-react";

/**
 * @component SanctuaryNav
 * @description Persistent navigation bar for the Sanctuary UI. Features smooth animations, keyboard navigation,
 * and tooltips. Designed for sensory-friendly, accessible navigation across the 7 core Sanctuary pages.
 * @prop {string} [className] - Additional CSS classes
 */

interface NavItem {
  id: number;
  title: string;
  url: string;
  icon: React.ReactNode;
  description?: string;
}

const navItems: NavItem[] = [
  {
    id: 1,
    title: "Home",
    url: "/",
    icon: <Home className="w-5 h-5" />,
    description: "Return to the main sanctuary space"
  },
  {
    id: 2,
    title: "Experiences",
    url: "/experiences",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Explore immersive AI experiences"
  },
  {
    id: 3,
    title: "Visual",
    url: "/visual",
    icon: <Palette className="w-5 h-5" />,
    description: "Visual AI creations and galleries"
  },
  {
    id: 4,
    title: "Audio",
    url: "/audio",
    icon: <Headphones className="w-5 h-5" />,
    description: "Sound and music AI experiences"
  },
  {
    id: 5,
    title: "Community",
    url: "/community",
    icon: <Users className="w-5 h-5" />,
    description: "Connect with other visitors"
  },
  {
    id: 6,
    title: "Chat",
    url: "/chat",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Interact with our AI assistants"
  },
  {
    id: 7,
    title: "Settings",
    url: "/settings",
    icon: <Settings className="w-5 h-5" />,
    description: "Customize your experience"
  }
];

const SanctuaryNav: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [activeItem, setActiveItem] = useState<number>(1);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!navRef.current) return;
      
      const items = Array.from(navRef.current.querySelectorAll('[role="menuitem"]'));
      const currentIndex = items.findIndex(item => 
        item.getAttribute('data-active') === 'true'
      );
      
      let newIndex = currentIndex;
      
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          newIndex = (currentIndex + 1) % items.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          newIndex = (currentIndex - 1 + items.length) % items.length;
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = items.length - 1;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          const target = items[currentIndex] as HTMLElement;
          target.click();
          return;
        default:
          return;
      }
      
      setActiveItem(newIndex + 1);
      (items[newIndex] as HTMLElement).focus();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseMove = (e: React.MouseEvent, itemId: number) => {
    const navRect = navRef.current?.getBoundingClientRect();
    if (navRect) {
      setTooltipPosition({
        x: e.clientX - navRect.left,
        y: e.clientY - navRect.top
      });
      setHoveredItem(itemId);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleItemClick = (itemId: number) => {
    setActiveItem(itemId);
  };

  return (
    <MotionConfig transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
      <nav 
        ref={navRef}
        className={`fixed left-0 top-0 h-full w-16 bg-background/80 backdrop-blur-sm border-r border-border/50 flex flex-col items-center py-6 z-50 ${className}`}
        role="navigation"
        aria-label="Main navigation"
        onMouseLeave={handleMouseLeave}
      >
        <div className="mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">S</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center space-y-2 w-full">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              isHovered={hoveredItem === item.id}
              onMouseMove={handleMouseMove}
              onClick={handleItemClick}
            />
          ))}
        </div>
        
        <AnimatePresence>
          {hoveredItem !== null && (
            <motion.div
              className="absolute left-full ml-2 px-3 py-1.5 rounded-md bg-foreground/90 text-background text-sm pointer-events-none whitespace-nowrap z-50"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{
                top: tooltipPosition.y - 12,
                left: tooltipPosition.x + 24,
              }}
            >
              {navItems.find(item => item.id === hoveredItem)?.title}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </MotionConfig>
  );
};

const NavItem: React.FC<{
  item: NavItem;
  isActive: boolean;
  isHovered: boolean;
  onMouseMove: (e: React.MouseEvent, id: number) => void;
  onClick: (id: number) => void;
}> = ({ item, isActive, isHovered, onMouseMove, onClick }) => {
  return (
    <Link
      href={item.url}
      className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
      }`}
      onMouseMove={(e) => onMouseMove(e, item.id)}
      onClick={() => onClick(item.id)}
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
      data-active={isActive}
      aria-label={item.title}
      title={item.title}
    >
      <motion.div
        className="relative flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {item.icon}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute inset-0 rounded-full border-2 border-primary"
            initial={false}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default SanctuaryNav;
"use client";

import { cn } from "../../lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import {
  Blocks,
  ChevronsUpDown,
  FileClock,
  GraduationCap,
  Layout,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MessagesSquare,
  Moon,
  Plus,
  Settings,
  Sun,
  UserCircle,
  UserCog,
  UserSearch,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { AgentPresenceBar } from "./AgentPresenceBar";
import { SanctuaryNav } from "./SanctuaryNav";

/**
 * @component SanctuaryLayout
 * @description Main layout component for the Sanctuary UI. Provides a consistent layout
 * with responsive navigation, agent presence, and theme management.
 * @prop {React.ReactNode} children - Page content to be rendered in the main content area
 * @prop {string} [className] - Additional CSS classes for the layout container
 */

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

type ThemeToggleProps = {
  className?: string;
};

function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  return (
    <button
      onClick={() => {
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "light" : "dark");
        setIsDark(!isDark);
      }}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full border border-border bg-background",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform duration-200 ease-in-out",
          isDark ? "translate-x-5" : "translate-x-0"
        )}
      >
        {isDark ? (
          <Moon className="h-full w-full p-0.5 text-background" />
        ) : (
          <Sun className="h-full w-full p-0.5 text-background" />
        )}
      </span>
    </button>
  );
}

export function SanctuaryLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      badge: "New",
    },
    {
      title: "Memory Palace",
      href: "/memory",
      icon: FileClock,
    },
    {
      title: "Creation Studio",
      href: "/studio",
      icon: Blocks,
    },
    {
      title: "Learning Hub",
      href: "/learn",
      icon: GraduationCap,
    },
    {
      title: "Sensory Garden",
      href: "/sensory",
      icon: Layout,
    },
    {
      title: "Agent Command",
      href: "/agents",
      icon: UserCog,
    },
    {
      title: "Activity Feed",
      href: "/activity",
      icon: MessageSquareText,
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md hover:bg-accent"
        aria-label="Toggle menu"
      >
        <div className="space-y-1.5">
          <span className="block h-0.5 w-6 bg-foreground transition-transform duration-200 ease-in-out"></span>
          <span className="block h-0.5 w-6 bg-foreground transition-opacity duration-200 ease-in-out"></span>
          <span className="block h-0.5 w-6 bg-foreground transition-transform duration-200 ease-in-out"></span>
        </div>
      </button>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed top-0 left-0 h-full bg-card border-r border-border z-40",
          "overflow-hidden transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-20",
          "hidden md:block"
        )}
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <motion.div
              className="flex items-center space-x-2"
              variants={variants}
              animate={isSidebarOpen ? "open" : "closed"}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              {isSidebarOpen && (
                <span className="text-lg font-semibold">Sanctuary</span>
              )}
            </motion.div>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-accent"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronsUpDown className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="space-y-1 p-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <motion.span
                      className="ml-3"
                      initial={{ opacity: 1 }}
                      animate={{
                        opacity: isSidebarOpen ? 1 : 0,
                        x: isSidebarOpen ? 0 : -10,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.title}
                    </motion.span>
                    {item.badge && isSidebarOpen && (
                      <Badge className="ml-auto" variant="secondary">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User menu */}
          <div className="border-t border-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center space-x-3 rounded-md p-2 text-left hover:bg-accent focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>MB</AvatarFallback>
                  </Avatar>
                  <motion.div
                    className="overflow-hidden"
                    initial={{ opacity: 1 }}
                    animate={{
                      opacity: isSidebarOpen ? 1 : 0,
                      x: isSidebarOpen ? 0 : -10,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm font-medium">Mama Bear</p>
                    <p className="text-xs text-muted-foreground">AI Assistant</p>
                  </motion.div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" side="top">
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.aside>

      {/* Mobile sidebar */}
      <motion.div
        className={cn(
          "fixed inset-0 z-30 bg-background/80 backdrop-blur-sm",
          "md:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
        onClick={toggleMobileMenu}
      >
        <motion.div
          className={cn(
            "h-full w-64 bg-card border-r border-border shadow-lg",
            "transform transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          initial={{ x: -320 }}
          animate={{ x: isMobileMenuOpen ? 0 : -320 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">Sanctuary</span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-1 rounded-md hover:bg-accent"
              aria-label="Close menu"
            >
              <span className="block h-0.5 w-5 bg-foreground rotate-45 translate-y-0.5"></span>
              <span className="block h-0.5 w-5 bg-foreground -rotate-45 -translate-y-0.5"></span>
            </button>
          </div>
          <nav className="space-y-1 p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                  onClick={toggleMobileMenu}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="ml-3">{item.title}</span>
                  {item.badge && (
                    <Badge className="ml-auto" variant="secondary">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </motion.div>
      </motion.div>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden",
          "transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        {/* Top bar */}
        <header
          className={cn(
            "sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4",
            isScrolled && "shadow-sm"
          )}
        >
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">
              {navItems.find((item) => item.href === pathname)?.title || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className={cn("mx-auto w-full max-w-6xl", className)}>
            {children}
          </div>
        </main>

        {/* Agent presence bar */}
        <AgentPresenceBar />
      </div>
    </div>
  );
}
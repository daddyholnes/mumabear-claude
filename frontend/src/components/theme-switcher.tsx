import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Palette, 
  Star, 
  Cloud, 
  Eye,
  Settings,
  Monitor,
  Contrast,
  Volume2,
  VolumeX,
  Type,
  Accessibility
} from 'lucide-react';
import { useEnhancedTheme } from './sanctuary-theme-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ThemeOption {
  key: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    key: 'sanctuary',
    name: 'Sanctuary',
    description: 'Calming nature-inspired theme for focus and tranquility',
    icon: <Eye className="w-4 h-4" />,
    gradient: 'from-green-400 via-blue-500 to-purple-600',
    preview: {
      primary: '#4a7c59',
      secondary: '#7ba185', 
      accent: '#98fb98',
    },
  },
  {
    key: 'daytime',
    name: 'Daytime',
    description: 'Bright and energetic theme for active work sessions',
    icon: <Sun className="w-4 h-4" />,
    gradient: 'from-blue-400 via-cyan-300 to-yellow-300',
    preview: {
      primary: '#4fc3f7',
      secondary: '#fff176',
      accent: '#aed581',
    },
  },
  {
    key: 'night',
    name: 'Night',
    description: 'Dark theme perfect for low-light environments',
    icon: <Moon className="w-4 h-4" />,
    gradient: 'from-slate-900 via-purple-900 to-indigo-900',
    preview: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#c084fc',
    },
  },
  {
    key: 'purple-haze',
    name: 'Purple Haze',
    description: 'Creative and mystical theme for inspiration',
    icon: <Palette className="w-4 h-4" />,
    gradient: 'from-purple-600 via-pink-600 to-yellow-400',
    preview: {
      primary: '#d946ef',
      secondary: '#f472b6',
      accent: '#a855f7',
    },
  },
  {
    key: 'cosmic-purple',
    name: 'Cosmic Purple',
    description: 'Deep space theme for immersive experiences',
    icon: <Star className="w-4 h-4" />,
    gradient: 'from-indigo-900 via-purple-900 to-pink-900',
    preview: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
    },
  },
];

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full' | 'dropdown';
  showAccessibility?: boolean;
}

export function ThemeSwitcher({ 
  className, 
  variant = 'compact',
  showAccessibility = true 
}: ThemeSwitcherProps) {
  const theme = useEnhancedTheme();
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  
  const currentThemeOption = themeOptions.find(t => t.key === theme.currentTheme) || themeOptions[0];

  if (variant === 'dropdown') {
    return (      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("gap-2", className)}
            data-testid="theme-switcher"
          >
            {currentThemeOption.icon}
            <span className="hidden sm:inline">{currentThemeOption.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {themeOptions.map((option) => (            <DropdownMenuItem
              key={option.key}
              onClick={() => theme.setCurrentTheme(option.key as any)}
              className="flex items-center gap-2"
              data-theme={option.key}
            >
              {option.icon}
              <div className="flex-1">
                <div className="font-medium">{option.name}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </div>
              {theme.currentTheme === option.key && (
                <Badge variant="secondary" className="ml-2">Current</Badge>
              )}
            </DropdownMenuItem>
          ))}
          {showAccessibility && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowAccessibilityPanel(true)}>
                <Accessibility className="w-4 h-4 mr-2" />
                Accessibility Settings
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'compact') {
    return (      <div className={cn("flex items-center gap-2", className)} data-testid="theme-switcher">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {currentThemeOption.icon}
              <span className="hidden sm:inline">{currentThemeOption.name}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Theme Selection</h3>
                <div className="grid grid-cols-1 gap-2">
                  {themeOptions.map((option) => (                    <motion.button
                      key={option.key}
                      onClick={() => theme.setCurrentTheme(option.key as any)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                        theme.currentTheme === option.key
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-theme={option.key}
                    >
                      <div className={cn("w-8 h-8 rounded-full bg-gradient-to-r", option.gradient)} />
                      <div className="flex-1">
                        <div className="font-medium">{option.name}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                      {theme.currentTheme === option.key && (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {showAccessibility && (
                <div className="border-t pt-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Accessibility className="w-4 h-4" />
                    Accessibility
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Contrast className="w-4 h-4" />
                        <span className="text-sm">High Contrast</span>
                      </div>
                      <Switch
                        checked={theme.customSettings.highContrast}
                        onCheckedChange={(checked) => 
                          theme.updateCustomSettings({ highContrast: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {theme.customSettings.reducedMotion ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                        <span className="text-sm">Reduced Motion</span>
                      </div>
                      <Switch
                        checked={theme.customSettings.reducedMotion}
                        onCheckedChange={(checked) => 
                          theme.updateCustomSettings({ reducedMotion: checked })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        <span className="text-sm">Font Size</span>
                        <Badge variant="outline" className="ml-auto">
                          {theme.customSettings.fontSize}
                        </Badge>
                      </div>
                      <div className="px-2">
                        <Slider
                          value={[
                            theme.customSettings.fontSize === 'small' ? 0 :
                            theme.customSettings.fontSize === 'medium' ? 1 :
                            theme.customSettings.fontSize === 'large' ? 2 : 3
                          ]}
                          onValueChange={([value]) => {
                            const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
                            theme.updateCustomSettings({ fontSize: sizes[value] });
                          }}
                          max={3}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  // Full variant - shows theme grid
  return (
    <div className={cn("space-y-6", className)} data-testid="theme-switcher">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Theme Customization</h2>
        <p className="text-muted-foreground">
          Choose a theme that matches your mood and working style
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themeOptions.map((option) => (          <motion.div
            key={option.key}
            className={cn(
              "relative group cursor-pointer rounded-xl border-2 overflow-hidden",
              theme.currentTheme === option.key
                ? "border-primary shadow-lg"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => theme.setCurrentTheme(option.key as any)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-theme={option.key}
          >
            {/* Theme Preview */}
            <div className={cn("h-32 bg-gradient-to-br", option.gradient)} />
            
            {/* Color Preview */}
            <div className="absolute top-4 right-4 flex gap-1">
              {Object.values(option.preview).map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-white/50"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Theme Info */}
            <div className="p-4 bg-card">
              <div className="flex items-center gap-2 mb-2">
                {option.icon}
                <h3 className="font-semibold">{option.name}</h3>
                {theme.currentTheme === option.key && (
                  <Badge className="ml-auto">Active</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            
            {/* Selection Indicator */}
            <AnimatePresence>
              {theme.currentTheme === option.key && (
                <motion.div
                  className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      
      {showAccessibility && (
        <div className="bg-card rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Accessibility Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">High Contrast</div>
                  <div className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </div>
                </div>
                <Switch
                  checked={theme.customSettings.highContrast}
                  onCheckedChange={(checked) => 
                    theme.updateCustomSettings({ highContrast: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Reduced Motion</div>
                  <div className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </div>
                </div>
                <Switch
                  checked={theme.customSettings.reducedMotion}
                  onCheckedChange={(checked) => 
                    theme.updateCustomSettings({ reducedMotion: checked })
                  }
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Font Size</div>
                  <Badge variant="outline">
                    {theme.customSettings.fontSize}
                  </Badge>
                </div>
                <Slider
                  value={[
                    theme.customSettings.fontSize === 'small' ? 0 :
                    theme.customSettings.fontSize === 'medium' ? 1 :
                    theme.customSettings.fontSize === 'large' ? 2 : 3
                  ]}
                  onValueChange={([value]) => {
                    const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
                    theme.updateCustomSettings({ fontSize: sizes[value] });
                  }}
                  max={3}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="font-medium mb-2">Color Blind Support</div>
                <div className="flex gap-2">
                  {[
                    { key: 'none', label: 'None' },
                    { key: 'protanopia', label: 'Protanopia' },
                    { key: 'deuteranopia', label: 'Deuteranopia' },
                    { key: 'tritanopia', label: 'Tritanopia' }
                  ].map((support) => (
                    <Button
                      key={support.key}
                      variant={theme.customSettings.colorBlindSupport === support.key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => theme.updateCustomSettings({ 
                        colorBlindSupport: support.key as any 
                      })}
                    >
                      {support.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

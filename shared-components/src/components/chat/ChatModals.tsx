"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Edit3,
  Save,
  Upload,
  Trash2,
  Plus,
  Settings,
  Palette,
  Volume2,
  Mic,
  Globe,
  Zap,
  Brain,
  Camera,
  User,
  Bot,
  Sparkles
} from "lucide-react";

export interface AIFriend {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  customAvatar?: string;
  online: boolean;
  typing: boolean;
  tokenCount: number;
  pricePerMinute: number;
  usage: number;
  description: string;
  capabilities: string[];
  lastActive: string;
  personality: string;
  memoryEnabled: boolean;
  voiceId?: string;
  provider: "openai" | "anthropic" | "google" | "meta" | "custom";
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  border: string;
  sidebar: string;
}

interface FriendsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friends: AIFriend[];
  onFriendsUpdate: (friends: AIFriend[]) => void;
  onSelectFriend: (friend: AIFriend) => void;
  theme: Theme;
}

interface ThemePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themes: Theme[];
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: Theme;
  speechToText: boolean;
  setSpeechToText: (value: boolean) => void;
  textToSpeech: boolean;
  setTextToSpeech: (value: boolean) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  webSearch: boolean;
  setWebSearch: (value: boolean) => void;
  functionCalling: boolean;
  setFunctionCalling: (value: boolean) => void;
  googleVoices: string[];
}

interface FriendEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friend: AIFriend | null;
  onFriendUpdate: (friend: AIFriend) => void;
  theme: Theme;
}

// Friends Manager Component
export function FriendsManager({
  open,
  onOpenChange,
  friends,
  onFriendsUpdate,
  onSelectFriend,
  theme
}: FriendsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  
  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         friend.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = selectedProvider === "all" || friend.provider === selectedProvider;
    return matchesSearch && matchesProvider;
  });

  const providerStats = {
    openai: friends.filter(f => f.provider === "openai").length,
    anthropic: friends.filter(f => f.provider === "anthropic").length,
    google: friends.filter(f => f.provider === "google").length,
    meta: friends.filter(f => f.provider === "meta").length,
    custom: friends.filter(f => f.provider === "custom").length,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-4xl max-h-[80vh]",
        theme.cardBackground,
        theme.text,
        theme.border
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>AI Friends Network</span>
            <Badge variant="outline" className="ml-2">
              {friends.length} friends
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex space-x-3">
            <Input
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="openai">OpenAI ({providerStats.openai})</SelectItem>
                <SelectItem value="anthropic">Anthropic ({providerStats.anthropic})</SelectItem>
                <SelectItem value="google">Google ({providerStats.google})</SelectItem>
                <SelectItem value="meta">Meta ({providerStats.meta})</SelectItem>
                <SelectItem value="custom">Custom ({providerStats.custom})</SelectItem>
              </SelectContent>
            </Select>
            <Button className={cn(
              "bg-gradient-to-r text-white",
              theme.primary
            )}>
              <Plus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
          </div>

          {/* Friends Grid */}
          <ScrollArea className="h-96">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFriends.map((friend) => (
                <motion.div
                  key={friend.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    theme.cardBackground,
                    theme.border,
                    "hover:ring-2 hover:ring-current"
                  )}
                  onClick={() => {
                    onSelectFriend(friend);
                    onOpenChange(false);
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={friend.customAvatar} />
                        <AvatarFallback className={cn(
                          "text-lg bg-gradient-to-r text-white",
                          theme.primary
                        )}>
                          {friend.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {friend.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm truncate">
                          {friend.displayName}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Open edit modal
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className={cn("text-xs", theme.textSecondary)}>
                        {friend.name}
                      </p>
                      <p className={cn("text-xs mt-1", theme.textSecondary)}>
                        {friend.description}
                      </p>
                      
                      {/* Capabilities */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {friend.capabilities.slice(0, 3).map((capability) => (
                          <Badge 
                            key={capability} 
                            variant="outline" 
                            className="text-xs px-1 py-0"
                          >
                            {capability}
                          </Badge>
                        ))}
                        {friend.capabilities.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{friend.capabilities.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className={theme.textSecondary}>
                          Usage: {friend.usage}%
                        </span>
                        <span className={theme.textSecondary}>
                          ${friend.pricePerMinute}/min
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Theme Picker Component
export function ThemePicker({
  open,
  onOpenChange,
  themes,
  currentTheme,
  onThemeChange
}: ThemePickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-2xl",
        currentTheme.cardBackground,
        currentTheme.text,
        currentTheme.border
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Choose Your Theme</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {themes.map((theme) => (
            <motion.div
              key={theme.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all",
                "hover:ring-2 hover:ring-current",
                currentTheme.name === theme.name && "ring-2 ring-current"
              )}
              style={{
                background: `linear-gradient(135deg, ${theme.primary.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`,
              }}
              onClick={() => {
                onThemeChange(theme);
                onOpenChange(false);
              }}
            >
              <div className="text-white">
                <h3 className="font-semibold text-lg mb-2">{theme.name}</h3>
                
                {/* Theme Preview */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                      🤖
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-white/30 rounded mb-1"></div>
                      <div className="h-2 bg-white/20 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-white/40 rounded-lg p-2 max-w-[60%]">
                      <div className="h-2 bg-white/60 rounded mb-1"></div>
                      <div className="h-2 bg-white/40 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                
                {currentTheme.name === theme.name && (
                  <div className="flex items-center justify-center mt-3">
                    <Badge className="bg-white/20 text-white border-white/30">
                      Current Theme
                    </Badge>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Settings Modal Component
export function SettingsModal({
  open,
  onOpenChange,
  theme,
  speechToText,
  setSpeechToText,
  textToSpeech,
  setTextToSpeech,
  selectedVoice,
  setSelectedVoice,
  webSearch,
  setWebSearch,
  functionCalling,
  setFunctionCalling,
  googleVoices
}: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-2xl max-h-[80vh]",
        theme.cardBackground,
        theme.text,
        theme.border
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="space-y-6">
            {/* Audio Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Volume2 className="w-5 h-5 mr-2" />
                Audio Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Speech to Text</Label>
                    <p className={cn("text-sm", theme.textSecondary)}>
                      Convert your speech to text automatically
                    </p>
                  </div>
                  <Switch
                    checked={speechToText}
                    onCheckedChange={setSpeechToText}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Text to Speech</Label>
                    <p className={cn("text-sm", theme.textSecondary)}>
                      AI responses will be spoken aloud
                    </p>
                  </div>
                  <Switch
                    checked={textToSpeech}
                    onCheckedChange={setTextToSpeech}
                  />
                </div>

                {textToSpeech && (
                  <div>
                    <Label>Voice Selection</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {googleVoices.map((voice) => (
                          <SelectItem key={voice} value={voice}>
                            {voice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* AI Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Features
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Web Search</Label>
                    <p className={cn("text-sm", theme.textSecondary)}>
                      Allow AI to search the web for current information
                    </p>
                  </div>
                  <Switch
                    checked={webSearch}
                    onCheckedChange={setWebSearch}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Function Calling</Label>
                    <p className={cn("text-sm", theme.textSecondary)}>
                      Enable AI to use tools and external functions
                    </p>
                  </div>
                  <Switch
                    checked={functionCalling}
                    onCheckedChange={setFunctionCalling}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacy Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Privacy & Data
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Persistent Memory</Label>
                    <p className={cn("text-sm", theme.textSecondary)}>
                      Allow AI friends to remember conversations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Usage Analytics</Label>
                    <p className={cn("text-sm", theme.textSecondary)}>
                      Help improve the experience with usage data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className={cn(
            "bg-gradient-to-r text-white",
            theme.primary
          )}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Friend Edit Modal Component
export function FriendEditModal({
  open,
  onOpenChange,
  friend,
  onFriendUpdate,
  theme
}: FriendEditModalProps) {
  const [editedFriend, setEditedFriend] = useState<AIFriend | null>(friend);

  React.useEffect(() => {
    setEditedFriend(friend);
  }, [friend]);

  if (!editedFriend) return null;

  const handleSave = () => {
    onFriendUpdate(editedFriend);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-2xl max-h-[80vh]",
        theme.cardBackground,
        theme.text,
        theme.border
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5" />
            <span>Edit {editedFriend.displayName}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Display Name</Label>
                <Input
                  value={editedFriend.displayName}
                  onChange={(e) => setEditedFriend({
                    ...editedFriend,
                    displayName: e.target.value
                  })}
                  placeholder="How they appear in chat"
                />
              </div>
              <div>
                <Label>Avatar</Label>
                <Input
                  value={editedFriend.avatar}
                  onChange={(e) => setEditedFriend({
                    ...editedFriend,
                    avatar: e.target.value
                  })}
                  placeholder="Emoji or character"
                />
              </div>
            </div>

            {/* Personality */}
            <div>
              <Label>Personality</Label>
              <Textarea
                value={editedFriend.personality}
                onChange={(e) => setEditedFriend({
                  ...editedFriend,
                  personality: e.target.value
                })}
                placeholder="Describe their personality and style"
                rows={3}
              />
            </div>

            {/* System Prompt */}
            <div>
              <Label>System Prompt</Label>
              <Textarea
                value={editedFriend.systemPrompt}
                onChange={(e) => setEditedFriend({
                  ...editedFriend,
                  systemPrompt: e.target.value
                })}
                placeholder="Instructions for how this AI should behave"
                rows={4}
              />
            </div>

            {/* AI Parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Temperature ({editedFriend.temperature})</Label>
                <Slider
                  value={[editedFriend.temperature]}
                  onValueChange={([value]) => setEditedFriend({
                    ...editedFriend,
                    temperature: value
                  })}
                  min={0}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
                <p className={cn("text-xs mt-1", theme.textSecondary)}>
                  Higher = more creative, Lower = more focused
                </p>
              </div>
              <div>
                <Label>Max Tokens</Label>
                <Input
                  type="number"
                  value={editedFriend.maxTokens}
                  onChange={(e) => setEditedFriend({
                    ...editedFriend,
                    maxTokens: parseInt(e.target.value)
                  })}
                  placeholder="Maximum response length"
                />
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <Label>Capabilities</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {editedFriend.capabilities.map((capability, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <span>{capability}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => setEditedFriend({
                        ...editedFriend,
                        capabilities: editedFriend.capabilities.filter((_, i) => i !== index)
                      })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6"
                  onClick={() => {
                    const newCapability = prompt("Add a capability:");
                    if (newCapability) {
                      setEditedFriend({
                        ...editedFriend,
                        capabilities: [...editedFriend.capabilities, newCapability]
                      });
                    }
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Memory Enabled</Label>
                  <p className={cn("text-sm", theme.textSecondary)}>
                    Remember conversation history
                  </p>
                </div>
                <Switch
                  checked={editedFriend.memoryEnabled}
                  onCheckedChange={(checked) => setEditedFriend({
                    ...editedFriend,
                    memoryEnabled: checked
                  })}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className={cn(
              "bg-gradient-to-r text-white",
              theme.primary
            )}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

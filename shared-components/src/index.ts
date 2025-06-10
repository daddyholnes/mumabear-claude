// Main exports for the Podplay Sanctuary Component Library

// Effects Components
export { AuroraBackground } from "./components/effects/AuroraBackground";
export { BackgroundGradientAnimation } from "./components/effects/BackgroundGradientAnimation";
export { SplashCursor } from "./components/effects/SplashCursor";
export { ImmersiveLoader } from "./components/effects/ImmersiveLoader";
export { LivingSanctuaryBackground } from "./components/effects/LivingSanctuaryBackground";

// UI Components
export { GlowingEffect } from "./components/ui/GlowingEffect";
export { default as AgentPlan } from "./components/ui/AgentPlan";
export { MessageLoading } from "./components/ui/message-loading";
export { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./components/ui/resizable";
export { ChatInput } from "./components/ui/chat-input";
export { ChatMessageList } from "./components/ui/chat-message-list";
export { AnimatedList } from "./components/ui/animated-list";
export { ExpandableChat } from "./components/ui/expandable-chat";
export { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./components/ui/chat-bubble";
export { Button } from "./components/ui/button";
export { Input } from "./components/ui/input";
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";

// Scout UI Components
export { ScoutUI2 } from "./components/scout-ui/ScoutUI2";
export { ScoutUI3 } from "./components/scout-ui/ScoutUI3";
export { ScoutUI4 } from "./components/scout-ui/ScoutUI4";

// Sanctuary Components
export { SanctuaryLayout } from "./components/sanctuary/SanctuaryLayout";

// Hub Component
export { PodplaySanctuaryHub } from "./components/PodplaySanctuaryHub";

// Hooks
export { useAutoScroll } from "./hooks/use-auto-scroll";

// Utilities
export { cn } from "./utils/cn";

// Types
export type { ComponentMeta, ComponentCategory } from "./types";

// Component Registry for mem0.ai integration
export { COMPONENT_REGISTRY } from "./registry";

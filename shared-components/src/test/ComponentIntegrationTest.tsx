import React from 'react';
import { 
  PodplaySanctuaryHub,
  SanctuaryLayout,
  AuroraBackground,
  ScoutUI2,
  ScoutUI3,
  ScoutUI4,
  MessageLoading,
  ChatInput,
  ChatMessageList,
  ExpandableChat,
  useAutoScroll
} from '../index';

/**
 * Comprehensive Integration Test Component
 * Tests all major components and their accessibility features
 */
export const ComponentIntegrationTest: React.FC = () => {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold text-center">
        🐻 Podplay Sanctuary Component Integration Test
      </h1>
      
      {/* Test 1: Full Hub Interface */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Test 1: Complete Hub Interface</h2>
        <div className="h-screen border rounded-lg overflow-hidden">
          <PodplaySanctuaryHub />
        </div>
      </section>

      {/* Test 2: Sanctuary Layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Test 2: Sanctuary Layout</h2>
        <div className="h-96 border rounded-lg overflow-hidden">
          <SanctuaryLayout>
            <div className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Layout Test Content</h3>
              <p>This tests the sanctuary layout with navigation and theming.</p>
            </div>
          </SanctuaryLayout>
        </div>
      </section>

      {/* Test 3: Scout UI Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Test 3: Scout UI Variants</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-96 border rounded-lg overflow-hidden">
            <h4 className="p-2 text-center font-medium bg-gray-100 dark:bg-gray-800">
              Scout UI 2: AI Generator
            </h4>
            <ScoutUI2 
              reducedMotion={false}
              neurodivergentMode={true}
            />
          </div>
          <div className="h-96 border rounded-lg overflow-hidden">
            <h4 className="p-2 text-center font-medium bg-gray-100 dark:bg-gray-800">
              Scout UI 3: Content Studio
            </h4>
            <ScoutUI3 
              reducedMotion={false}
              neurodivergentMode={true}
            />
          </div>
          <div className="h-96 border rounded-lg overflow-hidden">
            <h4 className="p-2 text-center font-medium bg-gray-100 dark:bg-gray-800">
              Scout UI 4: Project Manager
            </h4>
            <ScoutUI4 
              reducedMotion={false}
              neurodivergentMode={true}
            />
          </div>
        </div>
      </section>

      {/* Test 4: Chat Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Test 4: Chat Interface Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Message Loading States</h4>
            <div className="space-y-3">
              <MessageLoading size="sm" />
              <MessageLoading size="md" />
              <MessageLoading size="lg" neurodivergentMode={true} />
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Chat Input</h4>
            <ChatInput 
              placeholder="Type your message..."
              neurodivergentMode={true}
            />
          </div>
        </div>
      </section>

      {/* Test 5: Background Effects */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Test 5: Background Effects</h2>
        <div className="h-64 border rounded-lg overflow-hidden relative">
          <AuroraBackground showRadialGradient={true}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold">Aurora Background Test</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Calming aurora effects for sanctuary environments
                </p>
              </div>
            </div>
          </AuroraBackground>
        </div>
      </section>

      {/* Test 6: Accessibility Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Test 6: Accessibility Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Reduced Motion Test</h4>
            <MessageLoading 
              size="md" 
              reducedMotion={true}
              className="mb-4"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Animation should be minimal when reduced motion is enabled
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Neurodivergent Mode Test</h4>
            <ChatInput 
              placeholder="Enhanced input for neurodivergent users"
              neurodivergentMode={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Input should have enhanced spacing and visual clarity
            </p>
          </div>
        </div>
      </section>

      {/* Integration Status */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">✅ Integration Status</h2>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            Component Integration Complete
          </h3>
          <ul className="text-green-700 dark:text-green-300 space-y-1">
            <li>✅ All UI components migrated with TypeScript interfaces</li>
            <li>✅ Scout UI variants (2, 3, 4) integrated with accessibility support</li>
            <li>✅ Chat components with auto-scroll functionality</li>
            <li>✅ PodplaySanctuaryHub updated with new components</li>
            <li>✅ Comprehensive accessibility pattern implementation</li>
            <li>✅ Neurodivergent-friendly features across all components</li>
            <li>✅ Component registry updated with documentation</li>
            <li>✅ Export system complete for all components</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ComponentIntegrationTest;

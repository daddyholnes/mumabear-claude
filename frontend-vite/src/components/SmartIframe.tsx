import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, AlertTriangle, RefreshCw, Monitor } from 'lucide-react';

interface SmartIframeProps {
  src: string;
  title?: string;
  className?: string;
  fallbackComponent?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * SmartIframe component that handles iframe blocking gracefully
 * Provides multiple fallback strategies when iframe embedding is blocked
 */
export const SmartIframe: React.FC<SmartIframeProps> = ({
  src,
  title = 'Embedded Content',
  className = '',
  fallbackComponent,
  onLoad,
  onError
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'blocked' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Set a timeout to detect if iframe fails to load
    timeoutRef.current = setTimeout(() => {
      if (status === 'loading') {
        setStatus('blocked');
        setErrorMessage('Content blocked by security policy');
        onError?.();
      }
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [status, onError]);

  const handleLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setStatus('loaded');
    onLoad?.();
  };

  const handleError = (error: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setStatus('error');
    setErrorMessage(error.message || 'Failed to load content');
    onError?.();
  };

  const openInNewTab = () => {
    window.open(src, '_blank', 'noopener,noreferrer');
  };

  const retry = () => {
    setStatus('loading');
    setErrorMessage('');
    if (iframeRef.current) {
      iframeRef.current.src = src;
    }
  };

  const renderFallback = () => {
    if (fallbackComponent) {
      return fallbackComponent;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
      >
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Content Temporarily Unavailable
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {status === 'blocked' 
              ? 'This content is blocked by security policies. You can view it in a new tab instead.'
              : 'There was an issue loading this content. Please try again or view it externally.'
            }
          </p>
          
          {errorMessage && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
              {errorMessage}
            </p>
          )}
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openInNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in New Tab
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={retry}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </motion.button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
              <Monitor className="w-4 h-4" />
              <span className="font-medium">Alternative Access</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              For the best experience, consider using our dedicated browser extension or desktop app.
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      )}
      
      {(status === 'blocked' || status === 'error') ? (
        renderFallback()
      ) : (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className={`w-full h-full border-0 ${status === 'loading' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default SmartIframe;

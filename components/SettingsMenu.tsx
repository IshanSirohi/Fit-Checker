import React, { useState, useEffect, useRef } from 'react';
import { MenuIcon, XIcon, KeyIcon } from './icons';
import { AnimatePresence, motion } from 'framer-motion';

const SettingsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if a default env key exists
  const hasEnvKey = !!import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key') || '';
    setApiKey(storedKey);
    // Auto-open if no key exists at all (useful for Vercel deployments)
    if (!storedKey && !hasEnvKey) {
      setIsOpen(true);
    }
  }, [hasEnvKey]);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setIsOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const hasAnyKey = !!apiKey.trim() || hasEnvKey;

  return (
    <div className="absolute top-4 right-4 z-50 text-gray-800" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-sm border ${hasAnyKey ? 'border-gray-200' : 'border-red-300 animate-pulse'} transition-all`}
        aria-label="Settings"
      >
        <MenuIcon className={`w-6 h-6 ${hasAnyKey ? 'text-gray-700' : 'text-red-500'}`} />
        {!hasAnyKey && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-400"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 w-[340px] bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <KeyIcon className="w-5 h-5 text-gray-500" />
                  Configuration
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col gap-3">
                <label htmlFor="api-key" className="text-sm font-semibold text-gray-800 hover:cursor-pointer">
                  Gemini API Key
                </label>
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={hasEnvKey ? "Using default environment key..." : "AIzaSy..."}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm font-mono shadow-sm placeholder-gray-400"
                />
                
                <div className="flex flex-col gap-1.5 mt-1 mb-5">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    This Key is securely stored locally in your browser. {hasEnvKey ? "Leave blank to use the site's default key." : "Required for the application to function."}
                  </p>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 font-medium w-max"
                  >
                    Get a free API key &rarr;
                  </a>
                </div>

                <button 
                  onClick={handleSave}
                  className="w-full bg-gray-900 text-white font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm shadow-md"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsMenu;

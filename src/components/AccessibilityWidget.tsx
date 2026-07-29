import React, { useState, useEffect } from 'react';
import { Accessibility, Eye, Type, Volume2, X, VolumeX, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);
  const { theme, toggleTheme, isDarkMode } = useTheme();

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText]);

  useEffect(() => {
    if (readingMode && speechSynthesisAvailable) {
      const handleSelection = () => {
        const text = window.getSelection()?.toString();
        if (text) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        }
      };
      
      document.addEventListener('mouseup', handleSelection);
      return () => {
        document.removeEventListener('mouseup', handleSelection);
        window.speechSynthesis.cancel();
      };
    } else {
      if (speechSynthesisAvailable) {
        window.speechSynthesis.cancel();
      }
    }
  }, [readingMode, speechSynthesisAvailable]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 p-4 mb-4 w-64 animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-slate-800 pb-2">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
              <Accessibility className="w-5 h-5 mr-2 text-green-700 dark:text-emerald-400" />
              Accessibility Tools
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white" aria-label="Close accessibility widget">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300 font-medium dark:bg-emerald-900/40' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <span className="flex items-center">
                {isDarkMode ? <Sun className="w-4 h-4 mr-2 text-amber-400" /> : <Moon className="w-4 h-4 mr-2 text-slate-600" />}
                Dark Mode
              </span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${isDarkMode ? 'left-6' : 'left-1'}`} />
              </div>
            </button>

            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${highContrast ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <span className="flex items-center"><Eye className="w-4 h-4 mr-2" /> High Contrast</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? 'bg-green-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${highContrast ? 'left-6' : 'left-1'}`} />
              </div>
            </button>

            <button
              onClick={() => setLargeText(!largeText)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${largeText ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <span className="flex items-center"><Type className="w-4 h-4 mr-2" /> Large Text</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${largeText ? 'bg-green-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${largeText ? 'left-6' : 'left-1'}`} />
              </div>
            </button>

            {speechSynthesisAvailable && (
              <button
                onClick={() => setReadingMode(!readingMode)}
                title="Select any text on the page to hear it read aloud"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${readingMode ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                <span className="flex items-center">
                  {readingMode ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                  Read Aloud
                </span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${readingMode ? 'bg-green-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${readingMode ? 'left-6' : 'left-1'}`} />
                </div>
              </button>
            )}
            {readingMode && (
              <p className="text-xs text-gray-500 mt-2 px-1">
                Reading mode is on. Select any text on the page to hear it spoken.
              </p>
            )}
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
        aria-label="Open accessibility tools"
      >
        <Accessibility className="w-7 h-7" />
      </button>
    </div>
  );
}

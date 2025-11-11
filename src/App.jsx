import React, { useState, useEffect, useRef } from 'react';
import { TypeSelector } from './components/TypeSelector.jsx';
import { DynamicFormBuilder } from './components/DynamicFormBuilder.jsx';
import { PreviewPanel } from './components/PreviewPanel.jsx';
import { ExportOptions } from './components/ExportOptions.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { FeaturesSection } from './components/FeaturesSection.jsx';
import { AboutSection } from './components/AboutSection.jsx';
import { FAQSection } from './components/FAQSection.jsx';
import { Button } from './components/ui/button.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip.jsx';
import { schemas } from './schemas/index.js';
import { cleanSchema } from './utils/formToSchema.js';
import { ArrowLeft, Undo, Redo, RotateCcw, Moon, Sun } from 'lucide-react';
import { useDebounce } from './hooks/useDebounce.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { useUndoRedo } from './hooks/useUndoRedo.js';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext.jsx';

function AppContent() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [selectedType, setSelectedType] = useState(null);
  const [generatedSchema, setGeneratedSchema] = useState(null);

  // Undo/Redo for form data
  const {
    state: formData,
    setState: setFormData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo({});

  // Debounce form data to avoid regenerating schema on every keystroke
  const debouncedFormData = useDebounce(formData, 300);

  useEffect(() => {
    if (selectedType && debouncedFormData) {
      generateSchema();
    }
  }, [debouncedFormData, selectedType]);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setFormData({});
    setGeneratedSchema(null);

    if (type) {
      // When selecting a schema type, go to top
      window.scrollTo(0, 0);
    } else {
      // When going back, scroll to schema selector section
      setTimeout(() => {
        document.getElementById('schema-selector')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleFormChange = (data) => {
    setFormData(data);
  };


  const generateSchema = () => {
    if (!selectedType) return;

    const schema = schemas[selectedType];
    if (!schema || !schema.transform) return;

    try {
      const generated = schema.transform(debouncedFormData);
      const cleaned = cleanSchema(generated);
      setGeneratedSchema(cleaned);
    } catch (error) {
      console.error('Error generating schema:', error);
    }
  };

  const currentSchema = selectedType ? schemas[selectedType] : null;

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+k': (e) => {
      // Copy schema to clipboard
      if (generatedSchema) {
        const jsonString = JSON.stringify(generatedSchema, null, 2);
        navigator.clipboard.writeText(jsonString).then(() => {
          console.log('Schema copied to clipboard!');
        });
      }
    },
    'cmd+z': (e) => {
      // Undo
      if (canUndo) {
        undo();
      }
    },
    'cmd+shift+z': (e) => {
      // Redo
      if (canRedo) {
        redo();
      }
    },
    'escape': (e) => {
      // Go back
      if (selectedType) {
        handleSelectType(null);
      }
    },
  });

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
        <div className="container flex h-16 items-center px-4 mx-auto max-w-7xl">
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Schema Markup Generator
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Generate valid JSON-LD structured data</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedType && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={undo}
                        disabled={!canUndo}
                        className="gap-1"
                        aria-label="Undo"
                      >
                        <Undo className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Undo (⌘/Ctrl + Z)</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={redo}
                        disabled={!canRedo}
                        className="gap-1"
                        aria-label="Redo"
                      >
                        <Redo className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Redo (⌘/Ctrl + Shift + Z)</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDarkMode}
                    className="gap-1"
                    aria-label="Toggle dark mode"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        {!selectedType ? (
          <>
            <HeroSection onGetStarted={() => document.getElementById('schema-selector')?.scrollIntoView({ behavior: 'smooth' })} />
            <div id="schema-selector" className="max-w-7xl mx-auto px-4 py-12 md:py-16">
              <TypeSelector onSelectType={handleSelectType} selectedType={selectedType} />
            </div>
            <FeaturesSection />
            <AboutSection />
            <FAQSection />
          </>
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Schema Form View */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => handleSelectType(null)}
                  className="gap-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Schema Types
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({});
                    setGeneratedSchema(null);
                  }}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Form
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Panel - Form (3 columns) */}
                <div className="lg:col-span-3 space-y-6">
                  <DynamicFormBuilder
                    schema={currentSchema}
                    formData={formData}
                    onChange={handleFormChange}
                  />
                </div>

                {/* Right Panel - Preview & Export (2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="lg:sticky lg:top-20 space-y-6">
                    <PreviewPanel
                      jsonLD={generatedSchema}
                      schema={currentSchema}
                    />

                    {generatedSchema && (
                      <ExportOptions jsonLD={generatedSchema} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 text-center md:text-left">
            {/* Brand Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Schema Markup Generator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Generate valid JSON-LD structured data for SEO. Free, fast, and reliable tool for creating Schema.org markup.
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div>
                  Powered by{' '}
                  <a
                    href="https://scalinghigh.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold hover:underline"
                  >
                    Scaling High Technologies
                  </a>
                </div>
                <div>
                  Need SEO, Web Development, or Graphic Design?{' '}
                  <a
                    href="https://www.scalinghigh.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold hover:underline"
                  >
                    Get in touch
                  </a>
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://schema.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Schema.org Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://developers.google.com/search/docs/appearance/structured-data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Google Search Central
                  </a>
                </li>
                <li>
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Google Rich Results Test
                  </a>
                </li>
                <li>
                  <a
                    href="https://validator.schema.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Schema.org Validator
                  </a>
                </li>
              </ul>
            </div>

            {/* About Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">About This Tool</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ 100% Free & Open Source</li>
                <li>✓ No Signup Required</li>
                <li>✓ Client-Side Processing</li>
                <li>✓ Privacy-First Design</li>
                <li>✓ Real-Time Validation</li>
                <li>✓ Google-Ready Code</li>
              </ul>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-6 border-t border-gray-200 dark:border-gray-800">
            🔒 All code generation happens client-side in your browser. No data is sent to any server. Your content stays completely private.
          </div>

          {/* Keyboard Shortcuts (only shown when in form view) */}
          {selectedType && (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center gap-4 flex-wrap">
              <span className="font-medium">Keyboard Shortcuts:</span>
              <span className="flex items-center gap-1">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">⌘/Ctrl + K</span>
                <span>Copy Code</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">⌘/Ctrl + Z</span>
                <span>Undo</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">Esc</span>
                <span>Back</span>
              </span>
            </div>
          )}

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-200 dark:border-gray-800">
            © {new Date().getFullYear()} Scaling High Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
    </TooltipProvider>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

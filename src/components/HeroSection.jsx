import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export function HeroSection({ onGetStarted }) {
  return (
    <section className="w-full py-16 md:py-20 bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-hidden">
      {/* Dotted Pattern Background */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #9333ea 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Breadcrumbs - Left aligned to match header */}
        <nav className="flex items-start text-sm text-gray-600 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <a
                href="https://www.scalinghigh.com"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Home
              </a>
            </li>
            <li>
              <ChevronRight className="w-4 h-4" />
            </li>
            <li className="text-gray-900 dark:text-gray-100 font-medium" aria-current="page">
              Schema Markup Generator
            </li>
          </ol>
        </nav>

        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
              Free Schema Markup Generator
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Generate valid JSON-LD structured data for SEO in seconds
          </p>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Create Schema.org markup for 14 schema types including Articles, Products, Events, Recipes, Videos, Job Postings, and more with real-time validation. No signup required, 100% free.
          </p>

          <div className="flex justify-center pt-2">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="gap-2 text-base md:text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all bg-purple-600 hover:bg-purple-700 text-white"
            >
              Generate Schema Markup
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center md:justify-start gap-2 px-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Real-time validation & error checking</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 px-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Google-ready JSON-LD code</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 px-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">No signup, 100% client-side</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

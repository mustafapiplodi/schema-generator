import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Zap, Shield, Code2, Smartphone, RefreshCw, Globe } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Real-Time Validation',
    description: 'Instant validation as you type. Catch errors before generating code with our 4-level validation system (syntax, structure, Schema.org compliance, Google requirements).'
  },
  {
    icon: Shield,
    title: 'Google-Ready Markup',
    description: 'Generate schema markup that passes Google Rich Results Test without manual editing. Validated against Google Search Central guidelines.'
  },
  {
    icon: Code2,
    title: 'Clean JSON-LD Code',
    description: 'Generate clean, valid JSON-LD structured data. Empty fields are automatically omitted. XSS protection included. Copy or download instantly.'
  },
  {
    icon: Smartphone,
    title: 'Mobile-Friendly Interface',
    description: 'Fully responsive design works perfectly on desktop, tablet, and mobile devices. Generate schema markup anywhere, anytime.'
  },
  {
    icon: RefreshCw,
    title: 'Auto-Save & Undo/Redo',
    description: 'Never lose your work with automatic saving. Full undo/redo support with keyboard shortcuts (Cmd/Ctrl + Z).'
  },
  {
    icon: Globe,
    title: '100% Client-Side Privacy',
    description: 'All schema generation happens in your browser. No data sent to servers. Your content stays completely private and secure.'
  }
];

export function FeaturesSection() {
  return (
    <section className="w-full py-16 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Why Use Our Schema Markup Generator?
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            The most reliable tool for creating valid structured data. Trusted by SEO professionals, developers, and content creators worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

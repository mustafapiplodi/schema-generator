import React from 'react';
import { Card, CardContent } from './ui/card';
import {
  FileText,
  ShoppingBag,
  Store,
  Building2,
  Link as LinkIcon,
  HelpCircle,
  Calendar,
  UtensilsCrossed,
  Video,
  BookOpen,
  Briefcase,
  Star,
  Globe,
  User
} from 'lucide-react';

export function AboutSection() {
  return (
    <section className="w-full py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-12">
          {/* What is Schema Markup */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              What is Schema Markup?
            </h2>
            <div className="max-w-4xl mx-auto space-y-4 text-left">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Schema markup (also known as structured data) is code you add to your website to help search engines understand your content better. Using Schema.org vocabulary in JSON-LD format, you can provide explicit information about your pages, products, articles, businesses, and more.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                When implemented correctly, schema markup enables <strong>rich results</strong> in Google Search - enhanced search listings that can include images, ratings, prices, event dates, and other valuable information. These rich snippets significantly improve click-through rates and drive more qualified traffic to your website.
              </p>
            </div>
          </div>

          {/* How to Use */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
              How to Use This Schema Generator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 font-bold text-purple-600 dark:text-purple-400">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Select Schema Type</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Choose the type of structured data you need: Article, Product, LocalBusiness, Organization, Breadcrumb, or FAQ. Each type is optimized for specific content.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 font-bold text-purple-600 dark:text-purple-400">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Fill in the Form</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enter your content details. Required fields are marked with a red asterisk (*), recommended fields with an orange dot. Real-time validation guides you.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 font-bold text-purple-600 dark:text-purple-400">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Preview & Validate</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Watch the JSON-LD code generate in real-time as you type. Our validator checks syntax, structure, Schema.org compliance, and Google requirements instantly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 font-bold text-purple-600 dark:text-purple-400">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Copy & Implement</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Copy the generated code or download as JSON. Paste it into your website's &lt;head&gt; section or use with Google Tag Manager. Test with Google Rich Results Test.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Supported Schema Types */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
              14 Schema Types Supported
            </h2>
            <p className="text-center text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive coverage for all your structured data needs - from articles and products to events and job postings
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Article</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Blog posts, news, editorial</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <ShoppingBag className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Product</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">E-commerce products</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <Store className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Local Business</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Restaurants, stores, services</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Organization</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Companies and brands</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <LinkIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Breadcrumb</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Site navigation paths</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <HelpCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">FAQ</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Questions and answers</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Event</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Concerts, conferences, webinars</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <UtensilsCrossed className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recipe</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Food recipes and cooking</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <Video className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Video</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Video content and YouTube</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">HowTo</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Tutorials and guides</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Job Posting</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Career opportunities</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <Star className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Review</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Product and service reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">WebSite</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Site-wide markup</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <User className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Person</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Authors and professionals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
              Benefits of Using Schema Markup
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex gap-3">
                <div className="text-2xl">🚀</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Higher Click-Through Rates</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Rich results with images, ratings, and additional info attract more clicks than standard search results.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">📊</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Better Search Visibility</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Enhanced search listings stand out in SERPs, increasing your brand visibility and authority.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">More Qualified Traffic</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Detailed search results help users find exactly what they need, bringing more relevant visitors to your site.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">AI-Ready Content</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Structured data helps AI assistants (ChatGPT, Google Gemini, Perplexity) understand and reference your content accurately.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

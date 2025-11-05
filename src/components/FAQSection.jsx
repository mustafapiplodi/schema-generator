import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const faqs = [
  {
    question: "What is a schema markup generator?",
    answer: "A schema markup generator is a tool that helps you create structured data code (JSON-LD) that search engines can understand. Our generator creates valid Schema.org markup that helps your content appear as rich results in Google Search with enhanced features like images, ratings, prices, and other valuable information."
  },
  {
    question: "Is this schema generator really free?",
    answer: "Yes, this tool is 100% free with no hidden costs, no signup required, and no credit card needed. You can generate unlimited schema markup for all supported types (Article, Product, LocalBusiness, Organization, Breadcrumb, FAQ) without any restrictions."
  },
  {
    question: "Do I need technical knowledge to use this tool?",
    answer: "No technical knowledge is required. Our intuitive interface guides you through each step with clear labels, examples, and real-time validation. Required fields are marked with a red asterisk (*), recommended fields with an orange dot. Simply fill in the form and copy the generated code."
  },
  {
    question: "What is JSON-LD and why should I use it?",
    answer: "JSON-LD (JavaScript Object Notation for Linked Data) is Google's recommended format for structured data. It's easier to implement than alternatives (Microdata, RDFa) because you can add it anywhere in your HTML without modifying your existing markup. JSON-LD is also more maintainable and less error-prone."
  },
  {
    question: "Will this schema markup work with my website?",
    answer: "Yes, our generated JSON-LD code works with any website platform including WordPress, Shopify, Wix, Squarespace, custom HTML sites, and more. The code is universal and can be added to your website's <head> section, footer, or implemented through Google Tag Manager."
  },
  {
    question: "How do I add the generated schema markup to my website?",
    answer: "After generating your schema markup: 1) Copy the JSON-LD code, 2) Paste it into your website's HTML within a <script type=\"application/ld+json\"> tag in the <head> section, or 3) Use Google Tag Manager with a Custom HTML tag. After implementation, validate your markup using Google's Rich Results Test tool."
  },
  {
    question: "Does schema markup guarantee rich results in Google?",
    answer: "While schema markup makes your site eligible for rich results, Google doesn't guarantee they will display. Rich results depend on several factors including content quality, schema accuracy, and Google's algorithmic decisions. However, properly implemented schema markup significantly increases your chances of getting enhanced search listings."
  },
  {
    question: "How do I validate my generated schema markup?",
    answer: "After generating your code, validate it using Google's Rich Results Test (search.google.com/test/rich-results) or Schema.org Validator (validator.schema.org). Our generator includes real-time validation, but testing with official tools confirms your implementation meets all requirements."
  },
  {
    question: "Can I generate multiple schema types for one page?",
    answer: "Yes, you can use multiple schema types on a single page. For example, an article about a product could have both Article and Product schema. Generate each type separately and add all the JSON-LD scripts to your page. Make sure they're logically consistent and represent actual content on the page."
  },
  {
    question: "Is my data safe? Do you store my information?",
    answer: "Your data is completely safe and private. All schema generation happens 100% client-side in your browser. No data is ever sent to our servers or stored anywhere. Your content stays on your device. You can even use this tool offline after the initial page load."
  },
  {
    question: "What's the difference between required and recommended fields?",
    answer: "Required fields (marked with red *) must be filled for valid schema markup. Recommended fields (marked with orange dot) are strongly suggested by Google and significantly improve your chances of getting rich results. Optional fields enhance your schema but aren't critical for basic implementation."
  },
  {
    question: "Can I save my schema markup for later editing?",
    answer: "Yes, our tool includes auto-save functionality. Your work is automatically saved in your browser's local storage every few seconds. You can also download the JSON file for your records or to share with your development team."
  },
  {
    question: "Does this work for e-commerce product pages?",
    answer: "Absolutely! Our Product schema generator is specifically designed for e-commerce. It supports all important properties including price, currency, availability, SKU, GTIN, brand, ratings, reviews, and more. This helps your products appear in Google Shopping results and product rich snippets."
  },
  {
    question: "How often should I update my schema markup?",
    answer: "Update your schema markup whenever the underlying content changes. For Product schema, update prices, availability, and ratings regularly. For Article schema, update the dateModified field when you make substantial changes. Keep schema markup synchronized with visible page content to avoid penalties."
  },
  {
    question: "What if I need help or have a question?",
    answer: "Each field in our generator includes tooltips with examples and explanations. For more comprehensive guidance, refer to Google Search Central documentation or Schema.org vocabulary. If you encounter technical issues, check that your generated code passes Google's Rich Results Test."
  }
];

export function FAQSection() {
  return (
    <section className="w-full py-16 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about schema markup and our generator
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-6 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-gray-100 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Still have questions?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            For more detailed information about structured data and schema markup, visit these official resources:
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://schema.org/docs/documents.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium hover:underline"
            >
              Schema.org Documentation →
            </a>
            <a
              href="https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium hover:underline"
            >
              Google Search Central →
            </a>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium hover:underline"
            >
              Rich Results Test →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

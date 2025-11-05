/**
 * Comprehensive Schema Test Suite
 * Tests all 14 schema types for proper generation and validation
 */

import { schemas } from './src/schemas/index.js';
import { cleanSchema } from './src/utils/formToSchema.js';

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Test data for each schema type
const testData = {
  article: {
    articleType: 'Article',
    headline: 'How to Build a Schema Markup Generator',
    description: 'A comprehensive guide to building a schema markup generator with real-time validation.',
    imageUrl: 'https://example.com/image.jpg',
    datePublished: '2024-01-15T08:00:00+00:00',
    dateModified: '2024-01-20T10:00:00+00:00',
    authorName: 'John Doe',
    authorUrl: 'https://example.com/author/john-doe',
    publisherName: 'Tech Blog',
    publisherLogoUrl: 'https://example.com/logo.png'
  },

  product: {
    name: 'iPhone 15 Pro',
    description: 'The latest iPhone with A17 Pro chip and titanium design.',
    images: ['https://example.com/iphone-1.jpg', 'https://example.com/iphone-2.jpg'],
    brand: 'Apple',
    price: '999.00',
    currency: 'USD',
    availability: 'https://schema.org/InStock',
    condition: 'https://schema.org/NewCondition',
    sku: 'IPH15PRO-128-BLU',
    gtin: '0190199559871',
    ratingValue: '4.5',
    reviewCount: '1250',
    bestRating: '5',
    worstRating: '1'
  },

  localBusiness: {
    businessType: 'Restaurant',
    name: 'The Italian Kitchen',
    streetAddress: '123 Main Street',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94102',
    addressCountry: 'US',
    telephone: '+1-415-555-0123',
    latitude: '37.7749',
    longitude: '-122.4194',
    priceRange: '$$',
    openingHours: [
      { day: 'Monday', open: '11:00', close: '22:00', closed: false },
      { day: 'Tuesday', open: '11:00', close: '22:00', closed: false }
    ]
  },

  organization: {
    name: 'Acme Corporation',
    url: 'https://example.com',
    logoUrl: 'https://example.com/logo.png',
    description: 'A leading technology company specializing in innovative solutions.',
    telephone: '+1-555-123-4567',
    email: 'info@example.com',
    socialProfiles: [
      'https://facebook.com/acmecorp',
      'https://twitter.com/acmecorp',
      'https://linkedin.com/company/acmecorp'
    ],
    foundingDate: '2010-01-01'
  },

  breadcrumb: {
    items: [
      { name: 'Home', url: 'https://example.com/' },
      { name: 'Products', url: 'https://example.com/products' },
      { name: 'Electronics', url: 'https://example.com/products/electronics' },
      { name: 'iPhone 15', url: 'https://example.com/products/electronics/iphone-15' }
    ]
  },

  faq: {
    questions: [
      {
        question: 'What is schema markup?',
        answer: 'Schema markup is structured data that helps search engines understand your content better.'
      },
      {
        question: 'How do I implement schema markup?',
        answer: 'You can implement schema markup by adding JSON-LD script tags to your HTML pages.'
      },
      {
        question: 'Is schema markup required for SEO?',
        answer: 'While not required, schema markup can significantly improve your search visibility and CTR.'
      }
    ]
  },

  event: {
    name: 'Web Development Conference 2024',
    description: 'Annual conference for web developers featuring latest trends and technologies.',
    startDate: '2024-06-15T09:00:00-07:00',
    endDate: '2024-06-17T18:00:00-07:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    locationName: 'Convention Center',
    streetAddress: '456 Conference Blvd',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94102',
    addressCountry: 'US',
    url: 'https://example.com/conference-2024',
    imageUrl: 'https://example.com/conference.jpg',
    organizerName: 'Tech Events Inc',
    organizerUrl: 'https://example.com/organizer'
  },

  recipe: {
    name: 'Classic Chocolate Chip Cookies',
    description: 'Delicious homemade chocolate chip cookies that are crispy on the outside and soft inside.',
    imageUrl: 'https://example.com/cookies.jpg',
    prepTime: 'PT15M',
    cookTime: 'PT12M',
    totalTime: 'PT27M',
    recipeYield: '24 cookies',
    recipeCategory: 'Dessert',
    recipeCuisine: 'American',
    keywords: 'cookies, chocolate chip, baking, dessert',
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 cup butter, softened',
      '3/4 cup granulated sugar',
      '2 cups chocolate chips'
    ],
    instructions: [
      'Preheat oven to 375°F',
      'Mix butter and sugars until creamy',
      'Add eggs and vanilla',
      'Mix in flour gradually',
      'Stir in chocolate chips',
      'Bake for 10-12 minutes'
    ]
  },

  video: {
    name: 'How to Create Schema Markup',
    description: 'Learn how to create and implement schema markup for better SEO.',
    thumbnailUrl: 'https://example.com/video-thumbnail.jpg',
    uploadDate: '2024-01-15T10:00:00Z',
    duration: 'PT10M30S',
    contentUrl: 'https://example.com/video.mp4',
    embedUrl: 'https://example.com/embed/video',
    videoQuality: 'HD'
  },

  howto: {
    name: 'How to Install a Light Fixture',
    description: 'Step-by-step guide to safely installing a ceiling light fixture.',
    imageUrl: 'https://example.com/light-fixture.jpg',
    totalTime: 'PT45M',
    estimatedCost: { currency: 'USD', value: '50' },
    supply: [
      'Light fixture',
      'Wire connectors',
      'Electrical tape',
      'Voltage tester'
    ],
    tool: [
      'Screwdriver',
      'Wire stripper',
      'Ladder',
      'Voltage tester'
    ],
    steps: [
      {
        name: 'Turn off power',
        text: 'Turn off the circuit breaker for the room where you will be working.',
        url: 'https://example.com/howto/step1'
      },
      {
        name: 'Remove old fixture',
        text: 'Carefully remove the old light fixture and disconnect the wires.',
        url: 'https://example.com/howto/step2'
      }
    ]
  },

  jobPosting: {
    title: 'Senior Software Engineer',
    description: 'We are seeking an experienced software engineer to join our growing team.',
    datePosted: '2024-01-15',
    validThrough: '2024-03-15',
    employmentType: 'FULL_TIME',
    hiringOrganizationName: 'Tech Corp',
    hiringOrganizationUrl: 'https://example.com',
    hiringOrganizationLogoUrl: 'https://example.com/logo.png',
    streetAddress: '789 Tech Drive',
    addressLocality: 'Seattle',
    addressRegion: 'WA',
    postalCode: '98101',
    addressCountry: 'US',
    baseSalaryCurrency: 'USD',
    baseSalaryValue: '150000',
    baseSalaryUnit: 'YEAR'
  },

  review: {
    itemReviewedType: 'Product',
    itemName: 'Awesome Product',
    reviewRating: '5',
    bestRating: '5',
    worstRating: '1',
    reviewBody: 'This product exceeded my expectations. Highly recommended!',
    reviewAuthor: 'Jane Smith',
    datePublished: '2024-01-15'
  },

  website: {
    name: 'Tech Blog',
    url: 'https://example.com',
    description: 'A blog about technology, programming, and web development.',
    inLanguage: 'en-US',
    publisher: 'Tech Media Inc',
    searchUrl: 'https://example.com/search?q={search_term_string}'
  },

  person: {
    name: 'John Doe',
    givenName: 'John',
    familyName: 'Doe',
    jobTitle: 'Software Engineer',
    url: 'https://johndoe.com',
    imageUrl: 'https://example.com/johndoe.jpg',
    email: 'john@example.com',
    telephone: '+1-555-987-6543',
    sameAs: [
      'https://twitter.com/johndoe',
      'https://linkedin.com/in/johndoe',
      'https://github.com/johndoe'
    ]
  }
};

// Validation functions
function validateJSONLD(jsonLD) {
  const errors = [];
  const warnings = [];

  // Level 1: JSON Syntax - already validated by transform
  if (!jsonLD) {
    errors.push('Schema generation failed - returned null or undefined');
    return { valid: false, errors, warnings };
  }

  // Level 2: JSON-LD Structure
  if (jsonLD['@context'] !== 'https://schema.org') {
    errors.push('@context must be "https://schema.org"');
  }

  if (!jsonLD['@type']) {
    errors.push('@type is required');
  }

  // Level 3: Schema.org Compliance - Check for common required fields
  const schemaType = jsonLD['@type'];

  switch (schemaType) {
    case 'Article':
    case 'BlogPosting':
    case 'NewsArticle':
      if (!jsonLD.headline) errors.push('headline is required for Article');
      if (!jsonLD.image) warnings.push('image is recommended for Article');
      if (!jsonLD.datePublished) errors.push('datePublished is required for Article');
      if (jsonLD.headline && jsonLD.headline.length > 110) {
        warnings.push(`headline is ${jsonLD.headline.length} chars (max 110 recommended)`);
      }
      break;

    case 'Product':
      if (!jsonLD.name) errors.push('name is required for Product');
      if (!jsonLD.image) warnings.push('image is recommended for Product');
      if (!jsonLD.offers) warnings.push('offers is recommended for Product');
      if (jsonLD.offers && !jsonLD.offers.price) {
        warnings.push('price is recommended in offers');
      }
      break;

    case 'LocalBusiness':
    case 'Restaurant':
    case 'Store':
      if (!jsonLD.name) errors.push('name is required for LocalBusiness');
      if (!jsonLD.address) warnings.push('address is recommended for LocalBusiness');
      break;

    case 'Organization':
      if (!jsonLD.name) warnings.push('name is recommended for Organization');
      if (!jsonLD.url) warnings.push('url is recommended for Organization');
      break;

    case 'BreadcrumbList':
      if (!jsonLD.itemListElement || !Array.isArray(jsonLD.itemListElement)) {
        errors.push('itemListElement array is required for BreadcrumbList');
      } else if (jsonLD.itemListElement.length < 2) {
        warnings.push('At least 2 breadcrumb items are recommended');
      }
      break;

    case 'FAQPage':
      if (!jsonLD.mainEntity || !Array.isArray(jsonLD.mainEntity)) {
        errors.push('mainEntity array is required for FAQPage');
      } else if (jsonLD.mainEntity.length < 2) {
        warnings.push('At least 2 questions are recommended for FAQPage');
      }
      break;

    case 'Event':
      if (!jsonLD.name) errors.push('name is required for Event');
      if (!jsonLD.startDate) errors.push('startDate is required for Event');
      if (!jsonLD.location) warnings.push('location is recommended for Event');
      break;

    case 'Recipe':
      if (!jsonLD.name) errors.push('name is required for Recipe');
      if (!jsonLD.recipeIngredient) warnings.push('recipeIngredient is recommended for Recipe');
      if (!jsonLD.recipeInstructions) warnings.push('recipeInstructions is recommended for Recipe');
      break;

    case 'VideoObject':
      if (!jsonLD.name) errors.push('name is required for VideoObject');
      if (!jsonLD.description) errors.push('description is required for VideoObject');
      if (!jsonLD.thumbnailUrl) errors.push('thumbnailUrl is required for VideoObject');
      if (!jsonLD.uploadDate) errors.push('uploadDate is required for VideoObject');
      break;

    case 'HowTo':
      if (!jsonLD.name) errors.push('name is required for HowTo');
      if (!jsonLD.step) warnings.push('step is recommended for HowTo');
      break;

    case 'JobPosting':
      if (!jsonLD.title) errors.push('title is required for JobPosting');
      if (!jsonLD.description) errors.push('description is required for JobPosting');
      if (!jsonLD.datePosted) errors.push('datePosted is required for JobPosting');
      if (!jsonLD.hiringOrganization) errors.push('hiringOrganization is required for JobPosting');
      break;

    case 'Review':
      if (!jsonLD.itemReviewed) errors.push('itemReviewed is required for Review');
      if (!jsonLD.reviewRating) warnings.push('reviewRating is recommended for Review');
      if (!jsonLD.author) warnings.push('author is recommended for Review');
      break;

    case 'WebSite':
      if (!jsonLD.name) warnings.push('name is recommended for WebSite');
      if (!jsonLD.url) errors.push('url is required for WebSite');
      break;

    case 'Person':
      if (!jsonLD.name) errors.push('name is required for Person');
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Test runner
async function runTests() {
  console.log(`${colors.bold}${colors.cyan}========================================`);
  console.log(`  Schema Markup Generator Test Suite`);
  console.log(`========================================${colors.reset}\n`);

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: {}
  };

  for (const [schemaType, data] of Object.entries(testData)) {
    results.total++;
    const schema = schemas[schemaType];

    console.log(`${colors.bold}Testing: ${schemaType}${colors.reset}`);
    console.log(`${colors.blue}${'─'.repeat(50)}${colors.reset}`);

    if (!schema) {
      console.log(`${colors.red}✗ Schema definition not found${colors.reset}\n`);
      results.failed++;
      results.details[schemaType] = { success: false, error: 'Schema not found' };
      continue;
    }

    if (!schema.transform) {
      console.log(`${colors.red}✗ Transform function not found${colors.reset}\n`);
      results.failed++;
      results.details[schemaType] = { success: false, error: 'Transform function missing' };
      continue;
    }

    try {
      // Generate schema
      const generated = schema.transform(data);
      const cleaned = cleanSchema(generated);

      // Validate
      const validation = validateJSONLD(cleaned);

      // Display results
      console.log(`${colors.green}✓ Schema generated successfully${colors.reset}`);
      console.log(`  @type: ${cleaned['@type']}`);
      console.log(`  Properties: ${Object.keys(cleaned).length}`);

      if (validation.errors.length > 0) {
        console.log(`${colors.red}\n  Errors (${validation.errors.length}):${colors.reset}`);
        validation.errors.forEach(err => console.log(`    • ${err}`));
      }

      if (validation.warnings.length > 0) {
        console.log(`${colors.yellow}\n  Warnings (${validation.warnings.length}):${colors.reset}`);
        validation.warnings.forEach(warn => console.log(`    • ${warn}`));
      }

      // Check if valid JSON
      const jsonString = JSON.stringify(cleaned, null, 2);
      JSON.parse(jsonString); // Will throw if invalid

      console.log(`${colors.green}✓ Valid JSON-LD format${colors.reset}`);

      if (validation.valid) {
        console.log(`${colors.green}✓ Schema validation passed${colors.reset}`);
        results.passed++;
        results.details[schemaType] = {
          success: true,
          warnings: validation.warnings,
          schema: cleaned
        };
      } else {
        console.log(`${colors.yellow}⚠ Schema has validation errors${colors.reset}`);
        results.failed++;
        results.details[schemaType] = {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          schema: cleaned
        };
      }

    } catch (error) {
      console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
      results.failed++;
      results.details[schemaType] = {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }

    console.log(); // Empty line between tests
  }

  // Summary
  console.log(`${colors.bold}${colors.cyan}========================================`);
  console.log(`  Test Summary`);
  console.log(`========================================${colors.reset}`);
  console.log(`Total Tests:  ${results.total}`);
  console.log(`${colors.green}Passed:       ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed:       ${results.failed}${colors.reset}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`);

  // Save detailed results
  const fs = await import('fs');
  fs.writeFileSync(
    './test-results.json',
    JSON.stringify(results, null, 2)
  );
  console.log(`${colors.cyan}Detailed results saved to: test-results.json${colors.reset}\n`);

  return results;
}

// Run tests
runTests().catch(console.error);

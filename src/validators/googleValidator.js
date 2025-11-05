/**
 * Level 4: Google Rich Results Requirements Validator
 * Validates Google-specific requirements for rich result eligibility
 */

export function validateGoogleRequirements(schema, schemaType) {
  const errors = [];
  const warnings = [];

  switch (schemaType) {
    case 'Article':
    case 'BlogPosting':
    case 'NewsArticle':
      validateArticle(schema, errors, warnings);
      break;
    case 'Product':
      validateProduct(schema, errors, warnings);
      break;
    case 'LocalBusiness':
      validateLocalBusiness(schema, errors, warnings);
      break;
    case 'Organization':
      validateOrganization(schema, errors, warnings);
      break;
    case 'BreadcrumbList':
      validateBreadcrumb(schema, errors, warnings);
      break;
    case 'FAQPage':
      validateFAQ(schema, errors, warnings);
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function validateArticle(schema, errors, warnings) {
  // Headline max 110 characters (Google requirement)
  if (schema.headline && schema.headline.length > 110) {
    warnings.push({
      severity: 'warning',
      message: 'Headline exceeds 110 characters',
      detail: `Your headline is ${schema.headline.length} characters. Google may truncate headlines over 110 characters. Current: ${schema.headline.length}/110`
    });
  }

  // Image requirements
  if (!schema.image) {
    warnings.push({
      severity: 'warning',
      message: 'Image is strongly recommended',
      detail: 'Images significantly improve rich result eligibility and appearance. Minimum 50,000 pixels (e.g., 696px width)'
    });
  }

  // Author should be structured
  if (schema.author && typeof schema.author === 'string') {
    errors.push({
      severity: 'error',
      message: 'Author must be a Person or Organization object',
      detail: 'Author should be structured as {"@type": "Person", "name": "...", "url": "..."} not a plain string'
    });
  }

  // Publisher should be structured
  if (schema.publisher && typeof schema.publisher === 'string') {
    errors.push({
      severity: 'error',
      message: 'Publisher must be an Organization object',
      detail: 'Publisher should include name and logo as ImageObject'
    });
  }
}

function validateProduct(schema, errors, warnings) {
  // Must have offers, review, or aggregateRating for rich results
  const hasOffers = schema.offers && Object.keys(schema.offers).length > 0;
  const hasReview = schema.review && (Array.isArray(schema.review) ? schema.review.length > 0 : true);
  const hasRating = schema.aggregateRating && Object.keys(schema.aggregateRating).length > 0;

  if (!hasOffers && !hasReview && !hasRating) {
    warnings.push({
      severity: 'warning',
      message: 'Product should have offers, review, or aggregateRating',
      detail: 'At least one of these properties is needed for Product rich results'
    });
  }

  // Price must use period as decimal separator
  if (schema.offers?.price) {
    const priceStr = String(schema.offers.price);
    if (priceStr.includes(',')) {
      errors.push({
        severity: 'error',
        message: 'Price must use period as decimal separator',
        detail: 'Google requires prices to use period (.) not comma (,). Example: 29.99 not 29,99'
      });
    }
  }

  // Validate availability
  if (schema.offers?.availability) {
    const validAvailability = [
      'https://schema.org/InStock',
      'https://schema.org/OutOfStock',
      'https://schema.org/PreOrder',
      'https://schema.org/Discontinued',
      'https://schema.org/SoldOut',
      'https://schema.org/LimitedAvailability',
      'https://schema.org/OnlineOnly',
      'https://schema.org/PreSale'
    ];

    if (!validAvailability.includes(schema.offers.availability)) {
      errors.push({
        severity: 'error',
        message: 'Invalid availability value',
        detail: 'Availability must be a full schema.org URL like "https://schema.org/InStock"'
      });
    }
  }

  // Brand or manufacturer recommended
  if (!schema.brand && !schema.manufacturer) {
    warnings.push({
      severity: 'warning',
      message: 'Brand or manufacturer is recommended',
      detail: 'Adding brand or manufacturer significantly improves rich result quality'
    });
  }
}

function validateLocalBusiness(schema, errors, warnings) {
  // Address must be structured
  if (schema.address && typeof schema.address === 'string') {
    errors.push({
      severity: 'error',
      message: 'Address must be a PostalAddress object',
      detail: 'Address should be structured with streetAddress, addressLocality, addressRegion, postalCode, addressCountry'
    });
  }

  // Telephone should have country code
  if (schema.telephone && !schema.telephone.startsWith('+')) {
    warnings.push({
      severity: 'warning',
      message: 'Telephone should include country code with + prefix',
      detail: 'Example: +1-555-123-4567'
    });
  }

  // Geo coordinates recommended
  if (!schema.geo) {
    warnings.push({
      severity: 'warning',
      message: 'Geo coordinates are recommended',
      detail: 'GeoCoordinates (latitude/longitude) improve local search visibility. Use at least 5 decimal places for precision.'
    });
  }

  // NAP consistency warning
  warnings.push({
    severity: 'suggestion',
    message: 'Ensure NAP consistency',
    detail: 'Your Name, Address, Phone (NAP) must match your Google Business Profile exactly to avoid entity confusion'
  });
}

function validateOrganization(schema, errors, warnings) {
  // Logo recommended
  if (!schema.logo) {
    warnings.push({
      severity: 'warning',
      message: 'Logo is recommended',
      detail: 'Logo should be square or wide rectangle (not tall) for proper display in Knowledge Graph'
    });
  }

  // sameAs recommended for E-E-A-T
  if (!schema.sameAs || (Array.isArray(schema.sameAs) && schema.sameAs.length === 0)) {
    warnings.push({
      severity: 'warning',
      message: 'sameAs links are recommended',
      detail: 'Links to social media profiles, Wikipedia, etc. are vital for E-E-A-T signals and entity recognition'
    });
  }
}

function validateBreadcrumb(schema, errors, warnings) {
  // Must have at least 2 items
  if (!schema.itemListElement || schema.itemListElement.length < 2) {
    errors.push({
      severity: 'error',
      message: 'Breadcrumb must have at least 2 items',
      detail: 'BreadcrumbList requires minimum 2 ListItem objects for valid breadcrumb navigation'
    });
  }

  // Validate sequential positions
  if (schema.itemListElement && Array.isArray(schema.itemListElement)) {
    schema.itemListElement.forEach((item, index) => {
      if (item.position !== index + 1) {
        errors.push({
          severity: 'error',
          message: `Invalid position in breadcrumb item ${index + 1}`,
          detail: `Position should be ${index + 1} but found ${item.position}. Positions must be sequential starting at 1.`
        });
      }

      // Check for absolute URLs
      if (item.item && typeof item.item === 'string' && !item.item.startsWith('http')) {
        errors.push({
          severity: 'error',
          message: `Breadcrumb URL must be absolute`,
          detail: `URLs must include full domain (https://example.com/page), not relative paths (/page)`
        });
      }
    });
  }
}

function validateFAQ(schema, errors, warnings) {
  // Show Google restriction warning
  warnings.push({
    severity: 'warning',
    message: 'FAQ rich results restricted to government/health websites',
    detail: 'As of August 2023, Google only shows FAQ rich results for well-known government and health-focused websites. Other search engines and AI systems may still benefit from this markup.'
  });

  // Must have at least 2 questions
  if (!schema.mainEntity || schema.mainEntity.length < 2) {
    errors.push({
      severity: 'error',
      message: 'FAQ must have at least 2 questions',
      detail: 'FAQPage requires minimum 2 Question objects in mainEntity array'
    });
  }

  // Validate question structure
  if (schema.mainEntity && Array.isArray(schema.mainEntity)) {
    schema.mainEntity.forEach((question, index) => {
      if (!question.acceptedAnswer) {
        errors.push({
          severity: 'error',
          message: `Question ${index + 1} missing acceptedAnswer`,
          detail: 'Each Question must have exactly one acceptedAnswer'
        });
      }

      if (question.acceptedAnswer && !question.acceptedAnswer.text) {
        errors.push({
          severity: 'error',
          message: `Question ${index + 1} answer missing text`,
          detail: 'acceptedAnswer must contain text property with the answer content'
        });
      }
    });
  }
}

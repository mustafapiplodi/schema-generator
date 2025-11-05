/**
 * Product Schema Definition
 * For e-commerce products with offers, reviews, and ratings
 */

export const productSchema = {
  type: 'Product',
  name: 'Product',
  description: 'For e-commerce products and merchant listings',
  icon: '🛍️',
  required: ['name', 'image', 'description', 'offerPrice', 'offerCurrency'],
  recommended: ['brand', 'sku', 'aggregateRatingValue', 'reviewCount'],
  properties: {
    name: {
      type: 'Text',
      label: 'Product Name',
      required: true,
      placeholder: 'Enter product name',
      description: 'The name of the product',
      help: 'Full product name as displayed to users'
    },
    image: {
      type: 'URL',
      label: 'Image URL',
      required: true,
      placeholder: 'https://example.com/product.jpg',
      description: 'URL of the product image',
      help: 'High-quality product image URL'
    },
    description: {
      type: 'Text',
      label: 'Description',
      required: true,
      multiline: true,
      placeholder: 'Detailed product description',
      description: 'Product description',
      help: 'Detailed description of the product features and benefits'
    },
    brand: {
      type: 'Text',
      label: 'Brand',
      recommended: true,
      placeholder: 'Brand Name',
      description: 'Product brand or manufacturer',
      help: 'Brand significantly improves rich result quality'
    },
    offerPrice: {
      type: 'Number',
      label: 'Price',
      required: true,
      placeholder: '29.99',
      description: 'Product price',
      help: 'Use period as decimal separator (e.g., 29.99). Google requirement.'
    },
    offerCurrency: {
      type: 'Select',
      label: 'Currency',
      required: true,
      options: [
        { value: 'USD', label: 'USD - US Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - British Pound' },
        { value: 'CAD', label: 'CAD - Canadian Dollar' },
        { value: 'AUD', label: 'AUD - Australian Dollar' },
        { value: 'JPY', label: 'JPY - Japanese Yen' },
        { value: 'INR', label: 'INR - Indian Rupee' }
      ],
      description: 'ISO 4217 currency code',
      help: 'Three-letter currency code'
    },
    offerAvailability: {
      type: 'Select',
      label: 'Availability',
      recommended: true,
      options: [
        { value: 'https://schema.org/InStock', label: 'In Stock' },
        { value: 'https://schema.org/OutOfStock', label: 'Out of Stock' },
        { value: 'https://schema.org/PreOrder', label: 'Pre-Order' },
        { value: 'https://schema.org/Discontinued', label: 'Discontinued' },
        { value: 'https://schema.org/SoldOut', label: 'Sold Out' },
        { value: 'https://schema.org/LimitedAvailability', label: 'Limited Availability' }
      ],
      description: 'Product availability status',
      help: 'Must use full schema.org URL'
    },
    offerPriceValidUntil: {
      type: 'Date',
      label: 'Price Valid Until',
      placeholder: '2024-12-31',
      description: 'Date until which the price is valid',
      help: 'ISO 8601 date format: YYYY-MM-DD'
    },
    sku: {
      type: 'Text',
      label: 'SKU',
      recommended: true,
      placeholder: 'SKU-12345',
      description: 'Stock Keeping Unit',
      help: 'Your internal product identifier'
    },
    gtin: {
      type: 'Text',
      label: 'GTIN/UPC/EAN',
      placeholder: '0123456789012',
      description: 'Global Trade Item Number',
      help: 'GTIN-8, GTIN-12 (UPC), GTIN-13 (EAN), or GTIN-14. Example: 0123456789012 for UPC'
    },
    mpn: {
      type: 'Text',
      label: 'MPN',
      placeholder: 'MPN-ABC-123',
      description: "Manufacturer's Part Number",
      help: 'Unique manufacturer identifier'
    },
    aggregateRatingValue: {
      type: 'Number',
      label: 'Rating Value',
      recommended: true,
      placeholder: '4.5',
      min: 0,
      max: 5,
      description: 'Average rating value',
      help: 'Average rating (typically 0-5)'
    },
    reviewCount: {
      type: 'Number',
      label: 'Review Count',
      recommended: true,
      placeholder: '150',
      min: 1,
      description: 'Number of reviews',
      help: 'Total number of customer reviews'
    },
    bestRating: {
      type: 'Number',
      label: 'Best Rating',
      placeholder: '5',
      description: 'Highest possible rating',
      help: 'Maximum rating value (typically 5)'
    },
    worstRating: {
      type: 'Number',
      label: 'Worst Rating',
      placeholder: '1',
      description: 'Lowest possible rating',
      help: 'Minimum rating value (typically 1)'
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: formData.name,
      image: formData.image,
      description: formData.description
    };

    if (formData.brand) {
      schema.brand = {
        '@type': 'Brand',
        name: formData.brand
      };
    }

    if (formData.sku) schema.sku = formData.sku;
    if (formData.gtin) schema.gtin = formData.gtin;
    if (formData.mpn) schema.mpn = formData.mpn;

    // Offers object
    if (formData.offerPrice && formData.offerCurrency) {
      schema.offers = {
        '@type': 'Offer',
        price: formData.offerPrice,
        priceCurrency: formData.offerCurrency
      };

      if (formData.offerAvailability) {
        schema.offers.availability = formData.offerAvailability;
      }

      if (formData.offerPriceValidUntil) {
        schema.offers.priceValidUntil = formData.offerPriceValidUntil;
      }
    }

    // Aggregate rating
    if (formData.aggregateRatingValue && formData.reviewCount) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: formData.aggregateRatingValue,
        reviewCount: formData.reviewCount
      };

      if (formData.bestRating) schema.aggregateRating.bestRating = formData.bestRating;
      if (formData.worstRating) schema.aggregateRating.worstRating = formData.worstRating;
    }

    return schema;
  }
};

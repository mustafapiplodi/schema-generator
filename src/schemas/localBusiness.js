/**
 * LocalBusiness Schema Definition
 * For local businesses with physical locations
 */

export const localBusinessSchema = {
  type: 'LocalBusiness',
  name: 'Local Business',
  description: 'For businesses with physical locations',
  icon: '🏪',
  subtypes: [
    { value: 'LocalBusiness', label: 'Local Business (Generic)' },
    { value: 'Restaurant', label: 'Restaurant' },
    { value: 'Store', label: 'Store' },
    { value: 'Dentist', label: 'Dentist' },
    { value: 'DaySpa', label: 'Day Spa' },
    { value: 'HealthAndBeautyBusiness', label: 'Health & Beauty' },
    { value: 'MedicalClinic', label: 'Medical Clinic' },
    { value: 'ProfessionalService', label: 'Professional Service' },
    { value: 'AutoRepair', label: 'Auto Repair' },
    { value: 'LegalService', label: 'Legal Service' },
    { value: 'RealEstateAgent', label: 'Real Estate Agent' },
    { value: 'FoodEstablishment', label: 'Food Establishment' }
  ],
  required: ['name', 'streetAddress', 'addressLocality', 'addressRegion', 'postalCode', 'addressCountry'],
  recommended: ['telephone', 'latitude', 'longitude', 'priceRange'],
  properties: {
    name: {
      type: 'Text',
      label: 'Business Name',
      required: true,
      placeholder: 'ABC Coffee Shop',
      description: 'Name of the business',
      help: 'Must match your Google Business Profile exactly'
    },
    streetAddress: {
      type: 'Text',
      label: 'Street Address',
      required: true,
      placeholder: '123 Main Street',
      description: 'Street address of the business',
      help: 'Include suite/unit number if applicable'
    },
    addressLocality: {
      type: 'Text',
      label: 'City',
      required: true,
      placeholder: 'New York',
      description: 'City or locality',
      help: 'City name'
    },
    addressRegion: {
      type: 'Text',
      label: 'State/Region',
      required: true,
      placeholder: 'NY',
      description: 'State, province, or region',
      help: 'Use abbreviations (e.g., NY, CA, TX)'
    },
    postalCode: {
      type: 'Text',
      label: 'Postal Code',
      required: true,
      placeholder: '10001',
      description: 'ZIP or postal code',
      help: 'ZIP code or postal code'
    },
    addressCountry: {
      type: 'Select',
      label: 'Country',
      required: true,
      options: [
        { value: 'US', label: 'United States' },
        { value: 'GB', label: 'United Kingdom' },
        { value: 'CA', label: 'Canada' },
        { value: 'AU', label: 'Australia' },
        { value: 'DE', label: 'Germany' },
        { value: 'FR', label: 'France' },
        { value: 'IN', label: 'India' }
      ],
      description: 'Country code',
      help: 'ISO 3166-1 alpha-2 country code'
    },
    telephone: {
      type: 'Text',
      label: 'Phone Number',
      recommended: true,
      placeholder: '+1-555-123-4567',
      description: 'Business phone number',
      help: 'Must include country code with + prefix'
    },
    latitude: {
      type: 'Number',
      label: 'Latitude',
      recommended: true,
      placeholder: '40.7128',
      description: 'Geographic latitude',
      help: 'Use at least 5 decimal places for precision'
    },
    longitude: {
      type: 'Number',
      label: 'Longitude',
      recommended: true,
      placeholder: '-74.0060',
      description: 'Geographic longitude',
      help: 'Use at least 5 decimal places for precision'
    },
    priceRange: {
      type: 'Text',
      label: 'Price Range',
      recommended: true,
      placeholder: '$$',
      maxLength: 100,
      description: 'Price range indicator',
      help: 'Use $ symbols (e.g., $$) or range (e.g., $10-15)'
    },
    url: {
      type: 'URL',
      label: 'Website URL',
      placeholder: 'https://example.com',
      description: 'Business website URL',
      help: 'Your business website'
    },
    openingHoursSpecification: {
      type: 'OpeningHours',
      label: 'Opening Hours',
      description: 'Business operating hours',
      help: 'Specify your business hours for each day of the week'
    },
    servesCuisine: {
      type: 'Text',
      label: 'Cuisine Types (for restaurants)',
      placeholder: 'Italian, Pizza, Pasta',
      description: 'Types of cuisine served',
      help: 'Comma-separated list. Only for restaurants.'
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': formData.businessType || 'LocalBusiness',
      name: formData.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: formData.streetAddress,
        addressLocality: formData.addressLocality,
        addressRegion: formData.addressRegion,
        postalCode: formData.postalCode,
        addressCountry: formData.addressCountry
      }
    };

    if (formData.telephone) schema.telephone = formData.telephone;
    if (formData.url) schema.url = formData.url;
    if (formData.priceRange) schema.priceRange = formData.priceRange;

    // Geo coordinates
    if (formData.latitude && formData.longitude) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: formData.latitude,
        longitude: formData.longitude
      };
    }

    // Opening hours
    if (formData.openingHoursSpecification) {
      schema.openingHoursSpecification = formData.openingHoursSpecification;
    }

    // Restaurant-specific
    if (formData.servesCuisine && (formData.businessType === 'Restaurant' || formData.businessType === 'FoodEstablishment')) {
      schema.servesCuisine = formData.servesCuisine.split(',').map(c => c.trim());
    }

    return schema;
  }
};

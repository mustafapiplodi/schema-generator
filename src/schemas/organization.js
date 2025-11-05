/**
 * Organization Schema Definition
 * For organizations and companies
 */

export const organizationSchema = {
  type: 'Organization',
  name: 'Organization',
  description: 'For companies and organizations',
  icon: '🏢',
  required: ['name'],
  recommended: ['url', 'logo', 'sameAs'],
  properties: {
    name: {
      type: 'Text',
      label: 'Organization Name',
      required: true,
      placeholder: 'Acme Corporation',
      description: 'Name of the organization',
      help: 'Official organization name'
    },
    url: {
      type: 'URL',
      label: 'Website URL',
      recommended: true,
      placeholder: 'https://example.com',
      description: 'Organization website',
      help: 'Main website URL'
    },
    logo: {
      type: 'URL',
      label: 'Logo URL',
      recommended: true,
      placeholder: 'https://example.com/logo.png',
      description: 'Organization logo',
      help: 'Logo should be square or wide rectangle (not tall) for Knowledge Graph display'
    },
    description: {
      type: 'Text',
      label: 'Description',
      multiline: true,
      placeholder: 'Brief description of the organization',
      description: 'Organization description',
      help: 'Brief description of what the organization does'
    },
    sameAs: {
      type: 'Text',
      label: 'Social Media & Other Links',
      multiline: true,
      recommended: true,
      placeholder: 'https://facebook.com/yourcompany\nhttps://twitter.com/yourcompany\nhttps://linkedin.com/company/yourcompany',
      description: 'Social media profiles and other authoritative links',
      help: 'One URL per line. Include Facebook, Twitter, LinkedIn, Wikipedia, etc. Critical for E-E-A-T signals.'
    },
    telephone: {
      type: 'Text',
      label: 'Phone Number',
      placeholder: '+1-555-123-4567',
      description: 'Organization phone number',
      help: 'Include country code with + prefix'
    },
    email: {
      type: 'Email',
      label: 'Email',
      placeholder: 'info@example.com',
      description: 'Contact email',
      help: 'General contact email address'
    },
    foundingDate: {
      type: 'Date',
      label: 'Founding Date',
      placeholder: '2020-01-15',
      description: 'Date organization was founded',
      help: 'ISO 8601 date format: YYYY-MM-DD'
    },
    numberOfEmployees: {
      type: 'Number',
      label: 'Number of Employees',
      placeholder: '50',
      description: 'Employee count',
      help: 'Approximate number of employees'
    },
    streetAddress: {
      type: 'Text',
      label: 'Street Address',
      placeholder: '123 Business Ave',
      description: 'Organization street address',
      help: 'Physical address (optional)'
    },
    addressLocality: {
      type: 'Text',
      label: 'City',
      placeholder: 'San Francisco',
      description: 'City or locality',
      help: 'City name'
    },
    addressRegion: {
      type: 'Text',
      label: 'State/Region',
      placeholder: 'CA',
      description: 'State, province, or region',
      help: 'Use abbreviations (e.g., CA, NY)'
    },
    postalCode: {
      type: 'Text',
      label: 'Postal Code',
      placeholder: '94102',
      description: 'ZIP or postal code',
      help: 'ZIP code or postal code'
    },
    addressCountry: {
      type: 'Text',
      label: 'Country',
      placeholder: 'US',
      description: 'Country code',
      help: 'ISO 3166-1 alpha-2 country code (e.g., US, GB, CA)'
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: formData.name
    };

    if (formData.url) schema.url = formData.url;
    if (formData.description) schema.description = formData.description;
    if (formData.telephone) schema.telephone = formData.telephone;
    if (formData.email) schema.email = formData.email;
    if (formData.foundingDate) schema.foundingDate = formData.foundingDate;

    // Logo as ImageObject
    if (formData.logo) {
      schema.logo = {
        '@type': 'ImageObject',
        url: formData.logo
      };
    }

    // SameAs array
    if (formData.sameAs) {
      const links = formData.sameAs.split('\n')
        .map(link => link.trim())
        .filter(link => link.length > 0);
      if (links.length > 0) {
        schema.sameAs = links;
      }
    }

    // Number of employees
    if (formData.numberOfEmployees) {
      schema.numberOfEmployees = {
        '@type': 'QuantitativeValue',
        value: formData.numberOfEmployees
      };
    }

    // Address (if any address fields provided)
    if (formData.streetAddress || formData.addressLocality) {
      schema.address = {
        '@type': 'PostalAddress'
      };
      if (formData.streetAddress) schema.address.streetAddress = formData.streetAddress;
      if (formData.addressLocality) schema.address.addressLocality = formData.addressLocality;
      if (formData.addressRegion) schema.address.addressRegion = formData.addressRegion;
      if (formData.postalCode) schema.address.postalCode = formData.postalCode;
      if (formData.addressCountry) schema.address.addressCountry = formData.addressCountry;
    }

    return schema;
  }
};

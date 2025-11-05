export const personSchema = {
  id: 'person',
  name: 'Person',
  description: 'Individual people, authors, and professionals',
  required: ['name'],
  recommended: ['url', 'image'],
  properties: {
    name: {
      label: 'Full Name',
      type: 'Text',
      required: true,
      placeholder: 'Jane Smith',
      help: 'Full name of the person'
    },
    givenName: {
      label: 'First Name',
      type: 'Text',
      placeholder: 'Jane',
      help: 'First/given name'
    },
    familyName: {
      label: 'Last Name',
      type: 'Text',
      placeholder: 'Smith',
      help: 'Last/family name'
    },
    jobTitle: {
      label: 'Job Title',
      type: 'Text',
      placeholder: 'Software Engineer',
      help: 'Current job title or profession'
    },
    worksFor_name: {
      label: 'Company/Organization',
      type: 'Text',
      placeholder: 'Acme Corporation',
      help: 'Company where this person works'
    },
    worksFor_url: {
      label: 'Company Website',
      type: 'URL',
      placeholder: 'https://acme.com',
      help: 'URL of the company'
    },
    url: {
      label: 'Personal Website',
      type: 'URL',
      recommended: true,
      placeholder: 'https://janesmith.com',
      help: 'Personal website or portfolio'
    },
    image: {
      label: 'Profile Image URL',
      type: 'URL',
      recommended: true,
      placeholder: 'https://example.com/jane-smith.jpg',
      help: 'URL to profile photo or headshot'
    },
    email: {
      label: 'Email Address',
      type: 'Email',
      placeholder: 'jane@example.com',
      help: 'Contact email address'
    },
    telephone: {
      label: 'Phone Number',
      type: 'Text',
      placeholder: '+1-555-123-4567',
      help: 'Phone number with country code'
    },
    address_street: {
      label: 'Street Address',
      type: 'Text',
      placeholder: '123 Main Street',
      help: 'Physical address'
    },
    address_city: {
      label: 'City',
      type: 'Text',
      placeholder: 'San Francisco'
    },
    address_region: {
      label: 'State/Region',
      type: 'Text',
      placeholder: 'CA',
      help: 'Use abbreviation (e.g., CA, NY, TX)'
    },
    address_postalCode: {
      label: 'Postal Code',
      type: 'Text',
      placeholder: '94102'
    },
    address_country: {
      label: 'Country',
      type: 'Text',
      placeholder: 'US',
      help: 'ISO 3166-1 alpha-2 country code (e.g., US, GB, CA)'
    },
    description: {
      label: 'Bio/Description',
      type: 'Textarea',
      placeholder: 'Jane is an experienced software engineer specializing in web development...',
      help: 'Brief biography or description',
      multiline: true
    },
    sameAs: {
      label: 'Social Media Profiles (one per line)',
      type: 'Textarea',
      placeholder: 'https://twitter.com/janesmith\nhttps://linkedin.com/in/janesmith\nhttps://github.com/janesmith',
      help: 'List social media and professional profile URLs, one per line',
      multiline: true
    },
    alumniOf: {
      label: 'Education/School',
      type: 'Text',
      placeholder: 'Stanford University',
      help: 'School, college, or university attended'
    },
    award: {
      label: 'Awards (one per line)',
      type: 'Textarea',
      placeholder: 'Best Developer Award 2024\nTech Innovator of the Year',
      help: 'List awards received, one per line',
      multiline: true
    },
    birthDate: {
      label: 'Birth Date',
      type: 'Date',
      placeholder: '1990-05-15',
      help: 'Date of birth in YYYY-MM-DD format'
    },
    nationality: {
      label: 'Nationality',
      type: 'Text',
      placeholder: 'American',
      help: 'Nationality or citizenship'
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: formData.name,
      givenName: formData.givenName,
      familyName: formData.familyName,
      jobTitle: formData.jobTitle,
      url: formData.url,
      image: formData.image,
      email: formData.email,
      telephone: formData.telephone,
      description: formData.description,
      birthDate: formData.birthDate,
      nationality: formData.nationality
    };

    // Works For (Organization)
    if (formData.worksFor_name) {
      schema.worksFor = {
        '@type': 'Organization',
        name: formData.worksFor_name,
        url: formData.worksFor_url
      };
    }

    // Address
    if (formData.address_street || formData.address_city) {
      schema.address = {
        '@type': 'PostalAddress',
        streetAddress: formData.address_street,
        addressLocality: formData.address_city,
        addressRegion: formData.address_region,
        postalCode: formData.address_postalCode,
        addressCountry: formData.address_country
      };
    }

    // Social Media Profiles (sameAs) - handle both string and array inputs
    if (formData.sameAs) {
      schema.sameAs = Array.isArray(formData.sameAs)
        ? formData.sameAs
        : formData.sameAs.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }

    // Alumni Of (Education)
    if (formData.alumniOf) {
      schema.alumniOf = {
        '@type': 'Organization',
        name: formData.alumniOf
      };
    }

    // Awards - handle both string and array inputs
    if (formData.award) {
      schema.award = Array.isArray(formData.award)
        ? formData.award
        : formData.award.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }

    return schema;
  }
};

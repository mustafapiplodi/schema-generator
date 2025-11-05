export const jobPostingSchema = {
  id: 'jobPosting',
  name: 'Job Posting',
  description: 'Job listings and career opportunities',
  required: ['title', 'description', 'datePosted', 'hiringOrganization_name'],
  recommended: ['validThrough', 'employmentType', 'hiringOrganization_url', 'jobLocation_city', 'jobLocation_region', 'jobLocation_country'],
  properties: {
    title: {
      label: 'Job Title',
      type: 'Text',
      required: true,
      placeholder: 'Senior Software Engineer',
      help: 'The title of the position'
    },
    description: {
      label: 'Job Description',
      type: 'Textarea',
      required: true,
      placeholder: 'We are seeking a talented software engineer to join our team...',
      help: 'Full description of the job, responsibilities, and requirements'
    },
    datePosted: {
      label: 'Date Posted',
      type: 'DateTime',
      required: true,
      help: 'When the job was posted'
    },
    validThrough: {
      label: 'Valid Through',
      type: 'DateTime',
      recommended: true,
      help: 'When the job posting expires'
    },
    employmentType: {
      label: 'Employment Type',
      type: 'Select',
      recommended: true,
      options: [
        { value: 'FULL_TIME', label: 'Full Time' },
        { value: 'PART_TIME', label: 'Part Time' },
        { value: 'CONTRACTOR', label: 'Contractor' },
        { value: 'TEMPORARY', label: 'Temporary' },
        { value: 'INTERN', label: 'Intern' },
        { value: 'VOLUNTEER', label: 'Volunteer' },
        { value: 'PER_DIEM', label: 'Per Diem' },
        { value: 'OTHER', label: 'Other' }
      ],
      help: 'Type of employment'
    },
    hiringOrganization_name: {
      label: 'Company Name',
      type: 'Text',
      required: true,
      placeholder: 'Acme Corporation',
      help: 'Name of the hiring company'
    },
    hiringOrganization_url: {
      label: 'Company Website',
      type: 'URL',
      recommended: true,
      placeholder: 'https://acme.com',
      help: 'Company website URL'
    },
    hiringOrganization_logo: {
      label: 'Company Logo URL',
      type: 'URL',
      placeholder: 'https://acme.com/logo.png',
      help: 'URL to company logo'
    },
    jobLocation_address: {
      label: 'Street Address',
      type: 'Text',
      placeholder: '123 Main Street',
      help: 'Physical work location address'
    },
    jobLocation_city: {
      label: 'City',
      type: 'Text',
      recommended: true,
      placeholder: 'San Francisco'
    },
    jobLocation_region: {
      label: 'State/Region',
      type: 'Text',
      recommended: true,
      placeholder: 'CA',
      help: 'Use abbreviation (e.g., CA, NY, TX)'
    },
    jobLocation_postalCode: {
      label: 'Postal Code',
      type: 'Text',
      placeholder: '94102'
    },
    jobLocation_country: {
      label: 'Country',
      type: 'Text',
      recommended: true,
      placeholder: 'US',
      help: 'ISO 3166-1 alpha-2 country code (e.g., US, GB, CA)'
    },
    remoteAllowed: {
      label: 'Remote Work Allowed',
      type: 'Select',
      options: [
        { value: 'unspecified', label: 'Not specified' },
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' }
      ],
      help: 'Can this job be performed remotely?'
    },
    baseSalary_value: {
      label: 'Salary Amount',
      type: 'Number',
      placeholder: '120000',
      help: 'Base salary amount'
    },
    baseSalary_currency: {
      label: 'Currency',
      type: 'Select',
      options: [
        { value: 'USD', label: 'USD ($)' },
        { value: 'EUR', label: 'EUR (€)' },
        { value: 'GBP', label: 'GBP (£)' },
        { value: 'CAD', label: 'CAD ($)' },
        { value: 'AUD', label: 'AUD ($)' },
        { value: 'JPY', label: 'JPY (¥)' },
        { value: 'INR', label: 'INR (₹)' }
      ],
      help: 'Currency for the salary'
    },
    baseSalary_unitText: {
      label: 'Pay Period',
      type: 'Select',
      options: [
        { value: 'YEAR', label: 'Per Year' },
        { value: 'MONTH', label: 'Per Month' },
        { value: 'WEEK', label: 'Per Week' },
        { value: 'HOUR', label: 'Per Hour' }
      ],
      help: 'How often the salary is paid'
    },
    applicantLocationRequirements: {
      label: 'Allowed Applicant Locations',
      type: 'Text',
      placeholder: 'US,CA,GB',
      help: 'Comma-separated country codes where applicants can be located',
      example: 'US,CA,GB,AU'
    },
    applicationUrl: {
      label: 'Application URL',
      type: 'URL',
      placeholder: 'https://acme.com/careers/apply/123',
      help: 'Where to apply for this job'
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: formData.title,
      description: formData.description,
      datePosted: formData.datePosted,
      validThrough: formData.validThrough,
      employmentType: formData.employmentType,
      applicantLocationRequirements: formData.applicantLocationRequirements ?
        formData.applicantLocationRequirements.split(',').map(code => ({
          '@type': 'Country',
          name: code.trim()
        })) : undefined
    };

    // Hiring Organization
    schema.hiringOrganization = {
      '@type': 'Organization',
      name: formData.hiringOrganization_name,
      sameAs: formData.hiringOrganization_url,
      logo: formData.hiringOrganization_logo
    };

    // Job Location
    if (formData.jobLocation_city || formData.jobLocation_address) {
      schema.jobLocation = {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: formData.jobLocation_address,
          addressLocality: formData.jobLocation_city,
          addressRegion: formData.jobLocation_region,
          postalCode: formData.jobLocation_postalCode,
          addressCountry: formData.jobLocation_country
        }
      };
    }

    // Remote work
    if (formData.remoteAllowed && formData.remoteAllowed !== 'unspecified') {
      schema.jobLocationType = formData.remoteAllowed === 'true' ? 'TELECOMMUTE' : undefined;
    }

    // Base Salary
    if (formData.baseSalary_value) {
      schema.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: formData.baseSalary_currency || 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: formData.baseSalary_value,
          unitText: formData.baseSalary_unitText || 'YEAR'
        }
      };
    }

    // Application URL
    if (formData.applicationUrl) {
      schema.directApply = true;
      schema.applicationContact = {
        '@type': 'ContactPoint',
        url: formData.applicationUrl
      };
    }

    return schema;
  }
};

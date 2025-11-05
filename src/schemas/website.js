export const websiteSchema = {
  id: 'website',
  name: 'WebSite',
  description: 'Site-wide markup with search functionality',
  required: ['name', 'url'],
  recommended: ['description', 'publisher_name'],
  properties: {
    name: {
      label: 'Website Name',
      type: 'Text',
      required: true,
      placeholder: 'My Awesome Website',
      help: 'The name of your website'
    },
    url: {
      label: 'Website URL',
      type: 'URL',
      required: true,
      placeholder: 'https://example.com',
      help: 'The main URL of your website'
    },
    description: {
      label: 'Description',
      type: 'Textarea',
      recommended: true,
      placeholder: 'A comprehensive resource for web development tutorials...',
      help: 'Brief description of what your website is about'
    },
    publisher_name: {
      label: 'Publisher/Organization Name',
      type: 'Text',
      recommended: true,
      placeholder: 'Acme Corporation',
      help: 'Organization that publishes the website'
    },
    publisher_logo: {
      label: 'Publisher Logo URL',
      type: 'URL',
      placeholder: 'https://example.com/logo.png',
      help: 'URL to your organization\'s logo'
    },
    searchAction_enabled: {
      label: 'Enable Site Search',
      type: 'Select',
      options: [
        { value: 'false', label: 'No' },
        { value: 'true', label: 'Yes' }
      ],
      help: 'Does your site have a search function?'
    },
    searchAction_target: {
      label: 'Search URL Template',
      type: 'URL',
      placeholder: 'https://example.com/search?q={search_term_string}',
      help: 'Your search URL with {search_term_string} placeholder',
      example: 'https://example.com/search?q={search_term_string}'
    },
    inLanguage: {
      label: 'Primary Language',
      type: 'Select',
      options: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'it', label: 'Italian' },
        { value: 'pt', label: 'Portuguese' },
        { value: 'ru', label: 'Russian' },
        { value: 'ja', label: 'Japanese' },
        { value: 'zh', label: 'Chinese' },
        { value: 'ar', label: 'Arabic' },
        { value: 'hi', label: 'Hindi' }
      ],
      help: 'Primary language of your website content'
    },
    copyrightYear: {
      label: 'Copyright Year',
      type: 'Number',
      placeholder: '2025',
      help: 'Year of copyright'
    },
    copyrightHolder: {
      label: 'Copyright Holder',
      type: 'Text',
      placeholder: 'Acme Corporation',
      help: 'Who holds the copyright'
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: formData.name,
      url: formData.url,
      description: formData.description,
      inLanguage: formData.inLanguage,
      copyrightYear: formData.copyrightYear,
      copyrightHolder: formData.copyrightHolder ? {
        '@type': 'Organization',
        name: formData.copyrightHolder
      } : undefined
    };

    // Publisher
    if (formData.publisher_name) {
      schema.publisher = {
        '@type': 'Organization',
        name: formData.publisher_name,
        logo: formData.publisher_logo ? {
          '@type': 'ImageObject',
          url: formData.publisher_logo
        } : undefined
      };
    }

    // Potential Action (Site Search)
    if (formData.searchAction_enabled === 'true' && formData.searchAction_target) {
      schema.potentialAction = {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: formData.searchAction_target
        },
        'query-input': 'required name=search_term_string'
      };
    }

    return schema;
  }
};

/**
 * Breadcrumb Schema Definition
 * For breadcrumb navigation
 */

export const breadcrumbSchema = {
  type: 'BreadcrumbList',
  name: 'Breadcrumb',
  description: 'For breadcrumb navigation trails',
  icon: '🔗',
  required: ['items'],
  recommended: [],
  isArray: true, // Special handling for array of items
  properties: {
    items: {
      type: 'Array',
      label: 'Breadcrumb Items',
      required: true,
      minItems: 2,
      description: 'List of breadcrumb items (minimum 2 required)',
      help: 'Each item represents a step in the navigation path',
      itemProperties: {
        name: {
          type: 'Text',
          label: 'Name',
          required: true,
          placeholder: 'Home',
          description: 'Display text for this breadcrumb',
          help: 'Text shown to users'
        },
        url: {
          type: 'URL',
          label: 'URL',
          required: true,
          placeholder: 'https://example.com',
          description: 'URL for this breadcrumb item',
          help: 'Must be absolute URL (include full domain). Last item can be omitted.'
        }
      }
    }
  },
  defaultItems: [
    { name: 'Home', url: '' },
    { name: '', url: '' }
  ],
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: []
    };

    if (formData.items && Array.isArray(formData.items)) {
      schema.itemListElement = formData.items
        .filter(item => item.name) // Only include items with names
        .map((item, index) => {
          const listItem = {
            '@type': 'ListItem',
            position: index + 1,
            name: item.name
          };

          // Last item can omit URL (current page)
          if (item.url && item.url.trim() !== '') {
            listItem.item = item.url;
          }

          return listItem;
        });
    }

    return schema;
  }
};

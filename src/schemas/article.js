/**
 * Article Schema Definition
 * Includes BlogPosting and NewsArticle variants
 */

export const articleSchema = {
  type: 'Article',
  name: 'Article',
  description: 'For blog posts, news articles, and editorial content',
  icon: '📰',
  variantLabel: 'Article Type',
  variants: [
    { value: 'Article', label: 'Article' },
    { value: 'BlogPosting', label: 'Blog Post' },
    { value: 'NewsArticle', label: 'News Article' }
  ],
  required: ['headline', 'image', 'datePublished'],
  recommended: ['author', 'dateModified', 'publisher', 'description'],
  properties: {
    headline: {
      type: 'Text',
      label: 'Headline',
      required: true,
      maxLength: 110,
      placeholder: 'Enter article headline',
      description: 'The headline of the article. Maximum 110 characters to avoid truncation.',
      help: 'Keep under 110 characters for best display in search results'
    },
    image: {
      type: 'URL',
      label: 'Image URL',
      required: true,
      placeholder: 'https://example.com/image.jpg',
      description: 'URL of the article image. Minimum 50,000 pixels (e.g., 696px width)',
      help: 'Provide high-quality images with at least 50,000 pixels. Multiple aspect ratios recommended: 16x9, 4x3, 1x1'
    },
    datePublished: {
      type: 'DateTime',
      label: 'Date Published',
      required: true,
      placeholder: '2024-01-05T08:00:00+00:00',
      description: 'When the article was first published',
      help: 'Use ISO 8601 format with timezone. Example: 2024-01-05T08:00:00+08:00'
    },
    dateModified: {
      type: 'DateTime',
      label: 'Date Modified',
      recommended: true,
      placeholder: '2024-01-05T08:00:00+00:00',
      description: 'When the article was last modified',
      help: 'Should be same as or later than datePublished'
    },
    authorName: {
      type: 'Text',
      label: 'Author Name',
      recommended: true,
      placeholder: 'John Doe',
      description: 'Name of the article author',
      help: 'Will be structured as Person object with name and URL'
    },
    authorUrl: {
      type: 'URL',
      label: 'Author URL',
      recommended: true,
      placeholder: 'https://example.com/author/john-doe',
      description: 'URL to author profile or page',
      help: 'Link to author bio, social profile, or about page'
    },
    publisherName: {
      type: 'Text',
      label: 'Publisher Name',
      recommended: true,
      placeholder: 'Example Publishing',
      description: 'Name of the publishing organization',
      help: 'The organization that published the article'
    },
    publisherLogo: {
      type: 'URL',
      label: 'Publisher Logo URL',
      recommended: true,
      placeholder: 'https://example.com/logo.png',
      description: 'URL to publisher logo',
      help: 'Logo should be square or wide (not tall) for best display'
    },
    description: {
      type: 'Text',
      label: 'Description',
      recommended: true,
      multiline: true,
      placeholder: 'Brief description of the article content',
      description: 'Short description or summary of the article',
      help: 'Brief summary that describes the article content'
    }
  },
  mapping: {
    headline: 'headline',
    image: 'image',
    datePublished: 'datePublished',
    dateModified: 'dateModified',
    description: 'description'
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': formData.articleType || 'Article',
      headline: formData.headline,
      image: formData.image,
      datePublished: formData.datePublished
    };

    if (formData.dateModified) {
      schema.dateModified = formData.dateModified;
    }

    if (formData.description) {
      schema.description = formData.description;
    }

    // Author as Person object
    if (formData.authorName) {
      schema.author = {
        '@type': 'Person',
        name: formData.authorName
      };
      if (formData.authorUrl) {
        schema.author.url = formData.authorUrl;
      }
    }

    // Publisher as Organization object
    if (formData.publisherName) {
      schema.publisher = {
        '@type': 'Organization',
        name: formData.publisherName
      };
      if (formData.publisherLogo) {
        schema.publisher.logo = {
          '@type': 'ImageObject',
          url: formData.publisherLogo
        };
      }
    }

    return schema;
  }
};

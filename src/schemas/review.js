export const reviewSchema = {
  id: 'review',
  name: 'Review',
  description: 'Product, service, or business reviews',
  required: ['itemReviewed_name', 'itemReviewed_type', 'reviewRating_value', 'author_name', 'reviewBody'],
  recommended: ['datePublished'],
  properties: {
    itemReviewed_name: {
      label: 'Item/Business Name',
      type: 'Text',
      required: true,
      placeholder: 'Acme Restaurant',
      help: 'Name of the product, service, or business being reviewed'
    },
    itemReviewed_type: {
      label: 'Item Type',
      type: 'Select',
      required: true,
      options: [
        { value: 'Product', label: 'Product' },
        { value: 'Service', label: 'Service' },
        { value: 'LocalBusiness', label: 'Local Business' },
        { value: 'Restaurant', label: 'Restaurant' },
        { value: 'Movie', label: 'Movie' },
        { value: 'Book', label: 'Book' },
        { value: 'Organization', label: 'Organization' }
      ],
      help: 'What type of thing is being reviewed'
    },
    itemReviewed_image: {
      label: 'Item Image URL',
      type: 'URL',
      placeholder: 'https://example.com/item.jpg',
      help: 'Image of the item being reviewed'
    },
    reviewRating_value: {
      label: 'Rating',
      type: 'Number',
      required: true,
      placeholder: '4.5',
      help: 'Rating given (typically 1-5 scale)'
    },
    reviewRating_bestRating: {
      label: 'Best Possible Rating',
      type: 'Number',
      placeholder: '5',
      help: 'Maximum rating value (usually 5)'
    },
    reviewRating_worstRating: {
      label: 'Worst Possible Rating',
      type: 'Number',
      placeholder: '1',
      help: 'Minimum rating value (usually 1)'
    },
    author_name: {
      label: 'Reviewer Name',
      type: 'Text',
      required: true,
      placeholder: 'John Smith',
      help: 'Name of the person writing the review'
    },
    datePublished: {
      label: 'Review Date',
      type: 'DateTime',
      recommended: true,
      help: 'When the review was published'
    },
    reviewBody: {
      label: 'Review Text',
      type: 'Textarea',
      required: true,
      placeholder: 'Great product! I really enjoyed...',
      help: 'The actual review content'
    },
    name: {
      label: 'Review Headline',
      type: 'Text',
      placeholder: 'Excellent service and quality',
      help: 'Short headline for the review (optional)'
    },
    publisher_name: {
      label: 'Publisher Name',
      type: 'Text',
      placeholder: 'Reviews.com',
      help: 'Name of the site or platform publishing the review'
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Review',
      name: formData.name,
      reviewBody: formData.reviewBody,
      datePublished: formData.datePublished
    };

    // Item Reviewed
    schema.itemReviewed = {
      '@type': formData.itemReviewed_type || 'Thing',
      name: formData.itemReviewed_name,
      image: formData.itemReviewed_image
    };

    // Review Rating
    schema.reviewRating = {
      '@type': 'Rating',
      ratingValue: formData.reviewRating_value,
      bestRating: formData.reviewRating_bestRating || '5',
      worstRating: formData.reviewRating_worstRating || '1'
    };

    // Author
    schema.author = {
      '@type': 'Person',
      name: formData.author_name
    };

    // Publisher
    if (formData.publisher_name) {
      schema.publisher = {
        '@type': 'Organization',
        name: formData.publisher_name
      };
    }

    return schema;
  }
};

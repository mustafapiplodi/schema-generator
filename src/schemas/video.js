export const videoSchema = {
  id: 'video',
  name: 'Video',
  description: 'Video content and YouTube videos',
  required: ['name', 'description', 'thumbnailUrl', 'uploadDate'],
  recommended: ['duration', 'contentUrl', 'embedUrl', 'author_name'],
  properties: {
    name: {
      label: 'Video Title',
      type: 'Text',
      required: true,
      placeholder: 'How to Build a Website in 2025',
      help: 'The title of the video'
    },
    description: {
      label: 'Description',
      type: 'Textarea',
      required: true,
      placeholder: 'Learn how to build a professional website from scratch...',
      help: 'Description of the video content'
    },
    thumbnailUrl: {
      label: 'Thumbnail URL',
      type: 'URL',
      required: true,
      placeholder: 'https://example.com/thumbnail.jpg',
      help: 'URL to video thumbnail image (minimum 160x90 pixels)'
    },
    uploadDate: {
      label: 'Upload Date',
      type: 'DateTime',
      required: true,
      help: 'When the video was first published'
    },
    duration: {
      label: 'Duration',
      type: 'Text',
      recommended: true,
      placeholder: 'PT10M30S',
      help: 'Video duration in ISO 8601 format (e.g., PT10M30S = 10 minutes 30 seconds)',
      example: 'PT10M30S (10 minutes 30 seconds)'
    },
    contentUrl: {
      label: 'Video URL',
      type: 'URL',
      recommended: true,
      placeholder: 'https://example.com/video.mp4',
      help: 'Direct URL to the video file or YouTube URL'
    },
    embedUrl: {
      label: 'Embed URL',
      type: 'URL',
      recommended: true,
      placeholder: 'https://www.youtube.com/embed/abc123',
      help: 'URL for embedding the video (YouTube embed URL)'
    },
    author_name: {
      label: 'Creator/Channel Name',
      type: 'Text',
      recommended: true,
      placeholder: 'Tech Tutorials',
      help: 'Name of the video creator or channel'
    },
    author_url: {
      label: 'Creator URL',
      type: 'URL',
      placeholder: 'https://youtube.com/@techtutorials',
      help: 'URL to the creator\'s profile or channel'
    },
    interactionCount: {
      label: 'View Count',
      type: 'Number',
      placeholder: '12500',
      help: 'Number of times the video has been viewed'
    },
    expires: {
      label: 'Expiration Date',
      type: 'DateTime',
      help: 'When the video will be taken down (optional)'
    },
    regionsAllowed: {
      label: 'Allowed Regions',
      type: 'Text',
      placeholder: 'US,GB,CA',
      help: 'Comma-separated ISO country codes where video is available (leave blank for worldwide)',
      example: 'US,GB,CA,AU'
    },
    isFamilyFriendly: {
      label: 'Family Friendly',
      type: 'Select',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' }
      ],
      help: 'Is this video appropriate for all ages?'
    },
    keywords: {
      label: 'Keywords/Tags',
      type: 'Text',
      placeholder: 'web development, tutorial, coding',
      help: 'Comma-separated keywords'
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: formData.name,
      description: formData.description,
      thumbnailUrl: formData.thumbnailUrl,
      uploadDate: formData.uploadDate,
      duration: formData.duration,
      contentUrl: formData.contentUrl,
      embedUrl: formData.embedUrl,
      interactionStatistic: formData.interactionCount ? {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: formData.interactionCount
      } : undefined,
      expires: formData.expires,
      regionsAllowed: formData.regionsAllowed ? formData.regionsAllowed.split(',').map(r => r.trim()) : undefined,
      isFamilyFriendly: formData.isFamilyFriendly === 'true' ? true : formData.isFamilyFriendly === 'false' ? false : undefined
    };

    // Author/Creator
    if (formData.author_name) {
      schema.author = {
        '@type': 'Person',
        name: formData.author_name,
        url: formData.author_url
      };
    }

    // Keywords
    if (formData.keywords) {
      schema.keywords = formData.keywords;
    }

    return schema;
  }
};

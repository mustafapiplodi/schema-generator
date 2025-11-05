export const eventSchema = {
  id: 'event',
  name: 'Event',
  description: 'Concerts, conferences, webinars, and other events',
  required: ['name', 'startDate'],
  recommended: ['endDate', 'eventStatus', 'eventAttendanceMode', 'location_name', 'url', 'image', 'description'],
  properties: {
    name: {
      label: 'Event Name',
      type: 'Text',
      required: true,
      placeholder: 'Web Development Conference 2025',
      help: 'The name of the event'
    },
    startDate: {
      label: 'Start Date & Time',
      type: 'DateTime',
      required: true,
      help: 'When the event starts (ISO 8601 format with timezone)',
      placeholder: '2025-06-15T09:00:00-07:00'
    },
    endDate: {
      label: 'End Date & Time',
      type: 'DateTime',
      recommended: true,
      help: 'When the event ends (ISO 8601 format with timezone)',
      placeholder: '2025-06-15T17:00:00-07:00'
    },
    eventStatus: {
      label: 'Event Status',
      type: 'Select',
      recommended: true,
      options: [
        { value: 'EventScheduled', label: 'Scheduled' },
        { value: 'EventCancelled', label: 'Cancelled' },
        { value: 'EventMovedOnline', label: 'Moved Online' },
        { value: 'EventPostponed', label: 'Postponed' },
        { value: 'EventRescheduled', label: 'Rescheduled' }
      ],
      help: 'Current status of the event'
    },
    eventAttendanceMode: {
      label: 'Attendance Mode',
      type: 'Select',
      recommended: true,
      options: [
        { value: 'OfflineEventAttendanceMode', label: 'In-person' },
        { value: 'OnlineEventAttendanceMode', label: 'Online' },
        { value: 'MixedEventAttendanceMode', label: 'Hybrid (In-person + Online)' }
      ],
      help: 'How attendees can participate'
    },
    location_name: {
      label: 'Location Name',
      type: 'Text',
      recommended: true,
      placeholder: 'Conference Center',
      help: 'Name of the physical location or "Online" for virtual events'
    },
    location_address: {
      label: 'Street Address',
      type: 'Text',
      placeholder: '123 Main Street',
      help: 'Physical address (leave blank for online-only events)'
    },
    location_city: {
      label: 'City',
      type: 'Text',
      placeholder: 'San Francisco'
    },
    location_region: {
      label: 'State/Region',
      type: 'Text',
      placeholder: 'CA',
      help: 'Use abbreviation (e.g., CA, NY, TX)'
    },
    location_postalCode: {
      label: 'Postal Code',
      type: 'Text',
      placeholder: '94102'
    },
    location_country: {
      label: 'Country',
      type: 'Text',
      placeholder: 'US',
      help: 'ISO 3166-1 alpha-2 country code (e.g., US, GB, CA)'
    },
    url: {
      label: 'Event URL',
      type: 'URL',
      recommended: true,
      placeholder: 'https://example.com/event',
      help: 'URL where people can learn more about the event'
    },
    image: {
      label: 'Event Image URL',
      type: 'URL',
      recommended: true,
      placeholder: 'https://example.com/event-image.jpg',
      help: 'Image representing the event (minimum 1200px wide)'
    },
    description: {
      label: 'Description',
      type: 'Textarea',
      recommended: true,
      placeholder: 'Join us for an exciting conference about web development...',
      help: 'Detailed description of the event',
      multiline: true
    },
    organizer_name: {
      label: 'Organizer Name',
      type: 'Text',
      recommended: true,
      placeholder: 'Tech Events Inc.',
      help: 'Person or organization organizing the event'
    },
    organizer_url: {
      label: 'Organizer URL',
      type: 'URL',
      placeholder: 'https://techevents.com',
      help: 'Website of the organizer'
    },
    performer_name: {
      label: 'Performer/Speaker Name',
      type: 'Text',
      placeholder: 'John Doe',
      help: 'Main performer or speaker (optional)'
    },
    offers_price: {
      label: 'Ticket Price',
      type: 'Number',
      placeholder: '99.00',
      help: 'Price of admission (use 0 for free events)'
    },
    offers_currency: {
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
      help: 'Currency for the ticket price'
    },
    offers_url: {
      label: 'Ticket URL',
      type: 'URL',
      placeholder: 'https://example.com/tickets',
      help: 'Where to buy tickets'
    },
    offers_availability: {
      label: 'Availability',
      type: 'Select',
      options: [
        { value: 'InStock', label: 'In Stock' },
        { value: 'SoldOut', label: 'Sold Out' },
        { value: 'PreOrder', label: 'Pre-Order' }
      ],
      help: 'Ticket availability status'
    },
    offers_validFrom: {
      label: 'Ticket Sale Start Date',
      type: 'DateTime',
      help: 'When tickets go on sale'
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      eventStatus: formData.eventStatus ? `https://schema.org/${formData.eventStatus}` : undefined,
      eventAttendanceMode: formData.eventAttendanceMode ? `https://schema.org/${formData.eventAttendanceMode}` : undefined,
      url: formData.url,
      image: formData.image,
      description: formData.description
    };

    // Location
    if (formData.location_name) {
      const location = {
        '@type': 'Place',
        name: formData.location_name
      };

      if (formData.location_address || formData.location_city) {
        location.address = {
          '@type': 'PostalAddress',
          streetAddress: formData.location_address,
          addressLocality: formData.location_city,
          addressRegion: formData.location_region,
          postalCode: formData.location_postalCode,
          addressCountry: formData.location_country
        };
      }

      schema.location = location;
    }

    // Organizer
    if (formData.organizer_name) {
      schema.organizer = {
        '@type': 'Organization',
        name: formData.organizer_name,
        url: formData.organizer_url
      };
    }

    // Performer
    if (formData.performer_name) {
      schema.performer = {
        '@type': 'Person',
        name: formData.performer_name
      };
    }

    // Offers
    if (formData.offers_price !== undefined && formData.offers_price !== '') {
      schema.offers = {
        '@type': 'Offer',
        price: formData.offers_price,
        priceCurrency: formData.offers_currency || 'USD',
        url: formData.offers_url,
        availability: formData.offers_availability ? `https://schema.org/${formData.offers_availability}` : undefined,
        validFrom: formData.offers_validFrom
      };
    }

    return schema;
  }
};

/**
 * Schema Definitions Index
 * Exports all available schema types
 */

import { articleSchema } from './article.js';
import { productSchema } from './product.js';
import { localBusinessSchema } from './localBusiness.js';
import { organizationSchema } from './organization.js';
import { breadcrumbSchema } from './breadcrumb.js';
import { faqSchema } from './faq.js';
import { eventSchema } from './event.js';
import { recipeSchema } from './recipe.js';
import { videoSchema } from './video.js';
import { howToSchema } from './howto.js';
import { jobPostingSchema } from './jobPosting.js';
import { reviewSchema } from './review.js';
import { websiteSchema } from './website.js';
import { personSchema } from './person.js';

export const schemas = {
  article: articleSchema,
  product: productSchema,
  localBusiness: localBusinessSchema,
  organization: organizationSchema,
  breadcrumb: breadcrumbSchema,
  faq: faqSchema,
  event: eventSchema,
  recipe: recipeSchema,
  video: videoSchema,
  howto: howToSchema,
  jobPosting: jobPostingSchema,
  review: reviewSchema,
  website: websiteSchema,
  person: personSchema
};

export const schemaList = [
  { id: 'article', ...articleSchema },
  { id: 'product', ...productSchema },
  { id: 'localBusiness', ...localBusinessSchema },
  { id: 'organization', ...organizationSchema },
  { id: 'breadcrumb', ...breadcrumbSchema },
  { id: 'faq', ...faqSchema },
  { id: 'event', ...eventSchema },
  { id: 'recipe', ...recipeSchema },
  { id: 'video', ...videoSchema },
  { id: 'howto', ...howToSchema },
  { id: 'jobPosting', ...jobPostingSchema },
  { id: 'review', ...reviewSchema },
  { id: 'website', ...websiteSchema },
  { id: 'person', ...personSchema }
];

export {
  articleSchema,
  productSchema,
  localBusinessSchema,
  organizationSchema,
  breadcrumbSchema,
  faqSchema,
  eventSchema,
  recipeSchema,
  videoSchema,
  howToSchema,
  jobPostingSchema,
  reviewSchema,
  websiteSchema,
  personSchema
};

/**
 * FAQ Schema Definition
 * For Frequently Asked Questions pages
 */

export const faqSchema = {
  type: 'FAQPage',
  name: 'FAQ',
  description: 'For Frequently Asked Questions pages',
  icon: '❓',
  required: ['questions'],
  recommended: [],
  warning: 'FAQ rich results are restricted to government and health-focused websites only (Google policy as of August 2023). Other search engines and AI systems may still benefit from this markup.',
  isArray: true,
  properties: {
    questions: {
      type: 'Array',
      label: 'FAQ Questions',
      required: true,
      minItems: 2,
      description: 'List of questions and answers (minimum 2 required)',
      help: 'Each question must have exactly one answer',
      itemProperties: {
        question: {
          type: 'Text',
          label: 'Question',
          required: true,
          placeholder: 'What is your return policy?',
          description: 'The question text',
          help: 'Full question as displayed to users'
        },
        answer: {
          type: 'Text',
          label: 'Answer',
          required: true,
          multiline: true,
          placeholder: 'Our return policy allows...',
          description: 'The answer text',
          help: 'Can include limited HTML: h1-h6, br, ol, ul, li, a, p, div, b, strong, i, em'
        }
      }
    }
  },
  defaultItems: [
    { question: '', answer: '' },
    { question: '', answer: '' }
  ],
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: []
    };

    if (formData.questions && Array.isArray(formData.questions)) {
      schema.mainEntity = formData.questions
        .filter(item => item.question && item.answer) // Only include complete Q&A pairs
        .map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }));
    }

    return schema;
  }
};

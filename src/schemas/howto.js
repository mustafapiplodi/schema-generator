export const howToSchema = {
  id: 'howto',
  name: 'HowTo',
  description: 'Step-by-step tutorials and guides',
  required: ['name', 'step'],
  recommended: ['description', 'image', 'totalTime'],
  properties: {
    name: {
      label: 'Tutorial Title',
      type: 'Text',
      required: true,
      placeholder: 'How to Change a Tire',
      help: 'The title of the tutorial or guide'
    },
    description: {
      label: 'Description',
      type: 'Textarea',
      recommended: true,
      placeholder: 'Learn how to safely change a flat tire in 6 easy steps...',
      help: 'Brief description of what the tutorial teaches'
    },
    image: {
      label: 'Image URL',
      type: 'URL',
      recommended: true,
      placeholder: 'https://example.com/howto-image.jpg',
      help: 'Image showing the completed result or process'
    },
    totalTime: {
      label: 'Total Time',
      type: 'Duration',
      recommended: true,
      help: 'Total time needed to complete the tutorial'
    },
    estimatedCost: {
      label: 'Estimated Cost',
      type: 'Text',
      placeholder: '$50',
      help: 'Approximate cost including currency symbol'
    },
    supply: {
      label: 'Supplies/Materials (one per line)',
      type: 'Textarea',
      placeholder: 'Jack\nLug wrench\nSpare tire\nWheel wedges',
      help: 'List each supply on a new line',
      multiline: true
    },
    tool: {
      label: 'Tools Required (one per line)',
      type: 'Textarea',
      placeholder: 'Car jack\nTire iron\nTorque wrench',
      help: 'List each tool on a new line',
      multiline: true
    },
    step: {
      label: 'Steps (one per line)',
      type: 'Textarea',
      required: true,
      placeholder: 'Park on level ground and engage parking brake\nPlace wheel wedges around tires\nLoosen lug nuts slightly\nRaise vehicle with jack\nRemove lug nuts and tire\nMount spare tire and hand-tighten lug nuts',
      help: 'List each step on a new line in order',
      multiline: true
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: formData.name,
      description: formData.description,
      image: formData.image,
      totalTime: formData.totalTime
    };

    // Estimated cost
    if (formData.estimatedCost) {
      schema.estimatedCost = {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: formData.estimatedCost
      };
    }

    // Supply (handle both string and array inputs)
    if (formData.supply) {
      const supplyItems = Array.isArray(formData.supply)
        ? formData.supply
        : formData.supply.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      schema.supply = supplyItems.map(text => ({
        '@type': 'HowToSupply',
        name: text
      }));
    }

    // Tool (handle both string and array inputs)
    if (formData.tool) {
      const toolItems = Array.isArray(formData.tool)
        ? formData.tool
        : formData.tool.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      schema.tool = toolItems.map(text => ({
        '@type': 'HowToTool',
        name: text
      }));
    }

    // Steps (handle both string, array, and object array inputs)
    if (formData.step) {
      let stepItems;

      if (Array.isArray(formData.step)) {
        // If it's already an array of objects with name/text/url
        stepItems = formData.step.map((step, index) => {
          if (typeof step === 'object' && step !== null) {
            return {
              '@type': 'HowToStep',
              text: step.text || step.name || '',
              url: step.url,
              position: index + 1
            };
          } else {
            return {
              '@type': 'HowToStep',
              text: String(step),
              position: index + 1
            };
          }
        });
      } else {
        // If it's a string, split by newlines
        stepItems = formData.step
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map((text, index) => ({
            '@type': 'HowToStep',
            text: text,
            position: index + 1
          }));
      }

      schema.step = stepItems;
    }

    return schema;
  }
};

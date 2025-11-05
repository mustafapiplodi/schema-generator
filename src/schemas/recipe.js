export const recipeSchema = {
  id: 'recipe',
  name: 'Recipe',
  description: 'Food recipes and cooking instructions',
  required: ['name', 'image', 'recipeIngredient', 'recipeInstructions'],
  recommended: ['description', 'author_name', 'datePublished', 'prepTime', 'cookTime', 'totalTime', 'recipeYield'],
  properties: {
    name: {
      label: 'Recipe Name',
      type: 'Text',
      required: true,
      placeholder: 'Chocolate Chip Cookies',
      help: 'The name of the dish or recipe'
    },
    image: {
      label: 'Recipe Image URL',
      type: 'URL',
      required: true,
      placeholder: 'https://example.com/recipe-image.jpg',
      help: 'High-quality image of the finished dish (minimum 1200px wide)'
    },
    description: {
      label: 'Description',
      type: 'Textarea',
      recommended: true,
      placeholder: 'Delicious homemade chocolate chip cookies...',
      help: 'Brief description of the recipe'
    },
    author_name: {
      label: 'Author Name',
      type: 'Text',
      recommended: true,
      placeholder: 'Jane Smith',
      help: 'Recipe author or creator'
    },
    datePublished: {
      label: 'Published Date',
      type: 'DateTime',
      recommended: true,
      help: 'When the recipe was first published'
    },
    prepTime: {
      label: 'Prep Time',
      type: 'Text',
      recommended: true,
      placeholder: 'PT15M',
      help: 'Preparation time in ISO 8601 duration format (e.g., PT15M = 15 minutes, PT1H = 1 hour)',
      example: 'PT15M (15 minutes)'
    },
    cookTime: {
      label: 'Cook Time',
      type: 'Text',
      recommended: true,
      placeholder: 'PT10M',
      help: 'Cooking time in ISO 8601 duration format',
      example: 'PT30M (30 minutes)'
    },
    totalTime: {
      label: 'Total Time',
      type: 'Text',
      recommended: true,
      placeholder: 'PT25M',
      help: 'Total time (prep + cook) in ISO 8601 duration format',
      example: 'PT45M (45 minutes)'
    },
    recipeYield: {
      label: 'Recipe Yield',
      type: 'Text',
      recommended: true,
      placeholder: '24 cookies',
      help: 'How much the recipe makes (servings, pieces, etc.)'
    },
    recipeCategory: {
      label: 'Recipe Category',
      type: 'Text',
      placeholder: 'Dessert',
      help: 'Category (e.g., Dessert, Appetizer, Main Course)',
      example: 'Dessert, Appetizer, Main Course'
    },
    recipeCuisine: {
      label: 'Cuisine',
      type: 'Text',
      placeholder: 'American',
      help: 'Cuisine type (e.g., Italian, Mexican, Asian)',
      example: 'Italian, Mexican, Chinese'
    },
    keywords: {
      label: 'Keywords',
      type: 'Text',
      placeholder: 'cookies, dessert, chocolate',
      help: 'Comma-separated keywords for the recipe'
    },
    recipeIngredient: {
      label: 'Ingredients (one per line)',
      type: 'Textarea',
      required: true,
      placeholder: '2 cups all-purpose flour\n1 cup butter\n1 cup chocolate chips',
      help: 'List each ingredient on a new line with quantity and unit',
      multiline: true
    },
    recipeInstructions: {
      label: 'Instructions (one step per line)',
      type: 'Textarea',
      required: true,
      placeholder: 'Preheat oven to 375°F\nMix butter and sugar\nAdd flour and mix well\nFold in chocolate chips\nBake for 10 minutes',
      help: 'List each step on a new line',
      multiline: true
    },
    calories: {
      label: 'Calories',
      type: 'Number',
      placeholder: '150',
      help: 'Calories per serving'
    },
    fatContent: {
      label: 'Fat Content',
      type: 'Text',
      placeholder: '8g',
      help: 'Fat per serving (include unit, e.g., 8g)'
    },
    carbohydrateContent: {
      label: 'Carbohydrate Content',
      type: 'Text',
      placeholder: '20g',
      help: 'Carbs per serving (include unit)'
    },
    proteinContent: {
      label: 'Protein Content',
      type: 'Text',
      placeholder: '2g',
      help: 'Protein per serving (include unit)'
    },
    aggregateRating_value: {
      label: 'Average Rating',
      type: 'Number',
      placeholder: '4.5',
      help: 'Average rating (1-5 scale)'
    },
    aggregateRating_count: {
      label: 'Rating Count',
      type: 'Number',
      placeholder: '127',
      help: 'Number of ratings received'
    }
  },
  transform: (formData) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: formData.name,
      image: formData.image,
      description: formData.description,
      datePublished: formData.datePublished,
      prepTime: formData.prepTime,
      cookTime: formData.cookTime,
      totalTime: formData.totalTime,
      recipeYield: formData.recipeYield,
      recipeCategory: formData.recipeCategory,
      recipeCuisine: formData.recipeCuisine,
      keywords: formData.keywords
    };

    // Author
    if (formData.author_name) {
      schema.author = {
        '@type': 'Person',
        name: formData.author_name
      };
    }

    // Ingredients (split by newlines)
    if (formData.recipeIngredient) {
      schema.recipeIngredient = formData.recipeIngredient
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    }

    // Instructions (split by newlines into HowToStep objects)
    if (formData.recipeInstructions) {
      schema.recipeInstructions = formData.recipeInstructions
        .split('\n')
        .map((line, index) => line.trim())
        .filter(line => line.length > 0)
        .map((text, index) => ({
          '@type': 'HowToStep',
          text: text,
          position: index + 1
        }));
    }

    // Nutrition
    if (formData.calories || formData.fatContent || formData.carbohydrateContent || formData.proteinContent) {
      schema.nutrition = {
        '@type': 'NutritionInformation',
        calories: formData.calories ? `${formData.calories} calories` : undefined,
        fatContent: formData.fatContent,
        carbohydrateContent: formData.carbohydrateContent,
        proteinContent: formData.proteinContent
      };
    }

    // Aggregate Rating
    if (formData.aggregateRating_value && formData.aggregateRating_count) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: formData.aggregateRating_value,
        ratingCount: formData.aggregateRating_count,
        bestRating: '5',
        worstRating: '1'
      };
    }

    return schema;
  }
};

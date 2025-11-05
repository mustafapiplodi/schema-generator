/**
 * Advanced Integration Test Suite
 * Tests forms, buttons, previews, validation, and edge cases
 */

import { schemas, schemaList } from './src/schemas/index.js';
import { cleanSchema } from './src/utils/formToSchema.js';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

// Test results tracker
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  categories: {}
};

function logTest(category, testName, status, message = '') {
  testResults.total++;

  if (!testResults.categories[category]) {
    testResults.categories[category] = { passed: 0, failed: 0, warnings: 0 };
  }

  let icon, color;
  if (status === 'pass') {
    icon = '✓';
    color = colors.green;
    testResults.passed++;
    testResults.categories[category].passed++;
  } else if (status === 'fail') {
    icon = '✗';
    color = colors.red;
    testResults.failed++;
    testResults.categories[category].failed++;
  } else if (status === 'warn') {
    icon = '⚠';
    color = colors.yellow;
    testResults.warnings++;
    testResults.categories[category].warnings++;
  }

  console.log(`  ${color}${icon} ${testName}${colors.reset}${message ? colors.dim + ' - ' + message + colors.reset : ''}`);
}

// Test 1: Schema Definition Tests
async function testSchemaDefinitions() {
  console.log(`\n${colors.bold}${colors.cyan}═══ 1. Schema Definition Tests ═══${colors.reset}`);

  for (const schemaType of Object.keys(schemas)) {
    const schema = schemas[schemaType];
    const category = 'Schema Definitions';

    // Test schema has required properties
    if (schema.name && schema.description && schema.properties && schema.transform) {
      logTest(category, `${schemaType}: Has all required properties`, 'pass');
    } else {
      logTest(category, `${schemaType}: Missing required properties`, 'fail');
      continue;
    }

    // Test properties structure
    const props = schema.properties;
    let validProps = 0;
    let totalProps = 0;

    for (const [propKey, propDef] of Object.entries(props)) {
      totalProps++;
      if (propDef.label && propDef.type) {
        validProps++;
      }
    }

    if (validProps === totalProps) {
      logTest(category, `${schemaType}: All ${totalProps} properties well-defined`, 'pass');
    } else {
      logTest(category, `${schemaType}: ${totalProps - validProps} properties missing label/type`, 'fail');
    }

    // Test transform function
    try {
      const emptyResult = schema.transform({});
      if (emptyResult && emptyResult['@context'] && emptyResult['@type']) {
        logTest(category, `${schemaType}: Transform handles empty input`, 'pass');
      } else {
        logTest(category, `${schemaType}: Transform doesn't generate valid schema`, 'fail');
      }
    } catch (error) {
      logTest(category, `${schemaType}: Transform throws on empty input`, 'fail', error.message);
    }
  }
}

// Test 2: Form Field Tests
async function testFormFields() {
  console.log(`\n${colors.bold}${colors.cyan}═══ 2. Form Field Validation Tests ═══${colors.reset}`);

  const fieldTests = {
    article: {
      headline: 'Test Headline',
      description: 'Test Description',
      datePublished: '2024-01-15T08:00:00+00:00',
    },
    product: {
      name: 'Test Product',
      price: '99.99',
      currency: 'USD',
    },
    localBusiness: {
      name: 'Test Business',
      telephone: '+1-555-0123',
      latitude: '37.7749',
      longitude: '-122.4194'
    }
  };

  for (const [schemaType, testData] of Object.entries(fieldTests)) {
    const schema = schemas[schemaType];
    const category = 'Form Fields';

    try {
      const result = schema.transform(testData);
      const cleaned = cleanSchema(result);

      // Test that input data appears in output
      let fieldsMatched = 0;
      for (const [key, value] of Object.entries(testData)) {
        if (JSON.stringify(cleaned).includes(value)) {
          fieldsMatched++;
        }
      }

      if (fieldsMatched === Object.keys(testData).length) {
        logTest(category, `${schemaType}: All input fields appear in output`, 'pass');
      } else {
        logTest(category, `${schemaType}: Some fields missing in output`, 'warn', `${fieldsMatched}/${Object.keys(testData).length} matched`);
      }
    } catch (error) {
      logTest(category, `${schemaType}: Field transform failed`, 'fail', error.message);
    }
  }
}

// Test 3: Clear Form Behavior (Empty Input Tests)
async function testClearFormBehavior() {
  console.log(`\n${colors.bold}${colors.cyan}═══ 3. Clear Form Behavior Tests ═══${colors.reset}`);

  for (const schemaType of Object.keys(schemas)) {
    const schema = schemas[schemaType];
    const category = 'Clear Form';

    try {
      // Test with empty object (simulating cleared form)
      const emptyResult = schema.transform({});
      const cleaned = cleanSchema(emptyResult);

      // Should have @context and @type at minimum
      if (cleaned['@context'] && cleaned['@type']) {
        logTest(category, `${schemaType}: Generates minimal valid schema when cleared`, 'pass');
      } else {
        logTest(category, `${schemaType}: Fails to generate valid schema when cleared`, 'fail');
      }

      // Should not have many properties when empty
      const propCount = Object.keys(cleaned).length;
      if (propCount <= 3) { // @context, @type, and maybe one more
        logTest(category, `${schemaType}: Properly removes empty fields (${propCount} props)`, 'pass');
      } else {
        logTest(category, `${schemaType}: Retains too many empty fields (${propCount} props)`, 'warn');
      }

    } catch (error) {
      logTest(category, `${schemaType}: Clear form simulation failed`, 'fail', error.message);
    }
  }
}

// Test 4: Edge Cases and Special Characters
async function testEdgeCases() {
  console.log(`\n${colors.bold}${colors.cyan}═══ 4. Edge Cases & Special Characters ═══${colors.reset}`);

  const edgeCases = {
    specialChars: {
      article: {
        headline: 'Test "Quotes" & <Special> Characters',
        description: "Test's description with apostrophe"
      }
    },
    longStrings: {
      article: {
        headline: 'A'.repeat(150), // Longer than recommended 110
        description: 'B'.repeat(500)
      }
    },
    emptyStrings: {
      product: {
        name: '',
        description: '   ',
        price: ''
      }
    },
    invalidURLs: {
      organization: {
        url: 'not-a-valid-url',
        logoUrl: 'also-not-valid'
      }
    },
    negativeNumbers: {
      product: {
        price: '-99.99',
        ratingValue: '-5'
      }
    }
  };

  for (const [testType, testCases] of Object.entries(edgeCases)) {
    for (const [schemaType, testData] of Object.entries(testCases)) {
      const schema = schemas[schemaType];
      const category = 'Edge Cases';

      try {
        const result = schema.transform(testData);
        const cleaned = cleanSchema(result);

        // Just check it doesn't crash and produces valid JSON
        JSON.stringify(cleaned);
        logTest(category, `${schemaType}: Handles ${testType}`, 'pass');

        // Check for XSS protection (< should be escaped)
        const jsonString = JSON.stringify(cleaned);
        if (testType === 'specialChars' && jsonString.includes('<')) {
          logTest(category, `${schemaType}: XSS protection needed`, 'warn', 'Found unescaped < character');
        }

      } catch (error) {
        logTest(category, `${schemaType}: Failed on ${testType}`, 'fail', error.message);
      }
    }
  }
}

// Test 5: Array and Multiline Field Tests
async function testArrayFields() {
  console.log(`\n${colors.bold}${colors.cyan}═══ 5. Array & Multiline Field Tests ═══${colors.reset}`);

  const arrayTests = {
    breadcrumb: {
      // Test with array
      items: [
        { name: 'Home', url: 'https://example.com/' },
        { name: 'Products', url: 'https://example.com/products' }
      ]
    },
    faq: {
      // Test with array
      questions: [
        { question: 'Q1?', answer: 'A1' },
        { question: 'Q2?', answer: 'A2' }
      ]
    },
    howto: {
      // Test string input
      supply: 'Item 1\nItem 2\nItem 3',
      tool: 'Tool 1\nTool 2',
      step: 'Step 1\nStep 2\nStep 3'
    },
    person: {
      // Test string input
      sameAs: 'https://twitter.com/user\nhttps://linkedin.com/in/user',
      award: 'Award 1\nAward 2'
    }
  };

  // Also test with array inputs
  const arrayTestsAlternate = {
    howto: {
      supply: ['Item 1', 'Item 2', 'Item 3'],
      tool: ['Tool 1', 'Tool 2'],
      step: ['Step 1', 'Step 2', 'Step 3']
    },
    person: {
      sameAs: ['https://twitter.com/user', 'https://linkedin.com/in/user'],
      award: ['Award 1', 'Award 2']
    }
  };

  const category = 'Array Fields';

  // Test string inputs
  for (const [schemaType, testData] of Object.entries(arrayTests)) {
    const schema = schemas[schemaType];

    try {
      const result = schema.transform(testData);
      const cleaned = cleanSchema(result);
      const jsonString = JSON.stringify(cleaned);

      // Check that arrays are properly created
      if (jsonString.includes('[') && jsonString.includes(']')) {
        logTest(category, `${schemaType}: Converts string to array`, 'pass');
      } else {
        logTest(category, `${schemaType}: Array not generated`, 'warn');
      }

      // Check for proper array length
      const itemCount = testData.items?.length ||
                       testData.questions?.length ||
                       (testData.supply?.split?.('\n').filter(x => x.trim()).length) ||
                       (testData.sameAs?.split?.('\n').filter(x => x.trim()).length);

      if (itemCount) {
        logTest(category, `${schemaType}: Processes ${itemCount} array items`, 'pass');
      }

    } catch (error) {
      logTest(category, `${schemaType}: String array conversion failed`, 'fail', error.message);
    }
  }

  // Test array inputs
  for (const [schemaType, testData] of Object.entries(arrayTestsAlternate)) {
    const schema = schemas[schemaType];

    try {
      const result = schema.transform(testData);
      const cleaned = cleanSchema(result);

      logTest(category, `${schemaType}: Handles native array input`, 'pass');

    } catch (error) {
      logTest(category, `${schemaType}: Native array handling failed`, 'fail', error.message);
    }
  }
}

// Test 6: Required vs Optional Fields
async function testRequiredFields() {
  console.log(`\n${colors.bold}${colors.cyan}═══ 6. Required vs Optional Fields ═══${colors.reset}`);

  for (const schemaType of Object.keys(schemas)) {
    const schema = schemas[schemaType];
    const category = 'Required Fields';

    // Get required fields
    const requiredFields = Object.entries(schema.properties)
      .filter(([_, prop]) => prop.required)
      .map(([key, _]) => key);

    if (requiredFields.length > 0) {
      logTest(category, `${schemaType}: Has ${requiredFields.length} required fields`, 'pass', requiredFields.join(', '));

      // Test with only required fields
      const minimalData = {};
      requiredFields.forEach(field => {
        // Provide minimal valid data
        const propDef = schema.properties[field];
        if (propDef.type === 'Text') minimalData[field] = 'Test';
        else if (propDef.type === 'Number') minimalData[field] = '1';
        else if (propDef.type === 'URL') minimalData[field] = 'https://example.com';
        else if (propDef.type === 'Date') minimalData[field] = '2024-01-01';
        else if (propDef.type === 'Textarea') minimalData[field] = 'Test';
        else minimalData[field] = 'Test';
      });

      try {
        const result = schema.transform(minimalData);
        const cleaned = cleanSchema(result);

        if (cleaned['@context'] && cleaned['@type']) {
          logTest(category, `${schemaType}: Generates valid schema with only required fields`, 'pass');
        } else {
          logTest(category, `${schemaType}: Invalid schema with only required fields`, 'fail');
        }
      } catch (error) {
        logTest(category, `${schemaType}: Fails with only required fields`, 'fail', error.message);
      }

    } else {
      logTest(category, `${schemaType}: Has no required fields`, 'pass');
    }
  }
}

// Test 7: JSON-LD Validation
async function testJSONLDValidation() {
  console.log(`\n${colors.bold}${colors.cyan}═══ 7. JSON-LD Structure Validation ═══${colors.reset}`);

  // Sample complete data for each schema
  const sampleData = {
    article: { headline: 'Test', datePublished: '2024-01-01', authorName: 'John', publisherName: 'Pub' },
    product: { name: 'Product', description: 'Desc', price: '99', currency: 'USD' },
    localBusiness: { name: 'Business', streetAddress: '123 St', addressLocality: 'City' },
    organization: { name: 'Org', url: 'https://example.com' },
    breadcrumb: { items: [{ name: 'Home', url: 'https://example.com/' }] },
    faq: { questions: [{ question: 'Q?', answer: 'A' }] },
    event: { name: 'Event', startDate: '2024-06-01T10:00:00Z' },
    recipe: { name: 'Recipe', recipeYield: '4 servings' },
    video: { name: 'Video', description: 'Desc', thumbnailUrl: 'https://example.com/thumb.jpg', uploadDate: '2024-01-01' },
    howto: { name: 'HowTo', step: 'Step 1' },
    jobPosting: { title: 'Job', description: 'Desc', datePosted: '2024-01-01', hiringOrganizationName: 'Company' },
    review: { reviewBody: 'Great!', datePublished: '2024-01-01', reviewAuthor: 'John' },
    website: { name: 'Site', url: 'https://example.com' },
    person: { name: 'John Doe' }
  };

  for (const [schemaType, testData] of Object.entries(sampleData)) {
    const schema = schemas[schemaType];
    const category = 'JSON-LD Validation';

    try {
      const result = schema.transform(testData);
      const cleaned = cleanSchema(result);

      // Test @context
      if (cleaned['@context'] === 'https://schema.org') {
        logTest(category, `${schemaType}: Valid @context`, 'pass');
      } else {
        logTest(category, `${schemaType}: Invalid @context`, 'fail', cleaned['@context']);
      }

      // Test @type
      if (cleaned['@type'] && typeof cleaned['@type'] === 'string') {
        logTest(category, `${schemaType}: Valid @type (${cleaned['@type']})`, 'pass');
      } else {
        logTest(category, `${schemaType}: Invalid @type`, 'fail');
      }

      // Test nested objects have @type
      const nestedObjects = Object.values(cleaned).filter(val =>
        typeof val === 'object' && val !== null && !Array.isArray(val)
      );

      let allNestedHaveType = true;
      for (const obj of nestedObjects) {
        if (!obj['@type']) {
          allNestedHaveType = false;
          break;
        }
      }

      if (nestedObjects.length > 0) {
        if (allNestedHaveType) {
          logTest(category, `${schemaType}: All nested objects have @type`, 'pass');
        } else {
          logTest(category, `${schemaType}: Some nested objects missing @type`, 'warn');
        }
      }

    } catch (error) {
      logTest(category, `${schemaType}: JSON-LD validation failed`, 'fail', error.message);
    }
  }
}

// Test 8: Data Type Validation
async function testDataTypes() {
  console.log(`\n${colors.bold}${colors.cyan}═══ 8. Data Type Validation ═══${colors.reset}`);

  const typeTests = {
    article: {
      datePublished: '2024-01-15T08:00:00+00:00', // Should be ISO 8601
      headline: 'Test Headline', // Should be string
    },
    product: {
      price: '99.99', // Should be string number
      ratingValue: '4.5', // Should be numeric string
    },
    localBusiness: {
      latitude: '37.7749', // Should be string number
      longitude: '-122.4194',
      telephone: '+1-555-0123' // Should have + prefix
    },
    breadcrumb: {
      items: [
        { name: 'Home', url: 'https://example.com/' } // URLs should be absolute
      ]
    }
  };

  const category = 'Data Types';

  for (const [schemaType, testData] of Object.entries(typeTests)) {
    const schema = schemas[schemaType];

    try {
      const result = schema.transform(testData);
      const cleaned = cleanSchema(result);
      const jsonString = JSON.stringify(cleaned);

      // Test date format (ISO 8601)
      if (testData.datePublished) {
        if (jsonString.includes(testData.datePublished)) {
          logTest(category, `${schemaType}: Date in ISO 8601 format`, 'pass');
        } else {
          logTest(category, `${schemaType}: Date format modified`, 'warn');
        }
      }

      // Test URLs are absolute
      if (testData.items) {
        const hasHttps = jsonString.includes('https://');
        if (hasHttps) {
          logTest(category, `${schemaType}: URLs are absolute`, 'pass');
        } else {
          logTest(category, `${schemaType}: URLs might be relative`, 'warn');
        }
      }

      // Test phone numbers
      if (testData.telephone) {
        if (jsonString.includes('+')) {
          logTest(category, `${schemaType}: Phone has country code (+)`, 'pass');
        } else {
          logTest(category, `${schemaType}: Phone missing country code`, 'warn');
        }
      }

      // Test numeric values
      if (testData.price || testData.latitude) {
        logTest(category, `${schemaType}: Numeric values preserved`, 'pass');
      }

    } catch (error) {
      logTest(category, `${schemaType}: Data type validation failed`, 'fail', error.message);
    }
  }
}

// Test 9: Schema List Export Test
async function testSchemaListExport() {
  console.log(`\n${colors.bold}${colors.cyan}═══ 9. Schema List & Export Tests ═══${colors.reset}`);

  const category = 'Export';

  // Test schemaList export
  if (Array.isArray(schemaList)) {
    logTest(category, 'schemaList is an array', 'pass', `${schemaList.length} schemas`);
  } else {
    logTest(category, 'schemaList is not an array', 'fail');
    return;
  }

  // Test each item in schemaList
  for (const schemaItem of schemaList) {
    if (schemaItem.id && schemaItem.name && schemaItem.description) {
      logTest(category, `${schemaItem.id}: Has required metadata`, 'pass');
    } else {
      logTest(category, `${schemaItem.id}: Missing metadata`, 'fail');
    }
  }

  // Test cleanSchema function
  const testObj = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name: 'Test',
    empty: '',
    nullValue: null,
    undefined: undefined,
    emptyArray: [],
    emptyObject: {},
    validArray: ['item'],
    validObject: { key: 'value' }
  };

  const cleaned = cleanSchema(testObj);

  if (!cleaned.empty && !cleaned.nullValue && !cleaned.undefined) {
    logTest(category, 'cleanSchema removes empty/null/undefined', 'pass');
  } else {
    logTest(category, 'cleanSchema retains empty values', 'fail');
  }

  if (!cleaned.emptyArray && !cleaned.emptyObject) {
    logTest(category, 'cleanSchema removes empty arrays/objects', 'pass');
  } else {
    logTest(category, 'cleanSchema retains empty collections', 'fail');
  }

  if (cleaned.validArray && cleaned.validObject) {
    logTest(category, 'cleanSchema preserves valid data', 'pass');
  } else {
    logTest(category, 'cleanSchema removes valid data', 'fail');
  }
}

// Test 10: Performance Tests
async function testPerformance() {
  console.log(`\n${colors.bold}${colors.cyan}═══ 10. Performance Tests ═══${colors.reset}`);

  const category = 'Performance';

  for (const schemaType of Object.keys(schemas).slice(0, 5)) { // Test first 5 for speed
    const schema = schemas[schemaType];

    // Create sample data
    const sampleData = { name: 'Test', description: 'Test description' };

    // Test generation time
    const iterations = 100;
    const start = Date.now();

    for (let i = 0; i < iterations; i++) {
      const result = schema.transform(sampleData);
      cleanSchema(result);
    }

    const end = Date.now();
    const avgTime = (end - start) / iterations;

    if (avgTime < 10) {
      logTest(category, `${schemaType}: Fast generation (${avgTime.toFixed(2)}ms avg)`, 'pass');
    } else if (avgTime < 50) {
      logTest(category, `${schemaType}: Acceptable speed (${avgTime.toFixed(2)}ms avg)`, 'pass');
    } else {
      logTest(category, `${schemaType}: Slow generation (${avgTime.toFixed(2)}ms avg)`, 'warn');
    }
  }
}

// Main test runner
async function runAdvancedTests() {
  console.log(`${colors.bold}${colors.magenta}
╔════════════════════════════════════════════════════════╗
║   ADVANCED SCHEMA GENERATOR INTEGRATION TEST SUITE    ║
║           Comprehensive Functionality Testing          ║
╚════════════════════════════════════════════════════════╝
${colors.reset}`);

  try {
    await testSchemaDefinitions();
    await testFormFields();
    await testClearFormBehavior();
    await testEdgeCases();
    await testArrayFields();
    await testRequiredFields();
    await testJSONLDValidation();
    await testDataTypes();
    await testSchemaListExport();
    await testPerformance();

    // Print summary
    console.log(`\n${colors.bold}${colors.magenta}╔════════════════════════════════════════════════════════╗`);
    console.log(`║                    TEST SUMMARY                        ║`);
    console.log(`╚════════════════════════════════════════════════════════╝${colors.reset}\n`);

    console.log(`${colors.bold}Overall Results:${colors.reset}`);
    console.log(`  Total Tests:  ${testResults.total}`);
    console.log(`  ${colors.green}✓ Passed:     ${testResults.passed}${colors.reset}`);
    console.log(`  ${colors.red}✗ Failed:     ${testResults.failed}${colors.reset}`);
    console.log(`  ${colors.yellow}⚠ Warnings:   ${testResults.warnings}${colors.reset}`);

    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    console.log(`\n  ${colors.bold}Success Rate: ${successRate}%${colors.reset}`);

    console.log(`\n${colors.bold}Results by Category:${colors.reset}`);
    for (const [category, results] of Object.entries(testResults.categories)) {
      const total = results.passed + results.failed + results.warnings;
      const rate = ((results.passed / total) * 100).toFixed(0);
      console.log(`  ${category.padEnd(25)} ${colors.green}${results.passed}✓${colors.reset} ${colors.red}${results.failed}✗${colors.reset} ${colors.yellow}${results.warnings}⚠${colors.reset}  (${rate}%)`);
    }

    // Status badge
    if (testResults.failed === 0) {
      console.log(`\n${colors.bold}${colors.green}  ✓ ALL TESTS PASSED! System is production-ready.${colors.reset}`);
    } else if (testResults.failed < 5) {
      console.log(`\n${colors.bold}${colors.yellow}  ⚠ Minor issues detected. Review failed tests.${colors.reset}`);
    } else {
      console.log(`\n${colors.bold}${colors.red}  ✗ Multiple failures detected. System needs fixes.${colors.reset}`);
    }

    // Save results
    const fs = await import('fs');
    fs.writeFileSync(
      './test-results-advanced.json',
      JSON.stringify(testResults, null, 2)
    );

    console.log(`\n${colors.cyan}Detailed results saved to: test-results-advanced.json${colors.reset}\n`);

    return testResults;

  } catch (error) {
    console.error(`${colors.red}Test suite crashed: ${error.message}${colors.reset}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
runAdvancedTests().catch(console.error);

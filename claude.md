# Schema Markup Generator - Project Specification

## Project Overview

A client-side web application that generates valid JSON-LD structured data for the most common schema types. The tool addresses a proven market demand (18,000+ monthly searches for "schema markup generator") and solves critical pain points in existing tools: invalid code generation, lack of real-time validation, and poor user experience.

**Target Build Time**: 4-5 days
**Primary Format**: JSON-LD (Google's recommended format)
**Target Users**: SEO professionals, content creators, developers, small business owners

## Core Value Proposition

Unlike existing tools that generate invalid code requiring manual cleanup, this generator provides:
- Real-time validation BEFORE code generation
- Inline error explanations and field-level guidance
- Clean, valid code that passes Google's Rich Results Test without manual editing
- Multi-schema support for pages requiring multiple schema types
- Modern, intuitive interface with progressive disclosure

## Supported Schema Types (Priority Order)

### Phase 1 - Essential Types (MVP)
1. **Article** (BlogPosting, NewsArticle variants)
2. **Product** (with Offer, Review, AggregateRating)
3. **LocalBusiness** (with 100+ subtypes like Restaurant, Dentist, DaySpa)
4. **Organization** (with nested entities)
5. **Breadcrumb** (BreadcrumbList)
6. **FAQ** (with government/health restriction warning)

### Phase 2 - Extended Coverage
7. Event
8. Recipe
9. VideoObject
10. HowTo
11. JobPosting
12. Review
13. WebSite (with SiteNavigationElement)
14. Person

## Technical Architecture

### Technology Stack
- **Frontend Framework**: React or vanilla JavaScript (client-side only)
- **No Backend Required**: Pure client-side for privacy, speed, and zero hosting costs
- **Storage**: localStorage for save/load functionality
- **Styling**: Modern CSS with mobile-first responsive design
- **Validation**: Multi-level validation system (4 levels)

### Core Components

```
schema-generator/
├── src/
│   ├── components/
│   │   ├── TypeSelector.jsx          # Schema type selection interface
│   │   ├── DynamicFormBuilder.jsx    # Dynamic form generation
│   │   ├── CodeGenerator.jsx         # JSON-LD output generation
│   │   ├── RealtimeValidator.jsx     # 4-level validation system
│   │   ├── PreviewPanel.jsx          # Visual preview of rich results
│   │   └── ExportOptions.jsx         # Copy/download/GTM export
│   ├── schemas/
│   │   ├── article.js                # Article schema definition
│   │   ├── product.js                # Product schema definition
│   │   ├── localBusiness.js          # LocalBusiness schema definition
│   │   ├── organization.js           # Organization schema definition
│   │   ├── breadcrumb.js             # Breadcrumb schema definition
│   │   └── faq.js                    # FAQ schema definition
│   ├── validators/
│   │   ├── syntaxValidator.js        # Level 1: JSON syntax
│   │   ├── structureValidator.js     # Level 2: JSON-LD structure
│   │   ├── schemaValidator.js        # Level 3: Schema.org compliance
│   │   └── googleValidator.js        # Level 4: Google requirements
│   ├── utils/
│   │   ├── formToSchema.js           # Form data mapping
│   │   ├── xssProtection.js          # XSS prevention
│   │   └── dateFormatter.js          # ISO 8601 formatting
│   └── App.jsx
└── public/
```

## Key Features & Requirements

### 1. Type Selector
- **Visual Card Layout**: Display 6 primary schema types as cards
- **Search Functionality**: Filter schema types
- **Quick Access**: Most commonly used types prominently displayed
- **Type Descriptions**: Brief explanation of when to use each type

### 2. Dynamic Form Builder

#### Field Classification System
Display fields with clear visual indicators:
- **Required** (red asterisk): Must be filled for valid schema
- **Recommended** (orange dot): Strongly impacts rich result eligibility
- **Optional** (gray): Enhances schema but not critical

#### Field-Level Features
- Character count displays (e.g., Article headline: 110 char max)
- Format examples (e.g., "2024-01-05T08:00:00+08:00" for dates)
- Tooltips with explanations for technical fields
- Inline validation with real-time feedback (green/yellow/red indicators)
- Smart defaults where applicable

#### Nested Entity Support
- Support for nested objects (e.g., Product > Offer > Price)
- Visual hierarchy showing parent-child relationships
- Add/remove functionality for array properties

### 3. Real-Time Validation System

#### Level 1: JSON Syntax
- Use `JSON.parse()` to catch syntax errors
- Show syntax errors immediately

#### Level 2: JSON-LD Structure
- Verify `@context` is "https://schema.org"
- Verify `@type` is present
- Check proper JSON-LD formatting

#### Level 3: Schema.org Compliance
- Validate against Schema.org type definitions
- Check required properties are present
- Verify property types are correct (Text, Number, URL, Date)
- Generate warnings for missing recommended properties

#### Level 4: Google Rich Results Requirements
- **Article**: Image minimum 50,000 pixels, headline under 110 characters
- **Product**: Validate offers, price, priceCurrency, availability enumerations
- **LocalBusiness**: NAP consistency warnings
- **FAQ**: Display government/health restriction warning
- **All Types**: Ensure all structured data reflects visible page content

#### Error Severity Levels
- **Critical** (red): Blocks code generation
- **Error** (orange): Prevents rich results eligibility
- **Warning** (yellow): Limits features or effectiveness
- **Suggestion** (blue): Optimization opportunity

### 4. Code Generator

#### Output Requirements
- Generate clean, valid JSON-LD
- XSS protection: Escape `<` characters as `\u003c`
- Minified option for production use
- Human-readable formatting option for development
- Omit empty/null fields from output

#### Template System
```javascript
const MAPPINGS = {
  'product': {
    'product_name': 'name',
    'product_desc': 'description',
    'price': 'offers.price',
    'currency': 'offers.priceCurrency',
    'availability': 'offers.availability',
    'image_url': 'image'
  }
};
```

### 5. Multi-Schema Support

Enable users to generate multiple schema types for a single page:
- Add multiple schema types in single workflow
- Output as separate script blocks OR `@graph` format
- Warn about conflicting types (FAQ vs HowTo)
- Visual indicator showing which schemas are active

### 6. Preview Panel

- Visual representation of how rich results might appear
- Mobile and desktop view toggle
- Show different rich result formats (carousel, cards, lists)
- Preview updates in real-time as form changes

### 7. Export Options

- **Copy to Clipboard**: One-click copy with confirmation
- **Download JSON**: Save as .json file
- **HTML Embed Code**: Complete `<script type="application/ld+json">` tag
- **GTM Template**: Pre-formatted for Google Tag Manager

### 8. Save/Load Functionality

- Save schemas to localStorage with custom names
- Load previously created schemas
- Export/import schemas as JSON files
- Recent schemas quick access (last 5)

## Schema-Specific Implementation Details

### Article Schema
**Required Fields**: headline, image, datePublished
**Recommended**: author (as Person/Organization object), dateModified, publisher

**Validation Rules**:
- Headline: Max 110 characters
- Image: Minimum 50,000 pixels (696px width minimum)
- Date format: ISO 8601 with timezone (e.g., "2024-01-05T08:00:00+08:00")
- Author: Must be Person/Organization object, not bare string
- Publisher: Organization object with logo as ImageObject

**Form Fields**:
- Article Type dropdown (Article, BlogPosting, NewsArticle)
- Headline (text input, 110 char limit)
- Image URL (URL validation, dimension checker)
- Date Published (date-time picker with timezone)
- Date Modified (optional, date-time picker)
- Author Name + URL (generates Person object)
- Publisher Name + Logo URL (generates Organization object)
- Description (textarea)

### Product Schema
**Required Fields**: name, image, description, offers
**Recommended**: brand, sku/gtin/mpn, aggregateRating, review

**Validation Rules**:
- Price: Numeric with period as decimal separator (never comma)
- Currency: ISO 4217 codes (USD, EUR, GBP)
- Availability: Full schema.org URLs (https://schema.org/InStock)
- GTIN: Check digit validation for GTIN-8/12/13/14
- Price Valid Until: ISO 8601 date format

**Form Fields**:
- Product Name (text)
- Description (textarea)
- Image URLs (array, add/remove)
- Brand Name (text)
- Price (number, decimal validation)
- Currency (dropdown: USD, EUR, GBP, etc.)
- Availability (dropdown: InStock, OutOfStock, PreOrder, etc.)
- SKU (text)
- GTIN/UPC/EAN (text with validation)
- MPN (text)
- Aggregate Rating: rating value, review count, best/worst rating
- Individual Reviews: reviewer name, rating, review text (array)

**Product Variants Support** (February 2024 feature):
- Variant selector (color, size, material)
- Variant-specific pricing and availability

### LocalBusiness Schema
**Required Fields**: name, address (PostalAddress object)
**Recommended**: telephone, geo (GeoCoordinates), openingHoursSpecification

**Validation Rules**:
- Telephone: Must include country code with + prefix
- Geo Coordinates: Minimum 5 decimal places precision
- Address Region: Use abbreviations (NY, CA, TX)
- Address Country: ISO 3166-1 alpha-2 codes (US, GB, CA)
- Opening Hours: 24-hour format (hh:mm)
- NAP Consistency: Warning to match Google Business Profile exactly

**Form Fields**:
- Business Type (dropdown with 100+ subtypes: Restaurant, Dentist, etc.)
- Business Name (text)
- Street Address (text)
- City (text)
- State/Region (text, show abbreviation example)
- Postal Code (text)
- Country (dropdown, ISO codes)
- Phone (text with country code validation)
- Coordinates: Latitude/Longitude (number inputs, 5+ decimal places)
  - **Auto-populate option**: Geocoding API integration suggestion
- Opening Hours (day selector + time range picker)
  - Common patterns: 24-hour, closed days, past-midnight hours
- Price Range (text, max 100 chars, example: "$$" or "$10-15")
- Cuisine Types (for restaurants, array)
- Menu URL (for restaurants, URL validation)

**Special Cases**:
- 24-hour operation: "00:00" open, "23:59" close
- Closed days: "00:00" for both open and close
- Past midnight: Saturday "18:00" to "03:00"

### Organization Schema
**Required Fields**: None (per Google)
**Critical for E-E-A-T**: name, url, logo, sameAs

**Validation Rules**:
- Logo: Square or wide rectangle (not tall)
- Logo dimensions: Validate aspect ratio
- sameAs URLs: Must be valid, full URLs
- Business Identifiers: Format validation (DUNS, VAT ID, etc.)

**Form Fields**:
- Organization Name (text)
- Website URL (URL validation)
- Logo URL (URL validation, aspect ratio check)
- Social Media Profiles (array of URLs)
  - Facebook, Twitter, LinkedIn, Instagram, YouTube, Wikipedia
- Contact Information:
  - Telephone (country code format)
  - Email (email validation)
  - Contact Type (dropdown: Customer Service, Technical Support, etc.)
- Business Identifiers (optional but valuable):
  - DUNS Number
  - VAT ID (with ICD format: 9957:VAT_ID)
  - Tax ID
  - NAICS Code
- Address (for multi-location, array)
- Founding Date (date picker, ISO 8601)
- Number of Employees (range or specific number)

### Breadcrumb Schema
**Required Fields**: itemListElement (minimum 2 items)

**Validation Rules**:
- Minimum 2 ListItem objects
- Position: Sequential integers starting at 1
- URLs: Must be absolute (full domain), never relative
- Last breadcrumb: Can omit item property (current page)

**Form Fields**:
- Breadcrumb items (array, minimum 2):
  - Position (auto-increment, read-only)
  - Name/Label (text)
  - URL (URL validation, absolute check)
- Add/Remove item buttons
- Auto-increment position values
- Visual breadcrumb preview showing navigation path

**Features**:
- Support multiple breadcrumb trails (array of BreadcrumbList)
- Preview showing how breadcrumbs appear visually
- Mobile preview (typically shows last 2 elements)

### FAQ Schema
**Required Fields**: mainEntity (array of Question objects, minimum 2)

**Validation Rules**:
- Minimum 2 questions
- Each Question has exactly 1 acceptedAnswer
- Answer text accepts limited HTML: h1-h6, br, ol, ul, li, a, p, div, b, strong, i, em
- All Q&A content must be visible on page
- No promotional content disguised as questions

**Form Fields**:
- **PROMINENT WARNING**: "FAQ rich results are restricted to government and health-focused websites only (Google policy as of August 2023)"
- Question-Answer pairs (array, minimum 2):
  - Question text (textarea)
  - Answer text (rich text editor with HTML tag whitelist)
- Add/Remove Q&A buttons
- HTML tag whitelist validator
- Promotional language pattern detection (warning)

**UI Features**:
- Preview showing Q&A display on page
- HTML tag help tooltip
- Example of proper formatting

## UI/UX Design Guidelines

### Layout Structure
```
+------------------------------------------+
| Header: Schema Markup Generator          |
+------------------------------------------+
| [Type Selector Cards - 6 types]          |
+------------------------------------------+
| Left Panel          | Right Panel        |
| (60%)               | (40%)              |
|                     |                    |
| Dynamic Form        | Live Code Preview  |
| - Field groups      | - Syntax highlight |
| - Validation        | - Copy button      |
|   indicators        | - Download         |
| - Help tooltips     | - Validation       |
|                     |   status           |
|                     |                    |
|                     | Visual Preview     |
|                     | - Rich result      |
|                     | - Mobile/Desktop   |
+------------------------------------------+
| Footer: Resources, Validation Tools      |
+------------------------------------------+
```

### Color System (Validation States)
- **Critical/Required**: #EF4444 (red)
- **Error**: #F97316 (orange)
- **Warning**: #EAB308 (yellow)
- **Success/Valid**: #10B981 (green)
- **Suggestion**: #3B82F6 (blue)
- **Optional**: #6B7280 (gray)

### Progressive Disclosure
- Show required fields first, expanded by default
- Recommended fields in collapsible section (expanded)
- Optional fields in collapsible section (collapsed)
- Advanced options (minification, @graph format) in separate section

### Mobile Responsiveness
- Stack left/right panels vertically on mobile
- Type selector cards: 1 column on mobile, 2 on tablet, 3 on desktop
- Sticky header with type selector on scroll
- Bottom sheet for code preview on mobile

## Validation Error Messages

### Examples of Clear Error Messages
- **Bad**: "Invalid date format"
- **Good**: "Date must be in ISO 8601 format with timezone. Example: 2024-01-05T08:00:00+08:00"

- **Bad**: "Missing required field"
- **Good**: "Headline is required for Article schema and must be under 110 characters"

- **Bad**: "Invalid price"
- **Good**: "Price must use period as decimal separator (e.g., 29.99), not comma. Google requirement."

### Warning Examples
- "Your headline is 95 characters. Maximum is 110 characters. Consider shortening for mobile display."
- "No image provided. Images are strongly recommended and improve rich result eligibility."
- "FAQ rich results are restricted to government and health websites only (Google policy). Other search engines may still use this markup."
- "Your NAP (Name, Address, Phone) should match your Google Business Profile exactly to avoid entity confusion."

## Performance Requirements

### Page Load
- Initial load under 2 seconds
- Time to Interactive under 3 seconds

### Validation
- Real-time validation with <100ms debounce
- No blocking operations during typing
- Validate on blur for complex fields

### Code Generation
- Generate JSON-LD in <50ms
- Update preview in <100ms
- Minified/formatted toggle instant

### Caching
- Cache generated schemas in memory to avoid regeneration
- localStorage for saved schemas (max 5MB)

## Testing Requirements

### Validation Testing
1. **Level 1 Syntax**: Test with malformed JSON
2. **Level 2 Structure**: Test missing @context, @type
3. **Level 3 Schema.org**: Test invalid property types, missing required props
4. **Level 4 Google**: Test all Google-specific requirements per schema type

### Integration Testing
- Export all 6 schema types
- Validate exported code in Google Rich Results Test
- Verify code passes without errors or warnings
- Test multi-schema page generation

### Cross-Browser Testing
- Chrome, Firefox, Safari, Edge
- Mobile Safari, Chrome Mobile
- Test localStorage persistence
- Test clipboard copy functionality

### Accessibility Testing
- Keyboard navigation throughout entire workflow
- Screen reader compatibility
- ARIA labels for form fields
- Focus indicators visible
- Error messages announced to screen readers

## User Workflows

### Primary Workflow: Single Schema Generation
1. User lands on page → sees 6 type selector cards
2. User clicks "Article" card
3. Dynamic form appears with Article fields
4. User fills required fields (red asterisk)
5. Real-time validation shows green checkmarks
6. User fills recommended fields (orange dot)
7. Preview panel shows live JSON-LD code
8. Validation status shows "Valid - Ready for Google"
9. User clicks "Copy to Clipboard"
10. Success message confirms copy

### Secondary Workflow: Multi-Schema Page
1. User selects "Organization" → fills form
2. User clicks "Add Another Schema" button
3. User selects "LocalBusiness" → fills form
4. Preview shows both schemas in @graph format
5. User exports combined schema

### Tertiary Workflow: Save/Load
1. User generates Product schema
2. User clicks "Save Schema" button
3. Modal prompts for schema name: "Product - iPhone 15"
4. Schema saved to localStorage
5. Later session: User clicks "Load Schema"
6. Dropdown shows recent schemas
7. User selects "Product - iPhone 15"
8. Form auto-populates with saved data

## Competitive Differentiation

### Pain Points Solved (vs. Existing Tools)

| Pain Point | Existing Tools | Our Solution |
|------------|---------------|--------------|
| Invalid code generation | Blank fields create invalid JSON | Omit empty fields, validate before generation |
| No validation feedback | Generate → Test → Find errors → Repeat | Real-time validation with inline errors |
| Manual cleanup required | Users must fix code manually | Generate clean, valid code immediately |
| Single schema per workflow | Requires multiple uses for multi-schema pages | Multi-schema support in single workflow |
| No save functionality | Must recreate schemas | Save/load with localStorage |
| Poor mobile experience | Desktop-only interfaces | Mobile-first responsive design |
| No field guidance | Users guess what to enter | Tooltips, examples, character counts |

### Unique Value Propositions
1. **Zero Manual Cleanup**: Code works immediately without editing
2. **Real-Time Validation**: See errors before generating code
3. **Multi-Schema Workflow**: Combine multiple types for single page
4. **Educational Interface**: Learn proper schema usage while generating
5. **Privacy-First**: Client-side only, no data sent to servers

## Future Enhancements (Post-MVP)

### Phase 2 Features
- Bulk generation via CSV import
- Visual entity relationship mapper
- Industry-specific templates (Restaurant, SaaS, Medical Practice)
- Content detection: scrape URL and auto-populate fields
- A/B testing: save multiple versions, compare

### Phase 3 Features
- WordPress plugin integration
- Chrome extension for context-aware generation
- API for programmatic access
- Team collaboration features
- Schema version history

### AI Integration Opportunities
- Auto-detect schema type from page content
- Suggest missing recommended properties
- Optimize for AI platforms (ChatGPT, Gemini, Perplexity)
- Knowledge graph relationship suggestions

## Success Metrics

### User Engagement
- Time to first valid schema generation
- Average schemas generated per session
- Save/Load feature usage rate
- Multi-schema workflow adoption rate

### Quality Metrics
- Percentage of generated schemas passing Google Rich Results Test
- Reduction in validation errors vs. competitor tools
- User satisfaction ratings

### Business Metrics
- Monthly active users
- Organic search traffic from "schema markup generator"
- Conversion rate to advanced features (if monetized)

## Resources & Links

### Essential Documentation
- **Schema.org**: https://schema.org/docs/schemas.html
- **Google Search Central**: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/

### Key Reference Points
- Schema.org Version 29.3 (September 2025) - current standard
- 817 types, 1,518 properties in Schema.org vocabulary
- JSON-LD is Google's officially recommended format
- Mobile-first indexing: mobile version determines all ranking signals

### Market Research
- "schema markup generator": 18,000+ monthly searches
- 41% of websites use JSON-LD (up 7% YoY)
- 40% higher CTR average with schema markup
- Only 12.4% of domains implement structured data (massive opportunity)

### Competitive Tools to Study
- TechnicalSEO.com (Merkle) - most widely used, has blank field problem
- RankRanger - better validation, no bulk generation
- Schema.dev - Chrome extension, visual tagging
- Schemantra - enterprise-grade, entity relationships

## Development Priorities

### Week 1: Foundation
- Set up project structure
- Implement TypeSelector component
- Build DynamicFormBuilder with field classification system
- Create Article schema definition and form

### Week 2: Core Schemas
- Implement Product schema (most complex)
- Implement LocalBusiness schema
- Implement Organization schema
- Build 4-level validation system

### Week 3: Polish & Features
- Implement Breadcrumb and FAQ schemas
- Build PreviewPanel with syntax highlighting
- Create ExportOptions component
- Add save/load functionality

### Week 4: Testing & Launch
- Multi-schema support implementation
- Cross-browser testing
- Google Rich Results Test validation for all types
- Mobile responsiveness polish
- Launch preparation

## Technical Implementation Notes

### XSS Protection
```javascript
function escapeJSON(json) {
  return json.replace(/</g, '\\u003c')
             .replace(/>/g, '\\u003e');
}
```

### Date Formatting
```javascript
function formatISO8601(date, timezone = '+00:00') {
  // Returns: "2024-01-05T08:00:00+08:00"
  return date.toISOString().slice(0, 19) + timezone;
}
```

### Nested Property Mapping
```javascript
function setNestedProperty(obj, path, value) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
}
```

### Empty Field Handling
```javascript
function cleanSchema(schema) {
  return JSON.parse(JSON.stringify(schema, (key, value) => {
    // Remove null, undefined, empty strings
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    // Remove empty objects
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
      return undefined;
    }
    // Remove empty arrays
    if (Array.isArray(value) && value.length === 0) {
      return undefined;
    }
    return value;
  }));
}
```

## Critical Success Factors

1. **Code Quality**: Every generated schema must pass Google Rich Results Test without errors
2. **User Experience**: Intuitive interface with clear guidance at every step
3. **Performance**: Fast, responsive, no lag during typing or generation
4. **Validation**: Catch errors before generation, explain how to fix
5. **Mobile Experience**: Fully functional on mobile devices
6. **Accessibility**: Keyboard navigation, screen reader support
7. **Documentation**: Clear help text, examples, tooltips throughout

## Launch Checklist

- [ ] All 6 schema types implemented and tested
- [ ] 4-level validation system working correctly
- [ ] All generated schemas pass Google Rich Results Test
- [ ] Mobile responsive design tested on iOS and Android
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility audit passed
- [ ] Performance: page load under 2 seconds
- [ ] Save/load functionality working
- [ ] Multi-schema support tested
- [ ] Export options all functional (copy, download, HTML, GTM)
- [ ] Error messages clear and helpful
- [ ] Documentation/help text complete
- [ ] Analytics tracking implemented
- [ ] SEO optimization (meta tags, schema for the generator itself)

---

## Notes for AI Assistant

When building this application:
1. **Prioritize validation**: Users' biggest pain point is invalid code generation
2. **Be educational**: Help users learn proper schema usage through the interface
3. **Mobile-first**: Many SEO professionals work on mobile devices
4. **No compromises on accuracy**: Generated code must be 100% valid
5. **Performance matters**: Real-time validation can't feel laggy
6. **Accessibility is not optional**: Ensure keyboard navigation and screen reader support

The research document provides extensive technical details. Reference it for:
- Specific validation rules per schema type
- Google's requirements vs. Schema.org standards
- Field-level requirements (required/recommended/optional)
- Common errors to prevent
- Market gaps to address

This tool should become the go-to schema generator by solving the core problem: **generating valid, Google-ready schema markup without manual cleanup**.

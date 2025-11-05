import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Monitor, Smartphone, Star, MapPin, Clock } from 'lucide-react';

export function RichResultsPreview({ jsonLD, schema }) {
  const [viewMode, setViewMode] = React.useState('desktop');

  if (!jsonLD || !jsonLD['@type']) {
    return null;
  }

  const schemaType = jsonLD['@type'];

  const renderPreview = () => {
    switch (schemaType) {
      case 'Article':
      case 'BlogPosting':
      case 'NewsArticle':
        return <ArticlePreview data={jsonLD} viewMode={viewMode} />;
      case 'Product':
        return <ProductPreview data={jsonLD} viewMode={viewMode} />;
      case 'LocalBusiness':
      case 'Restaurant':
      case 'Store':
        return <LocalBusinessPreview data={jsonLD} viewMode={viewMode} />;
      case 'Organization':
        return <OrganizationPreview data={jsonLD} viewMode={viewMode} />;
      case 'BreadcrumbList':
        return <BreadcrumbPreview data={jsonLD} viewMode={viewMode} />;
      case 'FAQPage':
        return <FAQPreview data={jsonLD} viewMode={viewMode} />;
      default:
        return <GenericPreview data={jsonLD} viewMode={viewMode} />;
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Rich Results Preview</CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'desktop'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-750'
              }`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'mobile'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-750'
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Preview how your schema might appear in Google search results
        </p>
      </CardHeader>
      <CardContent>
        <div
          className={`border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 ${
            viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'max-w-2xl'
          }`}
        >
          {renderPreview()}
        </div>
      </CardContent>
    </Card>
  );
}

function ArticlePreview({ data, viewMode }) {
  return (
    <div className="p-4 space-y-2">
      <div className="text-xs text-green-700 dark:text-green-400 font-medium">
        {data.publisher?.name || 'Publisher'}
      </div>
      <div className="text-blue-700 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer">
        {data.headline || 'Article Headline'}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {data.datePublished
          ? new Date(data.datePublished).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Published date'}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
        {data.description || 'Article description will appear here...'}
      </div>
      {data.image && (
        <div className="mt-2">
          <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
            Article Image
          </div>
        </div>
      )}
      {data.author && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          By {data.author.name || 'Author'}
        </div>
      )}
    </div>
  );
}

function ProductPreview({ data, viewMode }) {
  const rating = data.aggregateRating?.ratingValue;
  const reviewCount = data.aggregateRating?.reviewCount;
  const price = data.offers?.price;
  const currency = data.offers?.priceCurrency || 'USD';
  const availability = data.offers?.availability;

  const getAvailabilityText = (url) => {
    if (!url) return '';
    if (url.includes('InStock')) return 'In stock';
    if (url.includes('OutOfStock')) return 'Out of stock';
    if (url.includes('PreOrder')) return 'Pre-order';
    return '';
  };

  return (
    <div className="p-4 space-y-2">
      {data.image && (
        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs mb-3">
          Product Image
        </div>
      )}
      <div className="text-blue-700 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer">
        {data.name || 'Product Name'}
      </div>
      {rating && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">{rating}</span>
          {reviewCount && (
            <span className="text-sm text-gray-600 dark:text-gray-400">({reviewCount} reviews)</span>
          )}
        </div>
      )}
      {price && (
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {currency === 'USD' && '$'}
            {currency === 'EUR' && '€'}
            {currency === 'GBP' && '£'}
            {price}
          </span>
          {availability && (
            <Badge
              variant={
                availability.includes('InStock')
                  ? 'default'
                  : availability.includes('OutOfStock')
                  ? 'destructive'
                  : 'secondary'
              }
              className="text-xs"
            >
              {getAvailabilityText(availability)}
            </Badge>
          )}
        </div>
      )}
      <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
        {data.description || 'Product description...'}
      </div>
      {data.brand && (
        <div className="text-xs text-gray-600 dark:text-gray-400">Brand: {data.brand.name}</div>
      )}
    </div>
  );
}

function LocalBusinessPreview({ data, viewMode }) {
  return (
    <div className="p-4 space-y-3">
      <div className="text-blue-700 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer">
        {data.name || 'Business Name'}
      </div>
      {data.address && (
        <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            {data.address.streetAddress && <div>{data.address.streetAddress}</div>}
            <div>
              {data.address.addressLocality && `${data.address.addressLocality}, `}
              {data.address.addressRegion && `${data.address.addressRegion} `}
              {data.address.postalCode}
            </div>
          </div>
        </div>
      )}
      {data.telephone && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Phone:</strong> {data.telephone}
        </div>
      )}
      {data.openingHours && (
        <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>{data.openingHours}</div>
        </div>
      )}
      {data.priceRange && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Price:</strong> {data.priceRange}
        </div>
      )}
    </div>
  );
}

function OrganizationPreview({ data, viewMode }) {
  return (
    <div className="p-4 space-y-3">
      {data.logo && (
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
          Logo
        </div>
      )}
      <div className="text-blue-700 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer">
        {data.name || 'Organization Name'}
      </div>
      {data.description && (
        <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{data.description}</div>
      )}
      {data.url && (
        <div className="text-sm text-green-700 dark:text-green-400">{data.url}</div>
      )}
      {data.sameAs && Array.isArray(data.sameAs) && data.sameAs.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {data.sameAs.slice(0, 4).map((link, idx) => {
            const domain = new URL(link).hostname.replace('www.', '');
            return (
              <Badge key={idx} variant="secondary" className="text-xs">
                {domain}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BreadcrumbPreview({ data, viewMode }) {
  const items = data.itemListElement || [];

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-sm flex-wrap">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <span
              className={`${
                idx === items.length - 1
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-blue-700 dark:text-blue-400 hover:underline cursor-pointer'
              }`}
            >
              {item.name}
            </span>
            {idx < items.length - 1 && (
              <span className="text-gray-400 dark:text-gray-500">›</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function FAQPreview({ data, viewMode }) {
  const questions = data.mainEntity || [];

  return (
    <div className="p-4 space-y-3">
      <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        People also ask
      </div>
      {questions.slice(0, 3).map((q, idx) => (
        <details key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <summary className="text-blue-700 dark:text-blue-400 text-sm cursor-pointer hover:underline py-2">
            {q.name || 'Question text'}
          </summary>
          <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 pl-4">
            {q.acceptedAnswer?.text || 'Answer text'}
          </div>
        </details>
      ))}
      {questions.length > 3 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          +{questions.length - 3} more questions
        </div>
      )}
    </div>
  );
}

function GenericPreview({ data, viewMode }) {
  return (
    <div className="p-4 space-y-2">
      <div className="text-blue-700 dark:text-blue-400 text-lg font-medium">
        {data.name || data.headline || data['@type']}
      </div>
      {data.description && (
        <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{data.description}</div>
      )}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Schema type: {data['@type']}
      </div>
    </div>
  );
}

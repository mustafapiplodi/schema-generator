import React, { useState } from 'react';
import { schemaList } from '../schemas/index.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import {
  FileText,
  ShoppingBag,
  Store,
  Building2,
  Link as LinkIcon,
  HelpCircle,
  Search,
  Calendar,
  UtensilsCrossed,
  Video,
  BookOpen,
  Briefcase,
  Star,
  Globe,
  User
} from 'lucide-react';

const iconMap = {
  article: FileText,
  product: ShoppingBag,
  localBusiness: Store,
  organization: Building2,
  breadcrumb: LinkIcon,
  faq: HelpCircle,
  event: Calendar,
  recipe: UtensilsCrossed,
  video: Video,
  howto: BookOpen,
  jobPosting: Briefcase,
  review: Star,
  website: Globe,
  person: User
};

export function TypeSelector({ onSelectType, selectedType }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemas = schemaList.filter((schema) => {
    const query = searchQuery.toLowerCase();
    return (
      schema.name.toLowerCase().includes(query) ||
      schema.description.toLowerCase().includes(query) ||
      schema.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Select Schema Type
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Choose the type of structured data you want to generate
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search schema types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full text-base"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            {filteredSchemas.length} {filteredSchemas.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemas.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No schema types match your search</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          filteredSchemas.map((schema) => {
            const Icon = iconMap[schema.id] || FileText;
            const isSelected = selectedType === schema.id;

            return (
              <Card
                key={schema.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-gray-800 ${
                  isSelected
                    ? 'ring-2 ring-purple-500 border-purple-500 dark:ring-purple-400 dark:border-purple-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-gray-750'
                }`}
                onClick={() => onSelectType(schema.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{schema.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {schema.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

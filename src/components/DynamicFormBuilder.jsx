import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { DateTimeInput } from './ui/DateTimeInput';
import { OpeningHoursInput } from './ui/OpeningHoursInput';
import { HelpCircle, Trash2, Plus, AlertTriangle, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { validateField, getCharCounterColor } from '../utils/fieldValidation';

export function DynamicFormBuilder({ schema, formData, onChange }) {
  const [localData, setLocalData] = useState(formData || {});
  const [arrayItems, setArrayItems] = useState({});
  const [fieldValidation, setFieldValidation] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    if (schema?.isArray && schema.properties) {
      const arrayField = Object.keys(schema.properties)[0];
      if (!arrayItems[arrayField]) {
        setArrayItems({
          [arrayField]: schema.defaultItems || [{}]
        });
      }
    }
  }, [schema]);

  const handleChange = (field, value) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);

    // Validate field on change
    if (schema && schema.properties && schema.properties[field]) {
      const validation = validateField(field, value, schema.properties[field], updated);
      setFieldValidation({ ...fieldValidation, [field]: validation });
    }
  };

  const handleArrayItemChange = (arrayField, index, itemField, value) => {
    const items = [...(arrayItems[arrayField] || [])];
    items[index] = { ...items[index], [itemField]: value };
    setArrayItems({ ...arrayItems, [arrayField]: items });
    handleChange(arrayField, items);
  };

  const addArrayItem = (arrayField) => {
    const items = [...(arrayItems[arrayField] || []), {}];
    setArrayItems({ ...arrayItems, [arrayField]: items });
  };

  const removeArrayItem = (arrayField, index) => {
    const items = arrayItems[arrayField].filter((_, i) => i !== index);
    setArrayItems({ ...arrayItems, [arrayField]: items });
    handleChange(arrayField, items);
  };

  const renderFieldLabel = (fieldName, fieldDef) => {
    return (
      <div className="flex items-center gap-2">
        <Label htmlFor={fieldName} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {fieldDef.label}
        </Label>
        {fieldDef.required && (
          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Required</Badge>
        )}
        {fieldDef.recommended && (
          <Badge variant="warning" className="text-xs px-1.5 py-0.5">Recommended</Badge>
        )}
        {fieldDef.help && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-sm">{fieldDef.help}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  const renderInput = (fieldName, fieldDef, value) => {
    // Special case for opening hours
    if (fieldName === 'openingHoursSpecification') {
      return (
        <OpeningHoursInput
          value={value}
          onChange={(hours) => handleChange(fieldName, hours)}
          label={null}
        />
      );
    }

    // Determine placeholder with examples
    let placeholder = fieldDef.placeholder;
    if (!placeholder) {
      if (fieldDef.type === 'URL') {
        placeholder = 'Example: https://example.com/page';
      } else if (fieldDef.type === 'Email') {
        placeholder = 'Example: user@example.com';
      } else if (fieldDef.type === 'DateTime') {
        placeholder = 'Example: 2024-01-05T08:00:00+00:00';
      } else if (fieldName === 'telephone') {
        placeholder = 'Example: +1-555-123-4567';
      } else if (fieldName === 'priceRange') {
        placeholder = 'Example: $$ or $10-15';
      }
    }

    const commonProps = {
      id: fieldName,
      value: value || '',
      onChange: (e) => handleChange(fieldName, e.target.value),
      onBlur: () => setTouchedFields({ ...touchedFields, [fieldName]: true }),
      placeholder: placeholder,
      className: "w-full"
    };

    switch (fieldDef.type) {
      case 'OpeningHours':
        return (
          <OpeningHoursInput
            value={value}
            onChange={(hours) => handleChange(fieldName, hours)}
            label={null}
          />
        );

      case 'Select':
        return (
          <Select value={value || ''} onValueChange={(val) => handleChange(fieldName, val)}>
            <SelectTrigger id={fieldName}>
              <SelectValue placeholder={fieldDef.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {fieldDef.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'Number':
        return <Input {...commonProps} type="number" min={fieldDef.min} max={fieldDef.max} step="any" />;

      case 'Email':
        return <Input {...commonProps} type="email" />;

      case 'URL':
        return <Input {...commonProps} type="url" />;

      case 'Date':
        return <Input {...commonProps} type="date" />;

      case 'DateTime':
        const validation = fieldValidation[fieldName];
        return (
          <DateTimeInput
            value={value}
            onChange={(iso8601Value) => handleChange(fieldName, iso8601Value)}
            error={validation && validation.status === 'error' ? validation.errors[0] : null}
          />
        );

      default:
        if (fieldDef.multiline) {
          return <Textarea {...commonProps} rows={3} maxLength={fieldDef.maxLength} />;
        }
        return <Input {...commonProps} type="text" maxLength={fieldDef.maxLength} />;
    }
  };

  const renderField = (fieldName, fieldDef) => {
    const value = localData[fieldName] || '';
    const validation = fieldValidation[fieldName];

    const getValidationIcon = () => {
      // Only show validation if field has been touched
      if (!touchedFields[fieldName] || !validation || !value) return null;

      switch (validation.status) {
        case 'valid':
          return <CheckCircle2 className="w-4 h-4 text-green-600" />;
        case 'warning':
          return <AlertCircle className="w-4 h-4 text-yellow-600" />;
        case 'error':
          return <XCircle className="w-4 h-4 text-red-600" />;
        default:
          return null;
      }
    };

    return (
      <div key={fieldName} className="space-y-2">
        <div className="flex items-center justify-between">
          {renderFieldLabel(fieldName, fieldDef)}
          {getValidationIcon()}
        </div>
        {renderInput(fieldName, fieldDef, value)}

        {/* Character counter with color coding */}
        {fieldDef.maxLength && value && (
          <p className={`text-xs text-right ${getCharCounterColor(value.length, fieldDef.maxLength)}`}>
            {value.length}/{fieldDef.maxLength}
            {value.length >= fieldDef.maxLength * 0.9 && value.length < fieldDef.maxLength && (
              <span className="ml-2">({fieldDef.maxLength - value.length} remaining)</span>
            )}
          </p>
        )}

        {/* Validation messages - only show if field has been touched */}
        {touchedFields[fieldName] && validation && validation.errors && validation.errors.length > 0 && (
          <div className="space-y-1">
            {validation.errors.length === 1 ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {validation.errors[0]}
              </p>
            ) : (
              <>
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {validation.errors[0]}
                </p>
                <p className="text-xs text-red-600 ml-4">
                  (+{validation.errors.length - 1} more issue{validation.errors.length - 1 > 1 ? 's' : ''})
                </p>
              </>
            )}
          </div>
        )}
        {touchedFields[fieldName] && validation && validation.warnings && validation.warnings.length > 0 && !validation.errors.length && (
          <div className="space-y-1">
            {validation.warnings.length === 1 ? (
              <p className="text-xs text-yellow-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validation.warnings[0]}
              </p>
            ) : (
              <>
                <p className="text-xs text-yellow-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validation.warnings[0]}
                </p>
                <p className="text-xs text-yellow-600 ml-4">
                  (+{validation.warnings.length - 1} more warning{validation.warnings.length - 1 > 1 ? 's' : ''})
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderArrayField = (fieldName, fieldDef) => {
    const items = arrayItems[fieldName] || [];

    return (
      <div key={fieldName} className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {fieldName === 'items' ? `Item ${index + 1}` : `Question ${index + 1}`}
                </CardTitle>
                {items.length > (fieldDef.minItems || 1) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem(fieldName, index)}
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(fieldDef.itemProperties).map(([itemFieldName, itemFieldDef]) => (
                <div key={itemFieldName} className="space-y-2">
                  <Label htmlFor={`${fieldName}-${index}-${itemFieldName}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {itemFieldDef.label}
                    {itemFieldDef.required && <Badge variant="destructive" className="ml-2 text-xs px-1.5 py-0">Required</Badge>}
                  </Label>

                  {itemFieldDef.multiline ? (
                    <Textarea
                      id={`${fieldName}-${index}-${itemFieldName}`}
                      value={item[itemFieldName] || ''}
                      onChange={(e) => handleArrayItemChange(fieldName, index, itemFieldName, e.target.value)}
                      placeholder={itemFieldDef.placeholder}
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={`${fieldName}-${index}-${itemFieldName}`}
                      type={itemFieldDef.type === 'URL' ? 'url' : 'text'}
                      value={item[itemFieldName] || ''}
                      onChange={(e) => handleArrayItemChange(fieldName, index, itemFieldName, e.target.value)}
                      placeholder={itemFieldDef.placeholder}
                    />
                  )}
                  {itemFieldDef.help && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{itemFieldDef.help}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => addArrayItem(fieldName)}
        >
          <Plus className="w-4 h-4" />
          Add {fieldName === 'items' ? 'Item' : 'Question'}
        </Button>
      </div>
    );
  };

  if (!schema) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-gray-500 dark:text-gray-400">
          Select a schema type to begin
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{schema.name} Schema</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{schema.description}</p>
      </div>

      {/* Warning Alert */}
      {schema.warning && (
        <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-300 text-sm">
            <strong>Important:</strong> {schema.warning}
          </AlertDescription>
        </Alert>
      )}

      {/* Type Variant Selector */}
      {schema.variants && (
        <Card className="bg-white dark:bg-gray-900">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="variant" className="dark:text-gray-300">{schema.variantLabel || 'Type'}</Label>
              <Select
                value={localData.articleType || ''}
                onValueChange={(val) => handleChange('articleType', val)}
              >
                <SelectTrigger id="variant">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {schema.variants.map((variant) => (
                    <SelectItem key={variant.value} value={variant.value}>
                      {variant.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Type Selector */}
      {schema.subtypes && (
        <Card className="bg-white dark:bg-gray-900">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="businessType" className="dark:text-gray-300">Business Type</Label>
                <Badge variant="destructive" className="text-xs px-1.5 py-0">Required</Badge>
              </div>
              <Select
                value={localData.businessType || ''}
                onValueChange={(val) => handleChange('businessType', val)}
              >
                <SelectTrigger id="businessType">
                  <SelectValue placeholder="Select business type..." />
                </SelectTrigger>
                <SelectContent>
                  {schema.subtypes.map((subtype) => (
                    <SelectItem key={subtype.value} value={subtype.value}>
                      {subtype.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required Fields */}
      {schema.required && schema.required.length > 0 && !schema.isArray && (
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Required Fields</CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">These fields must be filled for valid schema</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {schema.required.filter(f => {
                  const val = localData[f];
                  if (!val) return false;
                  if (Array.isArray(val)) return val.length > 0;
                  if (typeof val === 'object') return Object.keys(val).length > 0;
                  return val.toString().trim() !== '';
                }).length}/{schema.required.length} filled
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {schema.required.map((fieldName) => {
              const fieldDef = schema.properties[fieldName];
              return fieldDef ? renderField(fieldName, fieldDef) : null;
            })}
          </CardContent>
        </Card>
      )}

      {/* Special Fields (like Opening Hours) */}
      {schema.properties?.openingHoursSpecification && schema.properties.openingHoursSpecification.type === 'OpeningHours' && (
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Business Hours</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">Set your operating hours for each day of the week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {renderField('openingHoursSpecification', schema.properties.openingHoursSpecification)}
          </CardContent>
        </Card>
      )}

      {/* Recommended and Optional Fields */}
      <Accordion type="multiple" defaultValue={["recommended"]} className="space-y-3">
        {schema.recommended && schema.recommended.length > 0 && (
          <AccordionItem value="recommended" className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 w-full justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Recommended Fields</span>
                  <Badge variant="warning" className="text-xs px-2 py-0.5">Improves SEO</Badge>
                </div>
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {schema.recommended.filter(f => {
                    const val = localData[f];
                    if (!val) return false;
                    if (Array.isArray(val)) return val.length > 0;
                    if (typeof val === 'object') return Object.keys(val).length > 0;
                    return val.toString().trim() !== '';
                  }).length}/{schema.recommended.length} filled
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-6 pt-2">
                {schema.recommended.map((fieldName) => {
                  const fieldDef = schema.properties[fieldName];
                  return fieldDef ? renderField(fieldName, fieldDef) : null;
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Optional Fields - only show if there are optional fields */}
        {Object.entries(schema.properties).filter(([fieldName, fieldDef]) =>
          !schema.required?.includes(fieldName) &&
          !schema.recommended?.includes(fieldName) &&
          fieldDef.type !== 'Array' &&
          fieldDef.type !== 'OpeningHours'
        ).length > 0 && (
          <AccordionItem value="optional" className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 w-full justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Optional Fields</span>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">Enhances Schema</Badge>
                </div>
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {Object.entries(schema.properties).filter(([fieldName, fieldDef]) => {
                    if (schema.required?.includes(fieldName) ||
                        schema.recommended?.includes(fieldName) ||
                        fieldDef.type === 'Array' ||
                        fieldDef.type === 'OpeningHours') {
                      return false;
                    }
                    const val = localData[fieldName];
                    if (!val) return false;
                    if (Array.isArray(val)) return val.length > 0;
                    if (typeof val === 'object') return Object.keys(val).length > 0;
                    return val.toString().trim() !== '';
                  }).length}/{Object.entries(schema.properties).filter(([fieldName, fieldDef]) =>
                    !schema.required?.includes(fieldName) &&
                    !schema.recommended?.includes(fieldName) &&
                    fieldDef.type !== 'Array' &&
                    fieldDef.type !== 'OpeningHours'
                  ).length} filled
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-6 pt-2">
                {Object.entries(schema.properties)
                  .filter(([fieldName, fieldDef]) =>
                    !schema.required?.includes(fieldName) &&
                    !schema.recommended?.includes(fieldName) &&
                    fieldDef.type !== 'Array' &&
                    fieldDef.type !== 'OpeningHours'
                  )
                  .map(([fieldName, fieldDef]) => {
                    try {
                      return renderField(fieldName, fieldDef);
                    } catch (error) {
                      console.error(`Error rendering field ${fieldName}:`, error);
                      return null;
                    }
                  })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Array Fields (Breadcrumb, FAQ) */}
      {schema.isArray && Object.entries(schema.properties).map(([fieldName, fieldDef]) => {
        if (fieldDef.type === 'Array') {
          return (
            <Card key={fieldName} className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{fieldDef.label}</CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">{fieldDef.help}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderArrayField(fieldName, fieldDef)}
              </CardContent>
            </Card>
          );
        }
        return null;
      })}
    </div>
  );
}

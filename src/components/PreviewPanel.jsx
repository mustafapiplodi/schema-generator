import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertCircle, AlertTriangle, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { validateJSONSyntax } from '../validators/syntaxValidator.js';
import { validateJSONLDStructure } from '../validators/structureValidator.js';
import { validateSchemaCompliance } from '../validators/schemaValidator.js';
import { validateGoogleRequirements } from '../validators/googleValidator.js';
import { RichResultsPreview } from './RichResultsPreview.jsx';
import { CodeHighlight } from './CodeHighlight.jsx';

export function PreviewPanel({ jsonLD, schema }) {
  const [formatted, setFormatted] = useState(true);
  const [validationResults, setValidationResults] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showTestNotification, setShowTestNotification] = useState(false);

  useEffect(() => {
    if (jsonLD) {
      runValidation(jsonLD);
    }
  }, [jsonLD, schema]);

  const runValidation = (json) => {
    const jsonString = typeof json === 'string' ? json : JSON.stringify(json, null, 2);

    const syntaxResult = validateJSONSyntax(jsonString);
    if (!syntaxResult.valid) {
      setValidationResults({
        level: 1,
        valid: false,
        errors: syntaxResult.errors,
        warnings: []
      });
      return;
    }

    const schemaObj = JSON.parse(jsonString);
    const structureResult = validateJSONLDStructure(schemaObj);
    if (!structureResult.valid) {
      setValidationResults({
        level: 2,
        valid: false,
        errors: structureResult.errors,
        warnings: []
      });
      return;
    }

    const schemaResult = validateSchemaCompliance(schemaObj, schema);
    const allErrors = [...structureResult.errors, ...schemaResult.errors];
    const allWarnings = [...(schemaResult.warnings || [])];

    const googleResult = validateGoogleRequirements(schemaObj, schemaObj['@type']);
    allErrors.push(...googleResult.errors);
    allWarnings.push(...googleResult.warnings);

    setValidationResults({
      level: 4,
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    });
  };

  const getValidationStatus = () => {
    if (!validationResults) return { text: 'Pending', variant: 'secondary', icon: null };
    if (validationResults.errors.length > 0)
      return { text: 'Has Errors', variant: 'destructive', icon: AlertCircle };
    if (validationResults.warnings.length > 0)
      return { text: 'Valid with Warnings', variant: 'warning', icon: AlertTriangle };
    return { text: 'Valid', variant: 'default', icon: CheckCircle2 };
  };

  const formatJSON = (obj) => {
    return formatted ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  };

  const handleCopyCode = async () => {
    if (!jsonLD) return;
    const jsonString = formatJSON(jsonLD);
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const testWithGoogle = (json) => {
    const code = JSON.stringify(json, null, 2);
    // Copy to clipboard first
    navigator.clipboard.writeText(code).then(() => {
      // Show notification
      setShowTestNotification(true);
      setTimeout(() => setShowTestNotification(false), 3000);
      // Open Google Rich Results Test
      setTimeout(() => {
        window.open('https://search.google.com/test/rich-results', '_blank');
      }, 500);
    });
  };

  const testWithSchemaOrg = (json) => {
    const code = JSON.stringify(json, null, 2);
    // Copy to clipboard first
    navigator.clipboard.writeText(code).then(() => {
      // Show notification
      setShowTestNotification(true);
      setTimeout(() => setShowTestNotification(false), 3000);
      // Open Schema.org Validator
      setTimeout(() => {
        window.open('https://validator.schema.org/', '_blank');
      }, 500);
    });
  };

  const status = getValidationStatus();
  const StatusIcon = status.icon;

  // Check if jsonLD is empty or has no meaningful content
  const isEmptySchema = !jsonLD ||
    (typeof jsonLD === 'object' &&
     Object.keys(jsonLD).filter(k => k !== '@context' && k !== '@type').length === 0);

  if (!jsonLD) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Schema Preview</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Fill in the form to see generated JSON-LD</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 text-sm">
            Generated schema will appear here
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Schema Preview</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Test Notification */}
        {showTestNotification && (
          <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-300">Code copied to clipboard!</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              Opening validator in new tab...
            </AlertDescription>
          </Alert>
        )}
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="validation" className="gap-2">
              Validation
              {validationResults && (validationResults.errors.length > 0 || validationResults.warnings.length > 0) && (
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                  {validationResults.errors.length + validationResults.warnings.length}
                </span>
              )}
              {validationResults && validationResults.errors.length === 0 && validationResults.warnings.length === 0 && (
                <CheckCircle2 className="w-3 h-3 text-green-600" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <RichResultsPreview jsonLD={jsonLD} schema={schema} />
          </TabsContent>

          <TabsContent value="code" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formatted}
                  onChange={(e) => setFormatted(e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">Format JSON</span>
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyCode}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="relative">
              <ScrollArea className="h-[400px] w-full rounded-md border dark:border-gray-700 bg-gray-900 dark:bg-gray-950 p-4">
                {isEmptySchema ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">
                    Fill required fields to see generated schema code
                  </div>
                ) : formatted ? (
                  <CodeHighlight code={jsonLD} />
                ) : (
                  <pre className="text-sm font-mono">
                    <code className="text-gray-300">
                      {formatJSON(jsonLD)}
                    </code>
                  </pre>
                )}
              </ScrollArea>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Your Schema:</p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => testWithGoogle(jsonLD)}
                >
                  <ExternalLink className="w-4 h-4" />
                  Test with Google Rich Results
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => testWithSchemaOrg(jsonLD)}
                >
                  <ExternalLink className="w-4 h-4" />
                  Test with Schema.org Validator
                </Button>
              </div>
              {!validationResults?.valid && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ Fix validation errors first for best results
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="validation" className="mt-4">
            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-3 pr-4">
                {validationResults && validationResults.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Errors ({validationResults.errors.length})</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-2 mt-2">
                        {validationResults.errors.map((error, index) => (
                          <li key={index} className="text-sm">
                            <strong>{error.message}</strong>
                            {error.detail && <p className="mt-1 text-xs ml-5">{error.detail}</p>}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {validationResults && validationResults.warnings.length > 0 && (
                  <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                    <AlertTitle className="text-yellow-800 dark:text-yellow-300">
                      Warnings ({validationResults.warnings.length})
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                      <ul className="list-disc list-inside space-y-2 mt-2">
                        {validationResults.warnings.map((warning, index) => (
                          <li key={index} className="text-sm">
                            <strong>{warning.message}</strong>
                            {warning.detail && <p className="mt-1 text-xs ml-5">{warning.detail}</p>}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {validationResults && validationResults.errors.length === 0 && validationResults.warnings.length === 0 && (
                  <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-800 dark:text-green-300">Perfect! No Issues Found</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400">
                      Your schema is valid and ready to deploy. It passes all validation levels:
                      JSON syntax, JSON-LD structure, Schema.org compliance, and Google requirements.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

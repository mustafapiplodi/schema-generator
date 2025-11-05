import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Clipboard, Download, Code, Tag, CheckCircle2 } from 'lucide-react';
import { Label } from './ui/label';
import { escapeJSON } from '../utils/xssProtection.js';

export function ExportOptions({ jsonLD }) {
  const [copySuccess, setCopySuccess] = useState('');
  const [minified, setMinified] = useState(false);

  const formatJSON = (obj, minify = minified) => {
    return minify ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
  };

  const handleCopy = async () => {
    if (!jsonLD) return;
    const jsonString = formatJSON(jsonLD);
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopySuccess('JSON');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const handleDownload = () => {
    if (!jsonLD) return;
    const jsonString = formatJSON(jsonLD);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jsonLD['@type']?.toLowerCase() || 'schema'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyHTML = async () => {
    if (!jsonLD) return;
    const jsonString = escapeJSON(formatJSON(jsonLD));
    const html = `<script type="application/ld+json">
${jsonString}
</script>`;

    try {
      await navigator.clipboard.writeText(html);
      setCopySuccess('HTML');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const handleCopyGTM = async () => {
    if (!jsonLD) return;
    const jsonString = escapeJSON(formatJSON(jsonLD, true)); // Always minify for GTM
    const gtmCode = `<script type="application/ld+json">
${jsonString}
</script>`;

    try {
      await navigator.clipboard.writeText(gtmCode);
      setCopySuccess('GTM');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Download className="w-5 h-5" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Minify Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Label htmlFor="minify-toggle" className="text-sm font-medium cursor-pointer dark:text-gray-300">
            Minify JSON (for production)
          </Label>
          <button
            id="minify-toggle"
            role="switch"
            aria-checked={minified}
            onClick={() => setMinified(!minified)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer ${
              minified ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                minified ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full justify-start gap-2"
            variant="default"
            onClick={handleCopy}
          >
            <Clipboard className="w-4 h-4" />
            Copy JSON
            {copySuccess === 'JSON' && <CheckCircle2 className="w-4 h-4 ml-auto" />}
          </Button>

          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download File
          </Button>

          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={handleCopyHTML}
          >
            <Code className="w-4 h-4" />
            Copy HTML Embed
            {copySuccess === 'HTML' && <CheckCircle2 className="w-4 h-4 ml-auto text-green-600" />}
          </Button>

          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={handleCopyGTM}
          >
            <Tag className="w-4 h-4" />
            Copy for GTM
            {copySuccess === 'GTM' && <CheckCircle2 className="w-4 h-4 ml-auto text-green-600" />}
          </Button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {minified ? '✓ Code is minified for production use' : 'Code is formatted for readability'}
        </p>
      </CardContent>
    </Card>
  );
}

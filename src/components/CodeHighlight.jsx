import React from 'react';

/**
 * Lightweight JSON syntax highlighter
 * Highlights JSON without external dependencies
 */
export function CodeHighlight({ code }) {
  const highlightJSON = (json) => {
    if (!json) return '';

    // Convert to formatted string if object
    const jsonString = typeof json === 'string' ? json : JSON.stringify(json, null, 2);

    let result = jsonString;

    // Highlight strings (including keys)
    result = result.replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:');

    // Highlight string values
    result = result.replace(/:\s*"([^"]*)"/g, ': <span class="text-green-400">"$1"</span>');

    // Highlight numbers
    result = result.replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="text-orange-400">$1</span>');

    // Highlight booleans
    result = result.replace(/:\s*(true|false)/g, ': <span class="text-purple-400">$1</span>');

    // Highlight null
    result = result.replace(/:\s*(null)/g, ': <span class="text-red-400">$1</span>');

    // Highlight brackets and braces
    result = result.replace(/([{}[\]])/g, '<span class="text-gray-400 font-bold">$1</span>');

    return result;
  };

  const highlighted = highlightJSON(code);

  return (
    <pre className="text-sm font-mono">
      <code
        dangerouslySetInnerHTML={{ __html: highlighted }}
        className="block"
      />
    </pre>
  );
}

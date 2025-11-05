/**
 * Schema Storage Utilities
 * Handles saving/loading schemas to/from localStorage
 */

const STORAGE_KEY = 'schema_generator_saved_schemas';
const MAX_SAVED_SCHEMAS = 20;

export function saveSchema(name, type, formData, schema) {
  try {
    const savedSchemas = getSavedSchemas();

    const newSchema = {
      id: Date.now().toString(),
      name,
      type,
      formData,
      schema,
      timestamp: new Date().toISOString(),
    };

    // Add to beginning of array
    savedSchemas.unshift(newSchema);

    // Keep only MAX_SAVED_SCHEMAS
    const trimmed = savedSchemas.slice(0, MAX_SAVED_SCHEMAS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return true;
  } catch (error) {
    console.error('Failed to save schema:', error);
    return false;
  }
}

export function getSavedSchemas() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load schemas:', error);
    return [];
  }
}

export function getSavedSchema(id) {
  const schemas = getSavedSchemas();
  return schemas.find(s => s.id === id);
}

export function deleteSavedSchema(id) {
  try {
    const schemas = getSavedSchemas();
    const filtered = schemas.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete schema:', error);
    return false;
  }
}

export function clearAllSchemas() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear schemas:', error);
    return false;
  }
}

export function getRecentSchemas(count = 5) {
  const schemas = getSavedSchemas();
  return schemas.slice(0, count);
}

export function exportSchemaAsFile(schema) {
  const dataStr = JSON.stringify(schema, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${schema.name || 'schema'}_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importSchemaFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const schema = JSON.parse(e.target.result);
        resolve(schema);
      } catch (error) {
        reject(new Error('Invalid schema file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

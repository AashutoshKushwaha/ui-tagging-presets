import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { loadSchema } from '../services/schemaService';

export function useSchemaData() {
  const [presets, setPresets] = useState([]);
  const [fields, setFields] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSchema()
      .then(({ presets, fields, categories }) => {
        setPresets(presets);
        setFields(fields);
        setCategories(categories);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // Build Fuse.js search index
  const fuse = useMemo(() => {
    if (!presets.length) return null;
    return new Fuse(presets, {
      keys: [
        { name: 'name', weight: 3 },
        { name: '_termsString', weight: 2 },
        { name: '_tagString', weight: 1.5 },
        { name: 'id', weight: 1 },
      ],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [presets]);

  return { presets, fields, categories, fuse, loading, error };
}
